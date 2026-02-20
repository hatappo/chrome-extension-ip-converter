import type React from "react";
import { useCopyToClipboard } from "../hooks/useCopyToClipboard";
import { formatBitsToLines, getBitColorClass } from "../utils/bit-formatting";
import type { IPClassification } from "../utils/ip-classifier";
import type { IPv6Classification } from "../utils/ipv6-classifier";
import { IPBadge } from "./IPBadge";

interface BitDisplayProps {
	bits: string;
	variant?: "popup" | "tooltip";
	classification?: IPv6Classification;
	ipClassification?: IPClassification;
	prefixLength?: number;
}

/**
 * Shared component that renders IPv6 bit notation in 4 lines
 */
export function BitDisplay({
	bits,
	variant = "popup",
	classification,
	ipClassification,
	prefixLength,
}: BitDisplayProps): React.ReactElement {
	const lines = formatBitsToLines(bits);
	const { copyToClipboard, isCopied } = useCopyToClipboard();

	const handleCopy = async () => {
		const binaryString = bits.split(":").join("");
		await copyToClipboard(binaryString);
	};

	return (
		<div className={`bits-display ${variant === "tooltip" ? "tooltip-variant" : ""}`}>
			{(classification || ipClassification) && (
				<div className="classification-header">
					{classification && (
						<div className="classification-info">
							<div className="classification-type">{classification.type}</div>
							{classification.description && (
								<div className="classification-description">{classification.description}</div>
							)}
						</div>
					)}
					{ipClassification && <IPBadge badge={ipClassification.badge} />}
				</div>
			)}
			{prefixLength != null && (
				<div className="prefix-info">
					<span className="prefix-network">Network: /{prefixLength}</span>
					<span className="prefix-separator">|</span>
					<span className="prefix-host">Host: {128 - prefixLength} bits</span>
				</div>
			)}
			{lines.map((line, lineIndex) => (
				<div key={`line-${lineIndex}-${line.bits.slice(0, 4)}`} className="bits-line">
					<span className="line-number">{line.lineNumber}:</span>
					<div className="bits-content">
						{line.bits.split("").map((bit, bitIndex) => {
							const globalIndex = lineIndex * 32 + bitIndex;
							const colorClass = getBitColorClass(bit);
							const subnetClass = prefixLength != null ? (globalIndex < prefixLength ? "bit-network" : "bit-host") : "";
							return (
								<span key={`bit-${globalIndex}-${bit}`} className={`${colorClass} ${subnetClass}`.trim()}>
									{bit}
								</span>
							);
						})}
					</div>
				</div>
			))}
			<button type="button" onClick={handleCopy} className="copy-button" title="Copy binary string">
				{isCopied ? "Copied!" : "Copy"}
			</button>
		</div>
	);
}
