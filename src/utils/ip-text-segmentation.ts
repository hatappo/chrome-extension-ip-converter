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
 * Split text into "plain text" and "valid IP address" segments.
 * Indices are based on the original string and order is preserved even with multiple IPs.
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
