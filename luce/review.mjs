// REVIEW-ONLY: Luce inspects your preview and opens ONE Issue per commit with findings + Cursor prompt.
// No code changes, no PRs.
//
// Requires env:
// - OPENAI_API_KEY
// - PREVIEW_URL (public, viewable without auth)
// - GITHUB_REPOSITORY (owner/repo)
// - GITHUB_SHA
// - GITHUB_TOKEN (Actions default token)

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const PREVIEW_URL    = process.env.PREVIEW_URL || '';
const GITHUB_TOKEN   = process.env.GITHUB_TOKEN || '';
const REPO           = process.env.GITHUB_REPOSITORY || '';
const SHA            = process.env.GITHUB_SHA || '';

if (!OPENAI_API_KEY) throw new Error('Missing OPENAI_API_KEY');
if (!PREVIEW_URL)    throw new Error('Missing PREVIEW_URL');
if (!GITHUB_TOKEN)   throw new Error('Missing GITHUB_TOKEN');
if (!REPO)           throw new Error('Missing GITHUB_REPOSITORY');

const RUBRIC_PATH = path.join(__dirname, 'prompts', 'rubric.md');
const OUT_DIR     = path.join(__dirname, 'reviews');

// Minimal payload describing what to review (extend later if needed)
const payload = { previewUrl: PREVIEW_URL, paths: ['/'] };

// --- GitHub helpers (use Node 20 global fetch) ---
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

async function findExistingIssueForSHA(sha) {
  // List recent open issues and look for our marker
  const issues = await gh(`/issues?state=open&per_page=100`);
  return issues.find(i =>
    !i.pull_request &&
    (i.title || '').toLowerCase().includes('luce review') &&
    (i.body || '').includes(sha)
  );
}

async function openIssue({ score, findings, requiredFixes, cursorPrompt }) {
  const title = `Luce Review — ${new Date().toISOString()} — Score ${score}`;
  const body = [
    `**Preview**: ${PREVIEW_URL}`,
    `**Source commit**: \`${SHA}\``,
    `**Score**: ${score}`,
    ``,
    `## Findings`,
    ...(findings?.length ? findings.map(f => `- ${f}`) : ['- (none)']),
    ``,
    `## Required Fixes (priority order)`,
    ...(requiredFixes?.length ? requiredFixes.map((f, i) => `${i + 1}) ${f}`) : ['(none)']),
    ``,
    `---`,
    `## Paste in Cursor (delta prompt)`,
    '```',
    cursorPrompt || '(no prompt)',
    '```'
  ].join('\n');

  const json = await gh(`/issues`, {
    method: 'POST',
    body: JSON.stringify({ title, body, labels: ['luce', 'auto-review'] })
  });
  console.log(`Opened Issue #${json.number}: ${json.html_url}`);
}

// --- OpenAI review ---
async function openaiReview() {
  const rubric = fs.existsSync(RUBRIC_PATH)
    ? fs.readFileSync(RUBRIC_PATH, 'utf8')
    : 'Score 0-20. Return JSON with keys: score, findings[], requiredFixes[], cursorPrompt, stop';

  const body = {
    model: 'gpt-4o-mini',
    temperature: 0, // deterministic
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content:
          'You are Luce, a critical web supervisor. Output STRICT JSON ONLY: ' +
          '{"score":number,"findings":string[],"requiredFixes":string[],"cursorPrompt":string,"stop":boolean}'
      },
      { role: 'user', content: JSON.stringify(payload) },
      { role: 'user', content: rubric }
    ]
  };

  const r = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!r.ok) throw new Error(`OpenAI ${r.status}: ${await r.text()}`);
  const data = await r.json();
  let obj;
  try { obj = JSON.parse(data.choices?.[0]?.message?.content || '{}'); }
  catch { obj = { score: 0, findings: ['Invalid JSON'], requiredFixes: [], cursorPrompt: '', stop: false }; }
  return obj;
}

(async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  // Dedupe per commit SHA
  const existing = await findExistingIssueForSHA(SHA).catch(() => null);
  if (existing) {
    console.log(`Issue already exists for ${SHA}: #${existing.number} (${existing.html_url}). Skipping.`);
    return;
  }

  const review = await openaiReview();
  const out = path.join(OUT_DIR, `review-${SHA || Date.now()}.json`);
  fs.writeFileSync(out, JSON.stringify(review, null, 2));
  console.log(`Saved review to ${out}`);
  console.log(`Review summary: score=${review.score} stop=${review.stop === true}`);

  await openIssue({
    score: review.score ?? 0,
    findings: review.findings || [],
    requiredFixes: review.requiredFixes || [],
    cursorPrompt: review.cursorPrompt || ''
  });
})();