import { describe, expect, it } from "vitest";
import { parseCIDR, prefixLengthTo128BitSpace } from "./cidr-parser";

describe("parseCIDR", () => {
	it("parses IPv4 with CIDR notation", () => {
		const result = parseCIDR("192.168.1.0/24");
		expect(result).toEqual({ address: "192.168.1.0", prefixLength: 24, addressType: "ipv4" });
	});

	it("parses IPv4 without CIDR", () => {
		const result = parseCIDR("192.168.1.1");
		expect(result).toEqual({ address: "192.168.1.1", prefixLength: null, addressType: "ipv4" });
	});

	it("parses IPv6 with CIDR notation", () => {
		const result = parseCIDR("2001:db8::/32");
		expect(result).toEqual({ address: "2001:db8::", prefixLength: 32, addressType: "ipv6" });
	});

	it("parses IPv6 without CIDR", () => {
		const result = parseCIDR("2001:db8::1");
		expect(result).toEqual({ address: "2001:db8::1", prefixLength: null, addressType: "ipv6" });
	});

	it("rejects IPv4 prefix length > 32", () => {
		expect(parseCIDR("10.0.0.0/33").addressType).toBe("invalid");
	});

	it("rejects IPv6 prefix length > 128", () => {
		expect(parseCIDR("::1/129").addressType).toBe("invalid");
	});

	it("rejects negative prefix length", () => {
		expect(parseCIDR("10.0.0.0/-1").addressType).toBe("invalid");
	});

	it("rejects non-numeric prefix", () => {
		expect(parseCIDR("10.0.0.0/abc").addressType).toBe("invalid");
	});

	it("rejects invalid address", () => {
		expect(parseCIDR("invalid/24").addressType).toBe("invalid");
	});

	it("handles /0 prefix", () => {
		expect(parseCIDR("0.0.0.0/0")).toEqual({ address: "0.0.0.0", prefixLength: 0, addressType: "ipv4" });
	});

	it("handles /32 prefix for IPv4", () => {
		expect(parseCIDR("10.0.0.1/32")).toEqual({ address: "10.0.0.1", prefixLength: 32, addressType: "ipv4" });
	});

	it("trims whitespace", () => {
		expect(parseCIDR("  10.0.0.0/24  ")).toEqual({ address: "10.0.0.0", prefixLength: 24, addressType: "ipv4" });
	});
});

describe("prefixLengthTo128BitSpace", () => {
	it("converts IPv4 prefix to 128-bit space", () => {
		expect(prefixLengthTo128BitSpace(24, "ipv4")).toBe(120);
		expect(prefixLengthTo128BitSpace(0, "ipv4")).toBe(96);
		expect(prefixLengthTo128BitSpace(32, "ipv4")).toBe(128);
	});

	it("keeps IPv6 prefix as-is", () => {
		expect(prefixLengthTo128BitSpace(64, "ipv6")).toBe(64);
		expect(prefixLengthTo128BitSpace(128, "ipv6")).toBe(128);
	});
});
