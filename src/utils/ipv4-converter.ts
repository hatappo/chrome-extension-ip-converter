import ipRegex from "ip-regex";

// IPv4 regex pattern (ip-regex package)
export const IPV4_PATTERN = ipRegex.v4({ exact: true });

/**
 * Validate IPv4 address
 * @param address - Address string to validate
 * @returns true if the address is a valid IPv4 address
 */
export function isValidIPv4(address: string): boolean {
	if (!address || typeof address !== "string") {
		return false;
	}
	return IPV4_PATTERN.test(address.trim());
}

/**
 * Convert IPv4 address to bit notation
 * @param ipv4 - IPv4 address string
 * @returns 32-bit binary string (without colon separators)
 */
export function ipv4ToBits(ipv4: string): string {
	const trimmed = ipv4.trim();
	if (!isValidIPv4(trimmed)) {
		throw new Error("Invalid IPv4 address");
	}

	const octets = trimmed.split(".");
	const bits = octets.map((octet) => {
		const num = parseInt(octet, 10);
		return num.toString(2).padStart(8, "0");
	});

	// Return 32 bits (fits into the first line in IPv6-style display)
	return bits.join("");
}
