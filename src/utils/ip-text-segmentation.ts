import ipRegex from "ip-regex";
import { parseCIDR } from "./cidr-parser";
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
 * Supports CIDR notation (e.g. "192.168.0.0/24").
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

		// Check if followed by CIDR prefix (e.g. /24)
		let fullMatch = ipAddress;
		const afterIp = startIndex + ipAddress.length;
		const remaining = text.slice(afterIp);
		const cidrSuffix = remaining.match(/^\/(\d{1,3})/);
		if (cidrSuffix) {
			const candidate = `${ipAddress}${cidrSuffix[0]}`;
			const parsed = parseCIDR(candidate);
			if (parsed.addressType !== "invalid") {
				fullMatch = candidate;
			}
		}

		if (startIndex > lastIndex) {
			segments.push({ kind: "text", value: text.slice(lastIndex, startIndex) });
		}

		segments.push({ kind: "ip", value: fullMatch, addressType });
		lastIndex = startIndex + fullMatch.length;
	}

	if (lastIndex < text.length) {
		segments.push({ kind: "text", value: text.slice(lastIndex) });
	}

	if (!segments.some((segment) => segment.kind === "ip")) {
		return [{ kind: "text", value: text }];
	}

	return segments;
}
