import ipRegex from "ip-regex";

// Safe IPv6 pattern matching with timeout
const REGEX_TIMEOUT_MS = 100; // 100ms timeout

/**
 * Match IPv6 addresses with timeout
 * Interrupt processing after a fixed time to reduce ReDoS risk
 */
export function matchIPv6WithTimeout(text: string): string[] | null {
	const startTime = performance.now();
	const results: string[] = [];

	try {
		// Pre-check for excessively long text
		if (text.length > 10000) {
			console.warn("Text too long for IPv6 matching");
			return null;
		}

		const matches = text.matchAll(ipRegex.v6());

		for (const match of matches) {
			// Timeout check
			if (performance.now() - startTime > REGEX_TIMEOUT_MS) {
				console.warn("IPv6 regex matching timeout");
				return results.length > 0 ? results : null;
			}

			results.push(match[0]);
		}

		return results;
	} catch (error) {
		console.error("Error in IPv6 matching:", error);
		return null;
	}
}

/**
 * Reduce ReDoS risk by processing text in chunks
 */
export function matchIPv6InChunks(text: string, chunkSize = 1000): string[] {
	const results: string[] = [];

	// Split by newline and whitespace
	const chunks = text.split(/[\s\n]+/);

	for (const chunk of chunks) {
		if (chunk.length > chunkSize) {
			continue; // Skip oversized chunks
		}

		const matches = chunk.match(ipRegex.v6());
		if (matches) {
			results.push(...matches);
		}
	}

	return [...new Set(results)]; // Remove duplicates
}
