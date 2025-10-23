// Luce apply.mjs — resilient version (Step 4)
// Handles git patches, fallback JSON edits, auto-labeling, and PR creation
// -------------------------------------------------------------------------

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GITHUB_TOKEN   = process.env.GITHUB_TOKEN;
const REPO           = process.env.GITHUB_REPOSITORY;
const SHA            = process.env.GITHUB_SHA || '';

if (!OPENAI_API_KEY) throw new Error('Missing OPENAI_API_KEY');
if (!GITHUB_TOKEN)   throw new Error('Missing GITHUB_TOKEN');
if (!REPO)           throw new Error('Missing GITHUB_REPOSITORY');

const CONFIG_PATH = path.join(ROOT, 'luce.config.json');
const cfg = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));

function sh(cmd) {
  return execSync(cmd, { stdio: 'pipe', encoding: 'utf8', cwd: ROOT }).trim();
}

// -------------------------------------------------------------------------
// Helpers
// -------------------------------------------------------------------------

function listFiles(globs = []) {
  if (!globs.length) return sh('git ls-files');
  return sh(`git ls-files ${globs.map(g => `"${g}"`).join(' ')}`);
}

function withinAllow(relPath) {
  const allow = cfg.output?.allowPaths || [];
  if (!allow.length) return true;
  return allow.some(glob => {
    const prefix = glob.endsWith('/**') ? glob.slice(0, -3) : glob.replace(/\*+$/, '');
    return relPath.startsWith(prefix);
  });
}

async function gh(pathname, init = {}) {
  const res = await fetch(`https://api.github.com/repos/${REPO}${pathname}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
      ...(init.headers || {})
    }
  });
  if (!res.ok) throw new Error(`${init.method || 'GET'} ${pathname}: ${res.status} ${await res.text()}`);
  return res.json();
}

// -------------------------------------------------------------------------
// Patch utilities
// -------------------------------------------------------------------------

function normalizePatch(patch) {
  return patch
    .replace(/^diff --git\s+([^\s]+)\s+([^\s]+)$/gm, (_, a, b) =>
      `diff --git a/${a.replace(/^a\//,'')} b/${b.replace(/^b\//,'')}`)
    .replace(/^---\s+(.+)$/gm, (_, p) => `--- a/${p.replace(/^a\//,'')}`)
    .replace(/^\+\+\+\s+(.+)$/gm, (_, p) => `+++ b/${p.replace(/^b\//,'')}`);
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
  throw new Error(`Patch failed after all strategies. Last error: ${lastErr?.message}`);
}

// -------------------------------------------------------------------------
// Fallback (JSON edits)
// -------------------------------------------------------------------------

async function makeEdits(prompt, fileList) {
  const sys = [
    'Return JSON ONLY with shape:',
    '{"edits":[{"path":"relative/path","content":"<FULL FILE CONTENT>"}]}',
    'Edit only allow-listed files.  Provide full replacements.'
  ].join('\n');

  const user = [
    'File list (relative to repo root):',
    '```', fileList, '```',
    '',
    'Requested change:',
    '```', prompt, '```',
    '',
    'Return JSON ONLY.'
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
  const content = data.choices?.[0]?.message?.content || '{}';
  const obj = JSON.parse(content);
  if (!obj?.edits) throw new Error('No "edits" array in JSON response.');
  return obj.edits;
}

function applyEdits(edits) {
  const written = [];
  for (const { path: rel, content } of edits) {
    if (!rel || typeof content !== 'string' || !withinAllow(rel)) continue;
    const abs = path.join(ROOT, rel);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, content, 'utf8');
    written.push(rel);
  }
  if (!written.length) throw new Error('No edits applied.');
  return written;
}

// -------------------------------------------------------------------------
// PR utilities
// -------------------------------------------------------------------------

async function findExistingPR() {
  const list = await gh(`/pulls?state=open&per_page=50`);
  return list.find(p =>
    p.head?.ref?.startsWith('luce/delta-') ||
    (p.title || '').toLowerCase().includes('luce auto-delta')
  );
}

async function openPR(branch, title, body) {
  const pr = await gh(`/pulls`, {
    method: 'POST',
    body: JSON.stringify({ title, head: branch, base: 'main', body })
  });
  await gh(`/issues/${pr.number}/labels`, {
    method: 'POST',
    body: JSON.stringify({ labels: ['luce-auto'] })
  });
  return pr;
}

// -------------------------------------------------------------------------
// Entry point
// -------------------------------------------------------------------------

export async function applyCursorPrompt(cursorPrompt) {
  // Skip if an existing Luce PR is open
  try {
    const existing = await findExistingPR();
    if (existing) {
      console.log(`Existing PR #${existing.number} (${existing.html_url}); skipping.`);
      return;
    }
  } catch (err) {
    console.warn('PR check failed:', err.message);
  }

  const allow = cfg.output?.allowPaths || [];
  const fileList = listFiles(allow);
  const branch = `${cfg.output?.deltaBranchPrefix || 'luce/delta-'}${Date.now()}`;

  // Ask model for unified diff
  let patch = '';
  try {
    const sys = [
      'Output ONLY a unified diff patch (no prose).',
      'Use correct a/ and b/ prefixes.'
    ].join(' ');
    const user = [
      'Files:',
      '```', fileList, '```',
      '',
      'Request:',
      '```', cursorPrompt, '```'
    ].join('\n');

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.2,
        messages: [{ role: 'system', content: sys }, { role: 'user', content: user }]
      })
    });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    patch = data.choices?.[0]?.message?.content || '';
  } catch (e) {
    console.error('Diff request failed:', e.message);
  }

  // Create working branch
  sh(`git checkout -b "${branch}"`);

  // Try patch first
  let applied = false;
  const patchPath = path.join(__dirname, 'artifacts.patch');
  if (patch && patch.includes('diff --git')) {
    try {
      tryApplyPatch(normalizePatch(patch), patchPath);
      applied = true;
      console.log('Patch applied successfully.');
    } catch (err) {
      console.error('Patch apply failed:', err.message);
    }
  }

  // Fallback to edits
  if (!applied) {
    console.log('Falling back to file edits...');
    const edits = await makeEdits(cursorPrompt, fileList);
    const written = applyEdits(edits);
    sh(`git add ${written.map(f => `"${f}"`).join(' ')}`);
  } else {
    const addTargets = allow.length ? allow.join(' ') : '.';
    sh(`git add ${addTargets}`);
  }

  // Commit & push
  sh(`git -c user.name="luce-bot" -c user.email="luce-bot@users.noreply.github.com" commit -m "feat(luce): auto delta"`);
  sh(`git push --set-upstream origin "${branch}"`);

  // Open PR
  const pr = await openPR(branch, 'Luce auto-delta', `Auto changes from Luce.\nSource commit: ${SHA}`);
  console.log('Opened PR:', pr.html_url);
}