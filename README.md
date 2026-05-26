# X Send Helper

**公開URL: https://misoclub.github.io/x_send_helper/**

X（旧Twitter）への投稿テキストをスマホ・PCから素早く生成し、X公式アプリ/ブラウザでそのまま投稿できる、クライアントサイド完結のWebツール。

- 投稿タイプを切替（初期: YouTube動画告知 / Webサイト告知）。新タイプは `src/features/postTypes/` に追加可能。
- YouTubeタイプは Data API v3 で登録チャンネルの公開動画一覧を取得し、選択した動画のタイトル/URLを自動で本文に挿入。
- 投稿は X intent URL（`https://twitter.com/intent/tweet?text=...`）でX公式アプリ/Webを起動。本ツールは投稿APIを叩かない。
- すべての設定（APIキー、登録チャンネル、テンプレート）は端末の localStorage に保存。

## 動かす

```sh
npm install
npm run dev
# http://localhost:5173/x_send_helper/ を開く
```

## YouTube APIキーの取得

アプリ内の **設定 → 発行手順** ボタン、または直接 `#/help/youtube-api-key` を開くと
スクリーン手順付きのヘルプが表示されます。要点だけ書くと:

1. https://console.cloud.google.com/ で新規プロジェクトを作成
2. **APIライブラリ** から `YouTube Data API v3` を有効化
3. **認証情報** → **APIキー** を発行
4. キーの **アプリケーションの制限** で「HTTPリファラ」を選択し、以下を許可:
   - `http://localhost:5173/*`
   - `https://misoclub.github.io/x_send_helper/*`
5. キーの **APIの制限** で `YouTube Data API v3` のみに限定
6. ツールの **設定** 画面にキーを貼り付け、チャンネルを追加

## GitHub Pages へのデプロイ

1. リポジトリを GitHub に push
2. **Settings → Pages** で **Source** を **GitHub Actions** に設定
3. main へ push すると `.github/workflows/deploy.yml` が走り `dist/` がデプロイされる
4. 公開URL: https://misoclub.github.io/x_send_helper/

カスタムリポジトリ名で運用する場合は `vite.config.ts` の `base` を併せて変更してください。

## ディレクトリ構成（要約）

```
src/
├── routes/{HomeRoute,ComposeRoute,SettingsRoute}.tsx
├── components/{layout,compose,templates,ui}/...
├── features/
│   ├── postTypes/        # 投稿タイプの抽象と登録
│   ├── templates/        # テンプレ管理（builtin/user）
│   └── youtube/          # API クライアント・キャッシュ・チャンネル管理
└── lib/                  # intentUrl, useLocalStorage, countTweetLength, etc.
```

## ライセンス

MIT
