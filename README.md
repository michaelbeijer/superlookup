# Beijerterm

[![Version](https://img.shields.io/badge/version-v1.6.2-blue.svg)](https://github.com/michaelbeijer/beijerterm/releases)
[![License](https://img.shields.io/badge/license-CC0-green.svg)](LICENSE.md)
[![GitHub Pages](https://img.shields.io/badge/hosted-GitHub%20Pages-orange.svg)](https://michaelbeijer.github.io/beijerterm/)

**An open-source, GitHub-hosted multilingual terminology database.**

Every glossary is a Markdown file. Full-text search powered by Pagefind.

> 💡 **We believe terminology should be free.** All glossary data is released under [CC0 (Public Domain)](https://creativecommons.org/publicdomain/zero/1.0/) — use it however you want, no attribution required.

🌐 **Live site**: [michaelbeijer.github.io/beijerterm](https://michaelbeijer.github.io/beijerterm/)

##  Features

-  **One file per glossary** - Easy to browse, download, contribute
-  **Full-text search** - Search across ALL terms, translations, and notes
-  **Multilingual** - Any language pair supported
-  **Human-readable** - Markdown tables with YAML metadata
-  **Version controlled** - Full history of every change
-  **Free hosting** - GitHub Pages
-  **Search highlighting** - Click through from search to see matches highlighted

##  Structure

```
Beijerterm/
├── content/
│   ├── glossaries/           # Multi-term glossary files
│   │   ├── automotive/
│   │   │   ├── _category.yaml
│   │   │   └── autowoordenboek.md
│   │   ├── aviation/
│   │   │   └── schiphol-glossary.md
│   │   └── medical/
│   │       └── ...
│   ├── terms/                # Single-term definition pages
│   │   ├── vergisting.md
│   │   └── ...
│   └── resources/            # Articles and reference materials
│       └── nederbrackets.md
├── site/
│   ├── styles.css
│   └── mb-icon.svg
├── scripts/
│   └── build_site.py        # Generates HTML from Markdown
└── .github/
    └── workflows/
        └── deploy.yaml      # Auto-deploy on push
```

##  Glossary File Format

Each glossary is a Markdown file with YAML frontmatter:

```markdown
---
title: Amsterdam Airport Schiphol Glossary
slug: schiphol-glossary
description: Aviation terminology from Amsterdam Schiphol Airport
source_lang: nl
target_lang: en
domain: aviation
term_count: 2143
source_url: https://www.schiphol.nl/
author: Schiphol Group
license: CC0
last_updated: 2025-06-15
---

| Dutch | English | Notes |
|-------|---------|-------|
| bagageband | baggage carousel | also: bagagecarrousel |
| vertrekhal | departure hall | |
| aankomsthal | arrivals hall | |
| douane | customs | |
| paspoortcontrole | passport control | |
```

##  Search

Pagefind indexes all glossary content at build time, enabling:

- Full-text search across ALL terms
- Filter by language, domain, or glossary
- Instant results (client-side, no server needed)
- Works offline once loaded
- **NEW**: Search result highlighting with keyboard navigation (N/P/Esc)

##  Local Development

```bash
# Install dependencies
pip install -r requirements.txt
npm install

# Build the site
python scripts/build_site.py

# Run Pagefind indexing
npx pagefind --site _site

# Serve locally
npx serve _site
```

##  Deployment Architecture

Beijerterm uses a **static site generation + GitHub Actions** workflow:

### What gets stored in Git:
- ✅ Source content (Markdown files in `content/`)
- ✅ Build scripts (`scripts/build_site.py`)
- ✅ CSS and assets (`site/`)
- ❌ Generated HTML (`_site/`) - **gitignored**
- ❌ Search index (`_site/pagefind/`) - **gitignored (~196MB)**

### How deployment works:

1. **You push** → Source files committed to GitHub
2. **GitHub Actions** (`.github/workflows/deploy.yaml`):
   - Runs `python scripts/build_site.py` → Generates HTML pages
   - Runs `npx pagefind --site _site` → Generates search index (~196MB)
   - Uploads complete `_site/` folder as deployment artifact
3. **GitHub Pages** → Serves the built site with search index

**Why this approach?**
- Git repo stays small (no 196MB search index commits)
- Search index regenerated fresh on every deployment
- Build artifacts never pollute version history
- Standard practice for static site generators

##  Contributing

1. Fork this repository
2. Add or edit glossaries in `glossaries/`
3. Submit a Pull Request

### Adding a new glossary

1. Choose the appropriate category folder (or create one)
2. Create a new `.md` file with YAML frontmatter
3. Add terms in the Markdown table format
4. Submit PR

##  Versioning

Beijerterm uses [Semantic Versioning](https://semver.org/):

- **MAJOR** (1.x.x): Breaking changes to data format or API
- **MINOR** (x.1.x): New features (backward compatible)
- **PATCH** (x.x.1): Bug fixes and minor improvements

Current version: **v1.3.1** (see [CHANGELOG.md](CHANGELOG.md))

## 📜 License & Philosophy

**We believe terminology should be free.**

Lexical data, translations, and terminology are facts about language. Facts cannot and should not be owned.

- **Code** (build scripts, website): MIT License
- **Glossary data**: [CC0 (Public Domain Dedication)](https://creativecommons.org/publicdomain/zero/1.0/)

### What CC0 means for you:
- ✅ Use for any purpose (personal, commercial, academic)
- ✅ Modify, transform, and build upon freely  
- ✅ No attribution required (though appreciated!)
- ✅ No restrictions whatsoever

### About our sources

Many glossaries are compiled from various online sources, including government publications, academic resources, corporate glossaries, and community contributions. We acknowledge original sources where known, but all data has been processed, cleaned, reformatted, and often enhanced.

We release our compilations freely because we believe terminology should be accessible to everyone.

##  Acknowledgments

Inspired by [superlookup.wiki](https://superlookup.wiki) - one of the world's largest collections of specialist multilingual terminology.

---

Created by [Michael Beijer](https://michaelbeijer.co.uk)  Part of the [Supervertaler](https://supervertaler.com) ecosystem
