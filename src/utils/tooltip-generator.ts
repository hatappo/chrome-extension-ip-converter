import { addSpacingToBits, formatBitsToLines, getBitColorClass } from "./bit-formatting";
import type { IPv6Classification } from "./ipv6-classifier";

/**
 * Generate tooltip HTML
 */
export function generateTooltipHTML(bits: string, classification?: IPv6Classification): string {
	const lines = formatBitsToLines(bits);

	let html = "";

	// Add classification info
	if (classification) {
		html += `<div class="tooltip-classification">`;
		html += `<div class="classification-type">${classification.type}</div>`;
		if (classification.description) {
			html += `<div class="classification-description">${classification.description}</div>`;
		}
		html += `</div>`;
	}

	html += lines
		.map((line) => {
			const spacedBits = addSpacingToBits(line.bits);
			const coloredBits = spacedBits
				.split("")
				.map((char) => {
					if (char === " ") return char;
					const colorClass = getBitColorClass(char);
					return colorClass ? `<span class="${colorClass}">${char}</span>` : char;
				})
				.join("");

			return `<div class="tooltip-line"><span class="tooltip-line-number">${line.lineNumber}:</span><span class="tooltip-bits">${coloredBits}</span></div>`;
		})
		.join("");

	return html;
}
