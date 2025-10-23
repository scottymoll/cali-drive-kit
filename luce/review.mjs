// REVIEW-ONLY: Luce inspects your preview and opens ONE Issue per commit with findings + a
// **detailed, production-grade Cursor prompt** (verbose by default).
//
// Requires env:
// - OPENAI_API_KEY
// - PREVIEW_URL (public, viewable without auth)
// - GITHUB_REPOSITORY (owner/repo)
// - GITHUB_SHA
// - GITHUB_TOKEN (Actions default token)
// - Optional: LUCE_PROMPT_STYLE = 'verbose' | 'concise' (default: verbose)

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
const PROMPT_STYLE   = (process.env.LUCE_PROMPT_STYLE || 'verbose').toLowerCase();

if (!OPENAI_API_KEY) throw new Error('Missing OPENAI_API_KEY');
if (!PREVIEW_URL)    throw new Error('Missing PREVIEW_URL');
if (!GITHUB_TOKEN)   throw new Error('Missing GITHUB_TOKEN');
if (!REPO)           throw new Error('Missing GITHUB_REPOSITORY');

const RUBRIC_PATH = path.join(__dirname, 'prompts', 'rubric.md');
const OUT_DIR     = path.join(__dirname, 'reviews');

// Minimal payload describing what to review (extend later if needed)
const payload = { previewUrl: PREVIEW_URL, paths: ['/'] };

// --- GitHub helpers (Node 20 has global fetch) ---
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

// --- Cursor prompt spec (forces a long, actionable prompt) ---
function cursorPromptSpec() {
  // A strict spec the model must follow. It’s included in the system prompt.
  const verboseRequirements = `
You will generate a *detailed, production-grade* Cursor delta prompt that an engineer can paste and run without clarifying questions.

HARD REQUIREMENTS (follow exactly):
- Tone: directive, concise, no chit-chat.
- Minimum length: 300+ words.
- Structure with the following headings (ALL caps exactly):
  1) GOALS
  2) CURRENT ISSUES (EVIDENCE)
  3) CHANGES TO MAKE (BULLETED)
  4) FILES TO TOUCH (RELATIVE PATHS)
  5) CODING GUIDELINES
  6) ACCEPTANCE CRITERIA
  7) MANUAL QA STEPS
  8) GIT INSTRUCTIONS
- Under **FILES TO TOUCH**, list plausible relative paths (e.g., app/page.tsx, pages/index.tsx, src/components/Hero.tsx, styles/globals.css). If a file likely doesn't exist, prefix with "(create)".
- Under **CHANGES TO MAKE**, be specific (selectors, components, props, aria attributes, typography tokens, spacing scale).
- Under **CODING GUIDELINES**, include: TypeScript if project uses TS, accessibility (ARIA, focus order, labels), performance (no layout shift; image sizing), responsive breakpoints (390/768/1280), and lint rules if applicable.
- Under **ACCEPTANCE CRITERIA**, write binary checkable points (e.g., "No console errors on /", "Lighthouse CLS <= 0.1 on mobile", "All interactive elements have visible focus states").
- Under **MANUAL QA STEPS**, list exact steps (URL path, viewport width, keys to press) to verify.
- Under **GIT INSTRUCTIONS**, tell Cursor to create a single commit with a clear message (e.g., "feat(ui): redesign hero + a11y fixes") and push to main (or open a PR if protected).

Do NOT include any placeholders like "<insert here>" — write concrete text.
Do NOT output code diffs — focus on instructions.`;

  const conciseRequirements = `
Generate a clear Cursor delta prompt with:
- GOALS, CHANGES TO MAKE, FILES TO TOUCH, ACCEPTANCE CRITERIA, QA STEPS, GIT INSTRUCTIONS.
- 150+ words, specific and directive, no placeholders.`;

  return PROMPT_STYLE === 'concise' ? conciseRequirements : verboseRequirements;
}

// --- OpenAI review (now with stronger prompt spec) ---
async function openaiReview() {
  const rubric = fs.existsSync(RUBRIC_PATH)
    ? fs.readFileSync(RUBRIC_PATH, 'utf8')
    : 'Score 0-20. Return JSON with keys: score, findings[], requiredFixes[], cursorPrompt, stop';

  const spec = cursorPromptSpec();

  const system = [
    'You are Luce, a critical web supervisor. Output STRICT JSON ONLY:',
    '{"score":number,"findings":string[],"requiredFixes":string[],"cursorPrompt":string,"stop":boolean}',
    '',
    'When writing cursorPrompt, follow this spec EXACTLY:',
    spec
  ].join('\n');

  const userPayload = JSON.stringify(payload);

  const body = {
    model: 'gpt-4o-mini',
    temperature: 0.2, // a touch of creativity, still stable
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: userPayload },
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