<p align="center"><sub><a href="./README.md">en</a> | <a href="./README_ja.md">ja</a></sub></p>

# IP Address Converter

IPv4/IPv6 アドレスをビット表記に変換して表示する Chrome 拡張機能です。

このプロジェクトは [Plasmo extension](https://docs.plasmo.com/) フレームワークを使用して開発されています。

## 機能

- インタラクティブなホバーツールチップで、ウェブページ上のバイナリ表現を表示
- コンテキストメニュー連携で、選択テキストを素早く分析
- 特定アドレスを試せる手動入力ツール
- カラースキーム: 青ビット (`0`) と赤ビット (`1`)
- IPv6 (128 ビット) / IPv4 (32 ビット) をサポート
- 外部通信なしのオフライン動作

## 開発環境セットアップ

### 必要環境

- Volta (Node.js と pnpm の管理)
- Node.js 24.3.0
- pnpm 10.30.1

### 依存関係のインストール

```bash
pnpm install
```

### 開発サーバー起動

```bash
pnpm dev
```

Chrome (Manifest V3) 向け開発ビルドは `build/chrome-mv3-dev` に出力されます。

### ローカルから拡張機能を読み込む

1. `chrome://extensions/` を開く
2. `デベロッパーモード` を有効にする
3. `パッケージ化されていない拡張機能を読み込む` をクリック
4. `build/chrome-mv3-dev` を選択

## 開発メモ

- `src/popup.tsx`: ポップアップ UI
- `src/contents/plasmo.ts`: コンテンツスクリプト
- `src/utils/ipv6-converter.ts`: IPv6 変換ロジック
- `src/utils/bit-formatting.ts`: ビット整形ロジック
- `src/utils/tooltip-generator.ts`: ツールチップ HTML 生成
- `src/components/BitDisplay.tsx`: 共通ビット表示コンポーネント

変更はホットリロードされます。コンテンツスクリプト変更時は Chrome 側で拡張機能の再読み込みを行ってください。

## テスト

```bash
pnpm test
pnpm test:ui
```

## コード品質

```bash
pnpm lint
pnpm lint:fix
pnpm format
```

## 本番ビルド

署名付き CRX を作成:

```bash
pnpm build
pnpm package:crx
```

- `pnpm package:crx` は `tmp/privatekey.pem` を前提にします
- ZIP が必要な場合は `pnpm package:zip` も利用可能です

## ファイル構成

```text
src/
├── components/
│   └── BitDisplay.tsx            # 共通ビット表示コンポーネント
├── contents/
│   └── plasmo.ts                 # コンテンツスクリプト
├── utils/
│   ├── ipv6-converter.ts         # IPv6変換ロジック
│   ├── ipv6-converter.test.ts    # IPv6変換テスト
│   ├── ipv4-converter.ts         # IPv4変換ロジック
│   ├── ipv4-converter.test.ts    # IPv4変換テスト
│   ├── ip-address-common.ts      # IPv4/IPv6共通インターフェース
│   ├── ip-address-common.test.ts # 共通インターフェーステスト
│   ├── bit-formatting.ts         # ビット整形ロジック
│   ├── bit-formatting.test.ts    # ビット整形テスト
│   └── tooltip-generator.ts      # ツールチップHTML生成
├── test/
│   └── setup.ts                  # テストセットアップ
├── options.tsx                   # 設定ページUI
├── popup.tsx                     # ポップアップUI
└── extension-ui.css              # 拡張UIスタイル（popup/options）

store/                            # Chrome Web Store向けアセット
├── description.txt               # ストア説明文
├── icon.png                      # ストアアイコン
├── screenshot-popup.png          # ポップアップスクリーンショット
└── screenshot-tooltip.png        # ツールチップスクリーンショット
```

## 対応 IP アドレス形式

### IPv4

- 標準形式: `192.168.1.1`
- プライベート帯: `10.0.0.1`, `172.16.0.1`
- 特殊アドレス: `0.0.0.0`, `255.255.255.255`

### IPv6

- 完全形式: `2001:db8:85a3:0:0:8a2e:370:7334`
- 短縮形式: `2001:db8::1`
- ループバック: `::1`
- 未指定: `::`

## 技術スタック

- **Framework**: Plasmo v0.90.5
- **UI**: React + TypeScript
- **Style**: Plain CSS
- **Testing**: Vitest
- **Code quality**: Biome (linter + formatter)
- **表示方式**: ホバーツールチップ + 手動再スキャン
