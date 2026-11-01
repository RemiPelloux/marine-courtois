/**
 * Logistic growth dN/dt = r N (1 − N/K): the exact solution and an explicit
 * Euler scheme, used by the outreach modules to show what a simulation does.
 */
export function logisticExact(t: number, r: number, K: number, N0: number) {
  return K / (1 + ((K - N0) / N0) * Math.exp(-r * t));
}

/** Euler steps of size dt from 0 to tEnd: [t, N] pairs, including both ends. */
export function logisticEuler(r: number, K: number, N0: number, dt: number, tEnd: number): [number, number][] {
  const out: [number, number][] = [[0, N0]];
  let N = N0;
  for (let t = dt; t <= tEnd + 1e-9; t += dt) {
    N += dt * r * N * (1 - N / K);
    out.push([Number(t.toFixed(6)), N]);
  }
  return out;
}
