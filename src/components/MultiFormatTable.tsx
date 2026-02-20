import type React from "react";
import type { FormatSegment, MultiFormatInfo } from "../utils/multi-format";

interface MultiFormatTableProps {
	info: MultiFormatInfo;
}

function SegmentTable({ segments, label }: { segments: FormatSegment[]; label: string }): React.ReactElement {
	return (
		<div className="multi-format-block">
			<div className="multi-format-label">{label}</div>
			<table className="multi-format-table">
				<thead>
					<tr>
						<th>#</th>
						<th>Decimal</th>
						<th>Hex</th>
						<th>Binary</th>
					</tr>
				</thead>
				<tbody>
					{segments.map((seg) => (
						<tr key={seg.index}>
							<td className="multi-format-index">{seg.index}</td>
							<td>{seg.decimal}</td>
							<td>{seg.hex}</td>
							<td className="multi-format-binary">{seg.binary}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

export function MultiFormatTable({ info }: MultiFormatTableProps): React.ReactElement {
	return (
		<div className="multi-format-section">
			<SegmentTable segments={info.segments} label={info.segmentType === "octet" ? "IPv4 Octets" : "IPv6 Hextets"} />
			{info.ipv4MappedSegments && <SegmentTable segments={info.ipv4MappedSegments} label="IPv4-Mapped IPv6" />}
		</div>
	);
}
