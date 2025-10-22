// Simple Luce reviewer script
import fs from 'fs';
import fetch from 'node-fetch';
const key = process.env.OPENAI_API_KEY;
const url = process.env.PREVIEW_URL || '';
const rubric = fs.readFileSync('luce/prompts/rubric.md', 'utf8');
const cfg = JSON.parse(fs.readFileSync('luce.config.json', 'utf8'));
const payload = { previewUrl: url, config: cfg };
const res = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ model: 'gpt-5.1', messages: [
    { role: 'system', content: 'You are Luce, an exacting web supervisor.' },
    { role: 'user', content: JSON.stringify(payload) },
    { role: 'user', content: rubric }
  ]})
});
const data = await res.json();
fs.mkdirSync('luce/reviews', { recursive: true });
fs.writeFileSync('luce/reviews/review.json', JSON.stringify(data, null, 2));
console.log('Review complete.');
