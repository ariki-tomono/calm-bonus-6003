import { html } from '../utils/response.js';

export function handleHello(request) {
	const url = new URL(request.url);
	const name = url.searchParams.get('name') || 'World';

	return html(`
<!DOCTYPE html>
<html lang="ja">
<head><meta charset="utf-8"><title>Hello</title></head>
<body>
  <h1>Hello, ${escapeHtml(name)}!</h1>
  <p><a href="/">← インデックスに戻る</a></p>
  <p>クエリパラメータで名前を変更できます: <code>/hello?name=あなたの名前</code></p>
</body>
</html>
	`);
}

function escapeHtml(str) {
	return str
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}
