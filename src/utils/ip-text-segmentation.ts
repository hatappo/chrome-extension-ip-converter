import ipRegex from "ip-regex";
import { detectAddressType } from "./ip-address-common";

type IPAddressType = "ipv4" | "ipv6";

interface TextSegment {
	kind: "text";
	value: string;
}

interface IPSegment {
	kind: "ip";
	value: string;
	addressType: IPAddressType;
}

export type IPTextSegment = TextSegment | IPSegment;

/**
 * テキストを「通常文字列」と「有効なIPアドレス」に分割する。
 * インデックスは元文字列基準で扱い、複数IPを含むケースでも順序を維持する。
 */
export function splitTextByIPAddresses(text: string): IPTextSegment[] {
	if (!text) {
		return [];
	}

	const ipPattern = ipRegex();
	const matches = Array.from(text.matchAll(new RegExp(ipPattern.source, "g")));
	if (matches.length === 0) {
		return [{ kind: "text", value: text }];
	}

	const segments: IPTextSegment[] = [];
	let lastIndex = 0;

	for (const match of matches) {
		const ipAddress = match[0];
		const startIndex = match.index ?? -1;
		if (startIndex < lastIndex || startIndex < 0) {
			continue;
		}

		const addressType = detectAddressType(ipAddress);
		if (addressType === "invalid") {
			continue;
		}

		if (startIndex > lastIndex) {
			segments.push({ kind: "text", value: text.slice(lastIndex, startIndex) });
		}

		segments.push({ kind: "ip", value: ipAddress, addressType });
		lastIndex = startIndex + ipAddress.length;
	}

	if (lastIndex < text.length) {
		segments.push({ kind: "text", value: text.slice(lastIndex) });
	}

	if (!segments.some((segment) => segment.kind === "ip")) {
		return [{ kind: "text", value: text }];
	}

	return segments;
}
