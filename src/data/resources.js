// Web resources for SuperLookup — ported from the Supervertaler Workbench
// (Supervertaler.py: `self.web_resources` + `_get_web_lang_code`).
// Keep this list conceptually in sync with the desktop app.
//
// Each resource has a `url_template` with placeholders filled by buildUrl():
//   {query}     the (URL-encoded) search term
//   {sl} {tl}   source/target lang in the resource's `lang_format`
//   {sl_full} {tl_full}   full lowercase language name (e.g. dutch, english)
//   {sl_upper} {tl_upper} uppercased ISO 639-1 (e.g. NL, EN)
//   {opus_corpus}         selected OPUS corpus (OPUS only)

// Languages offered in the From/To selectors. `code` is ISO 639-1; the maps
// below translate it into whatever each resource expects.
export const LANGUAGES = [
	{ code: 'en', name: 'English' },
	{ code: 'nl', name: 'Dutch' },
	{ code: 'de', name: 'German' },
	{ code: 'fr', name: 'French' },
	{ code: 'es', name: 'Spanish' },
	{ code: 'it', name: 'Italian' },
	{ code: 'pt', name: 'Portuguese' },
	{ code: 'pl', name: 'Polish' },
	{ code: 'ru', name: 'Russian' },
];

// ISO 639-2/B bibliographic codes (ProZ): dut, ger, fre…
const ISO3_BIBLIO = { en: 'eng', nl: 'dut', de: 'ger', fr: 'fre', es: 'spa', it: 'ita', pt: 'por', pl: 'pol', ru: 'rus' };
// ISO 639-3 codes (Juremy): nld, deu, fra…
const ISO639_3 = { en: 'eng', nl: 'nld', de: 'deu', fr: 'fra', es: 'spa', it: 'ita', pt: 'por', pl: 'pol', ru: 'rus' };
// Full lowercase names (Linguee, Reverso slugs).
const FULL_LOWER = { en: 'english', nl: 'dutch', de: 'german', fr: 'french', es: 'spanish', it: 'italian', pt: 'portuguese', pl: 'polish', ru: 'russian' };

export function langCode(code, format) {
	const c = (code || '').toLowerCase();
	switch (format) {
		case 'iso2': return c.slice(0, 2) || 'en';
		case 'iso3': return ISO3_BIBLIO[c] || 'eng';
		case 'iso639_3': return ISO639_3[c] || 'eng';
		case 'full_lower': return FULL_LOWER[c] || 'english';
		default: return c;
	}
}

// Build a resource's search URL for a query and language pair.
export function buildUrl(resource, query, from, to, opusCorpus = 'DGT') {
	const q = encodeURIComponent(query);
	const fmt = resource.lang_format;
	let sl = langCode(from, fmt);
	let tl = langCode(to, fmt);
	let slFull = langCode(from, 'full_lower');
	let tlFull = langCode(to, 'full_lower');
	const slUpper = langCode(from, 'iso2').toUpperCase();
	const tlUpper = langCode(to, 'iso2').toUpperCase();

	// Linguee uses a canonical pair slug: English is always first in an
	// English↔X pair; otherwise alphabetical. (Mirrors the desktop app.)
	if (resource.id === 'linguee' && slFull && tlFull) {
		if (slFull === 'english' || tlFull === 'english') {
			if (slFull !== 'english') [slFull, tlFull] = [tlFull, slFull];
		} else if (slFull > tlFull) {
			[slFull, tlFull] = [tlFull, slFull];
		}
	}

	return resource.url_template
		.replaceAll('{query}', q)
		.replaceAll('{sl}', sl)
		.replaceAll('{tl}', tl)
		.replaceAll('{sl_full}', slFull)
		.replaceAll('{tl_full}', tlFull)
		.replaceAll('{sl_upper}', slUpper)
		.replaceAll('{tl_upper}', tlUpper)
		.replaceAll('{opus_corpus}', opusCorpus);
}

export const RESOURCES = [
	{ id: 'superterm', name: 'Superterm', icon: '📚', description: 'Curated multilingual terminology database, with full provenance', url_template: 'https://superterm.io/?q={query}&from={sl}&to={tl}', lang_format: 'iso2', bidirectional: true, native: true },
	{ id: 'iate', name: 'IATE', icon: '🇪🇺', description: 'EU terminology database', url_template: 'https://iate.europa.eu/search/byUrl?term={query}&sl={sl}&tl={tl}', lang_format: 'iso2', bidirectional: false },
	{ id: 'linguee', name: 'Linguee', icon: '📗', description: 'Bilingual dictionary with context', url_template: 'https://www.linguee.com/{sl_full}-{tl_full}/search?source=auto&query={query}', lang_format: 'full_lower', bidirectional: true },
	{ id: 'proz', name: 'ProZ.com', icon: '💬', description: 'Translator terminology (KudoZ) database', url_template: 'https://www.proz.com/search/?term={query}&from={sl}&to={tl}&results_per_page=25&es=1', lang_format: 'iso3', bidirectional: false },
	{ id: 'reverso', name: 'Reverso Context', icon: '🔄', description: 'Context-based translations', url_template: 'https://context.reverso.net/translation/{sl_full}-{tl_full}/{query}', lang_format: 'full_lower', bidirectional: false },
	{ id: 'juremy', name: 'Juremy', icon: '⚖️', description: 'EU legal terminology (IATE + EUR-Lex)', url_template: 'https://juremy.com/search?src={sl}&dst={tl}&q={query}&opts=ia&tool=iws', lang_format: 'iso639_3', bidirectional: false },
	{ id: 'babelnet', name: 'BabelNet', icon: '🌐', description: 'Multilingual encyclopedic dictionary', url_template: 'https://babelnet.org/search?word={query}&lang={sl_upper}&transLang={tl_upper}', lang_format: 'iso2', bidirectional: false },
	{ id: 'wikipedia_source', name: 'Wikipedia (source)', icon: '📖', description: 'Wikipedia in the source language', url_template: 'https://{sl}.wikipedia.org/w/index.php?search={query}', lang_format: 'iso2', bidirectional: true },
	{ id: 'wikipedia_target', name: 'Wikipedia (target)', icon: '📖', description: 'Wikipedia in the target language', url_template: 'https://{tl}.wikipedia.org/w/index.php?search={query}', lang_format: 'iso2', bidirectional: true },
	{ id: 'wiktionary_source', name: 'Wiktionary (source)', icon: '📓', description: 'Wiktionary in the source language', url_template: 'https://{sl}.wiktionary.org/wiki/{query}', lang_format: 'iso2', bidirectional: true },
	{ id: 'wiktionary_target', name: 'Wiktionary (target)', icon: '📓', description: 'Wiktionary in the target language', url_template: 'https://{tl}.wiktionary.org/wiki/{query}', lang_format: 'iso2', bidirectional: true },
	{ id: 'acronymfinder', name: 'AcronymFinder', icon: '🔤', description: 'Acronym and abbreviation dictionary', url_template: 'https://www.acronymfinder.com/~/search/af.aspx?string=exact&Acronym={query}', lang_format: null, bidirectional: true },
	{ id: 'opus_corpus', name: 'OPUS Corpus', icon: '🗂️', description: 'Parallel-corpus concordance (defaults to DGT)', url_template: 'https://opus.nlpl.eu/bin/opuscqp.pl?corpus={opus_corpus};lang={sl};cqp={query};align={tl}', lang_format: 'iso2', bidirectional: false, has_corpus_selector: true },
	{ id: 'google_patents', name: 'Google Patents', icon: '📜', description: 'Patent search', url_template: 'https://patents.google.com/?q="{query}"', lang_format: null, bidirectional: true },
	{ id: 'github_code', name: 'GitHub Code', icon: '💻', description: 'Search code across all of GitHub', url_template: 'https://github.com/search?q={query}&type=code', lang_format: null, bidirectional: true },
	{ id: 'google', name: 'Google', icon: '🔍', description: 'General web search', url_template: 'https://www.google.com/search?q={query}', lang_format: null, bidirectional: true },
];
