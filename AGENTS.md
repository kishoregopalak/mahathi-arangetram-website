# AGENTS.md

Context for AI agents working in this repository.

## Project

- **What:** Mahathi Arangetram digital brochure (plain HTML/CSS/JS)
- **Hosting:** GitHub Pages → `mahathikishore.com`
- **Root:** This folder is the full deployable site. Do not nest the site in subfolders.

Parent workspace (`../`) holds design sources, event photos, and archives — not deployed.

## Constraints

1. Mobile-first layout.
2. Runtime assets only in `assets/`, `fonts/`, `meme/cake-vectors/`.
3. Do not summarize brochure copy unless asked.
4. **Fonts:** Iowan Old Style (body) · Kunaroh (hero title only) · Balladeer (accent/nav sparingly).
5. Dark mode via `#themeToggle`; persists in `localStorage` key `mahathi-theme`.

## Key files

| File | Role |
|------|------|
| `index.html` | Sections, program order, images |
| `styles.css` | Themes, layout, typography |
| `script.js` | Nav highlight, theme toggle, image crop tuning (`?tune=1`) |
| `meme/meme.js` | Meme mode: loads main page, cake overlays (`MEME_EMOJIS_ENABLED` flag) |
| `deliverables/` | Brochure PDF + QR artwork (not served by default) |

## Before shipping

1. Verify all asset paths resolve.
2. Test light and dark themes on mobile.
3. Check `?tune=1` and `/meme/` if those areas changed.

## Git

- Commit focused changes; push `main` for Pages deploy.
- Ignore `.DS_Store` (see `.gitignore`).
