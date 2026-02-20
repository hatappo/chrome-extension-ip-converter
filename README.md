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
- `src/contents/plasmo.ts`: content script
- `src/utils/ipv6-converter.ts`: IPv6 conversion logic
- `src/utils/bit-formatting.ts`: shared bit formatting logic
- `src/utils/tooltip-generator.ts`: tooltip HTML generation
- `src/components/BitDisplay.tsx`: shared bit display component

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
│   └── BitDisplay.tsx            # Shared bit display component
├── contents/
│   └── plasmo.ts                 # Content script
├── utils/
│   ├── ipv6-converter.ts         # IPv6 conversion logic
│   ├── ipv6-converter.test.ts    # IPv6 conversion tests
│   ├── ipv4-converter.ts         # IPv4 conversion logic
│   ├── ipv4-converter.test.ts    # IPv4 conversion tests
│   ├── ip-address-common.ts      # Shared IPv4/IPv6 interface
│   ├── ip-address-common.test.ts # Shared interface tests
│   ├── bit-formatting.ts         # Shared bit formatting logic
│   ├── bit-formatting.test.ts    # Bit formatting tests
│   └── tooltip-generator.ts      # Tooltip HTML generation
├── test/
│   └── setup.ts                  # Test setup
├── options.tsx                   # Options UI
├── popup.tsx                     # Popup UI
└── extension-ui.css              # Extension UI styles (popup/options)

store/                            # Chrome Web Store assets
├── description.txt               # Store description
├── icon.png                      # Store icon
├── screenshot-popup.png          # Popup screenshot
└── screenshot-tooltip.png        # Tooltip screenshot
```

## Supported IP Address Formats

### IPv4

- Standard: `192.168.1.1`
- Private ranges: `10.0.0.1`, `172.16.0.1`
- Special addresses: `0.0.0.0`, `255.255.255.255`

### IPv6

- Full form: `2001:db8:85a3:0:0:8a2e:370:7334`
- Shortened form: `2001:db8::1`
- Loopback: `::1`
- Unspecified: `::`

## Tech Stack

- **Framework**: Plasmo v0.90.5
- **UI**: React + TypeScript
- **Styling**: Plain CSS
- **Testing**: Vitest
- **Code quality**: Biome (linter + formatter)
- **Display mode**: Hover tooltip + manual re-scan
