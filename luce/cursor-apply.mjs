// Cursor-Apply (manual): reads the latest Luce Issue, extracts the prompt,
// generates edits (edits-only), opens a single PR.
// No loops. Runs only when you click "Run workflow".

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const GITHUB_TOKEN   = process.env.GITHUB_TOKEN || '';
const REPO           = process.env.GITHUB_REPOSITORY || '';
const SHA            = process.env.GITHUB_SHA || '';

if (!OPENAI_API_KEY) throw new Error('Missing OPENAI_API_KEY');
if (!GITHUB_TOKEN)   throw new Error('Missing GITHUB_TOKEN');
if (!REPO)           throw new Error('Missing GITHUB_REPOSITORY');

const CONFIG_PATH = path.join(ROOT, 'luce.config.json');
const cfg = fs.existsSync(CONFIG_PATH)
  ? JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'))
  : { output: { allowPaths: ["app/**","pages/**","src/**","components/**","styles/**","public/**"] } };

function sh(cmd) {
  return execSync(cmd, { stdio: 'pipe', encoding: 'utf8', cwd: ROOT }).trim();
}

/* ---------------- GitHub helpers (Node 20 has global fetch) ---------------- */

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
  // Prefer most recent Luce review with our label
  const sorted = issues
    .filter(i => !i.pull_request)
    .filter(i =>
      (i.labels || []).some(l => typeof l === 'string' ? l === 'auto-review' : (l.name === 'auto-review' || l.name === 'luce'))
    )
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  return sorted[0] || null;
}

function extractCursorPromptFromIssue(body) {
  // Grab the last fenced code block in the "Paste in Cursor" section
  // Simple regex for ```...```; pick the longest block.
  const codeBlocks = Array.from(body.matchAll(/```([\s\S]*?)```/g)).map(m => m[1].trim());
  if (!codeBlocks.length) return '';
  // Heuristic: the detailed cursor prompt is usually the longest code block
  codeBlocks.sort((a, b) => b.length - a.length);
  return codeBlocks[0];
}

/* ---------------- Repo helpers ---------------- */

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

/* ---------------- Edits-only apply ---------------- */

async function makeEdits(cursorPrompt, fileList) {
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
    'Requested delta (from Luce Issue):',
    '```',
    cursorPrompt,
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
    if (prev !== null && prev === content) continue; // no-op
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, content, 'utf8');
    written.push(rel);
  }
  return written;
}

/* ---------------- PR helpers ---------------- */

async function openPR(branch, title, body) {
  const pr = await gh(`/pulls`, {
    method: 'POST',
    body: JSON.stringify({ title, head: branch, base: 'main', body })
  });
  // Label best-effort
  try {
    await gh(`/issues/${pr.number}/labels`, {
      method: 'POST',
      body: JSON.stringify({ labels: ['cursor-apply','luce'] })
    });
  } catch (_) {}
  return pr;
}

async function commentOnIssue(issueNumber, text) {
  await gh(`/issues/${issueNumber}/comments`, {
    method: 'POST',
    body: JSON.stringify({ body: text })
  });
}

/* ---------------- Main ---------------- */

(async function main() {
  // 1) Find latest Luce Issue and extract the Cursor prompt
  const issue = await getLatestLuceIssue();
  if (!issue) throw new Error('No open Luce Review issue found with label "auto-review" or "luce".');
  const cursorPrompt = extractCursorPromptFromIssue(issue.body || '');
  if (!cursorPrompt) throw new Error(`Could not find a code block prompt in Issue #${issue.number}.`);

  // 2) Prepare file list and branch
  const allow = cfg.output?.allowPaths || [];
  const fileList = listFiles(allow);
  const branch = `cursor/apply-${Date.now()}`;

  // 3) Create working branch
  sh(`git checkout -b "${branch}"`);

  // 4) Generate edits from the prompt and apply
  const edits = await makeEdits(cursorPrompt, fileList);
  const written = applyEdits(edits);
  if (!written.length) {
    await commentOnIssue(issue.number, 'ℹ️ Cursor Apply found no effective changes from the prompt (no diffs).');
    console.log('No effective edits; exiting.');
    return;
  }
  sh(`git add ${written.map(w => `"${w}"`).join(' ')}`);

  // 5) Commit & push
  const msg = `feat(cursor): apply Luce Issue #${issue.number}`;
  sh(`git -c user.name="luce-bot" -c user.email="luce-bot@users.noreply.github.com" commit -m "${msg}"`);
  sh(`git push --set-upstream origin "${branch}"`);

  // 6) Open PR and link back to the Issue
  const pr = await openPR(branch, `Cursor apply from Luce Issue #${issue.number}`, `Automated application of Luce’s instructions.\n\nSource issue: #${issue.number}\nSource commit: \`${SHA}\``);
  await commentOnIssue(issue.number, `✅ Opened PR ${pr.html_url} applying the prompt.`);
  console.log('Opened PR:', pr.html_url);
})();