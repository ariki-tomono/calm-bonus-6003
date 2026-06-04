# スタイリング

このプロジェクトでは [Pico CSS v2](https://picocss.com/) を CDN 経由で使用しています。

## 導入方法

`src/utils/response.js` の共通レイアウト関数 `layout()` で全ページに適用しています。

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css">
```

## Pico CSS の特徴

- クラスレス CSS フレームワーク（セマンティック HTML だけで見栄えが良くなる）
- ビルドツール不要（CDN の `<link>` タグ1行で導入可能）
- レスポンシブ対応済み
- ダークモード対応（`data-theme` 属性で切り替え可能）

## 共通レイアウト構成

全ページが以下の構造で出力されます：

```html
<body>
  <header class="container">  <!-- ナビゲーション -->
  <main class="container">    <!-- 各ページのコンテンツ -->
  <footer class="container">  <!-- フッター -->
</body>
```

## カスタム CSS（グローバルスタイル）

Pico CSS のデフォルトでは `form` 内のボタンが `width: 100%` になるため、以下のカスタムスタイルで全ボタンをコンパクトなサイズに統一しています。

```css
button, [role="button"], input[type="submit"] {
  padding: 0.25rem 0.75rem !important;
  font-size: 0.85rem !important;
  width: auto !important;
  display: inline-block !important;
}
```

### 適用結果

- すべてのボタンが文字幅に合わせたコンパクトなサイズで表示される
- `<a role="button">` もボタンスタイルが適用される
- フォーム内のボタンも横幅いっぱいにならない

## 使用している Pico CSS の機能

| 機能 | 使用箇所 |
|------|------|
| `class="container"` | 全ページの header / main / footer |
| `class="grid"` | トップページのカードレイアウト |
| `<article>` | トップページの各機能カード |
| `<hgroup>` | ページタイトル + サブタイトル |
| `<nav>` | ヘッダーナビゲーション |
| `<table>` | メモ帳一覧、リダイレクト一覧、時刻表示 |
| `<kbd>` | トップページのバッジ（KV、D1） |
| `role="button"` | リンクをボタンとして表示 |

## 将来の移行について

プロジェクトが成長した場合、Hono フレームワーク + JSX テンプレートへの移行を検討しています。その際は Pico CSS を維持するか、Tailwind CSS に切り替えるかを判断します。
