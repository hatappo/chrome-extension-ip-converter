import type { AddressType } from "./ip-address-common";
import { normalizeIPv6 } from "./ipv6-converter";

export interface FormatSegment {
	index: number;
	decimal: string;
	hex: string;
	binary: string;
}

export interface MultiFormatInfo {
	segments: FormatSegment[];
	segmentType: "octet" | "hextet";
	ipv4MappedSegments?: FormatSegment[];
}

/**
 * Convert an IPv4 address into multi-format segments (4 octets).
 */
export function ipv4ToMultiFormat(address: string): FormatSegment[] {
	return address.split(".").map((octet, i) => {
		const value = parseInt(octet, 10);
		return {
			index: i + 1,
			decimal: String(value),
			hex: value.toString(16).padStart(2, "0"),
			binary: value.toString(2).padStart(8, "0"),
		};
	});
}

/**
 * Convert an IPv4 address to its IPv4-mapped IPv6 multi-format (8 hextets).
 */
export function ipv4ToMappedIPv6MultiFormat(address: string): FormatSegment[] {
	const octets = address.split(".").map((o) => parseInt(o, 10));
	const hex1 = ((octets[0] << 8) | octets[1]).toString(16).padStart(4, "0");
	const hex2 = ((octets[2] << 8) | octets[3]).toString(16).padStart(4, "0");
	const mapped = `0000:0000:0000:0000:0000:ffff:${hex1}:${hex2}`;
	return ipv6NormalizedToMultiFormat(mapped);
}

/**
 * Convert a normalized (expanded) IPv6 address into multi-format segments (8 hextets).
 */
function ipv6NormalizedToMultiFormat(normalized: string): FormatSegment[] {
	return normalized.split(":").map((hextet, i) => {
		const value = parseInt(hextet, 16);
		return {
			index: i + 1,
			decimal: String(value),
			hex: hextet.toLowerCase(),
			binary: value.toString(2).padStart(16, "0"),
		};
	});
}

/**
 * Convert an IPv6 address into multi-format segments (8 hextets).
 */
export function ipv6ToMultiFormat(address: string): FormatSegment[] {
	const normalized = normalizeIPv6(address);
	return ipv6NormalizedToMultiFormat(normalized);
}

/**
 * Unified entry point for multi-format info.
 * For IPv4, also includes the IPv4-mapped IPv6 representation.
 */
export function getMultiFormatInfo(address: string, addressType: AddressType): MultiFormatInfo | null {
	if (addressType === "ipv4") {
		return {
			segments: ipv4ToMultiFormat(address),
			segmentType: "octet",
			ipv4MappedSegments: ipv4ToMappedIPv6MultiFormat(address),
		};
	}

	if (addressType === "ipv6") {
		return {
			segments: ipv6ToMultiFormat(address),
			segmentType: "hextet",
		};
	}

	return null;
}
