import type { Capture, Prey, Tank } from "@/lib/fish/sim";
import { drawFish } from "@/components/fish/fishShape";
import { drawTorch, drawVignette, drawWater, type Water } from "@/components/fish/scene";

/** Prey: stamped glowing plankton that pulse gently, each at its own rhythm. */
function drawPrey(ctx: CanvasRenderingContext2D, prey: Prey[], water: Water, t: number) {
  prey.forEach((p, i) => {
    const s = 9 + Math.sin(t * 2.2 + i * 1.7) * 1.6;
    if (water.preySprite) ctx.drawImage(water.preySprite, p.x - s, p.y - s, s * 2, s * 2);
    else {
      ctx.fillStyle = "rgba(143, 193, 234, 0.8)";
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.8, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}

/** A capture: a ring opens where the prey was, and three bubbles rise from it. */
function drawCapture(ctx: CanvasRenderingContext2D, c: Capture, t: number) {
  const age = t - c.t;
  const k = Math.min(1, age / 0.6);
  ctx.strokeStyle = `rgba(214, 236, 255, ${0.55 * (1 - k)})`;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(c.x, c.y, 4 + k * 18, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = `rgba(214, 236, 255, ${0.5 * Math.max(0, 1 - age / 1.4)})`;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.arc(c.x + Math.sin(age * 6 + i * 2) * 3 + (i - 1) * 5, c.y - age * (22 + i * 9), 1.4 + i * 0.5, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function drawTank(ctx: CanvasRenderingContext2D, tank: Tank, dpr: number, water: Water) {
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  drawWater(ctx, water, tank.w, tank.h, tank.t);
  // fish keep the same presence on a phone as on a wide screen
  const scale = Math.min(1, Math.max(0.5, tank.w / 1100));
  const byDepth = [...tank.fish].sort((a, b) => a.z - b.z);
  const far = byDepth.filter((f) => f.z < 0.5);
  far.forEach((f) => drawFish(ctx, f, scale));
  drawPrey(ctx, tank.prey, water, tank.t);
  for (const c of tank.captures) drawCapture(ctx, c, tank.t);
  byDepth.filter((f) => f.z >= 0.5).forEach((f) => drawFish(ctx, f, scale));
  drawTorch(ctx, tank.pointer);
  drawVignette(ctx, tank.w, tank.h);
}
