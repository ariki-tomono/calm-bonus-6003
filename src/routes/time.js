import { html } from '../utils/response.js';

export function handleTime() {
	const now = new Date();
	const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
	const formatted = jst.toISOString().replace('T', ' ').replace('Z', '') + ' (JST)';

	return html(`
<!DOCTYPE html>
<html lang="ja">
<head><meta charset="utf-8"><title>現在時刻</title></head>
<body>
  <h1>🕐 現在時刻</h1>
  <p style="font-size: 1.5em;">${formatted}</p>
  <p>UTC: ${now.toISOString()}</p>
  <p><a href="/">← インデックスに戻る</a></p>
</body>
</html>
	`);
}
