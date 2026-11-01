/**
 * Discrete-time sterile-release model used for the cobweb figure of
 * thesisData / "Chapter 2 - Modeling SIT" / fig_chapter2_thesis.ipynb:
 *
 *   F_{t+1} = g(F_t) = λ F_t² / (F_t + S)
 *
 * with a constant number S of sterile males per generation.
 * Equilibria: F* = 0 (stable) and F* = S / (λ − 1) (unstable, for λ > 1).
 */
export function knipling(F: number, lambda: number, S: number): number {
  if (F <= 0) return 0;
  return (lambda * F * F) / (F + S);
}

export function kniplingThreshold(lambda: number, S: number): number | null {
  return lambda > 1 ? S / (lambda - 1) : null;
}

export interface CobwebPoint {
  x: number;
  y: number;
}

/** Staircase path (x_n, x_n) → (x_n, g(x_n)) → (g(x_n), g(x_n)) … */
export function cobweb(F0: number, lambda: number, S: number, iterations: number, cap = Infinity) {
  const pts: CobwebPoint[] = [];
  const series: number[] = [F0];
  let F = F0;
  for (let i = 0; i < iterations; i++) {
    const next = knipling(F, lambda, S);
    pts.push({ x: F, y: F }, { x: F, y: Math.min(next, cap) });
    if (next > cap) break;
    pts.push({ x: next, y: next });
    series.push(next);
    F = next;
  }
  return { points: pts, series };
}
