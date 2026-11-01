import { H, T_END, W, x, y, type Dot, type Series } from "./model";

const DOT_RADIUS = 1.55;
const DOT_FILL = ["rgba(15,29,46,0.78)", "rgba(36,104,179,0.82)"] as const;

/** Sizes the backing store to the CSS box (capped DPR), maps it to the W×H viewBox and clears it. */
export function prepareCanvas(canvas: HTMLCanvasElement | null): CanvasRenderingContext2D | null {
  if (!canvas) return null;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const cw = Math.round(rect.width * dpr);
  const ch = Math.round(rect.height * dpr);
  if (canvas.width !== cw || canvas.height !== ch) {
    canvas.width = cw;
    canvas.height = ch;
  }
  const k = (rect.width / W) * dpr;
  ctx.setTransform(k, 0, 0, k, 0, 0);
  ctx.clearRect(0, 0, W, H);
  return ctx;
}

function dotPosition(d: Dot, values: number[]) {
  const v = values[Math.min(Math.floor(d.t), T_END)];
  // spread grows with the value so the cloud stays close to zero when the population vanishes
  const spread = d.kind === 0 ? 0.018 + 0.075 * v : 0.012 + 0.07 * v;
  return { px: x(d.t), py: y(Math.max(0, v + d.dy * spread)) };
}

export interface PaintOptions {
  dots: Dot[];
  data: Series;
  tMax: number;
}

/** Paints every dot up to tMax, one filled path per population. */
export function paintDots(ctx: CanvasRenderingContext2D, { dots, data, tMax }: PaintOptions) {
  for (const kind of [0, 1] as const) {
    ctx.beginPath();
    const values = kind === 0 ? data.wild : data.sterile;
    for (const d of dots) {
      if (d.kind !== kind || d.t > tMax) continue;
      const { px, py } = dotPosition(d, values);
      ctx.moveTo(px + DOT_RADIUS, py);
      ctx.arc(px, py, DOT_RADIUS, 0, Math.PI * 2);
    }
    ctx.fillStyle = DOT_FILL[kind];
    ctx.fill();
  }
}
