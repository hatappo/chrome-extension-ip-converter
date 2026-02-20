import type { AddressType } from "./ip-address-common";
import { isValidIPv4 } from "./ipv4-converter";
import { isValidIPv6 } from "./ipv6-converter";

export interface CIDRInfo {
	address: string;
	prefixLength: number | null;
	addressType: AddressType;
}

/**
 * Parse CIDR notation (e.g. "192.168.1.0/24") into address and prefix length.
 * Returns addressType "invalid" if the address part is not a valid IP.
 */
export function parseCIDR(input: string): CIDRInfo {
	const trimmed = input.trim();
	const slashIndex = trimmed.lastIndexOf("/");

	if (slashIndex === -1) {
		if (isValidIPv4(trimmed)) return { address: trimmed, prefixLength: null, addressType: "ipv4" };
		if (isValidIPv6(trimmed)) return { address: trimmed, prefixLength: null, addressType: "ipv6" };
		return { address: trimmed, prefixLength: null, addressType: "invalid" };
	}

	const address = trimmed.substring(0, slashIndex);
	const prefixStr = trimmed.substring(slashIndex + 1);
	const prefixLength = Number.parseInt(prefixStr, 10);

	if (Number.isNaN(prefixLength) || prefixStr !== String(prefixLength)) {
		return { address: trimmed, prefixLength: null, addressType: "invalid" };
	}

	if (isValidIPv4(address)) {
		if (prefixLength < 0 || prefixLength > 32) {
			return { address, prefixLength: null, addressType: "invalid" };
		}
		return { address, prefixLength, addressType: "ipv4" };
	}

	if (isValidIPv6(address)) {
		if (prefixLength < 0 || prefixLength > 128) {
			return { address, prefixLength: null, addressType: "invalid" };
		}
		return { address, prefixLength, addressType: "ipv6" };
	}

	return { address, prefixLength: null, addressType: "invalid" };
}

/**
 * Convert a prefix length to 128-bit address space.
 * IPv4 /N becomes /(96+N) because IPv4 is mapped to the last 32 bits of 128-bit space.
 */
export function prefixLengthTo128BitSpace(prefixLength: number, addressType: AddressType): number {
	return addressType === "ipv4" ? 96 + prefixLength : prefixLength;
}
