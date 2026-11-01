/**
 * Fixed-step 4th-order Runge–Kutta integrator.
 *
 * The original notebooks use `scipy.integrate.odeint` (adaptive LSODA).
 * For the smooth, non-stiff systems ported here, a fixed-step RK4 with a
 * small step reproduces the trajectories to well below plotting precision.
 * See tests/unit/models.test.ts for the checks.
 */
export type Derivative = (state: readonly number[], t: number) => number[];

export interface IntegrationOptions {
  t0?: number;
  tEnd: number;
  /** integration step (days) */
  dt: number;
  /** keep one sample every `sampleEvery` time units */
  sampleEvery?: number;
}

export interface Trajectory {
  t: number[];
  states: number[][];
}

export function integrateRK4(
  f: Derivative,
  y0: readonly number[],
  { t0 = 0, tEnd, dt, sampleEvery = 1 }: IntegrationOptions,
): Trajectory {
  const n = y0.length;
  let y = y0.slice();
  let t = t0;
  const ts: number[] = [t0];
  const states: number[][] = [y.slice()];
  let nextSample = t0 + sampleEvery;
  const tmp = new Array<number>(n);

  const steps = Math.round((tEnd - t0) / dt);
  for (let s = 0; s < steps; s++) {
    const k1 = f(y, t);
    for (let i = 0; i < n; i++) tmp[i] = y[i] + (dt / 2) * k1[i];
    const k2 = f(tmp, t + dt / 2);
    for (let i = 0; i < n; i++) tmp[i] = y[i] + (dt / 2) * k2[i];
    const k3 = f(tmp, t + dt / 2);
    for (let i = 0; i < n; i++) tmp[i] = y[i] + dt * k3[i];
    const k4 = f(tmp, t + dt);
    const next = new Array<number>(n);
    for (let i = 0; i < n; i++) {
      // populations are densities: clamp tiny negative round-off to zero
      next[i] = Math.max(0, y[i] + (dt / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]));
    }
    y = next;
    t = t0 + (s + 1) * dt;
    if (t >= nextSample - 1e-9) {
      ts.push(t);
      states.push(y.slice());
      nextSample += sampleEvery;
    }
  }
  return { t: ts, states };
}
