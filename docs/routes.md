# ルート一覧

このプロジェクトで利用可能なルート（エンドポイント）の一覧です。

## `/` - インデックス

各機能へのリンク一覧を HTML で表示します。

## `/hello` - 挨拶メッセージ

| 項目 | 内容 |
|------|------|
| ファイル | `src/routes/hello.js` |
| メソッド | GET |
| パラメータ | `?name=名前`（省略時は "World"） |

### 例

- `/hello` → 「Hello, World!」
- `/hello?name=太郎` → 「Hello, 太郎!」

---

## `/time` - 現在時刻

| 項目 | 内容 |
|------|------|
| ファイル | `src/routes/time.js` |
| メソッド | GET |
| パラメータ | なし |

JST と UTC の現在時刻を HTML で表示します。

---

## `/json` - リクエスト情報

| 項目 | 内容 |
|------|------|
| ファイル | `src/routes/json.js` |
| メソッド | GET |
| パラメータ | なし |

リクエストの情報を JSON で返します。

### レスポンス例

```json
{
  "ip": "203.0.113.1",
  "country": "JP",
  "city": "Tokyo",
  "userAgent": "Mozilla/5.0 ...",
  "method": "GET",
  "url": "https://calm-bonus-6003.ariki1068.workers.dev/json",
  "timestamp": "2026-06-04T06:50:00.000Z"
}
```

---

## `/redirect` - リダイレクトサービス

| 項目 | 内容 |
|------|------|
| ファイル | `src/routes/redirect.js` |
| メソッド | GET |
| パラメータ | `?to=キー名` |

### 利用可能なリダイレクト先

| キー | URL |
|------|------|
| `github` | https://github.com |
| `cloudflare` | https://developers.cloudflare.com/workers/ |
| `mdn` | https://developer.mozilla.org/ja/ |

### 例

- `/redirect?to=github` → GitHub にリダイレクト
- `/redirect` → リダイレクト先一覧を表示

---

## `/shorten` - URL短縮サービス

| 項目 | 内容 |
|------|------|
| ファイル | `src/routes/shorten.js` |
| メソッド | GET（フォーム表示）/ POST（短縮URL生成） |
| 使用サービス | Workers KV（`URL_SHORTENER`） |

長い URL を短いコード付きの URL に変換して KV に保存します。

### 使い方

1. `/shorten` にアクセスしてフォームを表示
2. 短縮したい URL を入力して送信
3. `/s/xxxxxx` 形式の短縮URLが生成される

### 例

- `POST /shorten` (body: `url=https://example.com/very/long/path`)
  → 短縮URL `/s/aBc123` を生成
- `GET /s/aBc123`
  → `https://example.com/very/long/path` にリダイレクト（302）

### KV データ構造

| キー | 値 |
|------|------|
| `aBc123`（ランダム6文字） | 元の URL |

---

## 404 - Not Found

定義されていないパスにアクセスした場合、404 ページを返します。
