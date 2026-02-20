// Shared utility functions for bit display

export interface BitDisplayLine {
	lineNumber: number;
	bits: string;
}

/**
 * Split an IPv6 bit string into 4 lines of 32 bits each
 * IPv4 is handled the same way as an IPv4-mapped IPv6 address
 */
export function formatBitsToLines(bits: string): BitDisplayLine[] {
	const segments = bits.split(":");
	const binaryString = segments.join("");

	const lines: BitDisplayLine[] = [];
	for (let i = 0; i < 4; i++) {
		const start = i * 32;
		const end = start + 32;
		lines.push({
			lineNumber: (i + 1) * 32,
			bits: binaryString.slice(start, end),
		});
	}

	return lines;
}

/**
 * Return color CSS class for the given bit value
 */
export function getBitColorClass(bit: string): string {
	return bit === "0" ? "ipv6-bit-zero" : bit === "1" ? "ipv6-bit-one" : "";
}

/**
 * Add a space every 8 bits in a bit string
 */
export function addSpacingToBits(bits: string): string {
	return bits
		.split("")
		.map((bit, index) => {
			if ((index + 1) % 8 === 0 && index < bits.length - 1) {
				return `${bit} `;
			}
			return bit;
		})
		.join("");
}
