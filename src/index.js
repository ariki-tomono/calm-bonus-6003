import { page } from './utils/response.js';
import { handleHello } from './routes/hello.js';
import { handleTime } from './routes/time.js';
import { handleJson } from './routes/json.js';
import { handleRedirect } from './routes/redirect.js';
import { handleShorten, handleRedirectShort } from './routes/shorten.js';
import { handleNotes } from './routes/notes.js';

// ルート定義
const routes = {
	'/hello': handleHello,
	'/time': handleTime,
	'/json': handleJson,
	'/redirect': handleRedirect,
	'/shorten': handleShorten,
};

export default {
	async fetch(request, env, ctx) {
		const url = new URL(request.url);
		const path = url.pathname;

		// 短縮URLリダイレクト（/s/:code）
		const shortMatch = path.match(/^\/s\/([a-zA-Z0-9]+)$/);
		if (shortMatch) {
			return handleRedirectShort(request, env, shortMatch[1]);
		}

		// メモ帳（/notes 以下のすべてのパス）
		if (path === '/notes' || path.startsWith('/notes/')) {
			return handleNotes(request, env, path);
		}

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
		return page('404 Not Found', `
			<h1>404 - ページが見つかりません</h1>
			<p>リクエストされたパス: <code>${escapeHtml(path)}</code></p>
		`, 404);
	},
};

function renderIndex() {
	return page('Cloudflare Workers サンプル集', `
		<hgroup>
			<h1>⚡ Cloudflare Workers サンプル集</h1>
			<p>Cloudflare Workers の各種機能を学ぶためのサンプル集です</p>
		</hgroup>

		<div class="grid">
			<article>
				<header>🖐 Hello</header>
				<p>挨拶メッセージを返します。クエリパラメータで名前を変更可能。</p>
				<footer><a href="/hello" role="button">試す</a></footer>
			</article>
			<article>
				<header>🕐 現在時刻</header>
				<p>JST / UTC の現在時刻を表示します。</p>
				<footer><a href="/time" role="button">試す</a></footer>
			</article>
			<article>
				<header>📋 リクエスト情報</header>
				<p>IP、国、User-Agent などを JSON で返します。</p>
				<footer><a href="/json" role="button">試す</a></footer>
			</article>
		</div>

		<div class="grid">
			<article>
				<header>🔗 リダイレクト</header>
				<p>登録済みのキーで外部サイトへリダイレクトします。</p>
				<footer><a href="/redirect" role="button">試す</a></footer>
			</article>
			<article>
				<header>✂️ URL短縮 <kbd>KV</kbd></header>
				<p>長い URL を短いコードに変換して保存します。</p>
				<footer><a href="/shorten" role="button">試す</a></footer>
			</article>
			<article>
				<header>📝 メモ帳 <kbd>D1</kbd></header>
				<p>メモの作成・閲覧・編集・削除ができます。</p>
				<footer><a href="/notes" role="button">試す</a></footer>
			</article>
		</div>
	`);
}

function escapeHtml(str) {
	return str
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}
