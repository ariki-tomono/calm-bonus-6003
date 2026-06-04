import { html } from '../utils/response.js';

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

	// リダイレクト先一覧を表示
	const links = Object.entries(REDIRECT_MAP)
		.map(([key, value]) => `<li><a href="/redirect?to=${key}">${key}</a> → ${value}</li>`)
		.join('\n');

	return html(`
<!DOCTYPE html>
<html lang="ja">
<head><meta charset="utf-8"><title>リダイレクト</title></head>
<body>
  <h1>🔗 リダイレクトサービス</h1>
  <p>使い方: <code>/redirect?to=キー名</code></p>
  <h2>利用可能なリダイレクト先:</h2>
  <ul>${links}</ul>
  <p><a href="/">← インデックスに戻る</a></p>
</body>
</html>
	`);
}
