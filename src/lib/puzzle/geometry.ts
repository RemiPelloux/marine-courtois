/**
 * Jigsaw geometry. Every internal edge is shared by two pieces: a tab (+1) on
 * one side is a blank (−1) on the other, so the pieces fit exactly. Border
 * edges stay flat (0). Paths are drawn clockwise in a cell of size `size`.
 */
export type Bumps = { top: number; right: number; bottom: number; left: number };
type Pt = [number, number];

/** Deterministic sign of an internal edge: same input, same puzzle on server and client. */
function edgeSign(r: number, c: number, kind: number) {
  return ((r + 1) * 73 + (c + 1) * 151 + kind * 17) % 7 < 3 ? -1 : 1;
}

/** Tabs and blanks of the piece at row `r`, column `c`. */
export function pieceBumps(r: number, c: number, rows: number, cols: number): Bumps {
  return {
    top: r === 0 ? 0 : -edgeSign(r - 1, c, 0),
    bottom: r === rows - 1 ? 0 : edgeSign(r, c, 0),
    left: c === 0 ? 0 : -edgeSign(r, c - 1, 1),
    right: c === cols - 1 ? 0 : edgeSign(r, c, 1),
  };
}

/** One tab, as cubic segments in edge space: u along the edge, v outward (fraction of the edge length). */
const TAB: Pt[][] = [
  [[0.4, 0], [0.42, 0.04], [0.39, 0.075]],
  [[0.34, 0.15], [0.38, 0.2], [0.5, 0.2]],
  [[0.62, 0.2], [0.66, 0.15], [0.61, 0.075]],
  [[0.58, 0.04], [0.6, 0], [0.64, 0]],
];

/**
 * How far a tab reaches past its cell, as a fraction of the cell size. Tabs
 * only occupy the middle third of an edge, so a piece keeps two clear bands
 * for content: 21–33 % and 67–79 % of its height, edge to edge.
 */
export const TAB_DEPTH = 0.2;

const round = (n: number) => Math.round(n * 100) / 100;

function edge(p0: Pt, p1: Pt, bump: number) {
  if (bump === 0) return `L${round(p1[0])} ${round(p1[1])}`;
  const d: Pt = [p1[0] - p0[0], p1[1] - p0[1]];
  // outward normal of a clockwise edge in screen coordinates (y down)
  const n: Pt = [d[1] * bump, -d[0] * bump];
  const at = ([u, v]: Pt) => `${round(p0[0] + u * d[0] + v * n[0])} ${round(p0[1] + u * d[1] + v * n[1])}`;
  const start = at([0.36, 0]);
  const curves = TAB.map((seg) => `C${seg.map(at).join(",")}`).join("");
  return `L${start}${curves}L${round(p1[0])} ${round(p1[1])}`;
}

/** Closed SVG path of one piece, origin at the top-left corner of its cell. */
export function piecePath(b: Bumps, size: number) {
  const tl: Pt = [0, 0];
  const tr: Pt = [size, 0];
  const br: Pt = [size, size];
  const bl: Pt = [0, size];
  return `M0 0${edge(tl, tr, b.top)}${edge(tr, br, b.right)}${edge(br, bl, b.bottom)}${edge(bl, tl, b.left)}Z`;
}
