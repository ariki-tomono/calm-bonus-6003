import { json } from '../utils/response.js';

export function handleJson(request) {
	const url = new URL(request.url);

	const data = {
		ip: request.headers.get('cf-connecting-ip') || 'unknown',
		country: request.cf?.country || 'unknown',
		city: request.cf?.city || 'unknown',
		userAgent: request.headers.get('user-agent') || 'unknown',
		method: request.method,
		url: url.toString(),
		timestamp: new Date().toISOString(),
	};

	return json(data);
}
