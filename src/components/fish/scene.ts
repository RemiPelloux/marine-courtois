import { rng } from "@/lib/fish/sim";

/**
 * The water around the fish: depth gradient, light shafts from the surface,
 * drifting particles at three depths, a soft vignette. Everything is a pure
 * function of time, so a paused tank (or reduced motion) shows a still frame.
 */
type Mote = { x: number; y: number; r: number; depth: number; drift: number };
export type Water = { motes: Mote[]; preySprite: HTMLCanvasElement | null };

export function makeWater(seed = 21): Water {
  const rand = rng(seed);
  const motes = Array.from({ length: 70 }, () => ({ x: rand(), y: rand(), r: 0.4 + rand() * 1.4, depth: rand(), drift: 0.3 + rand() }));
  return { motes, preySprite: typeof document === "undefined" ? null : makePreySprite() };
}

/** A small glowing plankton, drawn once and stamped for every prey. */
function makePreySprite() {
  const c = document.createElement("canvas");
  c.width = c.height = 24;
  const g = c.getContext("2d");
  if (!g) return null;
  const halo = g.createRadialGradient(12, 12, 0, 12, 12, 12);
  halo.addColorStop(0, "rgba(214, 236, 255, 0.95)");
  halo.addColorStop(0.25, "rgba(143, 193, 234, 0.7)");
  halo.addColorStop(1, "rgba(143, 193, 234, 0)");
  g.fillStyle = halo;
  g.fillRect(0, 0, 24, 24);
  return c;
}

function drawDepth(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, "#14497a");
  bg.addColorStop(0.45, "#0b2d4f");
  bg.addColorStop(1, "#061a2e");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
}

/** Five slanted shafts of light that sway slowly, added on top of the water. */
function drawShafts(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (let i = 0; i < 5; i++) {
    const x = w * (0.08 + i * 0.22) + Math.sin(t * 0.25 + i * 1.7) * w * 0.03;
    const spread = w * (0.05 + (i % 2) * 0.03);
    const shaft = ctx.createLinearGradient(0, 0, 0, h * 0.95);
    const a = 0.07 + 0.04 * Math.sin(t * 0.6 + i);
    shaft.addColorStop(0, `rgba(170, 214, 250, ${a})`);
    shaft.addColorStop(1, "rgba(170, 214, 250, 0)");
    ctx.fillStyle = shaft;
    ctx.beginPath();
    ctx.moveTo(x - spread * 0.4, 0);
    ctx.lineTo(x + spread * 0.4, 0);
    ctx.lineTo(x + spread * 1.6 + w * 0.06, h);
    ctx.lineTo(x - spread * 0.2 + w * 0.06, h);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

/** Ripples of the surface, seen from below: a bright band that shimmers. */
function drawSurface(ctx: CanvasRenderingContext2D, w: number, t: number) {
  const band = ctx.createLinearGradient(0, 0, 0, 22);
  band.addColorStop(0, "rgba(190, 225, 252, 0.22)");
  band.addColorStop(1, "rgba(190, 225, 252, 0)");
  ctx.fillStyle = band;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  for (let x = 0; x <= w; x += 24) ctx.lineTo(x, 8 + Math.sin(x * 0.03 + t * 1.4) * 3 + Math.sin(x * 0.011 - t * 0.8) * 4);
  ctx.lineTo(w, 0);
  ctx.closePath();
  ctx.fill();
}

/** Marine snow: far particles are small, dim and slow; near ones larger and faster. */
function drawMotes(ctx: CanvasRenderingContext2D, water: Water, w: number, h: number, t: number) {
  for (const m of water.motes) {
    const y = (((m.y * h - t * (4 + m.depth * 10) * m.drift) % h) + h) % h;
    const x = m.x * w + Math.sin(t * 0.5 + m.y * 20) * 6 * m.depth;
    ctx.fillStyle = `rgba(210, 232, 250, ${0.12 + m.depth * 0.3})`;
    ctx.beginPath();
    ctx.arc(x, y, m.r * (0.6 + m.depth), 0, Math.PI * 2);
    ctx.fill();
  }
}

export function drawWater(ctx: CanvasRenderingContext2D, water: Water, w: number, h: number, t: number) {
  drawDepth(ctx, w, h);
  drawShafts(ctx, w, h, t);
  drawSurface(ctx, w, t);
  drawMotes(ctx, water, w, h, t);
}

export function drawVignette(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const v = ctx.createRadialGradient(w / 2, h * 0.45, Math.min(w, h) * 0.35, w / 2, h / 2, Math.max(w, h) * 0.75);
  v.addColorStop(0, "rgba(4, 16, 30, 0)");
  v.addColorStop(1, "rgba(4, 16, 30, 0.55)");
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, w, h);
}

/** The visitor's pointer, as a faint underwater torch. */
export function drawTorch(ctx: CanvasRenderingContext2D, pointer: { x: number; y: number } | null) {
  if (!pointer) return;
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  const g = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 90);
  g.addColorStop(0, "rgba(170, 214, 250, 0.16)");
  g.addColorStop(1, "rgba(170, 214, 250, 0)");
  ctx.fillStyle = g;
  ctx.fillRect(pointer.x - 90, pointer.y - 90, 180, 180);
  ctx.restore();
}
