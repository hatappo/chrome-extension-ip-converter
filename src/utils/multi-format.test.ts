import { describe, expect, it } from "vitest";
import { getMultiFormatInfo, ipv4ToMappedIPv6MultiFormat, ipv4ToMultiFormat, ipv6ToMultiFormat } from "./multi-format";

describe("ipv4ToMultiFormat", () => {
	it("converts 192.168.1.1 to 4 octets", () => {
		const result = ipv4ToMultiFormat("192.168.1.1");
		expect(result).toHaveLength(4);
		expect(result[0]).toEqual({ index: 1, decimal: "192", hex: "c0", binary: "11000000" });
		expect(result[1]).toEqual({ index: 2, decimal: "168", hex: "a8", binary: "10101000" });
		expect(result[2]).toEqual({ index: 3, decimal: "1", hex: "01", binary: "00000001" });
		expect(result[3]).toEqual({ index: 4, decimal: "1", hex: "01", binary: "00000001" });
	});

	it("converts 0.0.0.0", () => {
		const result = ipv4ToMultiFormat("0.0.0.0");
		expect(result[0]).toEqual({ index: 1, decimal: "0", hex: "00", binary: "00000000" });
	});

	it("converts 255.255.255.255", () => {
		const result = ipv4ToMultiFormat("255.255.255.255");
		expect(result[0]).toEqual({ index: 1, decimal: "255", hex: "ff", binary: "11111111" });
	});
});

describe("ipv6ToMultiFormat", () => {
	it("converts ::1 to 8 hextets", () => {
		const result = ipv6ToMultiFormat("::1");
		expect(result).toHaveLength(8);
		expect(result[7]).toEqual({ index: 8, decimal: "1", hex: "0001", binary: "0000000000000001" });
		expect(result[0]).toEqual({ index: 1, decimal: "0", hex: "0000", binary: "0000000000000000" });
	});

	it("converts 2001:db8::1", () => {
		const result = ipv6ToMultiFormat("2001:db8::1");
		expect(result[0]).toEqual({ index: 1, decimal: "8193", hex: "2001", binary: "0010000000000001" });
		expect(result[1]).toEqual({ index: 2, decimal: "3512", hex: "0db8", binary: "0000110110111000" });
	});
});

describe("ipv4ToMappedIPv6MultiFormat", () => {
	it("maps 192.168.1.1 to IPv4-mapped IPv6 hextets", () => {
		const result = ipv4ToMappedIPv6MultiFormat("192.168.1.1");
		expect(result).toHaveLength(8);
		// ::ffff segment
		expect(result[5].hex).toBe("ffff");
		expect(result[5].decimal).toBe("65535");
		// Last two segments encode IPv4
		expect(result[6].hex).toBe("c0a8");
		expect(result[6].decimal).toBe("49320");
		expect(result[7].hex).toBe("0101");
		expect(result[7].decimal).toBe("257");
	});
});

describe("getMultiFormatInfo", () => {
	it("returns octet segments for IPv4 with IPv4-mapped", () => {
		const result = getMultiFormatInfo("10.0.0.1", "ipv4");
		expect(result).not.toBeNull();
		expect(result?.segmentType).toBe("octet");
		expect(result?.segments).toHaveLength(4);
		expect(result?.ipv4MappedSegments).toHaveLength(8);
	});

	it("returns hextet segments for IPv6 without mapped", () => {
		const result = getMultiFormatInfo("2001:db8::1", "ipv6");
		expect(result).not.toBeNull();
		expect(result?.segmentType).toBe("hextet");
		expect(result?.segments).toHaveLength(8);
		expect(result?.ipv4MappedSegments).toBeUndefined();
	});

	it("returns null for invalid", () => {
		expect(getMultiFormatInfo("bad", "invalid")).toBeNull();
	});
});
