import { COMPETENCE_DOMAINS, DOMAIN_IDS, competencesIn, type Competence, type DomainId } from "@/data/competences";
import { maskCells, maskBumps, scatterFromCentre } from "@/lib/puzzle/mask";
import { piecePath } from "@/lib/puzzle/geometry";
import type { Lang } from "@/i18n/config";

export const CAREER_CELL = 100;
/** Each domain is a block three pieces wide. */
export const BLOCK_COLS = 3;

export type CompetencePiece = Competence & {
  r: number;
  c: number;
  order: number;
  path: string;
  scatter: { dx: number; dy: number; rot: number };
};

export type DomainBlock = { id: DomainId; title: string; subtitle: string; rows: number; pieces: CompetencePiece[] };

/** A block of `n` cells: full rows of three, the last row left-aligned. */
export function blockMask(n: number, cols = BLOCK_COLS): string[] {
  const rows = Math.ceil(n / cols);
  return Array.from({ length: rows }, (_, r) => "#".repeat(Math.min(cols, n - r * cols)).padEnd(cols, "."));
}

/**
 * All blocks stacked in one mask, an empty row between two blocks: edges inside
 * a block interlock, block outlines stay flat, and each block gets its own tabs.
 */
function stackBlocks(counts: number[]) {
  const mask: string[] = [];
  const starts = counts.map((n) => {
    const start = mask.length;
    mask.push(...blockMask(n), ".".repeat(BLOCK_COLS));
    return start;
  });
  return { mask, starts };
}

/** The career puzzle: four domain blocks, each made of its competence pieces. */
export function buildCompetenceBoard(lang: Lang, list: Competence[] = competencesIn(lang)) {
  const stray = list.filter((x) => !(DOMAIN_IDS as readonly string[]).includes(x.domain));
  if (stray.length) throw new Error(`Competences outside the four domains: ${stray.map((x) => x.id).join(", ")}`);
  const groups = COMPETENCE_DOMAINS.map((d) => ({ d, items: list.filter((x) => x.domain === d.id) }));
  const { mask, starts } = stackBlocks(groups.map((g) => g.items.length));
  let order = 0;
  const domains: DomainBlock[] = groups.map(({ d, items }, i) => {
    const cells = maskCells(blockMask(items.length));
    const pieces = items.map((x, j) => ({
      ...x,
      ...cells[j],
      order: order++,
      path: piecePath(maskBumps(mask, starts[i] + cells[j].r, cells[j].c), CAREER_CELL),
      scatter: scatterFromCentre(cells[j], cells, j),
    }));
    return { id: d.id, title: d.title[lang], subtitle: d.subtitle[lang], rows: Math.ceil(items.length / BLOCK_COLS), pieces };
  });
  return { domains };
}

export type CompetenceBoard = ReturnType<typeof buildCompetenceBoard>;
