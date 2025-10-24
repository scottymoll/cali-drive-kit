// REVIEW-ONLY (HTML-aware): Luce fetches live HTML from PREVIEW_URL,
// opens ONE Issue per commit with findings + a detailed Cursor prompt.
//
// Env required:
// - OPENAI_API_KEY
// - PREVIEW_URL (public, no auth; e.g., Vercel preview or prod URL)
// - GITHUB_REPOSITORY (owner/repo)
// - GITHUB_SHA
// - GITHUB_TOKEN
//
// Optional config: luce.config.json
// {
//   "preview": { "paths": ["/", "/pricing", "/contact"] },
//   "targets": { "rubricScore": 19 }
// }

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
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
const CFG_PATH    = path.join(__dirname, '..', 'luce.config.json');

// ---- tiny utils

function joinUrl(base, route) {
  if (!route || route === '/') return base;
  const b = base.endsWith('/') ? base.slice(0, -1) : base;
  const r = route.startsWith('/') ? route : `/${route}`;
  return `${b}${r}`;
}

function bust(url) {
  const sep = url.includes('?') ? '&' : '?';
  return `${url}${sep}cb=${Date.now()}`;
}

function stripNoise(html) {
  // remove scripts/styles to keep prompt compact & safer
  return String(html)
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function head(html, max = 150000) {
  if (!html) return '';
  return html.length > max ? html.slice(0, max) : html;
}

function hash(str) {
  return crypto.createHash('sha1').update(String(str)).digest('hex');
}

// ---- GitHub helpers

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
  const issues = await gh(`/issues?state=open&per_page=100`);
  return issues.find(i =>
    !i.pull_request &&
    (i.title || '').toLowerCase().includes('luce review') &&
    (i.body || '').includes(sha)
  );
}

async function openIssue({ score, findings, requiredFixes, cursorPrompt, meta }) {
  const title = `Luce Review — ${new Date().toISOString()} — Score ${score}`;
  const body = [
    `**Preview**: ${PREVIEW_URL}`,
    `**Source commit**: \`${SHA}\``,
    `**Score target**: ${meta?.targetScore ?? '—'}`,
    '',
    `## Findings`,
    ...(findings?.length ? findings.map(f => `- ${f}`) : ['- (none)']),
    '',
    `## Required Fixes (priority order)`,
    ...(requiredFixes?.length ? requiredFixes.map((f, i) => `${i + 1}) ${f}`) : ['(none)']),
    '',
    `---`,
    `## Paste in Cursor (delta prompt)`,
    '```',
    cursorPrompt || '(no prompt)',
    '```',
    '',
    `---`,
    `> meta`,
    `- routes reviewed: ${(meta?.routes || []).join(', ') || '/'}`,
    `- html hash: ${meta?.htmlHash || 'n/a'}`
  ].join('\n');

  const json = await gh(`/issues`, {
    method: 'POST',
    body: JSON.stringify({ title, body, labels: ['luce', 'auto-review'] })
  });
  console.log(`Opened Issue #${json.number}: ${json.html_url}`);
}

// ---- fetch live HTML for one or more routes

async function fetchRoute(url) {
  try {
    const u = bust(url);
    const res = await fetch(u, { redirect: 'follow' });
    const text = await res.text();
    return stripNoise(text);
  } catch (e) {
    return `<!-- FETCH ERROR for ${url}: ${String(e)} -->`;
  }
}

async function collectPreviewHtml() {
  // default to just "/"; allow extra routes in config
  let cfg = {};
  try {
    if (fs.existsSync(CFG_PATH)) cfg = JSON.parse(fs.readFileSync(CFG_PATH, 'utf8'));
  } catch {}
  const routes = (cfg.preview?.paths && Array.isArray(cfg.preview.paths) && cfg.preview.paths.length)
    ? cfg.preview.paths
    : ['/'];

  const result = {};
  for (const r of routes) {
    const url = joinUrl(PREVIEW_URL, r);
    console.log(`Fetching ${url}`);
    result[r] = await fetchRoute(url);
  }
  return { routes, htmlByRoute: result };
}

// ---- OpenAI call

async function openaiReview({ htmlByRoute, routes, targetScore }) {
  const rubric = fs.existsSync(RUBRIC_PATH)
    ? fs.readFileSync(RUBRIC_PATH, 'utf8')
    : 'Score 0-20. Return JSON {score, findings[], requiredFixes[], cursorPrompt, stop}.';

  // Build compact payload with per-route HTML (trimmed)
  const pages = routes.map(r => ({
    route: r,
    html: head(htmlByRoute[r], 120000) // keep enough content for meaningful review
  }));

  const system = [
    'You are Luce, a critical web supervisor.',
    'You will be given live HTML snapshots of one or more routes.',
    'Output STRICT JSON ONLY: {"score":number,"findings":string[],"requiredFixes":string[],"cursorPrompt":string,"stop":boolean}',
    'cursorPrompt must be detailed and structured as previously specified (GOALS, CURRENT ISSUES, CHANGES TO MAKE, FILES TO TOUCH, CODING GUIDELINES, ACCEPTANCE CRITERIA, MANUAL QA STEPS, GIT INSTRUCTIONS).'
  ].join('\n');

  const user = JSON.stringify({
    previewUrl: PREVIEW_URL,
    commit: SHA,
    targetScore,
    pages
  });

  const r = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      temperature: 0.2,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
        { role: 'user', content: rubric }
      ]
    })
  });
  if (!r.ok) throw new Error(`OpenAI ${r.status}: ${await r.text()}`);
  let obj;
  try {
    const data = await r.json();
    obj = JSON.parse(data.choices?.[0]?.message?.content || '{}');
  } catch {
    obj = { score: 0, findings: ['Invalid JSON'], requiredFixes: [], cursorPrompt: '', stop: false };
  }
  return obj;
}

// ---- main

(async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  // Dedupe per commit SHA
  const existing = await findExistingIssueForSHA(SHA).catch(() => null);
  if (existing) {
    console.log(`Issue already exists for ${SHA}: #${existing.number} (${existing.html_url}). Skipping.`);
    return;
  }

  // Fetch live HTML
  const cfg = fs.existsSync(CFG_PATH) ? JSON.parse(fs.readFileSync(CFG_PATH, 'utf8')) : {};
  const targetScore = cfg?.targets?.rubricScore ?? undefined;

  const { routes, htmlByRoute } = await collectPreviewHtml();
  const combined = routes.map(r => htmlByRoute[r] || '').join('\n<!-- route-split -->\n');
  const htmlHash = hash(combined).slice(0, 12);

  // Persist snapshot for debugging
  const snapDir = path.join(OUT_DIR, `snap-${SHA}`);
  fs.mkdirSync(snapDir, { recursive: true });
  for (const r of routes) {
    const safe = r === '/' ? 'root' : r.replace(/[^a-z0-9_-]+/gi, '-').replace(/^-+|-+$/g, '');
    fs.writeFileSync(path.join(snapDir, `${safe}.html`), htmlByRoute[r] || '');
  }
  fs.writeFileSync(path.join(snapDir, `hash.txt`), `${htmlHash}\n`);

  // Review with HTML context
  const review = await openaiReview({ htmlByRoute, routes, targetScore });
  const out = path.join(OUT_DIR, `review-${SHA || Date.now()}.json`);
  fs.writeFileSync(out, JSON.stringify(review, null, 2));
  console.log(`Saved review to ${out}`);
  console.log(`Review summary: score=${review.score} stop=${review.stop === true} hash=${htmlHash}`);

  await openIssue({
    score: review.score ?? 0,
    findings: review.findings || [],
    requiredFixes: review.requiredFixes || [],
    cursorPrompt: review.cursorPrompt || '',
    meta: { routes, htmlHash, targetScore }
  });
})();
