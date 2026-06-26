# Mahathi Arangetram Website

Single-page, mobile-first brochure website for Mahathi's Bharatanatyam Arangetram.

**Live:** [mahathikishore.com](https://mahathikishore.com)  
**Repo:** [github.com/kishoregopalak/mahathi-arangetram-website](https://github.com/kishoregopalak/mahathi-arangetram-website)

## Purpose

Mirrors the printed brochure for sharing via QR code when printed copies run out.

## Structure

```
├── index.html          # Main brochure page
├── styles.css          # Layout, themes, typography
├── script.js           # Nav, dark mode, image crop tuning
├── assets/             # Live site images (*-original.*)
├── fonts/              # Balladeer, Kunaroh
└── deliverables/       # Print/QR assets (not linked from site)
    ├── brochure.pdf
    └── qr/
        ├── qr-code.png
        └── qr-logo.psd
```

Archived design sources live outside this repo in `../archive/` and `../design/`.

## Local development

```bash
python3 -m http.server 8080
```

| URL | Page |
|-----|------|
| http://localhost:8080/ | Main site |
| http://localhost:8080/?tune=1 | Image crop tuning |

## Content rules

- Text from `design/exports/Mahathi2Pages 17x11v9.pdf` (parent workspace).
- Keep brochure wording exact; only fix PDF line-break artifacts.
- **Body:** Iowan Old Style · **Hero title:** Kunaroh · **Accent/nav:** Balladeer

## Configuration keys

| Key | Purpose |
|-----|---------|
| `mahathi-theme` | Light/dark mode |
| `mahathi-image-crops-v1` | Main site image crops |

## Deployment

Push to `main` → GitHub Pages (root `/`). Custom domain via `CNAME`.

Meme mode experiments live on the `meme` branch (not deployed).
