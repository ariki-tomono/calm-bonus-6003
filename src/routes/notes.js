import { html, json } from '../utils/response.js';

/**
 * メモ帳 API + UI
 *
 * GET    /notes          → メモ一覧（HTML）
 * GET    /notes/api      → メモ一覧（JSON）
 * GET    /notes/new      → 新規作成フォーム
 * POST   /notes          → メモ作成
 * GET    /notes/:id      → メモ詳細
 * GET    /notes/:id/edit → 編集フォーム
 * POST   /notes/:id      → メモ更新
 * POST   /notes/:id/delete → メモ削除
 */

export async function handleNotes(request, env, path) {
	const url = new URL(request.url);
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

	return html('<h1>404</h1>', 404);
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
			<td>${escapeHtml(note.updated_at)}</td>
			<td>
				<a href="/notes/${note.id}/edit">編集</a>
				<form method="POST" action="/notes/${note.id}/delete" style="display:inline">
					<button type="submit" onclick="return confirm('削除しますか？')">削除</button>
				</form>
			</td>
		</tr>`
		)
		.join('');

	return html(`
<!DOCTYPE html>
<html lang="ja">
<head><meta charset="utf-8"><title>メモ帳</title></head>
<body>
  <h1>📝 メモ帳</h1>
  <p><a href="/notes/new">＋ 新規作成</a></p>
  ${
		results.length === 0
			? '<p>メモがありません。新規作成してください。</p>'
			: `<table border="1" cellpadding="8">
      <tr><th>タイトル</th><th>更新日時</th><th>操作</th></tr>
      ${rows}
    </table>`
	}
  <hr>
  <p><a href="/notes/api">JSON API</a> | <a href="/">← インデックスに戻る</a></p>
</body>
</html>
	`);
}

async function showNote(env, id) {
	const note = await env.NOTES_DB.prepare('SELECT * FROM notes WHERE id = ?').bind(id).first();

	if (!note) {
		return html(`
<!DOCTYPE html>
<html lang="ja">
<head><meta charset="utf-8"><title>404</title></head>
<body>
  <h1>メモが見つかりません</h1>
  <p><a href="/notes">← メモ一覧に戻る</a></p>
</body>
</html>
		`, 404);
	}

	return html(`
<!DOCTYPE html>
<html lang="ja">
<head><meta charset="utf-8"><title>${escapeHtml(note.title)}</title></head>
<body>
  <h1>${escapeHtml(note.title)}</h1>
  <pre style="white-space: pre-wrap; background: #f5f5f5; padding: 1em;">${escapeHtml(note.content)}</pre>
  <p>作成: ${escapeHtml(note.created_at)} | 更新: ${escapeHtml(note.updated_at)}</p>
  <p>
    <a href="/notes/${note.id}/edit">編集</a> |
    <a href="/notes">← メモ一覧に戻る</a>
  </p>
</body>
</html>
	`);
}

async function createNote(request, env) {
	const formData = await request.formData();
	const title = formData.get('title')?.trim();
	const content = formData.get('content') || '';

	if (!title) {
		return html(`
<!DOCTYPE html>
<html lang="ja">
<head><meta charset="utf-8"><title>エラー</title></head>
<body>
  <h1>⚠️ タイトルを入力してください</h1>
  <p><a href="/notes/new">← 戻る</a></p>
</body>
</html>
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
		return html(`
<!DOCTYPE html>
<html lang="ja">
<head><meta charset="utf-8"><title>エラー</title></head>
<body>
  <h1>⚠️ タイトルを入力してください</h1>
  <p><a href="/notes/${id}/edit">← 戻る</a></p>
</body>
</html>
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
	return html(`
<!DOCTYPE html>
<html lang="ja">
<head><meta charset="utf-8"><title>新規メモ作成</title></head>
<body>
  <h1>📝 新規メモ作成</h1>
  <form method="POST" action="/notes">
    <p>
      <label for="title">タイトル:</label><br>
      <input type="text" id="title" name="title" size="50" required>
    </p>
    <p>
      <label for="content">内容:</label><br>
      <textarea id="content" name="content" rows="10" cols="50"></textarea>
    </p>
    <button type="submit">作成する</button>
  </form>
  <p><a href="/notes">← メモ一覧に戻る</a></p>
</body>
</html>
	`);
}

async function renderEditForm(env, id) {
	const note = await env.NOTES_DB.prepare('SELECT * FROM notes WHERE id = ?').bind(id).first();

	if (!note) {
		return html('<h1>メモが見つかりません</h1><p><a href="/notes">← 戻る</a></p>', 404);
	}

	return html(`
<!DOCTYPE html>
<html lang="ja">
<head><meta charset="utf-8"><title>メモ編集</title></head>
<body>
  <h1>📝 メモ編集</h1>
  <form method="POST" action="/notes/${note.id}">
    <p>
      <label for="title">タイトル:</label><br>
      <input type="text" id="title" name="title" value="${escapeHtml(note.title)}" size="50" required>
    </p>
    <p>
      <label for="content">内容:</label><br>
      <textarea id="content" name="content" rows="10" cols="50">${escapeHtml(note.content)}</textarea>
    </p>
    <button type="submit">更新する</button>
  </form>
  <p><a href="/notes/${note.id}">← キャンセル</a></p>
</body>
</html>
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
