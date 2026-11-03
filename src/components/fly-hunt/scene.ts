import { mulberry32 } from "@/lib/utils/random";

/**
 * Layout of the fly hunt: an orange tree full of wild flies, with a few
 * released sterile males hidden among them and decoys that share one of their
 * marks. Everything comes from a seed and a level, so the server and the
 * browser draw the same tree and "new game" is a new seed.
 */
export const VIEW = { w: 800, h: 500 };

/**
 * sterile: red and white stripes and a red and white hat. Each decoy gets one
 * of the two wrong: the hat on a purple jumper, the jumper without a hat,
 * pink or orange stripes, a navy hat, or a plain red jumper.
 */
export type FlyKind = "sterile" | "wild" | "hat" | "stripes" | "pink" | "orange" | "navy" | "plain";
type Decoy = Exclude<FlyKind, "sterile" | "wild">;
/** `cover`: leaves laid over the sterile male's jumper, so only his hat and a few stripes show. */
export type Level = { find: number; flies: number; decoys: Partial<Record<Decoy, number>>; size: number; cover: number };

/** One sterile male per tree; each level adds wild flies and look-alikes, and shrinks them all. */
export const LEVELS: Level[] = [
  { find: 1, flies: 110, decoys: { hat: 12, stripes: 10, pink: 8, orange: 6 }, size: 0.56, cover: 0 },
  { find: 1, flies: 160, decoys: { hat: 16, stripes: 14, pink: 12, orange: 10, navy: 8 }, size: 0.48, cover: 1 },
  { find: 1, flies: 210, decoys: { hat: 22, stripes: 18, pink: 14, orange: 14, navy: 12, plain: 10 }, size: 0.42, cover: 2 },
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

/** Kinds in a shuffled order: the sterile males first, then each decoy, then wild flies. */
function kindsFor(rand: Rand, level: Level): FlyKind[] {
  const kinds: FlyKind[] = [...Array<FlyKind>(level.find).fill("sterile")];
  for (const [kind, n] of Object.entries(level.decoys) as [Decoy, number][]) kinds.push(...Array<FlyKind>(n).fill(kind));
  while (kinds.length < level.flies) kinds.push("wild");
  for (let i = kinds.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [kinds[i], kinds[j]] = [kinds[j], kinds[i]];
  }
  return kinds;
}

function placeFlies(rand: Rand, level: Level): FlyPos[] {
  const flies: FlyPos[] = [];
  kindsFor(rand, level).forEach((kind, id) => {
    const s = r1(level.size * (kind === "sterile" ? 0.95 : 0.9 + rand() * 0.3));
    // a sterile male is never at the very back, so another fly can only hide part of it
    const pose = { rot: Math.round(rand() * 50 - 25), flip: rand() < 0.5, z: kind === "sterile" ? 0.5 + rand() / 2 : rand() };
    flies.push({ id, ...flySpot(rand, flies, 44 * level.size), s, ...pose, kind });
  });
  return flies;
}

/**
 * Leaves in front of the flies hide some of them in part. Scattered leaves keep
 * off the sterile male; on harder levels a few are laid on his jumper on purpose,
 * below the hat, so he is never hidden entirely.
 */
function frontLeaves(rand: Rand, flies: FlyPos[], cover: number) {
  const sterile = flies.filter((f) => f.kind === "sterile");
  const scattered = blobs(rand, 60, INNER, [9, 13], 2).filter((l) => !sterile.some((f) => near(f, l, 16)));
  // lying almost flat across the jumper (fly units: the body is centred 6 below the origin, the hat 30 above)
  const lay = (f: FlyPos, i: number): Blob => ({ x: r1(f.x + (i ? 6 : -6) * f.s), y: r1(f.y + (8 + rand() * 8) * f.s), r: r1(26 * f.s), tone: i % 2, rot: Math.round(rand() * 50 - 25) });
  const laid = sterile.flatMap((f) => Array.from({ length: cover }, (_, i) => lay(f, i)));
  return [...scattered, ...laid];
}

export function buildScene(seed: number, level: Level = LEVELS[0]): Scene {
  const rand = mulberry32(seed * 7919 + 3);
  const flies = placeFlies(rand, level);
  return {
    masses: blobs(rand, 44, { ...CANOPY, rx: CANOPY.rx - 34, ry: CANOPY.ry - 34 }, [36, 62], 3),
    leaves: blobs(rand, 110, INNER, [8, 11], 3),
    fruits: Array.from({ length: 56 }, () => ({ ...inEllipse(rand, PERCH), r: r1(11 + rand() * 6), lemon: rand() < 0.3, z: rand() })),
    flies,
    front: frontLeaves(rand, flies, level.cover),
    flowers: Array.from({ length: 44 }, () => ({ x: r1(10 + rand() * 780), y: r1(430 + rand() * 62), r: r1(2.5 + rand() * 2), tone: Math.floor(rand() * 4), rot: 0 })),
  };
}
