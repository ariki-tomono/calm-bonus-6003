import { html } from './utils/response.js';
import { handleHello } from './routes/hello.js';
import { handleTime } from './routes/time.js';
import { handleJson } from './routes/json.js';
import { handleRedirect } from './routes/redirect.js';

// ルート定義
const routes = {
	'/hello': handleHello,
	'/time': handleTime,
	'/json': handleJson,
	'/redirect': handleRedirect,
};

export default {
	async fetch(request, env, ctx) {
		const url = new URL(request.url);
		const path = url.pathname;

		// ルートマッチング
		const handler = routes[path];
		if (handler) {
			return handler(request, env, ctx);
		}

		// インデックスページ
		if (path === '/') {
			return renderIndex();
		}

		// 404
		return html(`
<!DOCTYPE html>
<html lang="ja">
<head><meta charset="utf-8"><title>404 Not Found</title></head>
<body>
  <h1>404 - ページが見つかりません</h1>
  <p>リクエストされたパス: <code>${escapeHtml(path)}</code></p>
  <p><a href="/">← インデックスに戻る</a></p>
</body>
</html>
		`, 404);
	},
};

function renderIndex() {
	return html(`
<!DOCTYPE html>
<html lang="ja">
<head><meta charset="utf-8"><title>Cloudflare Workers サンプル集</title></head>
<body>
  <h1>⚡ Cloudflare Workers サンプル集</h1>
  <p>各機能へのリンク:</p>
  <ul>
    <li><a href="/hello">/hello</a> - 挨拶メッセージ（クエリパラメータ対応）</li>
    <li><a href="/time">/time</a> - 現在時刻を表示</li>
    <li><a href="/json">/json</a> - リクエスト情報を JSON で返す</li>
    <li><a href="/redirect">/redirect</a> - リダイレクトサービス</li>
  </ul>
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
