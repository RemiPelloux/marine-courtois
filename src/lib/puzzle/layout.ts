/**
 * Puzzle board: COLS wide, ROWS tall. The top COLS × COLS square keeps the
 * centre for "your project", four themes in a cross around it, and the tools
 * in the remaining slots in reading order (callers pass them grouped by family,
 * so families stay together). The bottom row holds COLS more themes.
 */
export const COLS = 5;
export const ROWS = COLS + 1;
const CENTER = Math.floor(COLS / 2);
const CROSS: [number, number][] = [
  [CENTER - 1, CENTER],
  [CENTER, CENTER - 1],
  [CENTER, CENTER + 1],
  [CENTER + 1, CENTER],
];
const THEME_ROW: [number, number][] = Array.from({ length: COLS }, (_, c) => [ROWS - 1, c]);
const THEME_SLOTS = [...CROSS, ...THEME_ROW];
/** How many themes and tools fill the board exactly. */
export const THEMES = THEME_SLOTS.length;
export const TOOLS = COLS * COLS - CROSS.length - 1;

export type Scatter = { dx: number; dy: number; rot: number };
export type Slot<T, A> =
  | { kind: "tool"; r: number; c: number; order: number; scatter: Scatter; item: T }
  | { kind: "domain"; r: number; c: number; order: number; scatter: Scatter; item: A }
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

function toolCells() {
  const free: [number, number][] = [];
  for (let r = 0; r < COLS; r++) {
    for (let c = 0; c < COLS; c++) if (!(r === CENTER && c === CENTER) && !isCross(r, c)) free.push([r, c]);
  }
  return free;
}

/** Lay out exactly TOOLS tools and THEMES themes on the board. */
export function layoutPuzzle<T, A>(tools: T[], domains: A[]): Slot<T, A>[] {
  if (tools.length !== TOOLS || domains.length !== THEMES) {
    throw new Error(`Puzzle needs ${TOOLS} tools and ${THEMES} themes`);
  }
  const free = toolCells();
  const toolSlots = tools.map((item, i) => {
    const [r, c] = free[i];
    return { kind: "tool" as const, r, c, order: i, scatter: scatterFor(r, c, i), item };
  });
  const domainSlots = domains.map((item, j) => {
    const [r, c] = THEME_SLOTS[j];
    const i = tools.length + j;
    return { kind: "domain" as const, r, c, order: i, scatter: scatterFor(r, c, i), item };
  });
  const project = { kind: "project" as const, r: CENTER, c: CENTER, order: tools.length + domains.length, scatter: { dx: 0, dy: 0, rot: 0 } };
  return [...toolSlots, ...domainSlots, project];
}
