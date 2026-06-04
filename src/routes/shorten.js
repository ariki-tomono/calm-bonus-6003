import { html, json } from '../utils/response.js';

/**
 * URL 短縮サービス
 *
 * GET  /shorten          → 短縮URL作成フォーム
 * POST /shorten          → 短縮URLを生成して保存
 * GET  /s/:code          → 短縮URLからリダイレクト
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
		return html(`
<!DOCTYPE html>
<html lang="ja">
<head><meta charset="utf-8"><title>404</title></head>
<body>
  <h1>🔗 短縮URLが見つかりません</h1>
  <p>コード: <code>${escapeHtml(code)}</code> は登録されていません。</p>
  <p><a href="/shorten">← URL短縮サービスに戻る</a></p>
</body>
</html>
		`, 404);
	}

	return Response.redirect(url, 302);
}

async function createShortUrl(request, env) {
	const formData = await request.formData();
	const targetUrl = formData.get('url');

	// バリデーション
	if (!targetUrl) {
		return html(`
<!DOCTYPE html>
<html lang="ja">
<head><meta charset="utf-8"><title>エラー</title></head>
<body>
  <h1>⚠️ エラー</h1>
  <p>URL が入力されていません。</p>
  <p><a href="/shorten">← 戻る</a></p>
</body>
</html>
		`, 400);
	}

	// URL形式チェック
	try {
		new URL(targetUrl);
	} catch {
		return html(`
<!DOCTYPE html>
<html lang="ja">
<head><meta charset="utf-8"><title>エラー</title></head>
<body>
  <h1>⚠️ エラー</h1>
  <p>有効なURLを入力してください（https://... の形式）。</p>
  <p><a href="/shorten">← 戻る</a></p>
</body>
</html>
		`, 400);
	}

	// ランダムなショートコードを生成（6文字）
	const code = generateCode(6);

	// KV に保存
	await env.URL_SHORTENER.put(code, targetUrl);

	const shortUrl = new URL(`/s/${code}`, request.url).toString();

	return html(`
<!DOCTYPE html>
<html lang="ja">
<head><meta charset="utf-8"><title>URL短縮完了</title></head>
<body>
  <h1>✅ 短縮URLを作成しました</h1>
  <table>
    <tr><td>元のURL:</td><td><a href="${escapeHtml(targetUrl)}">${escapeHtml(targetUrl)}</a></td></tr>
    <tr><td>短縮URL:</td><td><a href="${escapeHtml(shortUrl)}">${escapeHtml(shortUrl)}</a></td></tr>
    <tr><td>コード:</td><td><code>${escapeHtml(code)}</code></td></tr>
  </table>
  <p><a href="/shorten">← もう1つ作成する</a></p>
  <p><a href="/">← インデックスに戻る</a></p>
</body>
</html>
	`);
}

function renderForm() {
	return html(`
<!DOCTYPE html>
<html lang="ja">
<head><meta charset="utf-8"><title>URL短縮サービス</title></head>
<body>
  <h1>🔗 URL短縮サービス</h1>
  <p>長いURLを短くします。KV（キーバリューストア）に保存されます。</p>
  <form method="POST" action="/shorten">
    <label for="url">短縮したいURL:</label><br>
    <input type="url" id="url" name="url" placeholder="https://example.com/very/long/path" size="50" required>
    <button type="submit">短縮する</button>
  </form>
  <h2>使い方</h2>
  <ol>
    <li>上のフォームにURLを入力して「短縮する」をクリック</li>
    <li>生成された短縮URL（<code>/s/xxxxxx</code>）を共有</li>
    <li>短縮URLにアクセスすると元のURLにリダイレクトされます</li>
  </ol>
  <p><a href="/">← インデックスに戻る</a></p>
</body>
</html>
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
