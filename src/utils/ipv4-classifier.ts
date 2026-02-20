export interface IPv4Classification {
	type: string;
	description: string;
}

/**
 * Classify an IPv4 address by its range
 */
export function classifyIPv4(address: string): IPv4Classification | null {
	const octets = address.trim().split(".").map(Number);
	if (octets.length !== 4 || octets.some((o) => Number.isNaN(o))) return null;

	const [a, b] = octets;

	// Loopback: 127.0.0.0/8
	if (a === 127) {
		return { type: "Loopback Address", description: "Points to itself (127.0.0.0/8)" };
	}

	// Link-Local: 169.254.0.0/16
	if (a === 169 && b === 254) {
		return { type: "Link-Local Address", description: "Auto-configured link-local (169.254.0.0/16)" };
	}

	// Private: RFC 1918
	if (a === 10) {
		return { type: "Private Address", description: "RFC 1918 private network (10.0.0.0/8)" };
	}
	if (a === 172 && b >= 16 && b <= 31) {
		return { type: "Private Address", description: "RFC 1918 private network (172.16.0.0/12)" };
	}
	if (a === 192 && b === 168) {
		return { type: "Private Address", description: "RFC 1918 private network (192.168.0.0/16)" };
	}

	// Current network: 0.0.0.0/8
	if (a === 0) {
		return { type: "Reserved Address", description: "Current network (0.0.0.0/8)" };
	}

	// Multicast: 224.0.0.0/4
	if (a >= 224 && a <= 239) {
		return { type: "Multicast Address", description: "Multicast (224.0.0.0/4)" };
	}

	// Reserved: 240.0.0.0/4
	if (a >= 240) {
		return { type: "Reserved Address", description: "Reserved for future use (240.0.0.0/4)" };
	}

	// Public
	return { type: "Public Address", description: "Routable on the Internet" };
}
