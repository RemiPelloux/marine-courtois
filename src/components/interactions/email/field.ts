import { mulberry32 } from "@/lib/utils/random";

export type Tone = "light" | "dark";
export type Phase = "drift" | "assemble" | "done";

const GLYPHS = ["σ", "δ", "ε", "μ", "η", "ρ", "λ", "@"];
const PALETTE: Record<Tone, string[]> = {
  light: ["#0f1d2e", "#2468b3", "#2468b3", "#55626f"],
  dark: ["#f5f2eb", "#6fb3f2", "#6fb3f2", "#a8bfd6"],
};
/** flight of one particle; arrivals spread left → right over SPREAD, the text sweep trails them */
export const FLIGHT = 820;
export const SPREAD = 420;

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  sx: number;
  sy: number;
  tx: number;
  ty: number;
  r: number;
  delay: number;
  bend: number;
  color: string;
  glyph?: string;
  born: number;
}

export interface FieldSpec {
  tone: Tone;
  large: boolean;
}

type Box = Pick<DOMRect, "left" | "top" | "width" | "height">;

/** The drifting field that hides the address: dots, with one Greek letter in seven. */
export function seedParticles({ tone, large, box }: FieldSpec & { box: Box }): Particle[] {
  const rand = mulberry32(large ? 4 : 9);
  const colors = PALETTE[tone];
  return Array.from({ length: large ? 90 : 34 }, (_, i) => {
    const x = rand() * box.width;
    const y = rand() * box.height;
    return {
      x,
      y,
      sx: x,
      sy: y,
      tx: x,
      ty: y,
      vx: (rand() - 0.5) * 0.25,
      vy: (rand() - 0.5) * 0.25,
      r: 0.9 + rand() * 1.5,
      delay: 0,
      bend: 0,
      color: colors[i % colors.length],
      glyph: i % 7 === 0 ? GLYPHS[i % GLYPHS.length] : undefined,
      born: 0,
    };
  });
}

interface SampleSpec {
  text: string;
  font: string;
  left: number;
  baseline: number;
  w: number;
  h: number;
  step: number;
}

/** Pixels of `text` drawn exactly where the real link sits (same font, same baseline). */
function sampleAt({ text, font, left, baseline, w, h, step }: SampleSpec) {
  const c = document.createElement("canvas");
  c.width = Math.ceil(w);
  c.height = Math.ceil(h);
  const ctx = c.getContext("2d", { willReadFrequently: true })!;
  ctx.font = font;
  ctx.textBaseline = "alphabetic";
  ctx.fillText(text, left, baseline);
  const data = ctx.getImageData(0, 0, c.width, c.height).data;
  const pts: [number, number][] = [];
  for (let y = 0; y < c.height; y += step) for (let x = 0; x < c.width; x += step) if (data[(y * c.width + x) * 4 + 3] > 120) pts.push([x, y]);
  return pts;
}

interface Layout {
  /** root box */
  rr: Box;
  /** laid-out text box */
  tr: Box;
}

/** Glyph pixels of the invisible, laid-out link, in the root's coordinates. */
export function glyphTargets({ rr, tr, text, email, large }: Layout & { text: HTMLElement; email: string; large: boolean }) {
  const cs = getComputedStyle(text);
  const font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
  const probe = document.createElement("canvas").getContext("2d")!;
  probe.font = font;
  const ascent = probe.measureText(email).fontBoundingBoxAscent || parseFloat(cs.fontSize) * 0.8;
  const baseline = tr.top - rr.top + ascent;
  return sampleAt({ text: email, font, left: tr.left - rr.left, baseline, w: rr.width, h: rr.height, step: large ? 2 : 1 });
}

/** Re-aims the field at `targets`, left to right; extra particles gather from the edges, fading in. */
export function aimParticles({ field, targets, rr, tr, tone, large }: Layout & FieldSpec & { field: Particle[]; targets: [number, number][] }) {
  const rand = mulberry32(11);
  const colors = PALETTE[tone];
  const span = Math.max(1, tr.width);
  return targets.map(([tx, ty], i): Particle => {
    const src = field[i % field.length];
    const fresh = i >= field.length;
    const sx = fresh ? (rand() < 0.5 ? -10 : rr.width + 10) * rand() + rand() * rr.width * 0.3 : src.x;
    const sy = fresh ? rand() * rr.height : src.y;
    return {
      ...src,
      x: sx,
      y: sy,
      sx,
      sy,
      tx,
      ty,
      glyph: undefined,
      color: colors[i % colors.length],
      delay: ((tx - (tr.left - rr.left)) / span) * SPREAD + rand() * 90,
      bend: (rand() - 0.5) * (large ? 46 : 18),
      born: fresh ? rand() * 160 : -999,
    };
  });
}
