import { mulberry32 } from "@/lib/utils/random";

/**
 * Layout of the fly hunt, as simple as the thesis defence slide: an orange
 * tree flooded with released sterile males, marked pink, and one wild male in
 * red and white stripes hidden among them. The female's goal is to find him:
 * only with him do her eggs develop. Everything comes from a seed and a level,
 * so the server and the browser draw the same tree and "new tree" is a new seed.
 */
export const VIEW = { w: 800, h: 500 };

export type FlyKind = "wild" | "sterile";
/** A release: how many sterile males share the tree with the one wild male, and how small they all are. */
export type Level = { sterile: number; size: number };

/** Bigger releases make the wild male harder to find; that is the whole idea of the technique. */
export const LEVELS: Level[] = [
  { sterile: 20, size: 0.8 },
  { sterile: 80, size: 0.6 },
  { sterile: 200, size: 0.44 },
];

export type Blob = { x: number; y: number; r: number; tone: number; rot: number };
export type Fruit = { x: number; y: number; r: number; lemon: boolean; z: number };
export type FlyPos = { id: number; x: number; y: number; s: number; rot: number; flip: boolean; kind: FlyKind; z: number };
export type Scene = { masses: Blob[]; leaves: Blob[]; front: Blob[]; fruits: Fruit[]; flies: FlyPos[]; flowers: Blob[] };

type Rand = () => number;
type Ellipse = { cx: number; cy: number; rx: number; ry: number };
type Point = { x: number; y: number };

const CANOPY: Ellipse = { cx: 400, cy: 200, rx: 330, ry: 160 };
const PERCH: Ellipse = { cx: 400, cy: 210, rx: 300, ry: 140 };
const INNER: Ellipse = { cx: 400, cy: 200, rx: 300, ry: 135 };
const r1 = (n: number) => Math.round(n * 10) / 10;
const near = (a: Point, b: Point, d: number) => Math.hypot(a.x - b.x, a.y - b.y) < d;

function inEllipse(rand: Rand, e: Ellipse): Point {
  const a = rand() * Math.PI * 2;
  const d = Math.sqrt(rand());
  return { x: r1(e.cx + Math.cos(a) * d * e.rx), y: r1(e.cy + Math.sin(a) * d * e.ry) };
}

function blobs(rand: Rand, n: number, e: Ellipse, size: [number, number], tones: number): Blob[] {
  return Array.from({ length: n }, () => ({ ...inEllipse(rand, e), r: r1(size[0] + rand() * (size[1] - size[0])), tone: Math.floor(rand() * tones), rot: Math.round(rand() * 180) }));
}

/** A spot for one more fly, in the canopy or on the grass, overlapping its neighbours only in part. */
function flySpot(rand: Rand, taken: Point[], gap: number): Point {
  let p = inEllipse(rand, PERCH);
  for (let i = 0; i < 80; i++) {
    p = rand() < 0.84 ? inEllipse(rand, PERCH) : { x: r1(30 + rand() * 740), y: r1(450 + rand() * 30) };
    if (Math.abs(p.x - 400) < 40 && p.y > 380) continue;
    if (!taken.some((q) => near(p, q, gap))) return p;
  }
  return p;
}

function placeFlies(rand: Rand, level: Level): FlyPos[] {
  const wildId = Math.floor(rand() * (level.sterile + 1));
  const flies: FlyPos[] = [];
  for (let id = 0; id <= level.sterile; id++) {
    const kind: FlyKind = id === wildId ? "wild" : "sterile";
    const s = r1(level.size * (kind === "wild" ? 0.95 : 0.9 + rand() * 0.3));
    // the wild male is never at the very back, so another fly can only hide part of him
    const pose = { rot: Math.round(rand() * 50 - 25), flip: rand() < 0.5, z: kind === "wild" ? 0.5 + rand() / 2 : rand() };
    flies.push({ id, ...flySpot(rand, flies, 44 * level.size), s, ...pose, kind });
  }
  return flies;
}

/** Leaves in front of the flies hide some of them in part, never the wild male. */
function frontLeaves(rand: Rand, flies: FlyPos[]) {
  const wild = flies.filter((f) => f.kind === "wild");
  return blobs(rand, 60, INNER, [9, 13], 2).filter((l) => !wild.some((f) => near(f, l, 16)));
}

export function buildScene(seed: number, level: Level = LEVELS[0]): Scene {
  const rand = mulberry32(seed * 7919 + 3);
  const flies = placeFlies(rand, level);
  return {
    masses: blobs(rand, 44, { ...CANOPY, rx: CANOPY.rx - 34, ry: CANOPY.ry - 34 }, [36, 62], 3),
    leaves: blobs(rand, 110, INNER, [8, 11], 3),
    fruits: Array.from({ length: 56 }, () => ({ ...inEllipse(rand, PERCH), r: r1(11 + rand() * 6), lemon: rand() < 0.3, z: rand() })),
    flies,
    front: frontLeaves(rand, flies),
    flowers: Array.from({ length: 44 }, () => ({ x: r1(10 + rand() * 780), y: r1(430 + rand() * 62), r: r1(2.5 + rand() * 2), tone: Math.floor(rand() * 4), rot: 0 })),
  };
}
