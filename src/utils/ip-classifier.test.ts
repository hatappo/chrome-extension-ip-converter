import { describe, expect, it } from "vitest";
import { classifyIP } from "./ip-classifier";

describe("classifyIP", () => {
	describe("IPv4 badge mapping", () => {
		it("returns Private badge for RFC 1918 addresses", () => {
			expect(classifyIP("192.168.1.1", "ipv4")?.badge).toBe("Private");
			expect(classifyIP("10.0.0.1", "ipv4")?.badge).toBe("Private");
			expect(classifyIP("172.16.0.1", "ipv4")?.badge).toBe("Private");
		});

		it("returns Public badge for routable addresses", () => {
			expect(classifyIP("8.8.8.8", "ipv4")?.badge).toBe("Public");
		});

		it("returns Loopback badge", () => {
			expect(classifyIP("127.0.0.1", "ipv4")?.badge).toBe("Loopback");
		});

		it("returns Link-Local badge", () => {
			expect(classifyIP("169.254.1.1", "ipv4")?.badge).toBe("Link-Local");
		});

		it("returns Multicast badge", () => {
			expect(classifyIP("224.0.0.1", "ipv4")?.badge).toBe("Multicast");
		});

		it("returns Reserved badge", () => {
			expect(classifyIP("0.0.0.0", "ipv4")?.badge).toBe("Reserved");
			expect(classifyIP("240.0.0.1", "ipv4")?.badge).toBe("Reserved");
		});
	});

	describe("IPv6 badge mapping", () => {
		it("returns Public badge for Global Unicast", () => {
			const result = classifyIP("2001:db8::1", "ipv6");
			expect(result?.badge).toBe("Public");
		});

		it("returns Link-Local badge", () => {
			const result = classifyIP("fe80::1", "ipv6");
			expect(result?.badge).toBe("Link-Local");
		});

		it("returns Private badge for Unique Local", () => {
			const result = classifyIP("fd00::1", "ipv6");
			expect(result?.badge).toBe("Private");
		});

		it("returns Loopback badge for ::1", () => {
			const result = classifyIP("::1", "ipv6");
			expect(result?.badge).toBe("Loopback");
		});

		it("returns Multicast badge", () => {
			const result = classifyIP("ff02::1", "ipv6");
			expect(result?.badge).toBe("Multicast");
		});

		it("returns Reserved badge for unspecified", () => {
			const result = classifyIP("::", "ipv6");
			expect(result?.badge).toBe("Reserved");
		});
	});

	it("returns null for invalid address type", () => {
		expect(classifyIP("invalid", "invalid")).toBeNull();
	});
});
