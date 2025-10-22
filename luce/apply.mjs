// Luce apply: convert Cursor-style prompt into a diff, apply robustly, and open a PR
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // LUCE_PAT from secrets
const REPO = process.env.GITHUB_REPOSITORY;
const SHA = process.env.GITHUB_SHA;

const CONFIG_PATH = path.join(ROOT, 'luce.config.json');
const cfg = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));

function sh(cmd, opts = {}) {
  return execSync(cmd, { stdio: 'pipe', encoding: 'utf8', ...opts }).trim();
}

function listFiles(globs = []) {
  if (!globs.length) return '';
  return sh(`git ls-files ${globs.map(g => `"${g}"`).join(' ')}`, { cwd: ROOT });
}

async function makePatch(cursorPrompt, fileList) {
  const sys = [
    'You MUST output ONLY a valid git unified diff patch (no prose).',
    'Start each change with: diff --git PATH PATH',
    'Use repo-root relative paths (e.g., src/file.tsx).',
    'Do NOT include a/ or b/ prefixes.',
    'Patch must apply with: git apply -p0 --reject --whitespace=fix',
    'Edit only existing files within the allowlist; keep changes minimal and self-contained.',
  ].join(' ');

  const user = [
    'Allowed repo files (subset); paths are relative to repo root:',
    '```',
    fileList,
    '```',
    '',
    'Delta request (Cursor-style instructions):',
    '```',
    cursorPrompt,
    '```',
    '',
    'Produce a SINGLE unified diff patch from repo root. No commentary, only the patch.'
  ].join('\n');

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
  const patch = data.choices?.[0]?.message?.content || '';
  if (!patch.includes('diff --git')) throw new Error('Model did not return a git diff.');
  return patch;
}

function tryApplyPatch(patchPath) {
  // Try multiple strategies: -p0, then -p1 (for a/b prefixes), then 3-way
  const attempts = [
    { name: 'apply -p0', cmd: `git apply -p0 --reject --whitespace=fix "${patchPath}"` },
    { name: 'apply -p1', cmd: `git apply -p1 --reject --whitespace=fix "${patchPath}"` },
    { name: 'apply --3way', cmd: `git apply --3way --whitespace=fix "${patchPath}"` }
  ];

  for (const a of attempts) {
    try {
      sh(a.cmd, { cwd: ROOT });
      return { ok: true, method: a.name };
    } catch (e) {
      // write a short log for each failure, continue to next attempt
      console.error(`Patch ${a.name} failed: ${e.message.split('\n')[0]}`);
    }
  }
  return { ok: false };
}

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

export async function applyCursorPrompt(cursorPrompt) {
  const allow = (cfg.output?.allowPaths || []);
  const files = listFiles(allow);
  const branch = `${cfg.output?.deltaBranchPrefix || 'luce/delta-'}${Date.now()}`;

  // Generate diff
  const patch = await makePatch(cursorPrompt, files);

  // New branch
  sh(`git checkout -b "${branch}"`, { cwd: ROOT });

  // Save patch for debugging
  const patchPath = path.join(__dirname, 'artifacts.patch');
  fs.writeFileSync(patchPath, patch);

  // Apply with resilient strategy
  const result = tryApplyPatch(patchPath);
  if (!result.ok) {
    // Keep branch so you can inspect; fail back to issue in review.mjs
    throw new Error('Patch failed to apply cleanly after multiple strategies.');
  }
  console.log(`Patch applied using method: ${result.method}`);

  // Optional: build/tests gate — uncomment when ready
  // if (fs.existsSync(path.join(ROOT, 'package.json'))) {
  //   sh(`npm ci`, { cwd: ROOT });
  //   // sh(`npm run build`, { cwd: ROOT });
  //   // sh(`npm test --silent`, { cwd: ROOT });
  // }

  // Commit & push only allowed paths
  const addTargets = allow.length ? allow.join(' ') : '.';
  sh(`git add ${addTargets}`, { cwd: ROOT });
  // In case new files were added within allowed paths, add them:
  sh(`git add -A`, { cwd: ROOT });

  sh(
    `git -c user.name="luce-bot" -c user.email="luce-bot@users.noreply.github.com" commit -m "feat(luce): auto delta"`,
    { cwd: ROOT }
  );
  sh(`git push --set-upstream origin "${branch}"`, { cwd: ROOT });

  // Open PR
  const url = await openPR(branch, 'Luce auto-delta', `Auto changes from Luce.\n\nSource commit: \`${SHA}\``);
  console.log('Opened PR:', url);
}