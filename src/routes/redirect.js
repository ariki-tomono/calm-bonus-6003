import { page } from '../utils/response.js';

const REDIRECT_MAP = {
	github: 'https://github.com',
	cloudflare: 'https://developers.cloudflare.com/workers/',
	mdn: 'https://developer.mozilla.org/ja/',
};

export function handleRedirect(request) {
	const url = new URL(request.url);
	const target = url.searchParams.get('to');

	if (target && REDIRECT_MAP[target]) {
		return Response.redirect(REDIRECT_MAP[target], 302);
	}

	const rows = Object.entries(REDIRECT_MAP)
		.map(([key, value]) => `
			<tr>
				<td><code>${key}</code></td>
				<td><a href="${value}">${value}</a></td>
				<td><a href="/redirect?to=${key}" role="button" class="outline secondary">Go</a></td>
			</tr>`)
		.join('');

	return page('リダイレクト', `
		<h1>🔗 リダイレクトサービス</h1>
		<p>使い方: <code>/redirect?to=キー名</code></p>
		<table>
			<thead><tr><th>キー</th><th>リダイレクト先</th><th>実行</th></tr></thead>
			<tbody>${rows}</tbody>
		</table>
	`);
}
