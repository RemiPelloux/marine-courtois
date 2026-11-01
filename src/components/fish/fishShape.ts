import type { Fish, Group } from "@/lib/fish/sim";

/**
 * A fish drawn from its spine: a travelling wave runs from head to tail and
 * grows toward the tail (carangiform swimming), the body follows the spine,
 * the forked caudal fin follows the last vertebra. Countershading: dark back,
 * pale belly. Fish further away (low z) are smaller and fainter.
 */
type Tone = { back: string; belly: string; fin: string; outline?: string };
const TONE: Record<Group, Tone> = {
  NIS: { back: "#4f86c6", belly: "#cfe5f8", fin: "rgba(143, 193, 234, 0.75)" },
  ISNR: { back: "#9fb3c8", belly: "#fbf8f1", fin: "rgba(245, 242, 235, 0.8)" },
  ISIR: { back: "rgba(91, 149, 214, 0.35)", belly: "rgba(91, 149, 214, 0.12)", fin: "rgba(91, 149, 214, 0.55)", outline: "#7fb0e6" },
};

const SEGMENTS = 12;
type Point = { x: number; y: number; w: number };

/** Half-width of the body along the spine, s = 0 at the snout, 1 at the tail stalk. */
const halfWidth = (s: number, len: number) => len * 0.18 * Math.pow(Math.sin(Math.PI * Math.min(1, s * 0.92 + 0.06)), 0.75) * (1 - s * 0.55);

function spine(len: number, phase: number, amp: number): Point[] {
  return Array.from({ length: SEGMENTS + 1 }, (_, i) => {
    const s = i / SEGMENTS;
    return { x: len * (0.5 - s), y: amp * s * s * Math.sin(phase - s * 5.2), w: halfWidth(s, len) };
  });
}

function traceBody(ctx: CanvasRenderingContext2D, pts: Point[]) {
  ctx.beginPath();
  ctx.moveTo(pts[0].x + 2, pts[0].y);
  for (const p of pts) ctx.lineTo(p.x, p.y - p.w);
  for (let i = pts.length - 1; i >= 0; i--) ctx.lineTo(pts[i].x, pts[i].y + pts[i].w);
  ctx.closePath();
}

function drawTail(ctx: CanvasRenderingContext2D, end: Point, prev: Point, len: number, fill: string) {
  const a = Math.atan2(end.y - prev.y, end.x - prev.x);
  ctx.save();
  ctx.translate(end.x, end.y);
  ctx.rotate(a);
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(len * 0.12, -len * 0.06, len * 0.24, -len * 0.2);
  ctx.quadraticCurveTo(len * 0.15, 0, len * 0.24, len * 0.2);
  ctx.quadraticCurveTo(len * 0.12, len * 0.06, 0, 0);
  ctx.fill();
  ctx.restore();
}

function drawFins(ctx: CanvasRenderingContext2D, pts: Point[], len: number, phase: number, fill: string) {
  ctx.fillStyle = fill;
  const d = pts[4];
  ctx.beginPath();
  ctx.moveTo(pts[3].x, pts[3].y - pts[3].w * 0.9);
  ctx.quadraticCurveTo(d.x - len * 0.02, d.y - d.w - len * 0.12, pts[6].x, pts[6].y - pts[6].w * 0.9);
  ctx.fill();
  const p = pts[2];
  const flap = Math.sin(phase * 1.3) * 0.35;
  ctx.save();
  ctx.translate(p.x, p.y + p.w * 0.4);
  ctx.rotate(0.6 + flap);
  ctx.beginPath();
  ctx.ellipse(-len * 0.06, 0, len * 0.08, len * 0.028, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawEye(ctx: CanvasRenderingContext2D, pts: Point[], len: number) {
  const e = pts[1];
  const r = Math.max(1.4, len * 0.045);
  ctx.fillStyle = "#f5f2eb";
  ctx.beginPath();
  ctx.arc(e.x, e.y - e.w * 0.25, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#061a2e";
  ctx.beginPath();
  ctx.arc(e.x + r * 0.2, e.y - e.w * 0.25, r * 0.6, 0, Math.PI * 2);
  ctx.fill();
}

function shade(ctx: CanvasRenderingContext2D, len: number, tone: Tone) {
  const g = ctx.createLinearGradient(0, -len * 0.16, 0, len * 0.16);
  g.addColorStop(0, tone.back);
  g.addColorStop(0.55, tone.back);
  g.addColorStop(1, tone.belly);
  return g;
}

/** Body length in px: native-range invasives are drawn a little larger; depth and tank size scale all. */
export const fishLength = (f: Fish, scale = 1) => (f.group === "ISNR" ? 52 : 46) * (0.72 + f.z * 0.42) * scale;

export function drawFish(ctx: CanvasRenderingContext2D, f: Fish, scale = 1) {
  const len = fishLength(f, scale);
  const tone = TONE[f.group];
  const speed = Math.hypot(f.vx, f.vy);
  const amp = len * (0.05 + Math.min(0.09, speed / 900)) * (f.busy > 0 ? 0.5 : 1);
  const pts = spine(len, f.phase, amp);
  ctx.save();
  ctx.translate(f.x, f.y);
  ctx.rotate(f.heading);
  ctx.globalAlpha = 0.55 + f.z * 0.45;
  drawTail(ctx, pts[SEGMENTS], pts[SEGMENTS - 1], len, tone.fin);
  drawFins(ctx, pts, len, f.phase, tone.fin);
  traceBody(ctx, pts);
  ctx.fillStyle = shade(ctx, len, tone);
  ctx.fill();
  if (tone.outline) {
    ctx.strokeStyle = tone.outline;
    ctx.lineWidth = 1.4;
    ctx.stroke();
  }
  drawEye(ctx, pts, len);
  ctx.restore();
}
