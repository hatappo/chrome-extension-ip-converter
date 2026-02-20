import { describe, expect, it } from "vitest";
import { formatBitsToLines } from "./bit-formatting";

describe("formatBitsToLines - IPv4", () => {
	it("IPv4射影アドレス形式のビット文字列を正しく4行に分割する", () => {
		// IPv4-mapped format: first 80 bits (5 segments) are 0, next 16 bits are 1, last 32 bits are IPv4
		const ipv4Bits =
			"0000000000000000:0000000000000000:0000000000000000:0000000000000000:0000000000000000:1111111111111111:1100000010101000:0000000100000001";
		const lines = formatBitsToLines(ipv4Bits);

		expect(lines).toHaveLength(4);

		// Line 1: first 32 bits (all 0)
		expect(lines[0].lineNumber).toBe(32);
		expect(lines[0].bits).toBe("00000000000000000000000000000000");

		// Line 2: next 32 bits (all 0)
		expect(lines[1].lineNumber).toBe(64);
		expect(lines[1].bits).toBe("00000000000000000000000000000000");

		// Line 3: 0 up to bit 80, then 1 up to bit 96
		expect(lines[2].lineNumber).toBe(96);
		expect(lines[2].bits).toBe("00000000000000001111111111111111");

		// Line 4: IPv4 address part
		expect(lines[3].lineNumber).toBe(128);
		expect(lines[3].bits).toBe("11000000101010000000000100000001");
	});

	it("IPv4の単純なケース（1.1.1.1）", () => {
		const ipv4Bits =
			"0000000000000000:0000000000000000:0000000000000000:0000000000000000:0000000000000000:1111111111111111:0000000100000001:0000000100000001";
		const lines = formatBitsToLines(ipv4Bits);

		// IPv4 address appears on the last line
		expect(lines[3].bits).toBe("00000001000000010000000100000001");
	});
});
