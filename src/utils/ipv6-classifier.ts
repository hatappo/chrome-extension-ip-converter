export interface IPv6Classification {
	type: string;
	description: string;
}

const IPv6_CLASSIFICATIONS = [
	{
		prefix: "2000::/3",
		type: "Global Unicast Address",
		description: "Routable on the Internet",
		check: (normalized: string) => {
			const firstHex = parseInt(normalized.substring(0, 1), 16);
			return firstHex >= 2 && firstHex <= 3;
		},
	},
	{
		prefix: "fe80::/10",
		type: "Link-Local Address",
		description: "Valid only within the same link",
		check: (normalized: string) => {
			const firstSegment = normalized.substring(0, 4);
			const value = parseInt(firstSegment, 16);
			return value >= 0xfe80 && value <= 0xfebf;
		},
	},
	{
		prefix: "fc00::/7",
		type: "Unique Local Address",
		description: "For private networks",
		check: (normalized: string) => {
			const firstByte = parseInt(normalized.substring(0, 2), 16);
			return firstByte >= 0xfc && firstByte <= 0xfd;
		},
	},
	{
		prefix: "ff00::/8",
		type: "Multicast Address",
		description: "",
		check: (normalized: string) => {
			return normalized.substring(0, 2).toLowerCase() === "ff";
		},
	},
	{
		prefix: "::1/128",
		type: "Loopback Address",
		description: "Points to itself",
		check: (normalized: string) => {
			return normalized === "0000:0000:0000:0000:0000:0000:0000:0001" || normalized === "::1";
		},
	},
	{
		prefix: "::/128",
		type: "Unspecified Address",
		description: "Address not yet assigned",
		check: (normalized: string) => {
			return normalized === "0000:0000:0000:0000:0000:0000:0000:0000" || normalized === "::";
		},
	},
	{
		prefix: "::ffff:0:0/96",
		type: "IPv4 Address / IPv4-Mapped Address",
		description: "For IPv4, the 32 bits in line 4 represent this",
		check: (normalized: string) => {
			const segments = normalized.split(":");
			return (
				segments[0] === "0000" &&
				segments[1] === "0000" &&
				segments[2] === "0000" &&
				segments[3] === "0000" &&
				segments[4] === "0000" &&
				segments[5] === "ffff"
			);
		},
	},
];

/**
 * Classify a normalized IPv6 address
 */
export function classifyIPv6(normalizedIPv6: string): IPv6Classification | null {
	for (const classification of IPv6_CLASSIFICATIONS) {
		if (classification.check(normalizedIPv6)) {
			return {
				type: classification.type,
				description: classification.description,
			};
		}
	}
	return null;
}
