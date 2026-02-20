import type React from "react";
import { useCopyToClipboard } from "../hooks/useCopyToClipboard";
import { formatBitsToLines, getBitColorClass } from "../utils/bit-formatting";
import type { IPv6Classification } from "../utils/ipv6-classifier";

interface BitDisplayProps {
	bits: string;
	variant?: "popup" | "tooltip";
	classification?: IPv6Classification;
}

/**
 * Shared component that renders IPv6 bit notation in 4 lines
 */
export function BitDisplay({ bits, variant = "popup", classification }: BitDisplayProps): React.ReactElement {
	const lines = formatBitsToLines(bits);
	const { copyToClipboard, isCopied } = useCopyToClipboard();

	const handleCopy = async () => {
		const binaryString = bits.split(":").join("");
		await copyToClipboard(binaryString);
	};

	return (
		<div className={`bits-display ${variant === "tooltip" ? "tooltip-variant" : ""}`}>
			<div className="classification-header">
				{classification ? (
					<div className="classification-info">
						<div className="classification-type">{classification.type}</div>
						{classification.description && (
							<div className="classification-description">{classification.description}</div>
						)}
					</div>
				) : (
					<div className="classification-info-empty" />
				)}
				<button type="button" onClick={handleCopy} className="copy-button" title="Copy binary string">
					{isCopied ? "Copied!" : "Copy"}
				</button>
			</div>
			{lines.map((line, lineIndex) => (
				<div key={`line-${lineIndex}-${line.bits.slice(0, 4)}`} className="bits-line">
					<span className="line-number">{line.lineNumber}:</span>
					<div className="bits-content">
						{line.bits.split("").map((bit, bitIndex) => {
							const globalIndex = lineIndex * 32 + bitIndex;
							return (
								<span key={`bit-${globalIndex}-${bit}`} className={getBitColorClass(bit)}>
									{bit}
								</span>
							);
						})}
					</div>
				</div>
			))}
		</div>
	);
}
