import { EXPERIENCES, EXPERIENCE_KIND_LABEL } from "@/data/experiences";
import { maskCells, maskBumps, growthOrder, scatterFromCentre, leafMask } from "@/lib/puzzle/mask";
import { piecePath } from "@/lib/puzzle/geometry";
import { formatDateFr } from "@/lib/utils/format";
import type { Experience } from "@/types/portfolio";

export const CAREER_CELL = 100;

/** An upright leaf sized to the pieces: it grows from the stalk (bottom) to the tip (top). */
export const LEAF = leafMask(EXPERIENCES.length);

export type CareerPiece = {
  id: string;
  kind: Experience["kind"];
  kindLabel: string;
  label: string;
  year?: string;
  title: string;
  detail: string;
  when?: string;
  place?: string;
  href?: string;
  r: number;
  c: number;
  order: number;
  path: string;
  scatter: { dx: number; dy: number; rot: number };
};

function whenLabel(e: Experience) {
  if (!e.date) return undefined;
  return e.endDate ? `${formatDateFr(e.date)} — ${formatDateFr(e.endDate)}` : formatDateFr(e.date);
}

/** Dated pieces in chronological order, then the skills that crown the leaf. */
export function orderedExperiences(list: Experience[] = EXPERIENCES) {
  const dated = list.filter((e) => e.date).sort((a, b) => a.date!.localeCompare(b.date!));
  return [...dated, ...list.filter((e) => !e.date)];
}

export function buildCareerBoard(list: Experience[] = EXPERIENCES, mask: string[] = leafMask(list.length)) {
  const cells = growthOrder(maskCells(mask));
  const items = orderedExperiences(list);
  if (items.length !== cells.length) throw new Error(`Leaf has ${cells.length} cells for ${items.length} pieces`);
  const pieces: CareerPiece[] = items.map((e, i) => ({
    id: e.id,
    kind: e.kind,
    kindLabel: EXPERIENCE_KIND_LABEL[e.kind],
    label: e.label,
    year: e.date?.slice(0, 4),
    title: e.title,
    detail: e.detail,
    when: whenLabel(e),
    place: e.place,
    href: e.href,
    r: cells[i].r,
    c: cells[i].c,
    order: i,
    path: piecePath(maskBumps(mask, cells[i].r, cells[i].c), CAREER_CELL),
    scatter: scatterFromCentre(cells[i], cells, i),
  }));
  return { pieces, rows: mask.length, cols: Math.max(...mask.map((r) => r.length)) };
}

export type CareerBoard = ReturnType<typeof buildCareerBoard>;
