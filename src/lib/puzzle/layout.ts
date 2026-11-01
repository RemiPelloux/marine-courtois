/**
 * Puzzle board: a 5 × 5 grid. The centre is left for "your project", the four
 * activity axes surround it, and the tools fill the remaining slots in reading
 * order (callers pass them grouped by family, so families stay together).
 */
export const GRID = 5;
const CENTER = Math.floor(GRID / 2);
const CROSS: [number, number][] = [
  [CENTER - 1, CENTER],
  [CENTER, CENTER - 1],
  [CENTER, CENTER + 1],
  [CENTER + 1, CENTER],
];

export type Scatter = { dx: number; dy: number; rot: number };
export type Slot<T, A> =
  | { kind: "tool"; r: number; c: number; order: number; scatter: Scatter; item: T }
  | { kind: "axis"; r: number; c: number; order: number; scatter: Scatter; item: A }
  | { kind: "project"; r: number; c: number; order: number; scatter: Scatter };

const isCross = (r: number, c: number) => CROSS.some(([cr, cc]) => cr === r && cc === c);

/** Where a piece starts: pushed outward from the centre, slightly turned. */
export function scatterFor(r: number, c: number, i: number): Scatter {
  const vx = c - CENTER;
  const vy = r - CENTER;
  const len = Math.hypot(vx, vy) || 1;
  const dist = 150 + ((i * 37) % 5) * 28;
  return { dx: Math.round((vx / len) * dist), dy: Math.round((vy / len) * dist), rot: (((i * 53) % 7) - 3) * 8 };
}

/** Lay out exactly GRID² − 5 tools and 4 axes on the board. */
export function layoutPuzzle<T, A>(tools: T[], axes: A[]): Slot<T, A>[] {
  if (tools.length !== GRID * GRID - 5 || axes.length !== CROSS.length) {
    throw new Error(`Puzzle needs ${GRID * GRID - 5} tools and ${CROSS.length} axes`);
  }
  const free: [number, number][] = [];
  for (let r = 0; r < GRID; r++) {
    for (let c = 0; c < GRID; c++) if (!(r === CENTER && c === CENTER) && !isCross(r, c)) free.push([r, c]);
  }
  const toolSlots = tools.map((item, i) => {
    const [r, c] = free[i];
    return { kind: "tool" as const, r, c, order: i, scatter: scatterFor(r, c, i), item };
  });
  const axisSlots = axes.map((item, j) => {
    const [r, c] = CROSS[j];
    const i = tools.length + j;
    return { kind: "axis" as const, r, c, order: i, scatter: scatterFor(r, c, i), item };
  });
  const project = { kind: "project" as const, r: CENTER, c: CENTER, order: tools.length + axes.length, scatter: { dx: 0, dy: 0, rot: 0 } };
  return [...toolSlots, ...axisSlots, project];
}
