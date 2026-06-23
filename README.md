# Mahathi Arangetram Website

Single-page, mobile-first brochure website for Mahathi's Bharatanatyam Arangetram.

Live site (GitHub Pages):
- https://kishoregopalak.github.io/mahathi-arangetram-website/

Repository:
- https://github.com/kishoregopalak/mahathi-arangetram-website

## Purpose

This site mirrors the printed brochure so it can be shared via QR code during the event when printed copies run out.

## Current Structure

- `index.html` - page markup and brochure content
- `styles.css` - layout, typography, color themes, dark mode styles
- `script.js` - section highlight logic + dark mode persistence
- `assets/` - all images referenced by the site
- `fonts/` - bundled custom fonts used by the site

## Content Source Rules

- Text content is based on `Mahathi2Pages 17x11v9.pdf`.
- Keep brochure wording exact when possible.
- Web-only cleanup is allowed only for PDF extraction artifacts (line-break hyphenation, spacing, punctuation normalization).

## Typography Rules

- Default body text: `Iowan Old Style` (with serif fallbacks).
- `Kunaroh`: use sparingly for the main hero title only.
- `Balladeer`: use sparingly for accent UI (eyebrow, nav pills, select metadata labels).

## Theme Rules

- Light mode follows warm brochure tones.
- Dark mode is enabled via toggle and uses black/maroon/gold palette inspired by brochure aesthetics.
- Theme choice persists in `localStorage` key `mahathi-theme`.

## Local Development

From repo root:

```bash
python3 -m http.server 8080
```

Open:
- http://localhost:8080/

## Deployment

GitHub Pages is configured from:
- Branch: `main`
- Path: `/` (root)

Push to `main` to deploy updates.

## Notes for Future Edits

- Keep the site self-contained (do not depend on files outside this repo).
- Add any new images to `assets/` and new fonts to `fonts/`.
- Use relative paths from `index.html`/`styles.css`.
- Prefer mobile-first layout decisions; desktop enhancements should be secondary.
