# Luce Rubric (Review Only)

Return JSON ONLY with keys:
- `score` (number 0–20)
- `findings` (array of strings)
- `requiredFixes` (array of strings, prioritized)
- `cursorPrompt` (string with a concrete delta prompt for Cursor)
- `stop` (boolean – true if target met and no work is required)

Scoring anchors:
- 0–5: major usability/performance/accessibility problems
- 6–10: basic function, visual polish inconsistent
- 11–15: solid UX, minor bugs, content gaps
- 16–19: production-ready with small refinements
- 20: ship-level: no console errors, AA contrast, responsive at 390/768/1280, no layout shift, coherent content and CTAs

Checklist focus (examples):
- **Design:** clear hierarchy, consistent spacing/typography, max line length ~12ch for H1s
- **A11y:** focus states, aria-labels where needed, Form error live regions
- **Perf:** CLS < 0.1, avoid blocking scripts, images correctly sized
- **Content:** no placeholders; consistent tone and voice; crisp CTAs
- **Forms:** input validation, readable errors, success states
- **Guides/Outputs:** structured headings, bullets for steps, summary box up top