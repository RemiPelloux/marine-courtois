import type { Bumps } from "@/lib/puzzle/geometry";

/**
 * Puzzles in any silhouette. A mask is a list of rows where "#" marks a cell.
 * Edges facing an empty cell or the outside stay flat, so the outline of the
 * shape is smooth; internal edges interlock exactly like the square board.
 */
export type Cell = { r: number; c: number };

export function maskCells(mask: string[]): Cell[] {
  return mask.flatMap((row, r) => [...row].flatMap((ch, c) => (ch === "#" ? [{ r, c }] : [])));
}

function edgeSign(r: number, c: number, kind: number) {
  return ((r + 3) * 61 + (c + 2) * 97 + kind * 29) % 5 < 2 ? -1 : 1;
}

export function maskBumps(mask: string[], r: number, c: number): Bumps {
  const has = (rr: number, cc: number) => mask[rr]?.[cc] === "#";
  return {
    top: has(r - 1, c) ? -edgeSign(r - 1, c, 0) : 0,
    bottom: has(r + 1, c) ? edgeSign(r, c, 0) : 0,
    left: has(r, c - 1) ? -edgeSign(r, c - 1, 1) : 0,
    right: has(r, c + 1) ? edgeSign(r, c, 1) : 0,
  };
}

/** Where a piece starts: pushed away from the centre of the shape. */
export function scatterFromCentre(cell: Cell, cells: Cell[], i: number) {
  const cr = cells.reduce((s, x) => s + x.r, 0) / cells.length;
  const cc = cells.reduce((s, x) => s + x.c, 0) / cells.length;
  const vx = cell.c - cc;
  const vy = cell.r - cr;
  const len = Math.hypot(vx, vy) || 1;
  const dist = 130 + ((i * 41) % 4) * 30;
  return { dx: Math.round((vx / len) * dist), dy: Math.round((vy / len) * dist), rot: (((i * 37) % 9) - 4) * 6 };
}
