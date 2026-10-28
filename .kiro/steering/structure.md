# プロジェクト構成と規約

## ディレクトリ構成

```
.
├── src/
│   ├── index.js              # ルーター（リクエスト振り分け + インデックスページ）
│   ├── routes/               # 各機能のハンドラ
│   │   ├── hello.js          # /hello
│   │   ├── time.js           # /time
│   │   ├── json.js           # /json
│   │   ├── redirect.js       # /redirect
│   │   ├── shorten.js        # /shorten, /s/:code（KV）
│   │   └── notes.js          # /notes 以下（D1）
│   └── utils/
│       └── response.js       # 共通レスポンスヘルパー（page / html / json / layout）
├── docs/
│   ├── routes.md             # ルート詳細ドキュメント
│   └── styling.md            # スタイリング（Pico CSS）
├── schema.sql                # D1 テーブル定義
├── wrangler.jsonc            # Worker 設定・bindings
└── package.json
```

## アーキテクチャ規約

- **ルーティング**: `src/index.js` が唯一のエントリーポイント。パスごとに `routes/` のハンドラへ振り分ける。動的パス（`/s/:code`, `/notes/:id`）は正規表現でマッチする。
- **ハンドラ**: 各ルートは `src/routes/<name>.js` に `handle<Name>` という名前でエクスポートする関数として実装する。シグネチャは `(request, env, ctx)` を基本とする。
- **レスポンス生成**: HTML / JSON レスポンスは必ず `src/utils/response.js` のヘルパー（`page()`, `json()`, `html()`）経由で生成する。HTML 全体のレイアウトは `layout()` に集約されている。
- **スタイリング**: Pico CSS v2 を CDN 経由で利用（クラスレス）。詳細は `docs/styling.md`。

## コーディング規約

- 言語は JavaScript（ES Modules）。
- インデントはタブ（`.editorconfig` / `.prettierrc` に従う）。
- ユーザー入力を HTML に埋め込む際は必ず `escapeHtml` でエスケープし、XSS を防ぐ。
- コメントは日本語で記述する（既存コードに合わせる）。

## bindings

| 種類 | binding 名 | 対象 |
|------|-----------|------|
| KV | `URL_SHORTENER` | URL 短縮の保存先 |
| D1 | `NOTES_DB` | メモ帳データベース（`notes-db`） |

bindings はいずれも `remote: true`。`wrangler dev` 実行時もローカルエミュレートではなく本番の KV / D1 に接続するため、開発中のデータ操作に注意する。

`wrangler.jsonc` の bindings を変更したら `npx wrangler types` を実行する。

## ドキュメント更新

ルートを追加・変更したら `docs/routes.md` と `README.md` のルート一覧も更新する。
