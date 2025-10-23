// Luce apply: rolling PR with strong idempotence & deterministic outputs
// - Reuses existing Luce PR branch (rolling PR)
// - Commits at most once per source SHA AND per prompt hash
// - Skips commit when no real changes
// - Tries git unified diff first; falls back to JSON full-file edits
// - Deterministic model (temperature: 0)
// - Optional edits-only mode: set env LUCE_PREFER_EDITS=1
// - Labels PR "luce-auto" and comments when updated

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import fetch from 'node-fetch';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GITHUB_TOKEN   = process.env.GITHUB_TOKEN;        // LUCE_PAT or github.token
const REPO           = process.env.GITHUB_REPOSITORY;   // owner/name
const SHA            = process.env.GITHUB_SHA || '';
const PREFER_EDITS   = process.env.LUCE_PREFER_EDITS === '1';

if (!OPENAI_API_KEY) throw new Error('OPENAI_API_KEY missing');
if (!GITHUB_TOKEN)   throw new Error('GITHUB_TOKEN missing');
if (!REPO)           throw new Error('GITHUB_REPOSITORY missing');

const CONFIG_PATH  = path.join(ROOT, 'luce.config.json');
const STATE_PATH   = path.join(ROOT, 'luce', '.state.json'); // lives under luce/** (ignored by workflow triggers)
const cfg = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));

function sh(cmd, opts = {}) {
  return execSync(cmd, { stdio: 'pipe', encoding: 'utf8', cwd: ROOT, ...opts }).trim();
}

function listFiles(globs = []) {
  if (!globs.length) return sh('git ls-files');
  return sh(`git ls-files ${globs.map(g => `"${g}"`).join(' ')}`);
}

function withinAllow(relPath) {
  const allow = cfg.output?.allowPaths || [];
  if (!allow.length) return true;
  const matches = allow.some(glob => {
    const pref = glob.endsWith('/**') ? glob.slice(0, -3) : glob.replace(/\*+$/,'');
    return relPath.startsWith(pref);
  });
  return matches;
}

/* ------------------ state (idempotence) ------------------ */

function loadState() {
  try {
    const raw = fs.readFileSync(STATE_PATH, 'utf8');
    return JSON.parse(raw);
  } catch {
    return { last: {} };
  }
}
function saveState(state) {
  fs.mkdirSync(path.dirname(STATE_PATH), { recursive: true });
  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2), 'utf8');
}
function sha256(s) {
  return crypto.createHash('sha256').update(s, 'utf8').digest('hex');
}

/* ------------------ GitHub helpers ------------------ */

async function gh(urlPath, init = {}) {
  const res = await fetch(`https://api.github.com/repos/${REPO}${urlPath}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
      ...(init.headers || {})
    }
  });
  if (!res.ok) throw new Error(`${init.method || 'GET'} ${urlPath} failed: ${res.status} ${await res.text()}`);
  return res.json();
}

async function findExistingLucePR() {
  const list = await gh(`/pulls?state=open&per_page=50`);
  return list.find(p =>
    p.head?.ref?.startsWith('luce/delta-') ||
    (p.title || '').toLowerCase().includes('luce auto-delta')
  );
}

async function openPR(branch, title, body) {
  const pr = await gh(`/pulls`, {
    method: 'POST',
    body: JSON.stringify({ title, head: branch, base: process.env.GITHUB_BASE_REF || 'main', body })
  });
  return pr;
}

async function addLabelsToPR(prNumber, labels = ['luce-auto']) {
  await gh(`/issues/${prNumber}/labels`, {
    method: 'POST',
    body: JSON.stringify({ labels })
  });
}

async function commentOnPR(prNumber, body) {
  await gh(`/issues/${prNumber}/comments`, {
    method: 'POST',
    body: JSON.stringify({ body })
  });
}

/* ------------------ Patch pathway ------------------ */

function normalizePatch(patch) {
  let out = patch
    .replace(/^diff --git\s+([^\s]+)\s+([^\s]+)$/gm, (_m, left, right) => {
      const a = left.startsWith('a/') ? left : `a/${left.replace(/^a\//,'')}`;
      const b = right.startsWith('b/') ? right : `b/${right.replace(/^b\//,'')}`;
      return `diff --git ${a} ${b}`;
    })
    .replace(/^---\s+(.+)$/gm, (_m, p) => `--- a/${p.replace(/^a\//,'')}`)
    .replace(/^\+\+\+\s+(.+)$/gm, (_m, p) => `+++ b/${p.replace(/^b\//,'')}`);
  return out;
}

function tryApplyPatch(patchText, patchPath) {
  fs.writeFileSync(patchPath, patchText, 'utf8');
  const strategies = [
    'git apply -p0 --reject --whitespace=fix',
    'git apply -p1 --reject --whitespace=fix',
    'git apply --3way --whitespace=fix'
  ];
  let lastErr;
  for (const cmd of strategies) {
    try {
      sh(`${cmd} "${patchPath}"`);
      return true;
    } catch (e) {
      lastErr = e;
    }
  }
  if (lastErr) throw new Error('Patch failed to apply cleanly after multiple strategies.');
  return false;
}

/* ------------------ Fallback (file edits) ------------------ */

async function makeEdits(cursorPrompt, fileList) {
  const sys = [
    'You will output JSON ONLY with this exact shape:',
    '{"edits":[{"path":"relative/path.ext","content":"<FULL NEW FILE CONTENT>"}]}',
    'Rules:',
    '- Only include existing files from the provided list unless creating small assets in allowed dirs.',
    '- Paths MUST be relative to the repo root.',
    '- Update only allow-listed paths.',
    '- Provide FULL replacement content for each file you include.',
    '- DO NOT include timestamps, random IDs, or non-deterministic content.'
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
    'Return JSON ONLY. No prose.'
  ].join('\n');

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      temperature: 0, // deterministic
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: sys },
        { role: 'user', content: user }
      ]
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
  for (const { path: rel, content } of edits) {
    if (!rel || typeof content !== 'string') continue;
    if (!withinAllow(rel)) continue;
    const abs = path.join(ROOT, rel);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    const prev = fs.existsSync(abs) ? fs.readFileSync(abs, 'utf8') : null;
    if (prev !== null && prev === content) {
      continue; // no change
    }
    fs.writeFileSync(abs, content, 'utf8');
    written.push(rel);
  }
  if (!written.length) throw new Error('No edits were applied (no changes or allowPaths too strict).');
  return written;
}

/* ------------------ Idempotence helpers ------------------ */

function lastCommitMessage() {
  try { return sh('git log -1 --pretty=%B'); }
  catch { return ''; }
}

function alreadyUpdatedForSHA(sourceSha) {
  const msg = lastCommitMessage();
  return msg.includes(`[source:${sourceSha}]`);
}

/* ------------------ Public entry (rolling PR + idempotence) ------------------ */

export async function applyCursorPrompt(cursorPrompt) {
  const allow = cfg.output?.allowPaths || [];
  const fileList = listFiles(allow);

  const promptHash = sha256(cursorPrompt || '');

  // Load state and check idempotence BEFORE doing work
  const state = loadState();
  const last = state.last || {};
  if (last.sourceSha === SHA && last.promptHash === promptHash) {
    console.log(`No-op: same source SHA ${SHA} and same prompt hash ${promptHash}. Skipping.`);
    return;
  }

  // Check for an existing Luce PR (rolling PR mode)
  let existing = null;
  try {
    existing = await findExistingLucePR();
  } catch (e) {
    console.warn('Unable to check existing PRs:', e.message);
  }

  let branch;
  if (existing) {
    branch = existing.head.ref;
    console.log(`Updating existing Luce PR #${existing.number} on branch ${branch}`);
    // Ensure local branch reflects remote latest
    sh(`git fetch origin "${branch}"`);
    sh(`git checkout "${branch}"`);
    sh(`git reset --hard "origin/${branch}"`);

    // Guard: only one commit per source SHA
    if (alreadyUpdatedForSHA(SHA)) {
      console.log(`This PR already has an update for source SHA ${SHA}. Skipping.`);
      return;
    }
  } else {
    // Create a new working branch
    branch = `${cfg.output?.deltaBranchPrefix || 'luce/delta-'}${Date.now()}`;
    sh(`git checkout -b "${branch}"`);
  }

  // Ask the model for a unified diff (unless edits-only)
  let patch = '';
  if (!PREFER_EDITS) {
    try {
      const sys = [
        'Output ONLY a git unified diff patch (no prose).',
        'The patch MUST use: diff --git a/<path> b/<path>, --- a/<path>, +++ b/<path>',
        'Patch must apply with: git apply -p0 --reject --whitespace=fix',
        'Edit only allow-listed files; changes minimal and self-contained.',
        'DO NOT inject timestamps or non-deterministic content.'
      ].join(' ');

      const user = [
        'Repo files (subset, relative paths from repo root):',
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

      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          temperature: 0, // deterministic
          messages: [
            { role: 'system', content: sys },
            { role: 'user', content: user }
          ]
        })
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      patch = (data.choices?.[0]?.message?.content || '').trim();
    } catch (e) {
      console.error('Failed to get diff from model:', e.message);
    }
  }

  // Try to apply the patch; if that fails or edits-only, fall back to file edits
  let appliedViaPatch = false;
  const patchPath = path.join(__dirname, 'artifacts.patch');

  if (!PREFER_EDITS && patch && patch.includes('diff --git')) {
    try {
      const normalized = normalizePatch(patch);
      tryApplyPatch(normalized, patchPath);
      appliedViaPatch = true;
      console.log('Patch applied successfully.');
    } catch (e) {
      console.error('Patch apply failed:', e.message);
    }
  } else if (!PREFER_EDITS) {
    console.log('No usable patch returned; will try edits fallback.');
  }

  if (!appliedViaPatch) {
    const edits = await makeEdits(cursorPrompt, fileList);
    const written = applyEdits(edits);
    sh(`git add ${written.map(w => `"${w}"`).join(' ')}`);
    console.log(`Applied ${written.length} edited file(s).`);
  } else {
    const addTargets = allow.length ? allow.join(' ') : '.';
    sh(`git add ${addTargets}`);
  }

  // Guard: skip commit if nothing staged
  try {
    sh('git diff --cached --quiet'); // 0 when no staged changes
    console.log('No staged changes detected; skipping commit.');
    return;
  } catch {
    // there ARE staged changes
  }

  // Before commit, write state so we don't re-run for same inputs
  state.last = { sourceSha: SHA, promptHash };
  saveState(state);
  // Also stage the state file (lives under luce/**, which your workflow ignores on push to main)
  sh(`git add "luce/.state.json"`);

  // Commit & push (embed source SHA marker for idempotence)
  const commitMsg = `feat(luce): auto delta [source:${SHA}]`;
  sh(`git -c user.name="luce-bot" -c user.email="luce-bot@users.noreply.github.com" commit -m "${commitMsg}"`);
  sh(`git push --set-upstream origin "${branch}"`);

  // Open a new PR or comment on the existing one
  if (existing) {
    try {
      await commentOnPR(existing.number, `🔁 Luce pushed a new delta commit for source \`${SHA}\`.`);
    } catch (e) {
      console.warn('Could not comment on existing PR:', e.message);
    }
    console.log(`Updated existing PR #${existing.number}: ${existing.html_url}`);
  } else {
    const pr = await openPR(branch, 'Luce auto-delta', `Auto changes from Luce.\n\nSource commit: \`${SHA}\``);
    try { await addLabelsToPR(pr.number, ['luce-auto']); } catch (e) {
      console.warn('Could not add label to PR:', e.message);
    }
    console.log('Opened PR:', pr.html_url);
  }
}