import { page } from '../utils/response.js';

export function handleHello(request) {
	const url = new URL(request.url);
	const name = url.searchParams.get('name') || 'World';

	return page('Hello', `
		<h1>Hello, ${escapeHtml(name)}!</h1>
		<p>クエリパラメータで名前を変更できます:</p>
		<pre><code>/hello?name=あなたの名前</code></pre>
		<form method="GET" action="/hello">
			<input type="text" name="name" placeholder="名前を入力" value="${escapeHtml(name)}">
			<button type="submit">送信</button>
		</form>
	`);
}

function escapeHtml(str) {
	return str
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}
