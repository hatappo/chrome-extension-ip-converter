# IP Address Converter

IPv4/IPv6 アドレスを 16 進数表記からビット表記に変換する Chrome 拡張機能です。

このプロジェクトは[Plasmo extension](https://docs.plasmo.com/)フレームワークを使用して開発されています。

## 機能

- インタラクティブなホバーツールチップにより、あらゆるウェブページでバイナリ表現を表示
- コンテキストメニュー統合により、選択したテキストを素早く分析
- 特定のアドレスをテストするための手動入力ツール
- カラースキーム：青ビット（0）と赤ビット（1）
- 最新のネットワークを完全サポート：IPv6（128 ビット）および IPv4（32 ビット）
- プライバシー重視：外部接続なしで完全にオフラインで動作

## 開発環境のセットアップ

### 必要な環境

- Volta （Node.js と pnpm を管理）
- Node.js 24.3.0
- pnpm 10.30.1

### インストール

```bash
# 依存関係をインストール
pnpm install
```

### 開発サーバーの起動

```bash
pnpm dev
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
pnpm test

# テストUIを起動
pnpm test:ui
```

## コード品質管理

```bash
# リンターでチェック
pnpm lint

# リンターで自動修正
pnpm lint:fix

# フォーマッター
pnpm format
```

## プロダクションビルド

```bash
pnpm build
pnpm package
```

このコマンドで拡張機能のプロダクションバンドルが作成され、ストアに公開する準備が整います。

## ファイル構造

```
src/
├── components/
│   └── BitDisplay.tsx            # ビット表示共通コンポーネント
├── contents/
│   └── plasmo.ts                 # コンテンツスクリプト
├── utils/
│   ├── ipv6-converter.ts         # IPv6変換ロジック
│   ├── ipv6-converter.test.ts    # IPv6変換テスト
│   ├── ipv4-converter.ts         # IPv4変換ロジック
│   ├── ipv4-converter.test.ts    # IPv4変換テスト
│   ├── ip-address-common.ts      # IPv4/IPv6共通インターフェース
│   ├── ip-address-common.test.ts # 共通インターフェーステスト
│   ├── bit-formatting.ts         # ビット表示共通ロジック
│   ├── bit-formatting.test.ts    # ビット表示テスト
│   └── tooltip-generator.ts      # ツールチップHTML生成
├── test/
│   └── setup.ts                  # テストセットアップ
├── options.tsx                   # 設定ページUI
├── popup.tsx                     # ポップアップUI
└── style.css                     # 共通スタイル

store/                            # Chrome Web Store用アセット
├── description.txt               # ストア説明文
├── icon.png                      # ストア用アイコン
├── screenshot-popup.png          # ポップアップのスクリーンショット
└── screenshot-tooltip.png        # ツールチップのスクリーンショット
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
