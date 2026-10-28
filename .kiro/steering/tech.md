# 技術スタックとコマンド

## 技術スタック

- **ランタイム**: Cloudflare Workers
- **言語**: JavaScript（ES Modules）
- **ツール**: Wrangler v4
- **互換性日付**: `2024-10-11`
- **互換性フラグ**: `nodejs_compat`
- **スタイリング**: Pico CSS v2（CDN）
- **ストレージ**: Workers KV（URL 短縮）, D1 / SQLite（メモ帳）

## コマンド

| コマンド | 用途 |
|---------|------|
| `npm install` | 依存関係のインストール |
| `npm run dev` / `npx wrangler dev` | ローカル開発サーバー起動 |
| `npm run deploy` / `npx wrangler deploy` | Cloudflare へデプロイ |
| `npx wrangler types` | TypeScript 型の生成（bindings 変更後に実行） |

開発サーバーやウォッチ系は長時間動作するため、エージェントからは起動せずユーザーのターミナルで実行する。

## D1 スキーマ適用

```bash
# ローカル
npx wrangler d1 execute notes-db --local --file=schema.sql
# リモート
npx wrangler d1 execute notes-db --remote --file=schema.sql
```

## 最新ドキュメントの参照

Cloudflare Workers / KV / R2 / D1 / Durable Objects / Queues 等の API や制限は変化が速い。
実装前に必ず公式ドキュメント（`developers.cloudflare.com`）または Cloudflare MCP サーバーで最新情報を確認する。詳細は `AGENTS.md` を参照。
