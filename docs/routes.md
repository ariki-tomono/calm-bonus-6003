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

## 404 - Not Found

定義されていないパスにアクセスした場合、404 ページを返します。
