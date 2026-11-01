import type { Fish, Tank } from "@/lib/fish/sim";
import { FISH_COLOR } from "@/components/fish/palette";

/** One fish, pointing along its velocity. Invasives from introduction ranges are drawn in outline. */
function drawFish(ctx: CanvasRenderingContext2D, f: Fish) {
  const angle = Math.atan2(f.vy, f.vx);
  const len = f.group === "ISNR" ? 34 : 30;
  ctx.save();
  ctx.translate(f.x, f.y);
  ctx.rotate(angle);
  ctx.globalAlpha = f.busy > 0 ? 0.6 : 1;
  ctx.beginPath();
  ctx.moveTo(len * 0.55, 0);
  ctx.bezierCurveTo(len * 0.3, -len * 0.32, -len * 0.3, -len * 0.3, -len * 0.45, 0);
  ctx.bezierCurveTo(-len * 0.3, len * 0.3, len * 0.3, len * 0.32, len * 0.55, 0);
  ctx.moveTo(-len * 0.4, 0);
  ctx.lineTo(-len * 0.75, -len * 0.26);
  ctx.lineTo(-len * 0.68, 0);
  ctx.lineTo(-len * 0.75, len * 0.26);
  ctx.closePath();
  if (f.group === "ISIR") {
    ctx.strokeStyle = FISH_COLOR.ISIR;
    ctx.lineWidth = 1.6;
    ctx.stroke();
  } else {
    ctx.fillStyle = FISH_COLOR[f.group];
    ctx.fill();
  }
  ctx.fillStyle = "#0b2d4f";
  ctx.beginPath();
  ctx.arc(len * 0.3, -len * 0.06, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function drawTank(ctx: CanvasRenderingContext2D, tank: Tank, dpr: number) {
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, tank.w, tank.h);
  ctx.fillStyle = "rgba(143, 193, 234, 0.75)";
  for (const p of tank.prey) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 2.8, 0, Math.PI * 2);
    ctx.fill();
  }
  for (const f of tank.fish) drawFish(ctx, f);
}
