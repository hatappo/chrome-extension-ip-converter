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
 * Compress a normalized IPv6 address per RFC 5952.
 * - Remove leading zeros from each group
 * - Replace the longest run of consecutive all-zero groups with ::
 * - If equal-length runs, use the first one
 * - A single zero group is NOT compressed
 */
export function compressIPv6(normalized: string): string {
	const groups = normalized.split(":").map((g) => g.replace(/^0+/, "") || "0");

	// Find the longest run of consecutive "0" groups
	let bestStart = -1;
	let bestLen = 0;
	let curStart = -1;
	let curLen = 0;

	for (let i = 0; i < groups.length; i++) {
		if (groups[i] === "0") {
			if (curStart === -1) {
				curStart = i;
				curLen = 1;
			} else {
				curLen++;
			}
			if (curLen > bestLen) {
				bestStart = curStart;
				bestLen = curLen;
			}
		} else {
			curStart = -1;
			curLen = 0;
		}
	}

	// Only compress if run length >= 2
	if (bestLen < 2) {
		return groups.join(":");
	}

	const left = groups.slice(0, bestStart).join(":");
	const right = groups.slice(bestStart + bestLen).join(":");

	if (left === "" && right === "") return "::";
	if (left === "") return `::${right}`;
	if (right === "") return `${left}::`;
	return `${left}::${right}`;
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
