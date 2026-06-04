# calm-bonus-6003

Cloudflare Workers で動作するシンプルな HTTP ワーカーアプリケーションです。

## 概要

リクエストを受け取り「Hello Cloudflare! Hello World!」を返すシンプルな Worker です。

## 技術スタック

- **ランタイム**: Cloudflare Workers
- **言語**: JavaScript
- **ツール**: Wrangler v4
- **互換性フラグ**: `nodejs_compat`

## プロジェクト構成

```
.
├── src/
│   └── index.js        # Worker のエントリーポイント
├── package.json
├── wrangler.jsonc       # Wrangler 設定ファイル
└── README.md
```

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

## 設定

| 項目 | 値 |
|------|------|
| エントリーポイント | `src/index.js` |
| 互換性日付 | 2024-10-11 |
| Observability | 有効（ログ永続化あり） |
| workers_dev | true |
