import { page, json } from '../utils/response.js';

/**
 * URL 短縮サービス
 */

export async function handleShorten(request, env) {
	if (request.method === 'POST') {
		return createShortUrl(request, env);
	}
	return renderForm();
}

export async function handleRedirectShort(request, env, code) {
	const url = await env.URL_SHORTENER.get(code);

	if (!url) {
		return page('404', `
			<h1>🔗 短縮URLが見つかりません</h1>
			<p>コード: <code>${escapeHtml(code)}</code> は登録されていません。</p>
			<p><a href="/shorten">← URL短縮サービスに戻る</a></p>
		`, 404);
	}

	return Response.redirect(url, 302);
}

async function createShortUrl(request, env) {
	const formData = await request.formData();
	const targetUrl = formData.get('url');

	if (!targetUrl) {
		return page('エラー', `
			<h1>⚠️ エラー</h1>
			<p>URL が入力されていません。</p>
			<p><a href="/shorten">← 戻る</a></p>
		`, 400);
	}

	try {
		new URL(targetUrl);
	} catch {
		return page('エラー', `
			<h1>⚠️ エラー</h1>
			<p>有効なURLを入力してください（https://... の形式）。</p>
			<p><a href="/shorten">← 戻る</a></p>
		`, 400);
	}

	const code = generateCode(6);
	await env.URL_SHORTENER.put(code, targetUrl);
	const shortUrl = new URL(`/s/${code}`, request.url).toString();

	return page('URL短縮完了', `
		<h1>✅ 短縮URLを作成しました</h1>
		<table>
			<tbody>
				<tr><td><strong>元のURL</strong></td><td><a href="${escapeHtml(targetUrl)}">${escapeHtml(targetUrl)}</a></td></tr>
				<tr><td><strong>短縮URL</strong></td><td><a href="${escapeHtml(shortUrl)}">${escapeHtml(shortUrl)}</a></td></tr>
				<tr><td><strong>コード</strong></td><td><code>${escapeHtml(code)}</code></td></tr>
			</tbody>
		</table>
		<p><a href="/shorten" role="button" class="outline">もう1つ作成する</a></p>
	`);
}

function renderForm() {
	return page('URL短縮サービス', `
		<h1>✂️ URL短縮サービス</h1>
		<p>長いURLを短くします。KV（キーバリューストア）に保存されます。</p>
		<form method="POST" action="/shorten">
			<label for="url">短縮したいURL</label>
			<input type="url" id="url" name="url" placeholder="https://example.com/very/long/path" required>
			<button type="submit">短縮する</button>
		</form>
		<h2>使い方</h2>
		<ol>
			<li>上のフォームにURLを入力して「短縮する」をクリック</li>
			<li>生成された短縮URL（<code>/s/xxxxxx</code>）を共有</li>
			<li>短縮URLにアクセスすると元のURLにリダイレクトされます</li>
		</ol>
	`);
}

function generateCode(length) {
	const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	let result = '';
	const array = new Uint8Array(length);
	crypto.getRandomValues(array);
	for (const byte of array) {
		result += chars[byte % chars.length];
	}
	return result;
}

function escapeHtml(str) {
	return str
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}
