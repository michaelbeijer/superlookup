// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Static output (default) → dist/ → Cloudflare Pages.
// `site` is required for @astrojs/sitemap to emit absolute URLs.
export default defineConfig({
	site: 'https://superlookup.io',
	integrations: [sitemap()],
});
