/**
 * Illustrative aquarium: predators search for prey, chase it, and after each
 * capture spend a handling time before hunting again. That pause is what makes
 * consumption saturate as prey become abundant — the mechanism of a type II
 * functional response. Values are illustrative; their ordering follows the
 * article (invasive species studied in their native range stand out).
 *
 * Around that mechanism, only what makes the scene read as living water:
 * fish of a school swim loosely together while they search, turn smoothly,
 * keep their distance from the visitor's pointer; prey drift.
 */
export type Group = "NIS" | "ISNR" | "ISIR";
export const GROUPS: Group[] = ["NIS", "ISNR", "ISIR"];

/** search radius (px), cruise speed (px/s), handling time (s) */
export const SCHOOL: Record<Group, { radius: number; speed: number; handling: number }> = {
  NIS: { radius: 70, speed: 58, handling: 1.3 },
  ISNR: { radius: 115, speed: 82, handling: 0.75 },
  ISIR: { radius: 72, speed: 60, handling: 1.25 },
};

/** heading: smoothed swimming direction (rad); phase: tail-beat phase; z: depth, 0 far → 1 near */
export type Fish = { group: Group; x: number; y: number; vx: number; vy: number; busy: number; eaten: number[]; heading: number; phase: number; z: number };
export type Prey = { x: number; y: number; vx: number; vy: number };
export type Capture = { x: number; y: number; t: number; group: Group };
export type Tank = { w: number; h: number; fish: Fish[]; prey: Prey[]; t: number; captures: Capture[]; pointer: { x: number; y: number } | null };

/** Deterministic pseudo-random generator, so server and tests see the same tank. */
export function rng(seed: number) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

const spawn = (w: number, h: number, rand: () => number): Prey => ({ x: rand() * w, y: rand() * h, vx: 0, vy: 0 });

function makeFish(group: Group, w: number, h: number, rand: () => number): Fish {
  const a = rand() * Math.PI * 2;
  return { group, x: rand() * w, y: rand() * h, vx: Math.cos(a) * 30, vy: Math.sin(a) * 30, busy: 0, eaten: [], heading: a, phase: rand() * 6, z: rand() };
}

export function makeTank(w: number, h: number, preyCount: number, perSchool = 5, rand = rng(7)): Tank {
  const fish = GROUPS.flatMap((group) => Array.from({ length: perSchool }, () => makeFish(group, w, h, rand)));
  const prey = Array.from({ length: preyCount }, () => spawn(w, h, rand));
  return { w, h, fish, prey, t: 0, captures: [], pointer: null };
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

/** Loose schooling while searching: keep apart when close, align and gather when near. */
function school(f: Fish, tank: Tank, dt: number) {
  let ax = 0;
  let ay = 0;
  for (const o of tank.fish) {
    if (o === f || o.group !== f.group) continue;
    const dx = o.x - f.x;
    const dy = o.y - f.y;
    const d = Math.hypot(dx, dy) || 1;
    if (d < 26) [ax, ay] = [ax - (dx / d) * 40, ay - (dy / d) * 40];
    else if (d < 110) [ax, ay] = [ax + dx * 0.05 + (o.vx - f.vx) * 0.08, ay + dy * 0.05 + (o.vy - f.vy) * 0.08];
  }
  f.vx += ax * dt;
  f.vy += ay * dt;
}

function wander(f: Fish, tank: Tank, rand: () => number, dt: number) {
  const a = Math.atan2(f.vy, f.vx) + (rand() - 0.5) * 2.4 * dt;
  const sp = Math.max(18, Math.hypot(f.vx, f.vy) * 0.98);
  f.vx = Math.cos(a) * sp;
  f.vy = Math.sin(a) * sp;
  school(f, tank, dt);
  const m = 28;
  if (f.x < m) f.vx += 160 * dt;
  if (f.x > tank.w - m) f.vx -= 160 * dt;
  if (f.y < m) f.vy += 160 * dt;
  if (f.y > tank.h - m) f.vy -= 160 * dt;
}

/** Fish keep their distance from the pointer, as they would from a hand on the glass. */
function avoid(f: Fish, pointer: Tank["pointer"], dt: number) {
  if (!pointer) return;
  const dx = f.x - pointer.x;
  const dy = f.y - pointer.y;
  const d = Math.hypot(dx, dy);
  if (d > 0 && d < 80) {
    f.vx += (dx / d) * (80 - d) * 6 * dt;
    f.vy += (dy / d) * (80 - d) * 6 * dt;
  }
}

/** Smooth turn toward the velocity and tail beat faster when swimming fast. */
function animate(f: Fish, dt: number) {
  const target = Math.atan2(f.vy, f.vx);
  const diff = Math.atan2(Math.sin(target - f.heading), Math.cos(target - f.heading));
  f.heading += diff * Math.min(1, dt * 6);
  f.phase += dt * (3 + Math.hypot(f.vx, f.vy) * 0.11);
}

function hunt(f: Fish, tank: Tank, rand: () => number, dt: number) {
  const s = SCHOOL[f.group];
  const i = nearest(f, tank.prey, s.radius);
  if (i < 0) return wander(f, tank, rand, dt);
  steer(f, tank.prey[i].x, tank.prey[i].y, s.speed, dt);
  if ((tank.prey[i].x - f.x) ** 2 + (tank.prey[i].y - f.y) ** 2 < 49) {
    tank.captures.push({ x: tank.prey[i].x, y: tank.prey[i].y, t: tank.t, group: f.group });
    tank.prey[i] = spawn(tank.w, tank.h, rand);
    f.busy = s.handling;
    f.eaten.push(tank.t);
  }
}

/** Prey drift slowly; their density never changes. */
function drift(p: Prey, tank: Tank, rand: () => number, dt: number) {
  p.vx = (p.vx + (rand() - 0.5) * 30 * dt) * 0.98;
  p.vy = (p.vy + (rand() - 0.5) * 30 * dt) * 0.98;
  p.x = Math.min(tank.w, Math.max(0, p.x + p.vx * dt));
  p.y = Math.min(tank.h, Math.max(0, p.y + p.vy * dt));
}

/** Advance the tank by dt seconds. Prey keep a constant density: an eaten prey reappears elsewhere. */
export function step(tank: Tank, dt: number, rand: () => number) {
  tank.t += dt;
  for (const p of tank.prey) drift(p, tank, rand, dt);
  for (const f of tank.fish) {
    if (f.busy > 0) {
      f.busy -= dt;
      f.vx *= 0.96;
      f.vy *= 0.96;
    } else hunt(f, tank, rand, dt);
    avoid(f, tank.pointer, dt);
    animate(f, dt);
    f.x = Math.min(tank.w, Math.max(0, f.x + f.vx * dt));
    f.y = Math.min(tank.h, Math.max(0, f.y + f.vy * dt));
  }
  tank.captures = tank.captures.filter((c) => tank.t - c.t < 1.4);
}

/** Captures per fish and per minute over the last `window` seconds, by group. */
export function captureRates(tank: Tank, window = 20): Record<Group, number> {
  const span = Math.min(window, tank.t) || 1;
  const out = { NIS: 0, ISNR: 0, ISIR: 0 } as Record<Group, number>;
  for (const g of GROUPS) {
    const members = tank.fish.filter((f) => f.group === g);
    const n = members.reduce((sum, f) => sum + f.eaten.filter((t) => t > tank.t - span).length, 0);
    out[g] = (n / members.length) * (60 / span);
  }
  return out;
}

/** Same prey density for everyone: add or remove prey to reach `count`. */
export function setPrey(tank: Tank, count: number, rand: () => number) {
  while (tank.prey.length < count) tank.prey.push(spawn(tank.w, tank.h, rand));
  tank.prey.length = count;
}
