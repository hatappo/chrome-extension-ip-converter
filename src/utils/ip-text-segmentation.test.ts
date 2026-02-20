import { describe, expect, it } from "vitest";
import { splitTextByIPAddresses } from "./ip-text-segmentation";

describe("splitTextByIPAddresses", () => {
	it("IPを含まない文字列はテキスト1要素を返す", () => {
		const text = "hello world";
		expect(splitTextByIPAddresses(text)).toEqual([{ kind: "text", value: text }]);
	});

	it("IPv4を1つ含む文字列を正しく分割する", () => {
		const text = "prefix 192.168.0.1 suffix";
		expect(splitTextByIPAddresses(text)).toEqual([
			{ kind: "text", value: "prefix " },
			{ kind: "ip", value: "192.168.0.1", addressType: "ipv4" },
			{ kind: "text", value: " suffix" },
		]);
	});

	it("IPv4とIPv6を複数含む文字列を順序を保って分割する", () => {
		const text = "A 192.168.0.1 B 2001:db8::1 C 10.0.0.1 D";
		expect(splitTextByIPAddresses(text)).toEqual([
			{ kind: "text", value: "A " },
			{ kind: "ip", value: "192.168.0.1", addressType: "ipv4" },
			{ kind: "text", value: " B " },
			{ kind: "ip", value: "2001:db8::1", addressType: "ipv6" },
			{ kind: "text", value: " C " },
			{ kind: "ip", value: "10.0.0.1", addressType: "ipv4" },
			{ kind: "text", value: " D" },
		]);
	});

	it("空文字列では空配列を返す", () => {
		expect(splitTextByIPAddresses("")).toEqual([]);
	});
});
