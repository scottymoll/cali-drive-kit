// Luce apply: try git patch first, fall back to whole-file edits, then open a PR
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // LUCE_PAT
const REPO = process.env.GITHUB_REPOSITORY;
const SHA = process.env.GITHUB_SHA;

const CONFIG_PATH = path.join(ROOT, 'luce.config.json');
const cfg = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));

function sh(cmd, opts = {}) {
  return execSync(cmd, { stdio: 'pipe', encoding: 'utf8', cwd: ROOT, ...opts }).trim();
}

function listFiles(globs = []) {
  if (!globs.length) return '';
  return sh(`git ls-files ${globs.map(g => `"${g}"`).join(' ')}`);
}

function withinAllow(pathname) {
  const allow = cfg.output?.allowPaths || [];
  if (!allow.length) return true; // nothing specified
  // Very light allow check: any glob prefix match
  return allow.some(glob => {
    const prefix = glob.replace(/\*\*?$/,''); // "src/**" -> "src/"
    return pathname.startsWith(prefix);
  });
}

// --- Patch pathway ---------------------------------------------------------

function normalizePatch(patch) {
  // Ensure "diff --git a/path b/path" style and "--- a/path\n+++ b/path"
  // If the model omitted a/ b/ prefixes, add them.
  return patch.replace(/^(---)\s+([^\n\r]+)/gm, (m, d, p) => `--- a/${p.replace(/^a\//,'')}`)
              .replace(/^(\+\+\+)\s+([^\n\r]+)/gm, (m, d, p) => `+++ b/${p.replace(/^b\//,'')}`)
              .replace(/^diff --git\s+([^ ]+)\s+([^\n\r]+)/gm, (m, p1, p2) => {
                const left = p1.startsWith('a/') ? p1 : `a/${p1}`;
                const right = p2.startsWith('b/') ? p2 : `b/${p2}`;
                return `diff --git ${left} ${right}`;
              });
}

function tryApplyPatch(patch, patchPath) {
  fs.writeFileSync(patchPath, patch, 'utf8');
  const strategies = [
    'git apply -p0 --reject --whitespace=fix',
    'git apply -p1 --reject --whitespace=fix',
    'git apply --3way --whitespace=fix'
  ];
  let lastErr = null;
  for (const cmd of strategies) {
    try {
      sh(`${cmd} "${patchPath}"`);
      return; // success
    } catch (e) {
      lastErr = e;
    }
  }
  throw new Error('Patch failed to apply cleanly after multiple strategies.');
}

// --- Fallback (file edits) -------------------------------------------------

async function makeEdits(cursorPrompt, fileList) {
  const sys = [
    'You will output JSON ONLY with this exact shape:',
    '{"edits":[{"path":"relative/path.ext","content":"<FULL NEW FILE CONTENT>"}]}',
    'Rules:',
    '- Only include files that EXIST in the fileList unless creating small assets in allowed dirs.',
    '- Paths MUST be relative to repo root.',
    '- Update only allowed paths. Provide full replacement content per file.',
  ].join('\n');

  const user = [
    'Repo files (subset, relative to repo root):',
    '```',
    fileList,
    '```',
    '',
    'Delta request (Cursor-style):',
    '```',
    cursorPrompt,
    '```',
    '',
    'Return JSON ONLY. No prose. Keep the minimal set of file replacements.'
  ].join('\n');

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      temperature: 0.2,
      response_format: { type: 'json_object' },
      messages: [{ role: 'system', content: sys }, { role: 'user', content: user }]
    })
  });
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  let obj;
  try {
    obj = JSON.parse(data.choices?.[0]?.message?.content || '{}');
  } catch {
    throw new Error('Model returned non-JSON for edits fallback.');
  }
  if (!obj?.edits || !Array.isArray(obj.edits)) {
    throw new Error('Edits JSON missing "edits" array.');
  }
  return obj.edits;
}

function applyEdits(edits) {
  const written = [];
  for (const { path: p, content } of edits) {
    if (!p || typeof content !== 'string') continue;
    if (!withinAllow(p)) continue;
    const abs = path.join(ROOT, p);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, content, 'utf8');
    written.push(p);
  }
  if (!written.length) throw new Error('No edits were applied (allowlist may be too strict).');
  return written;
}

// --- PR creation -----------------------------------------------------------

async function openPR(branch, title, body) {
  const res = await fetch(`https://api.github.com/repos/${REPO}/pulls`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json'
    },
    body: JSON.stringify({
      title,
      head: branch,
      base: process.env.GITHUB_BASE_REF || 'main',
      body
    })
  });
  if (!res.ok) throw new Error(`PR create failed: ${res.status} ${await res.text()}`);
  const json = await res.json();
  return json.html_url;
}

// --- Public entry ----------------------------------------------------------

export async function applyCursorPrompt(cursorPrompt) {
  const allow = (cfg.output?.allowPaths || []);
  const fileList = listFiles(allow);
  const branch = `${cfg.output?.deltaBranchPrefix || 'luce/delta-'}${Date.now()}`;

  // Ask for a unified diff first
  const sys = [
    'Output ONLY a git unified diff patch (no prose).',
    'The patch MUST use: diff --git a/<path> b/<path>, --- a/<path>, +++ b/<path>',
    'Patch must apply with: git apply -p0 --reject --whitespace=fix',
    'Edit only allowed files; keep changes minimal and self-contained.'
  ].join(' ');

  const user = [
    'Repo files (subset, paths relative to repo root):',
    '```',
    fileList,
    '```',
    '',
    'Delta request (Cursor-style):',
    '```',
    cursorPrompt,
    '```',
    '',
    'Produce a single unified diff from repo root.'
  ].join('\n');

  let patch = '';
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.2,
        messages: [
          { role: 'system', content: sys },
          { role: 'user', content: user }
        ]
      })
    });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    patch = data.choices?.[0]?.message?.content || '';
  } catch (e) {
    // If the diff request itself fails (quota/network), we’ll fall back to edits later
    patch = '';
  }

  // Create a working branch
  sh(`git checkout -b "${branch}"`);

  // Try patch path first if we have a diff-looking string
  const patchPath = path.join(__dirname, 'artifacts.patch');
  let appliedViaPatch = false;
  if (patch && patch.includes('diff --git')) {
    try {
      const normalized = normalizePatch(patch);
      tryApplyPatch(normalized, patchPath);
      appliedViaPatch = true;
    } catch (e) {
      console.error('Patch apply failed:', e.message);
    }
  }

  // If patch failed or wasn’t provided, fall back to file edits
  if (!appliedViaPatch) {
    const edits = await makeEdits(cursorPrompt, fileList);
    const written = applyEdits(edits);
    // Stage only allowed files written
    sh(`git add ${written.map(w => `"${w}"`).join(' ')}`);
  } else {
    // Stage allowed paths broadly (we don’t know the exact file set easily post-apply)
    const addTargets = allow.length ? allow.join(' ') : '.';
    sh(`git add ${addTargets}`);
  }

  // Optional: build/tests gate (uncomment once you have them)
  // if (fs.existsSync(path.join(ROOT, 'package.json'))) {
  //   sh(`npm ci`);
  //   sh(`npm run build`);
  //   // sh(`npm test --silent`);
  // }

  // Commit & push
  sh(`git -c user.name="luce-bot" -c user.email="luce-bot@users.noreply.github.com" commit -m "feat(luce): auto delta"`);
  sh(`git push --set-upstream origin "${branch}"`);

  // Open PR
  const url = await openPR(branch, 'Luce auto-delta', `Auto changes from Luce.\n\nSource commit: \`${SHA}\``);
  console.log('Opened PR:', url);
}