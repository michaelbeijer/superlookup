// SuperLookup Worker.
//
// Serves the static Astro site (via the ASSETS binding) and proxies Superterm
// searches. The Superterm search Worker only allows the superterm.io origin via
// CORS, so the browser can't call it cross-origin from superlookup.io. Proxying
// server-side (Worker → Worker) sidesteps CORS entirely: the page calls a
// same-origin endpoint (/api/superterm) and this Worker fetches the upstream.

const SUPERTERM_API = 'https://wordbook-search.michaelbeijer-co-uk.workers.dev';

export default {
	async fetch(request, env) {
		const url = new URL(request.url);
		if (url.pathname === '/api/superterm') {
			return handleSuperterm(url);
		}
		// Everything else is a static asset from the built Astro site.
		return env.ASSETS.fetch(request);
	},
};

async function handleSuperterm(url) {
	const q = (url.searchParams.get('q') || '').trim();
	if (!q) return json({ query: '', entries: [], senses: [] });

	const from = url.searchParams.get('from') || 'nl';
	const to = url.searchParams.get('to') || 'en';

	const upstream = new URL(SUPERTERM_API + '/search');
	upstream.searchParams.set('q', q);
	upstream.searchParams.set('from', from);
	upstream.searchParams.set('to', to);
	upstream.searchParams.set('limit', '40');

	try {
		const r = await fetch(upstream, { headers: { Accept: 'application/json' } });
		const body = await r.text();
		return new Response(body, {
			status: r.status,
			headers: {
				'content-type': 'application/json; charset=utf-8',
				'cache-control': 'public, max-age=120',
			},
		});
	} catch (e) {
		return json({ error: 'Superterm search is unavailable right now.' }, 502);
	}
}

function json(obj, status = 200) {
	return new Response(JSON.stringify(obj), {
		status,
		headers: { 'content-type': 'application/json; charset=utf-8' },
	});
}
