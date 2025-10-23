// Cursor-Apply (task-aware, multi-pass):
// - Reads a Luce Review Issue
// - Extracts the detailed Cursor prompt
// - Parses CHANGES TO MAKE bullets as tasks
// - Runs multiple edits-only passes per task
// - Opens ONE PR with all edits, and comments back files changed

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');

const OPENAI_API_KEY   = process.env.OPENAI_API_KEY || '';
const GITHUB_TOKEN     = process.env.GITHUB_TOKEN || '';
const REPO             = process.env.GITHUB_REPOSITORY || '';
const SHA              = process.env.GITHUB_SHA || '';
const ISSUE_NUMBER_RAW = (process.env.ISSUE_NUMBER || '').trim();
const TASK_LIMIT       = Math.max(1, Math.min(20, parseInt(process.env.TASK_LIMIT || '10', 10)));
const PASSES_PER_TASK  = Math.max(1, Math.min(5, parseInt(process.env.PASSES_PER_TASK || '2', 10)));

if (!OPENAI_API_KEY) throw new Error('Missing OPENAI_API_KEY');
if (!GITHUB_TOKEN)   throw new Error('Missing GITHUB_TOKEN');
if (!REPO)           throw new Error('Missing GITHUB_REPOSITORY');

const CONFIG_PATH = path.join(ROOT, 'luce.config.json');
const cfg = fs.existsSync(CONFIG_PATH)
  ? JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'))
  : { output: { allowPaths: ["app/**","pages/**","src/**","components/**","styles/**","public/**","lib/**"] } };

function sh(cmd) {
  return execSync(cmd, { stdio: 'pipe', encoding: 'utf8', cwd: ROOT }).trim();
}

/* ---------------- GitHub helpers ---------------- */

async function gh(pathname, init = {}) {
  const res = await fetch(`https://api.github.com/repos/${REPO}${pathname}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
      ...(init.headers || {})
    }
  });
  if (!res.ok) {
    const t = await res.text().catch(() => '');
    throw new Error(`${init.method || 'GET'} ${pathname} failed: ${res.status} ${t}`);
  }
  return res.json();
}

async function getLatestLuceIssue() {
  const issues = await gh(`/issues?state=open&per_page=50`);
  const sorted = issues
    .filter(i => !i.pull_request)
    .filter(i => (i.labels || []).some(l => (typeof l === 'string' ? l === 'auto-review' : (l.name === 'auto-review' || l.name === 'luce'))))
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  return sorted[0] || null;
}

async function getIssueByNumber(num) {
  return gh(`/issues/${num}`);
}

async function commentOnIssue(issueNumber, text) {
  await gh(`/issues/${issueNumber}/comments`, {
    method: 'POST',
    body: JSON.stringify({ body: text })
  });
}

async function openPR(branch, title, body) {
  const pr = await gh(`/pulls`, {
    method: 'POST',
    body: JSON.stringify({ title, head: branch, base: 'main', body })
  });
  try {
    await gh(`/issues/${pr.number}/labels`, {
      method: 'POST',
      body: JSON.stringify({ labels: ['cursor-apply','luce'] })
    });
  } catch {}
  return pr;
}

/* ---------------- Prompt parsing ---------------- */

function extractPromptCodeBlock(issueBody) {
  // Grab code blocks ```...```, pick the longest (that’s our detailed prompt)
  const blocks = Array.from(issueBody.matchAll(/```([\s\S]*?)```/g)).map(m => m[1].trim());
  if (!blocks.length) return '';
  blocks.sort((a, b) => b.length - a.length);
  return blocks[0];
}

function splitSections(promptText) {
  // Split by ALL CAPS headings we specified in rubric
  const lines = promptText.split(/\r?\n/);
  const sections = {};
  let current = null;
  for (const line of lines) {
    const m = line.match(/^[A-Z0-9 ()/-]{4,}$/); // crude ALL-CAPS heading detector
    if (m) {
      current = line.trim();
      sections[current] = [];
    } else if (current) {
      sections[current].push(line);
    }
  }
  return sections;
}

function parseBulletedTasks(sectionLines) {
  // Lines starting with -, *, or number.)
  const tasks = [];
  for (const raw of sectionLines) {
    const line = raw.trim();
    if (!line) continue;
    if (/^[-*]\s+/.test(line) || /^\d+\)\s+/.test(line) || /^\d+\.\s+/.test(line)) {
      tasks.push(line.replace(/^([-*]|\d+\)|\d+\.)\s+/, '').trim());
    }
  }
  return tasks;
}

function parseFilesToTouch(sectionLines) {
  const files = [];
  for (const raw of sectionLines) {
    const line = raw.trim();
    if (!line) continue;
    const m = line.match(/^\(?create\)?\s*([^,;]+)|^[-*]\s*([^,;]+)/i);
    const cand = (m?.[1] || m?.[2] || '').trim();
    if (cand && !files.includes(cand)) files.push(cand);
  }
  return files;
}

/* ---------------- Repo / allowlist helpers ---------------- */

function listFiles(globs = []) {
  if (!globs?.length) return sh('git ls-files');
  return sh(`git ls-files ${globs.map(g => `"${g}"`).join(' ')}`);
}

function withinAllow(relPath) {
  const allow = cfg.output?.allowPaths || [];
  if (!allow.length) return true;
  return allow.some(glob => {
    const pref = glob.endsWith('/**') ? glob.slice(0, -3) : glob.replace(/\*+$/,'');
    return relPath.startsWith(pref);
  });
}

function widenAllowFromHints(files) {
  // If the prompt lists paths like src/components/Hero.tsx, ensure prefixes exist in allowPaths
  if (!files?.length) return;
  const allow = new Set(cfg.output?.allowPaths || []);
  for (const f of files) {
    const parts = f.split('/').filter(Boolean);
    if (parts.length > 1) {
      const dir = parts[0] + '/**';
      allow.add(dir);
    }
  }
  cfg.output = cfg.output || {};
  cfg.output.allowPaths = Array.from(allow);
}

/* ---------------- Edits-only engine ---------------- */

async function makeEdits(instructionPrompt, fileList) {
  const sys = [
    'Return JSON ONLY with shape:',
    '{"edits":[{"path":"relative/path.ext","content":"<FULL NEW FILE CONTENT>"}]}',
    'Edit only allow-listed files. Provide FULL replacements.',
    'No timestamps, random IDs, or non-deterministic content.',
    'Paths must be relative to the repo root.'
  ].join('\n');

  const user = [
    'File list (relative to repo root):',
    '```',
    fileList,
    '```',
    '',
    'Task (apply ONLY this task as code changes):',
    '```',
    instructionPrompt,
    '```',
    '',
    'Return JSON ONLY.'
  ].join('\n');

  const r = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      temperature: 0,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: sys },
        { role: 'user', content: user }
      ]
    })
  });
  if (!r.ok) throw new Error(await r.text());
  const j = await r.json();
  let obj;
  try { obj = JSON.parse(j.choices?.[0]?.message?.content || '{}'); }
  catch { throw new Error('Model returned non-JSON for edits.'); }
  if (!obj?.edits || !Array.isArray(obj.edits)) throw new Error('Missing "edits" array.');
  return obj.edits;
}

function applyEdits(edits) {
  const written = [];
  for (const { path: rel, content } of edits) {
    if (!rel || typeof content !== 'string') continue;
    if (!withinAllow(rel)) continue;
    const abs = path.join(ROOT, rel);
    const prev = fs.existsSync(abs) ? fs.readFileSync(abs, 'utf8') : null;
    if (prev !== null && prev === content) continue;
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, content, 'utf8');
    written.push(rel);
  }
  return written;
}

/* ---------------- Main ---------------- */

(async function main() {
  // 1) Locate issue and extract prompt
  const issue = ISSUE_NUMBER_RAW ? await getIssueByNumber(ISSUE_NUMBER_RAW) : await getLatestLuceIssue();
  if (!issue) throw new Error('No Luce Review issue found.');
  const prompt = extractPromptCodeBlock(issue.body || '');
  if (!prompt) throw new Error(`Could not find a code block prompt in Issue #${issue.number}.`);

  const sections = splitSections(prompt);
  const changesSection = sections['CHANGES TO MAKE (BULLETED)'] || sections['CHANGES TO MAKE'] || [];
  const filesSection   = sections['FILES TO TOUCH (RELATIVE PATHS)'] || sections['FILES TO TOUCH'] || [];

  const allTasks = parseBulletedTasks(changesSection);
  const taskCount = Math.min(TASK_LIMIT, allTasks.length || 0);

  if (!taskCount) {
    await commentOnIssue(issue.number, 'ℹ️ Cursor Apply: No tasks parsed from **CHANGES TO MAKE**. Ensure the prompt uses bullets (-, *, or 1) as required by the rubric.');
    console.log('No tasks to process; exiting.');
    return;
  }

  const hintedFiles = parseFilesToTouch(filesSection);
  widenAllowFromHints(hintedFiles);

  // 2) Branch and file list
  const branch = `cursor/apply-${Date.now()}`;
  sh(`git checkout -b "${branch}"`);
  const fileList = listFiles(cfg.output?.allowPaths || []);

  // 3) Process tasks with multiple passes each
  const cumulative = new Set();
  for (let ti = 0; ti < taskCount; ti++) {
    const task = allTasks[ti];
    console.log(`\n=== Task ${ti + 1}/${taskCount}: ${task} ===`);
    for (let pass = 1; pass <= PASSES_PER_TASK; pass++) {
      const instruction = [
        // Focus only on one bullet at a time to ensure coverage
        'Context (excerpt from Luce prompt):',
        '---',
        prompt.substring(0, 800), // small context to keep request bounded
        '---',
        '',
        'Implement ONLY this task now, end-to-end (create files if listed under FILES TO TOUCH):',
        task
      ].join('\n');

      const edits = await makeEdits(instruction, fileList);
      const written = applyEdits(edits);
      if (written.length) {
        sh(`git add ${written.map(w => `"${w}"`).join(' ')}`);
        written.forEach(w => cumulative.add(w));
        console.log(`Applied ${written.length} edited file(s) on task ${ti + 1}, pass ${pass}/${PASSES_PER_TASK}.`);
      } else {
        console.log(`No effective edits on task ${ti + 1}, pass ${pass}.`);
        // If nothing changed on first pass for this task, move to next task
        if (pass === 1) break;
      }
    }
  }

  const changed = Array.from(cumulative);
  if (!changed.length) {
    await commentOnIssue(issue.number, 'ℹ️ Cursor Apply: No effective edits after processing tasks. Consider broadening `allowPaths`, increasing `passes_per_task`, or refining the prompt bullets.');
    console.log('No changes to commit; exiting.');
    return;
  }

  // 4) Commit & push
  const msg = `feat(cursor): apply Luce Issue #${issue.number} across ${changed.length} file${changed.length>1?'s':''}`;
  sh(`git -c user.name="luce-bot" -c user.email="luce-bot@users.noreply.github.com" commit -m "${msg}"`);
  sh(`git push --set-upstream origin "${branch}"`);

  // 5) Open PR and report back
  const pr = await openPR(
    branch,
    `Cursor apply from Luce Issue #${issue.number}`,
    `Applying Luce’s instructions across ${changed.length} file(s).` +
    `\n\nIssue: #${issue.number}\nSource commit: \`${SHA}\`` +
    `\n\n**Files changed (${changed.length}):**\n${changed.map(f => `- ${f}`).join('\n')}`
  );

  await commentOnIssue(
    issue.number,
    `✅ Opened PR ${pr.html_url}\n\n**Files changed (${changed.length}):**\n${changed.map(f => `- ${f}`).join('\n')}`
  );
  console.log('Opened PR:', pr.html_url);
})();