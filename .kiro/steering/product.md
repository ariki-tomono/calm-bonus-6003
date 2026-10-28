# プロダクト概要

Cloudflare Workers 上で動作する HTTP アプリケーション。複数の初級サンプル機能をルーティングで束ねた学習用プロジェクト。

## 目的

- Cloudflare Workers / KV / D1 の各種機能を学ぶためのサンプル集
- ビルドツールやフレームワークを使わない、素の JavaScript による実装

## 提供機能（ルート）

| パス | 機能 | 使用サービス |
|------|------|------|
| `/` | インデックス（各機能へのリンク） | Workers |
| `/hello` | 挨拶メッセージ（`?name=` 対応） | Workers |
| `/time` | 現在時刻（JST / UTC） | Workers |
| `/json` | リクエスト情報を JSON で返す | Workers |
| `/redirect` | 登録済みキーで外部サイトへリダイレクト（`?to=`） | Workers |
| `/shorten`, `/s/:code` | URL 短縮サービス | Workers + KV |
| `/notes`, `/notes/:id` ほか | メモ帳（CRUD） | Workers + D1 |

## デプロイ先

- Worker 名: `calm-bonus-6003`
- 公開 URL: `calm-bonus-6003.workers.dev`
- GitHub: `ariki-tomono/calm-bonus-6003`

Worker 名（`wrangler.jsonc` の `name`）とローカルフォルダ名は独立している点に注意。
