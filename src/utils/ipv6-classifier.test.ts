import { describe, expect, it } from "vitest";
import { classifyIPv6 } from "./ipv6-classifier";

describe("classifyIPv6", () => {
	it("グローバルユニキャストアドレスを正しく分類する", () => {
		const result = classifyIPv6("2001:0db8:0000:0000:0000:0000:0000:0001");
		expect(result).not.toBeNull();
		expect(result?.type.toLowerCase()).toMatch(/global unicast/i);
	});

	it("リンクローカルアドレスを正しく分類する", () => {
		const result = classifyIPv6("fe80:0000:0000:0000:0000:0000:0000:0001");
		expect(result).not.toBeNull();
		expect(result?.type.toLowerCase()).toMatch(/link-local/i);
	});

	it("ユニークローカルアドレスを正しく分類する", () => {
		const result1 = classifyIPv6("fc00:0000:0000:0000:0000:0000:0000:0001");
		expect(result1).not.toBeNull();
		expect(result1?.type.toLowerCase()).toMatch(/unique local/i);

		const result2 = classifyIPv6("fd00:0000:0000:0000:0000:0000:0000:0001");
		expect(result2).not.toBeNull();
		expect(result2?.type.toLowerCase()).toMatch(/unique local/i);
	});

	it("マルチキャストアドレスを正しく分類する", () => {
		const result = classifyIPv6("ff02:0000:0000:0000:0000:0000:0000:0001");
		expect(result).not.toBeNull();
		expect(result?.type.toLowerCase()).toMatch(/multicast/i);
	});

	it("ループバックアドレスを正しく分類する", () => {
		const result = classifyIPv6("0000:0000:0000:0000:0000:0000:0000:0001");
		expect(result).not.toBeNull();
		expect(result?.type.toLowerCase()).toMatch(/loopback/i);
	});

	it("未指定アドレスを正しく分類する", () => {
		const result = classifyIPv6("0000:0000:0000:0000:0000:0000:0000:0000");
		expect(result).not.toBeNull();
		expect(result?.type.toLowerCase()).toMatch(/unspecified/i);
	});

	it("IPv4射影アドレスを正しく分類する", () => {
		const result = classifyIPv6("0000:0000:0000:0000:0000:ffff:c0a8:0001");
		expect(result).not.toBeNull();
		expect(result?.type.toLowerCase()).toMatch(/ipv4/i);
	});

	it("分類できないアドレスはnullを返す", () => {
		const result = classifyIPv6("1234:5678:0000:0000:0000:0000:0000:0001");
		expect(result).toBeNull();
	});

	it("不正な入力に対してnullを返す", () => {
		expect(classifyIPv6("")).toBeNull();
		expect(classifyIPv6("not-an-ip")).toBeNull();
	});
});
