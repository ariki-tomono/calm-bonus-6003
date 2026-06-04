/**
 * HTML レスポンスを生成する
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
