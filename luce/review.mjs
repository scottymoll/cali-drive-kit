// Luce reviewer: opens a GitHub Issue with a Cursor delta prompt if under target
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const RUBRIC_PATH = path.join(__dirname, 'prompts', 'rubric.md');
const CONFIG_PATH = path.join(__dirname, '..', 'luce.config.json');
const OUT_DIR = path.join(__dirname, 'reviews');

// Env
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const PREVIEW_URL = process.env.PREVIEW_URL || '';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;            // provided by Actions
const REPO = process.env.GITHUB_REPOSITORY;               // owner/name
const SHA = process.env.GITHUB_SHA;

// Load inputs
const rubric = fs.readFileSync(RUBRIC_PATH, 'utf8');
const cfg = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));

// Build the review payload
const payload = { previewUrl: PREVIEW_URL, config: cfg, commit: SHA };

// Call OpenAI to get a structured review with a Cursor delta prompt
async function openaiReview() {
  const body = {
  model: 'gpt-4o-mini',
  response_format: { type: 'json_object' },
    temperature: 0.2,
    messages: [
      {
        role: 'system',
        content:
          'You are Luce, an exacting web supervisor. Output strict JSON ONLY with fields: ' +
          '{"score":number,"findings":string[],"requiredFixes":string[],"cursorPrompt":string,"stop":boolean}'
      },
      { role: 'user', content: JSON.stringify(payload) },
      { role: 'user', content: rubric }
    ]
  };

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const t = await res.text();
    throw new Error(`OpenAI API error ${res.status}: ${t}`);
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content || '{}';

  try {
    return JSON.parse(content);
  } catch {
    return { score: 0, findings: ['Invalid JSON from model'], requiredFixes: [], cursorPrompt: '', stop: false };
  }
}

async function createIssue(score, findings, requiredFixes, cursorPrompt) {
  const title = `Luce Review — ${new Date().toISOString()} — Score ${score}`;
  const body = [
    `**Preview**: ${PREVIEW_URL}`,
    `**Commit**: \`${SHA}\``,
    `**Score**: ${score}`,
    `## Findings`,
    ...(findings?.length ? findings.map(f => `- ${f}`) : ['- (none)']),
    `## Required Fixes`,
    ...(requiredFixes?.length ? requiredFixes.map((f, i) => `${i + 1}) ${f}`) : ['(none)']),
    `---`,
    `## Paste this in Cursor (delta prompt)`,
    '```',
    cursorPrompt || '(no prompt returned)',
    '```',
    `### Notes`,
    `- Push a new commit after applying; Luce will re-review automatically.`
  ].join('\n\n');

  const res = await fetch(`https://api.github.com/repos/${REPO}/issues`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json'
    },
    body: JSON.stringify({ title, body, labels: ['luce', 'auto-review'] })
  });

  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Failed to create issue: ${res.status} ${t}`);
  }
  const json = await res.json();
  console.log(`Opened issue #${json.number}`);
}

// Main
(async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const review = await openaiReview();

  // Save raw JSON
  const outFile = path.join(OUT_DIR, `review-${SHA}.json`);
  fs.writeFileSync(outFile, JSON.stringify(review, null, 2));
  console.log(`Saved review to ${outFile}`);

  const target = cfg.targets?.rubricScore ?? 18;
  const score = Number.isFinite(review?.score) ? review.score : 0;

  // Force iteration under target
  const shouldStop = review?.stop === true || score >= target;
  if (shouldStop) {
    console.log(`Target met (score=${score} >= ${target}) or stop=true. Not opening an issue.`);
    return;
  }

  await createIssue(score, review?.findings || [], review?.requiredFixes || [], review?.cursorPrompt || '');
})().catch(err => {
  console.error(err);
  process.exit(1);
});

