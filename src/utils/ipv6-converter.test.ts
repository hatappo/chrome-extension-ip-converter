import { describe, expect, it } from "vitest";
import { compressIPv6, IPV6_PATTERN, ipv6ToBits, isValidIPv6, normalizeIPv6 } from "./ipv6-converter";

describe("IPv6 Converter", () => {
	describe("normalizeIPv6", () => {
		it("should normalize full IPv6 address", () => {
			const result = normalizeIPv6("2001:db8:85a3:0:0:8a2e:370:7334");
			expect(result).toBe("2001:0db8:85a3:0000:0000:8a2e:0370:7334");
		});

		it("should expand :: notation", () => {
			const result = normalizeIPv6("2001:db8::1");
			expect(result).toBe("2001:0db8:0000:0000:0000:0000:0000:0001");
		});

		it("should handle :: at the beginning", () => {
			const result = normalizeIPv6("::1");
			expect(result).toBe("0000:0000:0000:0000:0000:0000:0000:0001");
		});

		it("should handle :: at the end", () => {
			const result = normalizeIPv6("2001:db8::");
			expect(result).toBe("2001:0db8:0000:0000:0000:0000:0000:0000");
		});

		it("should handle single :: (all zeros)", () => {
			const result = normalizeIPv6("::");
			expect(result).toBe("0000:0000:0000:0000:0000:0000:0000:0000");
		});

		it("should handle :: in the middle with trailing segments", () => {
			const result = normalizeIPv6("2001:0db8:0000:0000:3456::");
			expect(result).toBe("2001:0db8:0000:0000:3456:0000:0000:0000");
		});

		it("should handle :: in the middle with leading segments", () => {
			const result = normalizeIPv6("2001:0db8::3456:0000:0000:0000");
			expect(result).toBe("2001:0db8:0000:0000:3456:0000:0000:0000");
		});
	});

	describe("ipv6ToBits", () => {
		it("should convert IPv6 to binary representation", () => {
			const result = ipv6ToBits("2001:db8::1");
			expect(result).toBe(
				"0010000000000001:0000110110111000:0000000000000000:0000000000000000:0000000000000000:0000000000000000:0000000000000000:0000000000000001",
			);
		});

		it("should convert loopback address", () => {
			const result = ipv6ToBits("::1");
			expect(result).toBe(
				"0000000000000000:0000000000000000:0000000000000000:0000000000000000:0000000000000000:0000000000000000:0000000000000000:0000000000000001",
			);
		});

		it("should convert all zeros", () => {
			const result = ipv6ToBits("::");
			expect(result).toBe(
				"0000000000000000:0000000000000000:0000000000000000:0000000000000000:0000000000000000:0000000000000000:0000000000000000:0000000000000000",
			);
		});

		it("should handle full IPv6 address", () => {
			const result = ipv6ToBits("2001:db8:85a3:0:0:8a2e:370:7334");
			expect(result).toBe(
				"0010000000000001:0000110110111000:1000010110100011:0000000000000000:0000000000000000:1000101000101110:0000001101110000:0111001100110100",
			);
		});

		it("should convert trailing :: notation", () => {
			const result = ipv6ToBits("2001:0db8:0000:0000:3456::");
			expect(result).toBe(
				"0010000000000001:0000110110111000:0000000000000000:0000000000000000:0011010001010110:0000000000000000:0000000000000000:0000000000000000",
			);
		});

		it("should convert :: in the middle with trailing zeros", () => {
			const result = ipv6ToBits("2001:0db8::3456:0000:0000:0000");
			expect(result).toBe(
				"0010000000000001:0000110110111000:0000000000000000:0000000000000000:0011010001010110:0000000000000000:0000000000000000:0000000000000000",
			);
		});
	});

	describe("compressIPv6", () => {
		it("should compress all-zeros to ::", () => {
			expect(compressIPv6("0000:0000:0000:0000:0000:0000:0000:0000")).toBe("::");
		});

		it("should compress loopback to ::1", () => {
			expect(compressIPv6("0000:0000:0000:0000:0000:0000:0000:0001")).toBe("::1");
		});

		it("should compress longest zero run", () => {
			expect(compressIPv6("2001:0db8:0000:0000:0000:0000:0000:0001")).toBe("2001:db8::1");
		});

		it("should compress trailing zeros", () => {
			expect(compressIPv6("2001:0db8:0000:0000:0000:0000:0000:0000")).toBe("2001:db8::");
		});

		it("should prefer first run when equal length", () => {
			// 2001:0:0:1:0:0:0:1 — two runs of 2 and 3, pick the run of 3
			expect(compressIPv6("2001:0000:0000:0001:0000:0000:0000:0001")).toBe("2001:0:0:1::1");
		});

		it("should not compress single zero groups", () => {
			expect(compressIPv6("2001:0db8:0000:0001:0000:0001:0000:0001")).toBe("2001:db8:0:1:0:1:0:1");
		});

		it("should remove leading zeros from each group", () => {
			expect(compressIPv6("2001:0db8:85a3:0000:0000:8a2e:0370:7334")).toBe("2001:db8:85a3::8a2e:370:7334");
		});

		it("should handle fe80::1", () => {
			expect(compressIPv6("fe80:0000:0000:0000:0000:0000:0000:0001")).toBe("fe80::1");
		});
	});

	describe("isValidIPv6", () => {
		it("should return true for valid IPv6 addresses", () => {
			expect(isValidIPv6("2001:db8::1")).toBe(true);
			expect(isValidIPv6("::1")).toBe(true);
			expect(isValidIPv6("::")).toBe(true);
			expect(isValidIPv6("2001:db8:85a3:0:0:8a2e:370:7334")).toBe(true);
			expect(isValidIPv6("2001:0db8:0000:0000:3456::")).toBe(true);
			expect(isValidIPv6("2001:0db8::3456:0000:0000:0000")).toBe(true);
		});

		it("should return false for invalid IPv6 addresses", () => {
			expect(isValidIPv6("invalid")).toBe(false);
			expect(isValidIPv6("192.168.1.1")).toBe(false);
			expect(isValidIPv6("")).toBe(false);
		});
	});

	describe("IPV6_PATTERN", () => {
		it("should validate full IPv6 addresses with exact match", () => {
			const validAddresses = [
				"2001:0db8:85a3:0000:0000:8a2e:0370:7334",
				"2001:db8::1",
				"::1",
				"::",
				"2001:db8::",
				"::ffff:192.0.2.1",
				"2001:0db8::3456:0000:0000:0000",
				"2001:0db8:0000:0000:3456::",
				"2001:db8:85a3:0:0:8a2e:370:7334",
				"2001:db8:85a3::8a2e:370:7334",
				"fe80::1",
				"2001:db8:0:0:1:0:0:1",
				"1:2:3:4:5:6:7:8",
				"1::8",
				"1:2:3:4:5:6:7::",
				"1:2:3:4:5:6::8",
				"1:2:3:4:5::8",
				"1:2:3:4::8",
				"1:2:3::8",
				"1:2::8",
				"1::3:4:5:6:7:8",
				"::2:3:4:5:6:7:8",
				"1:2:3:4:5:6::8",
			];

			validAddresses.forEach((address) => {
				expect(IPV6_PATTERN.test(address)).toBe(true);
			});
		});

		it("should not match invalid IPv6 addresses with exact match", () => {
			const invalidAddresses = [
				"192.168.1.1", // IPv4 address
				"invalid", // plain string
				"", // empty string
				"gggg::1", // invalid segment
				"2001:db8:::1", // invalid :: usage
				"2001:db8:85a3:0:0:8a2e:370:7334:extra", // extra segment
				"::1::2", // multiple ::
			];

			invalidAddresses.forEach((address) => {
				expect(IPV6_PATTERN.test(address)).toBe(false);
			});
		});

		it("should not match IPv6 addresses with surrounding text", () => {
			const text = "Server at 2001:db8::1 is responding";
			expect(IPV6_PATTERN.test(text)).toBe(false); // Does not match full string due to exact-match mode
		});
	});
});
