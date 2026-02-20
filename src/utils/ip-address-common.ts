import { ipv4ToBits, isValidIPv4 } from "./ipv4-converter";
import { classifyIPv6, type IPv6Classification } from "./ipv6-classifier";
import { ipv6ToBits, isValidIPv6, normalizeIPv6 } from "./ipv6-converter";

export type AddressType = "ipv4" | "ipv6" | "invalid";

export interface IPInfo {
	address: string;
	type: AddressType;
	binary: string;
	classification?: IPv6Classification;
}

/**
 * Detect the IP address type
 * @param address - Address string to evaluate
 * @returns Address type
 */
export function detectAddressType(address: string): AddressType {
	if (!address || typeof address !== "string") {
		return "invalid";
	}

	const trimmed = address.trim();

	if (isValidIPv4(trimmed)) {
		return "ipv4";
	}

	if (isValidIPv6(trimmed)) {
		return "ipv6";
	}

	return "invalid";
}

/**
 * Shared IPv4/IPv6 validation function
 * @param address - Address string to validate
 * @returns true if the address is a valid IP address
 */
export function isValidIPAddress(address: string): boolean {
	return detectAddressType(address) !== "invalid";
}

/**
 * Shared IPv4/IPv6 conversion function
 * @param address - IP address string
 * @returns Bit notation string
 */
export function ipAddressToBits(address: string): string {
	const type = detectAddressType(address);

	switch (type) {
		case "ipv4": {
			// Convert IPv4 to IPv6 IPv4-mapped address bit representation
			// In ::ffff:x.x.x.x form, the first 96 bits are fixed and the last 32 bits are IPv4
			const ipv4Bits = ipv4ToBits(address.trim());
			// 96 bits of 0 (6 segments) + 32 bits of IPv4 (2 segments)
			const zeros = "0000000000000000"; // 16-bit zero
			const segment7 = ipv4Bits.substring(0, 16);
			const segment8 = ipv4Bits.substring(16, 32);
			return `${zeros}:${zeros}:${zeros}:${zeros}:${zeros}:1111111111111111:${segment7}:${segment8}`;
		}

		case "ipv6":
			return ipv6ToBits(address.trim());

		default:
			throw new Error("Invalid IP address");
	}
}

/**
 * Detect and convert an IP address
 * @param address - IP address string
 * @returns IPInfo object, or null when invalid
 */
export function detectAndConvertIP(address: string): IPInfo | null {
	const type = detectAddressType(address);

	if (type === "invalid") {
		return null;
	}

	try {
		const binary = ipAddressToBits(address);
		const trimmedAddress = address.trim();

		// For IPv4, convert to IPv4-mapped IPv6 form; for IPv6, normalize as-is
		let normalized: string;
		if (type === "ipv4") {
			// Convert IPv4 to IPv4-mapped IPv6 format
			const octets = trimmedAddress.split(".");
			const hex1 = (parseInt(octets[0]) * 256 + parseInt(octets[1])).toString(16).padStart(4, "0");
			const hex2 = (parseInt(octets[2]) * 256 + parseInt(octets[3])).toString(16).padStart(4, "0");
			normalized = `0000:0000:0000:0000:0000:ffff:${hex1}:${hex2}`;
		} else {
			normalized = normalizeIPv6(trimmedAddress);
		}

		const classification = classifyIPv6(normalized);

		return {
			address: trimmedAddress,
			type,
			binary,
			classification: classification || undefined,
		};
	} catch (_error) {
		return null;
	}
}
