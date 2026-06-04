# calm-bonus-6003

Cloudflare Workers で動作する HTTP ワーカーアプリケーションです。複数の初級サンプル機能をルーティングで束ねています。

## 概要

`src/index.js` がルーターとして動作し、各機能を `src/routes/` 以下のモジュールに振り分けます。

## 技術スタック

- **ランタイム**: Cloudflare Workers
- **言語**: JavaScript
- **ツール**: Wrangler v4
- **互換性フラグ**: `nodejs_compat`

## プロジェクト構成

```
.
├── src/
│   ├── index.js              # ルーター（リクエスト振り分け + インデックスページ）
│   ├── routes/
│   │   ├── hello.js          # /hello - 挨拶メッセージ
│   │   ├── time.js           # /time - 現在時刻
│   │   ├── json.js           # /json - リクエスト情報
│   │   ├── redirect.js       # /redirect - リダイレクト
│   │   └── shorten.js        # /shorten - URL短縮サービス
│   └── utils/
│       └── response.js       # 共通レスポンスヘルパー
├── docs/
│   └── routes.md             # ルート詳細ドキュメント
├── package.json
├── wrangler.jsonc
└── README.md
```

## ルート一覧

| パス | 機能 | 使用サービス |
|------|------|------|
| `/` | インデックス | Workers のみ |
| `/hello` | 挨拶（`?name=名前` 対応） | Workers のみ |
| `/time` | 現在時刻（JST / UTC） | Workers のみ |
| `/json` | リクエスト情報を JSON で返す | Workers のみ |
| `/redirect` | リダイレクト（`?to=キー名`） | Workers のみ |
| `/shorten` | URL短縮サービス | Workers + KV |
| `/s/:code` | 短縮URLからリダイレクト | Workers + KV |

詳細は [docs/routes.md](docs/routes.md) を参照してください。

## セットアップ

```bash
npm install
```

## 開発

ローカル開発サーバーを起動します：

```bash
npm run dev
```

## デプロイ

Cloudflare にデプロイします：

```bash
npm run deploy
```

## 開発フロー

1. `src/index.js` を編集して機能を追加・変更する
2. ローカルで動作確認する
   ```bash
   npx wrangler dev
   ```
3. Cloudflare にデプロイする
   ```bash
   npx wrangler deploy
   ```
4. Git にコミットして GitHub に反映する
   ```bash
   git add .
   git commit -m "変更内容の説明"
   git push
   ```

## 設定

| 項目 | 値 |
|------|------|
| エントリーポイント | `src/index.js` |
| 互換性日付 | 2024-10-11 |
| Observability | 有効（ログ永続化あり） |
| workers_dev | true |
