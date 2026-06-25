# Mahathi Arangetram Website

Single-page, mobile-first brochure website for Mahathi's Bharatanatyam Arangetram.

**Live:** [mahathikishore.com](https://mahathikishore.com)  
**Repo:** [github.com/kishoregopalak/mahathi-arangetram-website](https://github.com/kishoregopalak/mahathi-arangetram-website)

## Purpose

Mirrors the printed brochure for sharing via QR code when printed copies run out. Includes an optional **meme mode** with cake overlays on pose photos.

## Structure

```
hosting/
├── index.html          # Main brochure page
├── styles.css          # Layout, themes, typography
├── script.js           # Nav, dark mode, image crop tuning
├── assets/             # Live site images (*-original.*)
├── fonts/              # Balladeer, Kunaroh
├── meme/               # Meme mode (/meme/)
│   ├── index.html
│   ├── tune.html       # → index.html?tune=1
│   ├── meme.js
│   ├── meme.css
│   └── cake-vectors/   # cake-01.png … cake-13.png
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
| http://localhost:8080/meme/ | Meme mode (cake overlays) |
| http://localhost:8080/meme/?tune=1 | Cake position tuning |

## Content rules

- Text from `design/exports/Mahathi2Pages 17x11v9.pdf` (parent workspace).
- Keep brochure wording exact; only fix PDF line-break artifacts.
- **Body:** Iowan Old Style · **Hero title:** Kunaroh · **Accent/nav:** Balladeer

## Configuration keys

| Key | Purpose |
|-----|---------|
| `mahathi-theme` | Light/dark mode |
| `mahathi-image-crops-v1` | Main site image crops |
| `mahathi-meme-cake-v1` | Meme mode cake positions |

## Deployment

Push to `main` → GitHub Pages (root `/`). Custom domain via `CNAME`.
