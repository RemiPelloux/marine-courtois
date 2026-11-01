import type { Bumps } from "@/lib/puzzle/geometry";

/**
 * Puzzles in any silhouette. A mask is a list of rows where "#" marks a cell.
 * Edges facing an empty cell or the outside stay flat, so the outline of the
 * shape is smooth; internal edges interlock exactly like the square board.
 */
export type Cell = { r: number; c: number };

/**
 * An upright leaf of exactly `n` cells, six columns wide: rows of 2 and 4 at
 * the stalk, as many full rows as needed, then 4 and 2 at the tip; surplus
 * cells are taken off the tip, so any number of pieces still makes a leaf.
 */
export function leafMask(n: number, cols = 6): string[] {
  const k = Math.max(0, Math.ceil((n - 12) / cols));
  const widths = [2, 4, ...Array<number>(k).fill(cols), 4, 2]; // top → bottom
  let surplus = widths.reduce((a, b) => a + b, 0) - n;
  for (let i = 0; i < widths.length && surplus > 0; i++) {
    const cut = Math.min(widths[i], surplus);
    widths[i] -= cut;
    surplus -= cut;
  }
  return widths.filter((w) => w > 0).map((w) => {
    const start = Math.floor((cols - w) / 2);
    return ".".repeat(start) + "#".repeat(w) + ".".repeat(cols - start - w);
  });
}

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

/** Growth order: row by row from the bottom (the stalk) to the top (the tip), left to right. */
export function growthOrder(cells: Cell[]): Cell[] {
  return [...cells].sort((a, b) => b.r - a.r || a.c - b.c);
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
