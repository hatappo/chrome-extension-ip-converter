import type { BadgeType } from "../utils/ip-classifier";

interface IPBadgeProps {
	badge: BadgeType;
}

export function IPBadge({ badge }: IPBadgeProps) {
	return <span className={`ip-badge ip-badge-${badge.toLowerCase()}`}>{badge}</span>;
}
