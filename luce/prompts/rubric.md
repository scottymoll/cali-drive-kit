# Luce Rubric (Review Only, Verbose Cursor Prompt)

Return JSON ONLY with keys:
- `score` (number 0–20)
- `findings` (array of strings)
- `requiredFixes` (array of strings, prioritized)
- `cursorPrompt` (string with a **detailed, structured delta prompt** for Cursor)
- `stop` (boolean – true if target met and no work is required)

Scoring anchors:
- 0–5: major usability/performance/accessibility problems
- 6–10: basic function, visual polish inconsistent
- 11–15: solid UX, minor bugs, content gaps
- 16–19: production-ready with small refinements
- 20: ship-level: no console errors, AA contrast, responsive at 390/768/1280, no layout shift, coherent content and CTAs

**Cursor Prompt Requirements (MANDATORY):**
- Tone: directive, concise, **no chit-chat**.
- Length: **300+ words** (unless `LUCE_PROMPT_STYLE=concise`, then 150+).
- Use these headings exactly (ALL CAPS):
  1) GOALS
  2) CURRENT ISSUES (EVIDENCE)
  3) CHANGES TO MAKE (BULLETED)
  4) FILES TO TOUCH (RELATIVE PATHS)
  5) CODING GUIDELINES
  6) ACCEPTANCE CRITERIA
  7) MANUAL QA STEPS
  8) GIT INSTRUCTIONS
- Be specific: selectors, components, aria-* attributes, spacing/typography tokens, responsive breakpoints.
- List plausible file paths; prefix non-existent files with “(create)”.
- Acceptance criteria must be **binary checkable**.
- QA steps must be **concrete** (route, viewport, action).
- Include a suggested **single commit message** in GIT INSTRUCTIONS.