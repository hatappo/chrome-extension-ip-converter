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
- CIDR 記法対応 — ネットワーク部/ホスト部のビット色分け
- IP 分類バッジ (Private, Public, Loopback 等)
- IPv6 正規化トグル (圧縮形式 / 展開形式)
- マルチフォーマット表示 (10進 / 16進 / 2進) + IPv4-Mapped IPv6
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
- `src/contents/plasmo.ts`: コンテンツスクリプト (ツールチップ、スキャン、コンテキストメニュー)
- `src/utils/ipv6-converter.ts`: IPv6 変換・正規化ロジック
- `src/utils/ipv4-classifier.ts`: IPv4 アドレス分類
- `src/utils/ipv6-classifier.ts`: IPv6 アドレス分類
- `src/utils/ip-classifier.ts`: 統一分類 + バッジ型
- `src/utils/cidr-parser.ts`: CIDR 記法パーサー
- `src/utils/multi-format.ts`: マルチフォーマット変換 (10進/16進/2進)
- `src/utils/bit-formatting.ts`: ビット整形ロジック
- `src/components/BitDisplay.tsx`: 共通ビット表示コンポーネント
- `src/components/IPBadge.tsx`: IP 分類バッジコンポーネント
- `src/components/MultiFormatTable.tsx`: マルチフォーマットテーブルコンポーネント

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
│   ├── BitDisplay.tsx            # 共通ビット表示コンポーネント
│   ├── IPBadge.tsx               # IP分類バッジ
│   └── MultiFormatTable.tsx      # マルチフォーマットテーブル
├── contents/
│   ├── plasmo.ts                 # コンテンツスクリプト
│   └── content-style.css         # コンテンツスクリプトスタイル
├── hooks/
│   └── useCopyToClipboard.ts     # クリップボードフック
├── utils/
│   ├── ipv6-converter.ts         # IPv6変換・正規化
│   ├── ipv4-converter.ts         # IPv4変換ロジック
│   ├── ipv6-classifier.ts        # IPv6アドレス分類
│   ├── ipv4-classifier.ts        # IPv4アドレス分類
│   ├── ip-classifier.ts          # 統一分類 + バッジ
│   ├── cidr-parser.ts            # CIDRパーサー
│   ├── multi-format.ts           # マルチフォーマット変換
│   ├── ip-address-common.ts      # IPv4/IPv6共通インターフェース
│   ├── ip-text-segmentation.ts   # ページ内テキストのIP検出
│   └── bit-formatting.ts         # ビット整形ロジック
├── test/
│   └── setup.ts                  # テストセットアップ
├── background.ts                 # Service Worker
├── options.tsx                   # 設定ページUI
├── popup.tsx                     # ポップアップUI
└── extension-ui.css              # 拡張UIスタイル

store/                            # Chrome Web Store向けアセット
├── description.txt               # ストア説明文
├── icon.png                      # ストアアイコン
├── screenshot-popup.png          # ポップアップスクリーンショット
└── screenshot-tooltip.png        # ツールチップスクリーンショット
```

## 対応 IP アドレス形式

### IPv4

- 標準形式: `192.168.1.1`
- CIDR 記法: `192.168.0.0/24`
- 特殊アドレス: `0.0.0.0`, `255.255.255.255`

### IPv6

- 完全形式: `2001:db8:85a3:0:0:8a2e:370:7334`
- 短縮形式: `2001:db8::1`
- CIDR 記法: `2001:db8::/32`
- ループバック: `::1`
- 未指定: `::`

## 分類バッジ

各アドレスは自動的に分類され、色付きバッジで表示されます。

| バッジ | IPv4 範囲 | IPv6 範囲 |
|---|---|---|
| **Private** | `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16` (RFC 1918) | `fc00::/7` (ユニークローカル) |
| **Public** | その他のルーティング可能なアドレス | `2000::/3` (グローバルユニキャスト) |
| **Loopback** | `127.0.0.0/8` | `::1/128` |
| **Link-Local** | `169.254.0.0/16` | `fe80::/10` |
| **Multicast** | `224.0.0.0/4` | `ff00::/8` |
| **Reserved** | `0.0.0.0/8`, `240.0.0.0/4` | 未指定 (`::`), IPv4-Mapped (`::ffff:0:0/96`) |

## アドレス種別の説明

バッジとともに詳細な説明が表示されます。

### IPv4

| 種別 | 説明 |
|---|---|
| Loopback Address | 自身を指すアドレス (127.0.0.0/8) |
| Link-Local Address | 自動構成リンクローカル (169.254.0.0/16) |
| Private Address | RFC 1918 プライベートネットワーク |
| Public Address | インターネット上でルーティング可能 |
| Multicast Address | マルチキャスト (224.0.0.0/4) |
| Reserved Address | カレントネットワーク (0/8) または将来使用 (240/4) |

### IPv6

| 種別 | 説明 |
|---|---|
| Global Unicast Address | インターネット上でルーティング可能 |
| Link-Local Address | 同一リンク内でのみ有効 |
| Unique Local Address | プライベートネットワーク用 |
| Multicast Address | マルチキャスト |
| Loopback Address | 自身を指すアドレス |
| Unspecified Address | 未割り当てアドレス |
| IPv4-Mapped Address | IPv6 に埋め込まれた IPv4 アドレス |

## 技術スタック

- **Framework**: Plasmo v0.90.5
- **UI**: React + TypeScript
- **Style**: Plain CSS
- **Testing**: Vitest
- **Code quality**: Biome (linter + formatter)
- **表示方式**: ホバーツールチップ + 手動再スキャン
