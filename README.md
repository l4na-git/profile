# Profile Website

l4naのポートフォリオサイトです。GitHub Pagesでホスティングされています。

## 概要

このプロジェクトは、EJSテンプレートエンジンとTailwind CSSを使用した静的サイトジェネレーターです。開発時はExpress.js形式のパスを使用し、ビルド時にGitHub Pages用の相対パスに自動変換されます。

## プロジェクト構造

```
profile/
├── originals/              # ソースファイル（ここにあるファイルを編集する）
│   ├── layouts/            # EJSレイアウトテンプレート
│   │   ├── layout.ejs      # ベースレイアウト
│   │   ├── header.ejs      # ヘッダーコンポーネント
│   │   └── footer.ejs      # フッターコンポーネント
│   ├── pages/              # ページコンテンツ
│   │   ├── home.ejs        # ホームページ
│   │   ├── about.ejs       # 自己紹介ページ
│   │   └── product.ejs     # 制作物ページ
│   ├── images/             # 画像ファイル
│   ├── input.css           # Tailwind CSS入力ファイル
│   └── output.css          # Tailwind CSS出力ファイル
├── docs/                   # GitHub Pages用生成ファイル
│   ├── index.html          # 生成されたHTMLファイル（自動生成）
│   ├── about.html          
│   ├── product.html        
│   ├── images/             # 画像ファイル
│   └── output.css          # CSSファイル
├── gulpfile.js             # ビルドシステム
├── tailwind.config.js      # Tailwind CSS設定
└── package.json            # 依存関係とスクリプト
```

## 技術スタック

- **テンプレートエンジン**: EJS
- **CSSフレームワーク**: Tailwind CSS v3.4.17
- **ビルドツール**: Gulp
- **ホスティング**: Github Pages
- **言語**: Node.js, HTML, CSS, JavaScript

## 利用可能なスクリプト

| コマンド | 説明 |
|----------|------|
| `npm run build` | CSSとサイトの完全ビルド |
| `npm run build:css` | Tailwind CSSのコンパイル |
| `npm run build:site` | EJSテンプレートのHTML変換 |
| `npm run dev` | 開発モード（ファイル監視付き） |

## ビルドシステム

### 自動パス変換
ビルドシステムは以下の変換を自動実行します：

#### ナビゲーションパス
- `/` → `./index.html`
- `/about` → `./about.html`
- `/product` → `./product.html`

#### 画像パス
- `../images/` → `./images/`

### 最適化機能
- HTMLの圧縮とミニファイ
- CSSの圧縮と最適化
- 画像ファイルの自動コピー

## ファイル構成の詳細

### EJSテンプレート構造
```
originals/layouts/layout.ejs (ベースレイアウト)
├── header.ejs (ナビゲーション)
├── content (各ページの内容)
└── footer.ejs (フッター)
```

### CSS構成
```
originals/input.css (Tailwind入力)
↓ (Tailwind処理)
originals/output.css (Tailwind出力)
↓ (Gulp圧縮)
docs/output.css (最終CSS)
```

## 開発ワークフロー

1. **`originals/`フォルダ内のファイルを編集**
2. **`npm run dev`で開発サーバー起動**
3. **ファイル変更を自動監視**
4. **`docs/`フォルダに自動ビルド**
5. **ブラウザで`docs/index.html`を確認**
