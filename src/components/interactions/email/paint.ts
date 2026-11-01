import { FLIGHT, SPREAD, type Particle } from "./field";

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

type Size = Pick<DOMRect, "width" | "height">;

/** Matches the backing store to the root (capped at 2× DPR) and clears it. */
export function fitCanvas(ctx: CanvasRenderingContext2D, rect: Size) {
  const canvas = ctx.canvas;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  if (canvas.width !== Math.round(rect.width * dpr) || canvas.height !== Math.round(rect.height * dpr)) {
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, rect.width, rect.height);
}

interface Look {
  alpha: number;
  radius: number;
}

/** Idle motion: a slow bounce inside the root, frozen under reduced motion. */
function driftParticle(q: Particle, { rect, reduce }: { rect: Size; reduce: boolean }): Look {
  if (!reduce) {
    q.x += q.vx;
    q.y += q.vy;
    if (q.x < 0 || q.x > rect.width) q.vx *= -1;
    if (q.y < 0 || q.y > rect.height) q.vy *= -1;
  }
  return { alpha: 0.75, radius: q.r };
}

/** Assembly: a curved flight onto the target pixel, then a dissolve as the text crystallises under it. */
function flyParticle(q: Particle, elapsed: number): Look {
  const p = clamp01((elapsed - q.delay) / FLIGHT);
  const e = easeOutCubic(p);
  // curved flight: a perpendicular arc that vanishes on arrival
  const arc = Math.sin(p * Math.PI) * q.bend;
  const dx = q.tx - q.sx;
  const dy = q.ty - q.sy;
  const len = Math.hypot(dx, dy) || 1;
  q.x = q.sx + dx * e + (-dy / len) * arc;
  q.y = q.sy + dy * e + (dx / len) * arc;
  const born = clamp01((elapsed - q.born) / 180);
  // dissolve once landed, as the text crystallises under it
  const land = clamp01((elapsed - q.delay - FLIGHT) / 260);
  return { alpha: (0.55 + 0.45 * e) * born * (1 - land), radius: q.r + (0.85 - q.r) * e };
}

/** A dot, or its Greek letter while the field still drifts (`glyphFont` set). */
function drawParticle(ctx: CanvasRenderingContext2D, q: Particle, { alpha, radius, glyphFont }: Look & { glyphFont: string | null }) {
  ctx.globalAlpha = alpha;
  ctx.fillStyle = q.color;
  if (q.glyph && glyphFont) {
    ctx.font = glyphFont;
    ctx.fillText(q.glyph, q.x, q.y);
    return;
  }
  ctx.beginPath();
  ctx.arc(q.x, q.y, radius, 0, Math.PI * 2);
  ctx.fill();
}

export interface FieldFrame {
  particles: Particle[];
  rect: Size;
  elapsed: number;
  assembling: boolean;
  reduce: boolean;
  large: boolean;
}

/** One frame of the field: drift, or assemble onto the link's glyphs. */
export function paintField(ctx: CanvasRenderingContext2D, f: FieldFrame) {
  const glyphFont = f.assembling ? null : `italic ${f.large ? 15 : 11}px "Instrument Serif", Georgia, serif`;
  for (const q of f.particles) {
    const look = f.assembling ? flyParticle(q, f.elapsed) : driftParticle(q, f);
    if (look.alpha <= 0.01) continue;
    drawParticle(ctx, q, { ...look, glyphFont });
  }
  ctx.globalAlpha = 1;
}

/**
 * Write-on sweep of the real text, trailing the particles' arrival, then the copy
 * button fades in. Returns true once the whole reveal has played out.
 */
export function sweepReveal({ text, copy, elapsed }: { text: HTMLElement | null; copy: HTMLElement | null; elapsed: number }) {
  if (text) {
    const s = clamp01((elapsed - FLIGHT - 40) / (SPREAD + 140));
    text.style.clipPath = `inset(-20% ${(100 - s * 100).toFixed(2)}% -20% 0)`;
    text.style.opacity = "1";
  }
  const total = FLIGHT + SPREAD + 400;
  if (copy) copy.style.opacity = String(clamp01((elapsed - total + 200) / 300));
  return elapsed > total + 320;
}
