# SuperLookup

One search box across a translator's reference web. Type a term, pick a
language pair, and jump into every resource (Superterm, IATE, Linguee, ProZ,
Juremy, BabelNet, Wikipedia, Wiktionary, OPUS, and more) with the query
pre-filled and the right per-site language codes.

The public web version of the **SuperLookup** feature in
[Supervertaler](https://supervertaler.com). The desktop version additionally
searches your own local termbases and translation memories — this web slice
covers the web resources.

## Stack

Astro static site → Cloudflare Pages. Same setup as
[superterm](https://github.com/michaelbeijer/superterm).

```bash
npm install
npm run dev      # local dev server
npm run build    # → dist/
```

## Where the resources live

`src/data/resources.js` — the resource list and the per-site language-code
mapping, ported from the Supervertaler Workbench (`Supervertaler.py`:
`self.web_resources` + `_get_web_lang_code`). Keep the two conceptually in sync.

## Roadmap

- **Phase 1 (done):** search box + language pair + deep-link card grid;
  shareable `?q=&from=&to=` links.
- **Phase 2:** inline **Superterm** results panel (Superterm has its own
  Cloudflare Worker + D1 search API, so its results can render on-page instead
  of only deep-linking). Needs the Worker URL wired in and `superlookup.io`
  added to the Superterm worker's CORS allowlist.
- **Phase 3:** per-user enable/reorder of resources (localStorage), OPUS corpus
  selector, "open all" (best-effort; browsers block multi-tab opens).
