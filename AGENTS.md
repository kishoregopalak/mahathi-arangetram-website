# AGENTS.md

This file provides persistent context for AI/code agents working in this repository.

## Project Snapshot

- Project: Mahathi Arangetram digital brochure website
- Stack: plain HTML/CSS/JS (no framework/build step)
- Hosting target: GitHub Pages
- Repository root for site: this folder (do not move site into subfolders)

## Non-Negotiable Constraints

1. Keep the site mobile-first.
2. Keep all runtime assets inside this repo (`assets/`, `fonts/`).
3. Do not replace brochure copy with summaries unless explicitly requested.
4. Preserve current font policy:
   - Body/default: Iowan Old Style (fallback serif stack)
   - Kunaroh: main title heading use only
   - Balladeer: accent use only (sparingly)
5. Preserve dark mode behavior and localStorage key (`mahathi-theme`).

## Content and Design Source of Truth

- Primary brochure source: `Mahathi2Pages 17x11v9.pdf` from the original project workspace.
- Existing text on the page is intentionally aligned to brochure copy with minimal cleanup for web readability.
- Visual intent: classical brochure aesthetic with warm light palette and black/maroon/gold dark palette.

## Important File Responsibilities

- `index.html`
  - Section structure
  - Program ordering
  - Image mapping
  - Toggle button markup
- `styles.css`
  - Theme variables
  - Responsive layout
  - Typography constraints
- `script.js`
  - Active section nav state
  - Dark/light mode toggle + persistence

## Before Shipping Changes

1. Confirm all referenced files exist (images/fonts/paths).
2. Test both themes (light and dark).
3. Verify mobile layout first (small viewport).
4. Keep accessibility basics:
   - meaningful `alt` text
   - button semantics (`button`, `aria-pressed`)
   - visible focus state for interactive controls

## Git Workflow

- Commit focused changes with clear messages.
- Push to `main` for Pages deployment.
- After push, allow a short delay for Pages build propagation.

## Common Follow-ups Likely Requested

- Fine-tune typography spacing and hierarchy for mobile readability.
- Adjust color shades to match brochure print look more closely.
- Update/replace image mapping per choreography or program order changes.
- Add optional sections (venue details, QR/download links, acknowledgments).
