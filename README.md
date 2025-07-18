# IP Address Converter

IPv4/IPv6 アドレスを 16 進数表記からビット表記に変換する Chrome 拡張機能です。

このプロジェクトは[Plasmo extension](https://docs.plasmo.com/)フレームワークを使用して開発されています。

## 機能

- **IPv4/IPv6 対応**: IPv4 と IPv6 の両方のアドレスを自動判定して変換
- **ホバー表示**: ウェブページ上の IP アドレスにマウスオーバーでビット表記をツールチップ表示
- **手動変換**: ポップアップ UI で IP アドレスを手動入力して変換
- **コンテキストメニュー変換**: 選択したテキスト内の IP アドレスを右クリックメニューから変換
- **手動再スキャン**: 動的に追加されるコンテンツを手動でスキャン
- **4 行表示**: 128 ビットを 32 ビットずつ 4 行に分けて表示（IPv4 は最初の 1 行のみ使用）
- **色分け表示**: 0（青色）と 1（赤色）で視覚的に区別
- **多様な形式対応**: IPv4 全形式、IPv6 完全形式、短縮形式（::）、ループバックアドレスなど
- **コピー機能**: ビット表記をクリップボードにコピー
- **設定ページ**: 自動スキャンの ON/OFF 切り替え

## 開発環境のセットアップ

### 必要な環境

- Node.js 24.3.0 (Volta で管理)
- npm 11.4.2

### インストール

```bash
# 依存関係をインストール
npm install
```

### 開発サーバーの起動

```bash
npm run dev
```

ブラウザを開き、適切な開発ビルドを読み込んでください。
Chrome ブラウザ（Manifest V3）の場合: `build/chrome-mv3-dev`

### 拡張機能の読み込み方法

1. Chrome の拡張機能管理ページ（`chrome://extensions/`）を開く
2. 「デベロッパーモード」を有効にする
3. 「パッケージ化されていない拡張機能を読み込む」をクリック
4. `build/chrome-mv3-dev` フォルダを選択

## 開発

- `src/popup.tsx`: ポップアップ UI の編集
- `src/contents/plasmo.ts`: コンテンツスクリプトの編集
- `src/utils/ipv6-converter.ts`: IPv6 変換ロジック
- `src/utils/bit-formatting.ts`: ビット表示共通ロジック
- `src/utils/tooltip-generator.ts`: ツールチップ HTML 生成
- `src/components/BitDisplay.tsx`: ビット表示共通コンポーネント

変更は自動的に反映されます。コンテンツスクリプトを変更した場合は、ブラウザで拡張機能をリロードしてください。

## テスト

```bash
# テストを実行
npm test

# テストUIを起動
npm run test:ui
```

## コード品質管理

```bash
# リンターでチェック
npm run lint

# リンターで自動修正
npm run lint:fix

# フォーマッター
npm run format
```

## プロダクションビルド

```bash
npm run build
npm run package
```

このコマンドで拡張機能のプロダクションバンドルが作成され、ストアに公開する準備が整います。

## ファイル構造

```
src/
├── components/
│   └── BitDisplay.tsx          # ビット表示共通コンポーネント
├── contents/
│   └── plasmo.ts               # コンテンツスクリプト
├── utils/
│   ├── ipv6-converter.ts       # IPv6変換ロジック
│   ├── ipv6-converter.test.ts  # IPv6変換テスト
│   ├── ipv4-converter.ts       # IPv4変換ロジック
│   ├── ipv4-converter.test.ts  # IPv4変換テスト
│   ├── ip-address-common.ts    # IPv4/IPv6共通インターフェース
│   ├── ip-address-common.test.ts # 共通インターフェーステスト
│   ├── bit-formatting.ts       # ビット表示共通ロジック
│   ├── bit-formatting.test.ts  # ビット表示テスト
│   └── tooltip-generator.ts    # ツールチップHTML生成
├── test/
│   └── setup.ts                # テストセットアップ
├── options.tsx                 # 設定ページUI
├── popup.tsx                   # ポップアップUI
└── style.css                   # 共通スタイル

store/                          # Chrome Web Store用アセット
├── description.txt             # ストア説明文
├── icon.png                    # ストア用アイコン
├── screenshot-popup.png        # ポップアップのスクリーンショット
└── screenshot-tooltip.png      # ツールチップのスクリーンショット
```

## 対応する IP アドレス形式

### IPv4

- 標準形式: `192.168.1.1`
- プライベートアドレス: `10.0.0.1`, `172.16.0.1`
- 特殊アドレス: `0.0.0.0`, `255.255.255.255`

### IPv6

- 完全形式: `2001:db8:85a3:0:0:8a2e:370:7334`
- 短縮形式: `2001:db8::1`
- ループバック: `::1`
- 全ゼロ: `::`

## 技術仕様

- **フレームワーク**: Plasmo v0.90.5
- **UI**: React + TypeScript
- **スタイル**: 素の CSS
- **テスト**: Vitest
- **コード品質**: Biome（リンター + フォーマッター）
- **表示方式**: ホバーツールチップ + 手動再スキャン

## 詳細なドキュメント

- [基本実装](docs/dev/01-DOC-extension-base.md): 初期実装の詳細
