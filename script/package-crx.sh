#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
KEY_PATH="$ROOT_DIR/tmp/privatekey.pem"
EXTENSION_DIR="$ROOT_DIR/build/chrome-mv3-prod"
CHROME_BIN="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

if [ ! -f "$KEY_PATH" ]; then
	echo "Error: private key not found at $KEY_PATH" >&2
	exit 1
fi

if [ ! -x "$CHROME_BIN" ]; then
	echo "Error: Chrome binary not found at $CHROME_BIN" >&2
	exit 1
fi

if [ ! -d "$EXTENSION_DIR" ]; then
	echo "Error: build output not found at $EXTENSION_DIR" >&2
	exit 1
fi

"$CHROME_BIN" --pack-extension="$EXTENSION_DIR" --pack-extension-key="$KEY_PATH"
