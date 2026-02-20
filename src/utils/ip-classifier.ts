import type { AddressType } from "./ip-address-common";
import { classifyIPv4 } from "./ipv4-classifier";
import { classifyIPv6 } from "./ipv6-classifier";
import { normalizeIPv6 } from "./ipv6-converter";

export type BadgeType = "Private" | "Public" | "Loopback" | "Link-Local" | "Reserved" | "Multicast";

export interface IPClassification {
	type: string;
	description: string;
	badge: BadgeType;
}

function badgeFromLabel(label: string): BadgeType {
	const l = label.toLowerCase();
	if (l.includes("loopback")) return "Loopback";
	if (l.includes("link-local")) return "Link-Local";
	if (l.includes("private") || l.includes("unique local")) return "Private";
	if (l.includes("public") || l.includes("global unicast")) return "Public";
	if (l.includes("multicast")) return "Multicast";
	return "Reserved";
}

/**
 * Unified IP classification for both IPv4 and IPv6
 */
export function classifyIP(
	address: string,
	addressType: AddressType,
	normalizedIPv6?: string,
): IPClassification | null {
	if (addressType === "ipv4") {
		const result = classifyIPv4(address);
		if (!result) return null;
		return { ...result, badge: badgeFromLabel(result.type) };
	}

	if (addressType === "ipv6") {
		const normalized = normalizedIPv6 || normalizeIPv6(address);
		const result = classifyIPv6(normalized);
		if (!result) return null;

		// For IPv4-Mapped addresses, classify based on the embedded IPv4
		if (result.type.includes("IPv4")) {
			return { ...result, badge: "Reserved" };
		}

		return { ...result, badge: badgeFromLabel(result.type) };
	}

	return null;
}
