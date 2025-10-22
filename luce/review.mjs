// Luce reviewer: score the site, auto-apply Cursor-style deltas, and (optionally) open Issues
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';
import { applyCursorPrompt } from './apply.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------- Paths ----------
const RUBRIC_PATH = path.join(__dirname, 'prompts', 'rubric.md');
const CONFIG_PATH = path.join(__dirname, '..', 'luce.config.json');
const OUT_DIR = path.join(__dirname, 'reviews');

// ---------- Env ----------
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const PREVIEW_URL = process.env.PREVIEW_URL || '';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;       // Actions token or LUCE_PAT
const REPO = process.env.GITHUB_REPOSITORY || '';    // owner/name
const SHA = process.env.GITHUB_SHA || '';
const DRYRUN = process.env.LUCE_DRYRUN === '1';

// ---------- Load Inputs ----------
if (!OPENAI_API_KEY) {
  console.error('Missing OPENAI_API_KEY');
  process.exit(1);
}
if (!PREVIEW_URL) {
  console.error('Missing PREVIEW_URL secret/env');
  process.exit(1);
}
const rubric = fs.readFileSync(RUBRIC_PATH, 'utf8');
const cfg = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));

// Minimal payload—keep tokens/cost low
const payload = { previewUrl: PREVIEW_URL, paths: cfg?.preview?.paths || ['/'] };

// ---------- Helpers ----------
async function openaiReview() {
  const body = {
    model: 'gpt-4o-mini',
    response_format: { type: 'json_object' },
    temperature: 0.2,
    messages: [
      {
        role: 'system',
        content:
          'You are Luce, an exacting web supervisor. Output STRICT JSON ONLY with this shape: ' +
          '{"score":number,"findings":string[],"requiredFixes":string[],"cursorPrompt":string,"stop":boolean}'
      },
      { role: 'user', content: JSON.stringify(payload) },
      { role: 'user', content: rubric }
    ]
  };

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
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
    return {
      score: 0,
      findings: ['Invalid JSON from model'],
      requiredFixes: [],
      cursorPrompt: '',
      stop: false
    };
  }
}

async function createIssue({ score, findings, requiredFixes, cursorPrompt }) {
  if (!GITHUB_TOKEN || !REPO) {
    console.warn('No GITHUB_TOKEN or REPO; cannot open Issue.');
    return;
  }

  const title = `Luce Review — ${new Date().toISOString()} — Score ${score}`;
  const body = [
    `**Preview**: ${PREVIEW_URL}`,
    `**Commit**: \`${SHA}\``,
    `**Score**: ${score}`,
    `## Findings`,
    ...(Array.isArray(findings) && findings.length
      ? findings.map(f => `- ${f}`)
      : ['- (none)']),
    `## Required Fixes`,
    ...(Array.isArray(requiredFixes) && requiredFixes.length
      ? requiredFixes.map((f, i) => `${i + 1}) ${f}`)
      : ['(none)']),
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

// ---------- Main ----------
(async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  let review;

  if (DRYRUN) {
    // Safe mock so your loop can keep running if the API is down or key is gating
    review = {
      score: 12,
      findings: [
        'Mock: limit H1 to 12ch on hero',
        'Mock: increase overlay opacity to meet 4.5:1 contrast',
        'Mock: add inline form validation messages'
      ],
      requiredFixes: [
        'Set max-width: 12ch on H1',
        'Darken hero overlay by ~10–15%',
        'Add aria-live error region for form validation'
      ],
      cursorPrompt:
        'Apply: In hero, set H1 max-width:12ch; increase overlay opacity until contrast≥4.5:1; add form validation with aria-live and field-level messages; ensure mobile spacing @390px.',
      stop: false
    };
  } else {
    review = await openaiReview();
  }

  // Persist raw review
  const outFile = path.join(OUT_DIR, `review-${SHA || Date.now()}.json`);
  fs.writeFileSync(outFile, JSON.stringify(review, null, 2));
  console.log(`Saved review to ${outFile}`);

  const target = cfg.targets?.rubricScore ?? 19;
  const score = Number.isFinite(review?.score) ? review.score : 0;
  const shouldStop = review?.stop === true || score >= target;

  if (shouldStop) {
    console.log(`Target met (score=${score} >= ${target}) or stop=true. No delta opened.`);
    return;
  }

  // Try to auto-apply (open PR). If it fails and configured, open an Issue.
  if (cfg.output?.autoApply) {
    try {
      const prompt = review?.cursorPrompt || '';
      if (!prompt) throw new Error('No cursorPrompt in review.');
      await applyCursorPrompt(prompt);
      console.log('Auto-PR created from cursorPrompt.');
    } catch (e) {
      console.error('Auto-apply failed:', e.message);
      if (cfg.output?.openIssueOnFail) {
        try {
          await createIssue({
            score,
            findings: review?.findings || [],
            requiredFixes: review?.requiredFixes || [],
            cursorPrompt: review?.cursorPrompt || ''
          });
        } catch (ie) {
          console.error('Issue fallback also failed:', ie.message);
        }
      }
      process.exit(1);
    }
  } else if (cfg.output?.openIssueOnFail) {
    // Issue-only mode
    await createIssue({
      score,
      findings: review?.findings || [],
      requiredFixes: review?.requiredFixes || [],
      cursorPrompt: review?.cursorPrompt || ''
    });
  }
})().catch(err => {
  console.error(err);
  process.exit(1);
});