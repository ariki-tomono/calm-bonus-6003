import { page } from '../utils/response.js';

export function handleTime() {
	const now = new Date();
	const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
	const formatted = jst.toISOString().replace('T', ' ').replace('Z', '') + ' (JST)';

	return page('現在時刻', `
		<h1>🕐 現在時刻</h1>
		<table>
			<tbody>
				<tr><td><strong>JST</strong></td><td>${formatted}</td></tr>
				<tr><td><strong>UTC</strong></td><td>${now.toISOString()}</td></tr>
			</tbody>
		</table>
		<p><small>ページを再読み込みすると更新されます。</small></p>
	`);
}
