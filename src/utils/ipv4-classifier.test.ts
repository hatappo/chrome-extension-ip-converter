import { describe, expect, it } from "vitest";
import { classifyIPv4 } from "./ipv4-classifier";

describe("classifyIPv4", () => {
	it("classifies loopback addresses", () => {
		expect(classifyIPv4("127.0.0.1")?.type).toBe("Loopback Address");
		expect(classifyIPv4("127.255.255.255")?.type).toBe("Loopback Address");
	});

	it("classifies link-local addresses", () => {
		expect(classifyIPv4("169.254.0.1")?.type).toBe("Link-Local Address");
		expect(classifyIPv4("169.254.255.255")?.type).toBe("Link-Local Address");
	});

	it("classifies RFC 1918 private addresses", () => {
		expect(classifyIPv4("10.0.0.1")?.type).toBe("Private Address");
		expect(classifyIPv4("10.255.255.255")?.type).toBe("Private Address");
		expect(classifyIPv4("172.16.0.1")?.type).toBe("Private Address");
		expect(classifyIPv4("172.31.255.255")?.type).toBe("Private Address");
		expect(classifyIPv4("192.168.0.1")?.type).toBe("Private Address");
		expect(classifyIPv4("192.168.255.255")?.type).toBe("Private Address");
	});

	it("classifies public addresses", () => {
		expect(classifyIPv4("8.8.8.8")?.type).toBe("Public Address");
		expect(classifyIPv4("1.1.1.1")?.type).toBe("Public Address");
		expect(classifyIPv4("203.0.113.1")?.type).toBe("Public Address");
	});

	it("classifies multicast addresses", () => {
		expect(classifyIPv4("224.0.0.1")?.type).toBe("Multicast Address");
		expect(classifyIPv4("239.255.255.255")?.type).toBe("Multicast Address");
	});

	it("classifies reserved addresses", () => {
		expect(classifyIPv4("0.0.0.0")?.type).toBe("Reserved Address");
		expect(classifyIPv4("240.0.0.1")?.type).toBe("Reserved Address");
		expect(classifyIPv4("255.255.255.255")?.type).toBe("Reserved Address");
	});

	it("does not classify 172.15.x.x as private", () => {
		expect(classifyIPv4("172.15.0.1")?.type).toBe("Public Address");
	});

	it("does not classify 172.32.x.x as private", () => {
		expect(classifyIPv4("172.32.0.1")?.type).toBe("Public Address");
	});

	it("returns null for invalid input", () => {
		expect(classifyIPv4("invalid")).toBeNull();
		expect(classifyIPv4("")).toBeNull();
	});
});
