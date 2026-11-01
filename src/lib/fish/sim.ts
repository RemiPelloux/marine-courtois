/**
 * Illustrative aquarium: predators search for prey, chase it, and after each
 * capture spend a handling time before hunting again. That pause is what makes
 * consumption saturate as prey become abundant — the mechanism of a type II
 * functional response. Values are illustrative; their ordering follows the
 * article (invasive species studied in their native range stand out).
 */
export type Group = "NIS" | "ISNR" | "ISIR";
export const GROUPS: Group[] = ["NIS", "ISNR", "ISIR"];

/** search radius (px), cruise speed (px/s), handling time (s) */
export const SCHOOL: Record<Group, { radius: number; speed: number; handling: number }> = {
  NIS: { radius: 70, speed: 58, handling: 1.3 },
  ISNR: { radius: 115, speed: 82, handling: 0.75 },
  ISIR: { radius: 72, speed: 60, handling: 1.25 },
};

export type Fish = { group: Group; x: number; y: number; vx: number; vy: number; busy: number; eaten: number[] };
export type Prey = { x: number; y: number };
export type Tank = { w: number; h: number; fish: Fish[]; prey: Prey[]; t: number };

/** Deterministic pseudo-random generator, so server and tests see the same tank. */
export function rng(seed: number) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

export function makeTank(w: number, h: number, preyCount: number, perSchool = 5, rand = rng(7)): Tank {
  const fish = GROUPS.flatMap((group) =>
    Array.from({ length: perSchool }, () => {
      const a = rand() * Math.PI * 2;
      return { group, x: rand() * w, y: rand() * h, vx: Math.cos(a) * 30, vy: Math.sin(a) * 30, busy: 0, eaten: [] };
    }),
  );
  const prey = Array.from({ length: preyCount }, () => ({ x: rand() * w, y: rand() * h }));
  return { w, h, fish, prey, t: 0 };
}

function nearest(f: Fish, prey: Prey[], radius: number) {
  let best = -1;
  let bestD = radius * radius;
  prey.forEach((p, i) => {
    const d = (p.x - f.x) ** 2 + (p.y - f.y) ** 2;
    if (d < bestD) [best, bestD] = [i, d];
  });
  return best;
}

function steer(f: Fish, tx: number, ty: number, speed: number, dt: number) {
  const dx = tx - f.x;
  const dy = ty - f.y;
  const len = Math.hypot(dx, dy) || 1;
  const k = Math.min(1, dt * 4);
  f.vx += ((dx / len) * speed - f.vx) * k;
  f.vy += ((dy / len) * speed - f.vy) * k;
}

function wander(f: Fish, tank: Tank, rand: () => number, dt: number) {
  const a = Math.atan2(f.vy, f.vx) + (rand() - 0.5) * 2.4 * dt;
  const sp = Math.max(18, Math.hypot(f.vx, f.vy) * 0.98);
  f.vx = Math.cos(a) * sp;
  f.vy = Math.sin(a) * sp;
  const m = 24;
  if (f.x < m) f.vx += 40 * dt * 4;
  if (f.x > tank.w - m) f.vx -= 40 * dt * 4;
  if (f.y < m) f.vy += 40 * dt * 4;
  if (f.y > tank.h - m) f.vy -= 40 * dt * 4;
}

/** Advance the tank by dt seconds. Prey keep a constant density: an eaten prey reappears elsewhere. */
export function step(tank: Tank, dt: number, rand: () => number) {
  tank.t += dt;
  for (const f of tank.fish) {
    const s = SCHOOL[f.group];
    if (f.busy > 0) {
      f.busy -= dt;
      f.vx *= 0.96;
      f.vy *= 0.96;
    } else {
      const i = nearest(f, tank.prey, s.radius);
      if (i < 0) wander(f, tank, rand, dt);
      else {
        steer(f, tank.prey[i].x, tank.prey[i].y, s.speed, dt);
        if ((tank.prey[i].x - f.x) ** 2 + (tank.prey[i].y - f.y) ** 2 < 49) {
          tank.prey[i] = { x: rand() * tank.w, y: rand() * tank.h };
          f.busy = s.handling;
          f.eaten.push(tank.t);
        }
      }
    }
    f.x = Math.min(tank.w, Math.max(0, f.x + f.vx * dt));
    f.y = Math.min(tank.h, Math.max(0, f.y + f.vy * dt));
  }
}

/** Captures per fish and per minute over the last `window` seconds, by group. */
export function captureRates(tank: Tank, window = 20): Record<Group, number> {
  const span = Math.min(window, tank.t) || 1;
  const out = { NIS: 0, ISNR: 0, ISIR: 0 } as Record<Group, number>;
  for (const g of GROUPS) {
    const school = tank.fish.filter((f) => f.group === g);
    const n = school.reduce((sum, f) => sum + f.eaten.filter((t) => t > tank.t - span).length, 0);
    out[g] = (n / school.length) * (60 / span);
  }
  return out;
}

/** Same prey density for everyone: add or remove prey to reach `count`. */
export function setPrey(tank: Tank, count: number, rand: () => number) {
  while (tank.prey.length < count) tank.prey.push({ x: rand() * tank.w, y: rand() * tank.h });
  tank.prey.length = count;
}
