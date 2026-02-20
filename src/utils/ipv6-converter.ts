import ipRegex from "ip-regex";

// IPv6 regex pattern (ip-regex package, exact match)
export const IPV6_PATTERN = ipRegex.v6({ exact: true });

/**
 * Normalize an IPv6 address
 * - Expand ::
 * - Pad each segment to 4 digits
 */
export function normalizeIPv6(ipv6: string): string {
	// Handle ::
	if (ipv6.includes("::")) {
		const parts = ipv6.split("::");
		const leftParts = parts[0] ? parts[0].split(":") : [];
		const rightParts = parts[1] ? parts[1].split(":") : [];

		const missingParts = 8 - leftParts.length - rightParts.length;
		const middleParts = Array(missingParts).fill("0000");

		const allParts = [...leftParts, ...middleParts, ...rightParts];
		return allParts.map((part) => part.padStart(4, "0")).join(":");
	}

	// Pad each segment to 4 digits
	return ipv6
		.split(":")
		.map((segment) => segment.padStart(4, "0"))
		.join(":");
}

/**
 * Convert IPv6 address from hexadecimal to bit notation
 */
export function ipv6ToBits(ipv6: string): string {
	try {
		// Normalize IPv6 address
		const normalized = normalizeIPv6(ipv6);

		// Convert each hexadecimal segment to bit notation
		const segments = normalized.split(":");
		const binarySegments = segments.map((segment) => {
			return parseInt(segment, 16).toString(2).padStart(16, "0");
		});

		return binarySegments.join(":");
	} catch (error) {
		console.error("IPv6 to bits conversion error:", error);
		return ipv6;
	}
}

/**
 * Check whether IPv6 address is valid
 */
export function isValidIPv6(ipv6: string): boolean {
	if (!ipv6 || typeof ipv6 !== "string") {
		return false;
	}
	return IPV6_PATTERN.test(ipv6.trim());
}
