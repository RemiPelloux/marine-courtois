import { buildBoard, type PuzzleSlot } from "@/components/puzzle/board";
import { CELL, FAMILY_FILL, PAD } from "@/components/puzzle/constants";
import type { Lang } from "@/i18n/config";

export const PAPER = "#f5f2eb";
const ANTIBES = "#2468b3";

function fillOf(slot: PuzzleSlot) {
  if (slot.kind === "tool") return FAMILY_FILL[slot.item.family] ?? ANTIBES;
  return slot.kind === "domain" ? "#e4eaef" : "none";
}

/** The assembled tool puzzle of the home page, drawn as plain paths; the centre piece stays open. */
export function PuzzleArt({ lang, height }: { lang: Lang; height: number }) {
  const { slots, view } = buildBoard(lang);
  const width = Math.round((height * view.width) / view.height);
  return (
    <svg width={width} height={height} viewBox={`${-PAD} ${-PAD} ${view.width} ${view.height}`}>
      {slots.map((s) => (
        <path
          key={`${s.r}-${s.c}`}
          d={s.path}
          transform={`translate(${s.c * CELL} ${s.r * CELL})`}
          fill={fillOf(s)}
          stroke={s.kind === "project" ? ANTIBES : PAPER}
          strokeWidth={s.kind === "project" ? 3 : 1.5}
          strokeDasharray={s.kind === "project" ? "8 6" : undefined}
        />
      ))}
    </svg>
  );
}
