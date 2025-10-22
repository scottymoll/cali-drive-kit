// Simple Luce reviewer script (path-safe)
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// We are executing inside ./luce via the workflow's working-directory.
// So rubric is in ./prompts/, and config is one level up at ../luce.config.json
const RUBRIC_PATH = path.join(__dirname, 'prompts', 'rubric.md');
const CONFIG_PATH = path.join(__dirname, '..', 'luce.config.json');

const key = process.env.OPENAI_API_KEY;
const previewUrl = process.env.PREVIEW_URL || '';

const rubric = fs.readFileSync(RUBRIC_PATH, 'utf8');
const cfg = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));

const payload = { previewUrl, config: cfg };

const res = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'gpt-5.1',
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: 'You are Luce, an exacting web supervisor.' },
      { role: 'user', content: JSON.stringify(payload) },
      { role: 'user', content: rubric }
    ]
  })
});

const data = await res.json();

// Write artifact to ./luce/reviews/
const outDir = path.join(__dirname, 'reviews');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'review.json'), JSON.stringify(data, null, 2));

console.log('Review complete.');
