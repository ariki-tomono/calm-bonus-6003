/**
 * 共通 HTML レイアウト（Pico CSS 適用）
 */
export function layout(title, body) {
	return `<!DOCTYPE html>
<html lang="ja" data-theme="light">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css">
  <style>
    button, [role="button"], input[type="submit"] {
      padding: 0.25rem 0.75rem !important;
      font-size: 0.85rem !important;
      width: auto !important;
      display: inline-block !important;
    }
  </style>
</head>
<body>
  <header class="container">
    <nav>
      <ul><li><strong><a href="/">⚡ Workers サンプル集</a></strong></li></ul>
      <ul>
        <li><a href="/hello">Hello</a></li>
        <li><a href="/time">時刻</a></li>
        <li><a href="/json">JSON</a></li>
        <li><a href="/shorten">URL短縮</a></li>
        <li><a href="/notes">メモ帳</a></li>
      </ul>
    </nav>
  </header>
  <main class="container">
    ${body}
  </main>
  <footer class="container">
    <small>Powered by <a href="https://developers.cloudflare.com/workers/">Cloudflare Workers</a></small>
  </footer>
</body>
</html>`;
}

/**
 * HTML レスポンスを生成する（レイアウト付き）
 */
export function page(title, body, status = 200) {
	return new Response(layout(title, body), {
		status,
		headers: { 'Content-Type': 'text/html; charset=utf-8' },
	});
}

/**
 * HTML レスポンスを生成する（レイアウトなし、そのまま出力）
 */
export function html(body, status = 200) {
	return new Response(body, {
		status,
		headers: { 'Content-Type': 'text/html; charset=utf-8' },
	});
}

/**
 * JSON レスポンスを生成する
 */
export function json(data, status = 200) {
	return new Response(JSON.stringify(data, null, 2), {
		status,
		headers: { 'Content-Type': 'application/json; charset=utf-8' },
	});
}
