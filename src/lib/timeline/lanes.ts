import { dateToYear, type Milestone } from "@/data/milestones";

/** Visible span of the horizontal timeline, in fractional years. */
export const SPAN: [number, number] = [2022.35, 2026.65];

/** Horizontal position of an ISO date along the axis, in % of its width. */
export function axisPercent(iso: string, span: [number, number] = SPAN): number {
  const [a, b] = span;
  return ((dateToYear(iso) - a) / (b - a)) * 100;
}

/** Label width as a share of the axis (≈ 11.25rem on a 1280px stage). */
export const LABEL_WIDTH = 14;

/** Lanes, alternating above (negative) and below (positive) the axis. */
export const LANES = [-1, 1, -2, 2, -3, 3] as const;
export type Lane = (typeof LANES)[number];

export interface PlacedMilestone extends Milestone {
  x: number;
  lane: Lane;
  /** label grows to the left near the right edge */
  alignEnd: boolean;
}

/**
 * Greedy lane assignment: each label (≈ `labelWidth` % wide) takes the first
 * lane where it does not overlap the previous label of that lane.
 */
export function placeMilestones(milestones: Milestone[], labelWidth = LABEL_WIDTH, gap = 1): PlacedMilestone[] {
  const lastEnd = new Map<Lane, number>();
  return [...milestones]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((m) => {
      const x = axisPercent(m.date);
      const alignEnd = x > 100 - labelWidth;
      const start = alignEnd ? x - labelWidth : x;
      const end = alignEnd ? x : x + labelWidth;
      const lane = LANES.find((l) => (lastEnd.get(l) ?? -Infinity) + gap <= start) ?? LANES[LANES.length - 1];
      lastEnd.set(lane, end);
      return { ...m, x, lane, alignEnd };
    });
}

/** Years whose 1st of January falls inside the span. */
export function yearTicks(span: [number, number] = SPAN): number[] {
  const out: number[] = [];
  for (let y = Math.ceil(span[0]); y <= span[1]; y++) out.push(y);
  return out;
}
