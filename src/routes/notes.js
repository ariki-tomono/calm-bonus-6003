import { page, json } from '../utils/response.js';

/**
 * メモ帳 API + UI
 */

export async function handleNotes(request, env, path) {
	const method = request.method;

	// /notes/api - JSON API
	if (path === '/notes/api') {
		return listNotesJson(env);
	}

	// /notes/new - 新規作成フォーム
	if (path === '/notes/new' && method === 'GET') {
		return renderNewForm();
	}

	// /notes/:id/edit - 編集フォーム
	const editMatch = path.match(/^\/notes\/(\d+)\/edit$/);
	if (editMatch && method === 'GET') {
		return renderEditForm(env, parseInt(editMatch[1]));
	}

	// /notes/:id/delete - 削除
	const deleteMatch = path.match(/^\/notes\/(\d+)\/delete$/);
	if (deleteMatch && method === 'POST') {
		return deleteNote(env, parseInt(deleteMatch[1]));
	}

	// /notes/:id - 詳細 or 更新
	const idMatch = path.match(/^\/notes\/(\d+)$/);
	if (idMatch) {
		const id = parseInt(idMatch[1]);
		if (method === 'POST') {
			return updateNote(request, env, id);
		}
		return showNote(env, id);
	}

	// /notes - 一覧 or 作成
	if (path === '/notes') {
		if (method === 'POST') {
			return createNote(request, env);
		}
		return listNotes(env);
	}

	return page('404', '<h1>404</h1>', 404);
}

// --- JSON API ---

async function listNotesJson(env) {
	const { results } = await env.NOTES_DB.prepare(
		'SELECT * FROM notes ORDER BY updated_at DESC'
	).all();
	return json(results);
}

// --- CRUD 操作 ---

async function listNotes(env) {
	const { results } = await env.NOTES_DB.prepare(
		'SELECT * FROM notes ORDER BY updated_at DESC'
	).all();

	const rows = results
		.map(
			(note) => `
			<tr>
				<td><a href="/notes/${note.id}">${escapeHtml(note.title)}</a></td>
				<td><small>${escapeHtml(note.updated_at)}</small></td>
				<td style="white-space:nowrap;">
					<a href="/notes/${note.id}/edit" role="button" style="margin-bottom:0;">編集</a>
					<form method="POST" action="/notes/${note.id}/delete" style="display:inline; margin:0;">
						<button type="submit" style="margin-bottom:0; min-width:0;" onclick="return confirm('削除しますか？')">削除</button>
					</form>
				</td>
			</tr>`
		)
		.join('');

	return page('メモ帳', `
		<hgroup>
			<h1>📝 メモ帳</h1>
			<p>D1 データベースを使用したメモの CRUD アプリ</p>
		</hgroup>
		<p><a href="/notes/new" role="button">＋ 新規作成</a></p>
		${
			results.length === 0
				? '<p>メモがありません。新規作成してください。</p>'
				: `<figure><table>
				<thead><tr><th>タイトル</th><th>更新日時</th><th>操作</th></tr></thead>
				<tbody>${rows}</tbody>
			</table></figure>`
		}
		<hr>
		<p><small><a href="/notes/api">JSON API で取得</a></small></p>
	`);
}

async function showNote(env, id) {
	const note = await env.NOTES_DB.prepare('SELECT * FROM notes WHERE id = ?').bind(id).first();

	if (!note) {
		return page('404', `
			<h1>メモが見つかりません</h1>
			<p><a href="/notes">← メモ一覧に戻る</a></p>
		`, 404);
	}

	return page(escapeHtml(note.title), `
		<h1>${escapeHtml(note.title)}</h1>
		<pre><code>${escapeHtml(note.content)}</code></pre>
		<p><small>作成: ${escapeHtml(note.created_at)} | 更新: ${escapeHtml(note.updated_at)}</small></p>
		<div role="group">
			<a href="/notes/${note.id}/edit" role="button" class="outline">編集</a>
			<a href="/notes" role="button" class="outline secondary">← 一覧に戻る</a>
		</div>
	`);
}

async function createNote(request, env) {
	const formData = await request.formData();
	const title = formData.get('title')?.trim();
	const content = formData.get('content') || '';

	if (!title) {
		return page('エラー', `
			<h1>⚠️ タイトルを入力してください</h1>
			<p><a href="/notes/new">← 戻る</a></p>
		`, 400);
	}

	await env.NOTES_DB.prepare('INSERT INTO notes (title, content) VALUES (?, ?)').bind(title, content).run();

	return Response.redirect(new URL('/notes', request.url).toString(), 302);
}

async function updateNote(request, env, id) {
	const formData = await request.formData();
	const title = formData.get('title')?.trim();
	const content = formData.get('content') || '';

	if (!title) {
		return page('エラー', `
			<h1>⚠️ タイトルを入力してください</h1>
			<p><a href="/notes/${id}/edit">← 戻る</a></p>
		`, 400);
	}

	await env.NOTES_DB.prepare("UPDATE notes SET title = ?, content = ?, updated_at = datetime('now') WHERE id = ?")
		.bind(title, content, id)
		.run();

	return Response.redirect(new URL(`/notes/${id}`, request.url).toString(), 302);
}

async function deleteNote(env, id) {
	await env.NOTES_DB.prepare('DELETE FROM notes WHERE id = ?').bind(id).run();
	return new Response(null, {
		status: 302,
		headers: { Location: '/notes' },
	});
}

// --- フォーム ---

function renderNewForm() {
	return page('新規メモ作成', `
		<h1>📝 新規メモ作成</h1>
		<form method="POST" action="/notes">
			<label for="title">タイトル</label>
			<input type="text" id="title" name="title" required>
			<label for="content">内容</label>
			<textarea id="content" name="content" rows="10"></textarea>
			<button type="submit">作成する</button>
		</form>
		<p><a href="/notes">← メモ一覧に戻る</a></p>
	`);
}

async function renderEditForm(env, id) {
	const note = await env.NOTES_DB.prepare('SELECT * FROM notes WHERE id = ?').bind(id).first();

	if (!note) {
		return page('404', '<h1>メモが見つかりません</h1><p><a href="/notes">← 戻る</a></p>', 404);
	}

	return page('メモ編集', `
		<h1>📝 メモ編集</h1>
		<form method="POST" action="/notes/${note.id}">
			<label for="title">タイトル</label>
			<input type="text" id="title" name="title" value="${escapeHtml(note.title)}" required>
			<label for="content">内容</label>
			<textarea id="content" name="content" rows="10">${escapeHtml(note.content)}</textarea>
			<button type="submit">更新する</button>
		</form>
		<p><a href="/notes/${note.id}">← キャンセル</a></p>
	`);
}

// --- ユーティリティ ---

function escapeHtml(str) {
	return String(str)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}
