<p align="center"><sub><a href="./README.md">en</a> | <a href="./README_ja.md">ja</a></sub></p>

# IP Address Converter

A Chrome extension that converts IPv4/IPv6 addresses into binary notation and displays them on web pages.

This project is built with the [Plasmo extension](https://docs.plasmo.com/) framework.

## Features

- Interactive hover tooltip to show binary representations on any web page
- Context menu integration for quick analysis of selected text
- Manual input tool to test specific addresses
- Color coding: blue bits (`0`) and red bits (`1`)
- Full support for IPv6 (128-bit) and IPv4 (32-bit)
- CIDR notation support with network/host bit visualization
- IP classification badges (Private, Public, Loopback, etc.)
- IPv6 normalization toggle (compressed / expanded)
- Multi-format display (decimal / hex / binary) with IPv4-mapped IPv6
- Privacy-first: fully offline with no external network calls

## Development Setup

### Requirements

- Volta (to manage Node.js and pnpm)
- Node.js 24.3.0
- pnpm 10.30.1

### Install dependencies

```bash
pnpm install
```

### Start development server

```bash
pnpm dev
```

Then load the Chrome Manifest V3 dev build at `build/chrome-mv3-dev`.

### Load extension from local build

1. Open `chrome://extensions/`
2. Enable `Developer mode`
3. Click `Load unpacked`
4. Select `build/chrome-mv3-dev`

## Development Notes

- `src/popup.tsx`: popup UI
- `src/contents/plasmo.ts`: content script (tooltip, scan, context menu)
- `src/utils/ipv6-converter.ts`: IPv6 conversion and normalization
- `src/utils/ipv4-classifier.ts`: IPv4 address classification
- `src/utils/ipv6-classifier.ts`: IPv6 address classification
- `src/utils/ip-classifier.ts`: unified classification with badge types
- `src/utils/cidr-parser.ts`: CIDR notation parser
- `src/utils/multi-format.ts`: multi-format (decimal/hex/binary) conversion
- `src/utils/bit-formatting.ts`: shared bit formatting logic
- `src/components/BitDisplay.tsx`: shared bit display component
- `src/components/IPBadge.tsx`: IP classification badge component
- `src/components/MultiFormatTable.tsx`: multi-format table component

Changes are hot-reloaded. If you edit content scripts, reload the extension in Chrome.

## Testing

```bash
pnpm test
pnpm test:ui
```

## Code Quality

```bash
pnpm lint
pnpm lint:fix
pnpm format
```

## Production Build

Create a signed CRX package:

```bash
pnpm build
pnpm package:crx
```

- `pnpm package:crx` expects `tmp/privatekey.pem`
- Optional ZIP packaging is available with `pnpm package:zip`

## File Structure

```text
src/
├── components/
│   ├── BitDisplay.tsx            # Shared bit display component
│   ├── IPBadge.tsx               # IP classification badge
│   └── MultiFormatTable.tsx      # Multi-format table component
├── contents/
│   ├── plasmo.ts                 # Content script
│   └── content-style.css         # Content script styles
├── hooks/
│   └── useCopyToClipboard.ts     # Clipboard hook
├── utils/
│   ├── ipv6-converter.ts         # IPv6 conversion / normalization
│   ├── ipv4-converter.ts         # IPv4 conversion logic
│   ├── ipv6-classifier.ts        # IPv6 address classification
│   ├── ipv4-classifier.ts        # IPv4 address classification
│   ├── ip-classifier.ts          # Unified classification + badge
│   ├── cidr-parser.ts            # CIDR notation parser
│   ├── multi-format.ts           # Multi-format conversion
│   ├── ip-address-common.ts      # Shared IPv4/IPv6 interface
│   ├── ip-text-segmentation.ts   # IP detection in page text
│   └── bit-formatting.ts         # Shared bit formatting logic
├── test/
│   └── setup.ts                  # Test setup
├── background.ts                 # Service worker
├── options.tsx                   # Options UI
├── popup.tsx                     # Popup UI
└── extension-ui.css              # Extension UI styles

store/                            # Chrome Web Store assets
├── description.txt               # Store description
├── icon.png                      # Store icon
├── screenshot-popup.png          # Popup screenshot
└── screenshot-tooltip.png        # Tooltip screenshot
```

## Supported IP Address Formats

### IPv4

- Standard: `192.168.1.1`
- CIDR notation: `192.168.0.0/24`
- Special addresses: `0.0.0.0`, `255.255.255.255`

### IPv6

- Full form: `2001:db8:85a3:0:0:8a2e:370:7334`
- Shortened form: `2001:db8::1`
- CIDR notation: `2001:db8::/32`
- Loopback: `::1`
- Unspecified: `::`

## Classification Badges

Each address is automatically classified and shown with a colored badge.

| Badge | IPv4 Range | IPv6 Range |
|---|---|---|
| **Private** | `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16` (RFC 1918) | `fc00::/7` (Unique Local) |
| **Public** | All other routable addresses | `2000::/3` (Global Unicast) |
| **Loopback** | `127.0.0.0/8` | `::1/128` |
| **Link-Local** | `169.254.0.0/16` | `fe80::/10` |
| **Multicast** | `224.0.0.0/4` | `ff00::/8` |
| **Reserved** | `0.0.0.0/8`, `240.0.0.0/4` | Unspecified (`::`), IPv4-Mapped (`::ffff:0:0/96`) |

## Address Type Descriptions

Detailed descriptions are shown alongside the badge.

### IPv4

| Type | Description |
|---|---|
| Loopback Address | Points to itself (127.0.0.0/8) |
| Link-Local Address | Auto-configured link-local (169.254.0.0/16) |
| Private Address | RFC 1918 private network |
| Public Address | Routable on the Internet |
| Multicast Address | Multicast (224.0.0.0/4) |
| Reserved Address | Current network (0/8) or future use (240/4) |

### IPv6

| Type | Description |
|---|---|
| Global Unicast Address | Routable on the Internet |
| Link-Local Address | Valid only within the same link |
| Unique Local Address | For private networks |
| Multicast Address | Multicast |
| Loopback Address | Points to itself |
| Unspecified Address | Address not yet assigned |
| IPv4-Mapped Address | IPv4 address embedded in IPv6 |

## Tech Stack

- **Framework**: Plasmo v0.90.5
- **UI**: React + TypeScript
- **Styling**: Plain CSS
- **Testing**: Vitest
- **Code quality**: Biome (linter + formatter)
- **Display mode**: Hover tooltip + manual re-scan
