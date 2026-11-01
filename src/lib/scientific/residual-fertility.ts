import { integrateRK4, type Trajectory } from "./rk4";

/**
 * Port of `modele_SIT` from
 * thesisData / "Chapter 3 - Residual Fertility" / Script_Manuscrit_SIT_RF.ipynb
 * (Courtois et al., Bull. Math. Biol. 2025, doi:10.1007/s11538-024-01401-1).
 *
 *   dS/dt = −μS·S + (1−δ)·σ
 *   dF/dt = −μF·F + r(1−ρ)·(M + ε·η·S)/(k + M + η·S) · 1/(1+βF) · F
 *   dM/dt = −μM·M + rρ·(M + ε·η·S)/(k + M + η·S) · 1/(1+βF) · F + δ·σ
 *
 * Parameter values are the "fixed parameters" cell of the same notebook.
 */
export interface RFParams {
  muF: number;
  muM: number;
  muS: number;
  rho: number;
  beta: number;
  r: number;
  k: number;
  /** sterile male release rate (individuals / day) */
  sigma: number;
  /** relative mating competitiveness of sterile males */
  eta: number;
  /** costly residual fertility: fraction of matings with sterile males that are fertile */
  epsilon: number;
  /** cost-free residual fertility: fraction of released males that are fully fertile */
  delta: number;
}

export const RF_DEFAULTS: RFParams = {
  muF: 0.05,
  muM: 0.036,
  muS: 0.057,
  rho: 0.5,
  beta: 0.24,
  r: 23.7,
  k: 1.0,
  sigma: 100,
  eta: 0.2,
  epsilon: 0,
  delta: 0,
};

/** initial densities [S, F, M] used in the notebook (`x0 = [0, 983, 983]`) */
export const RF_INITIAL: readonly number[] = [0, 983, 983];

export function rfDerivative(p: RFParams) {
  return (x: readonly number[]) => {
    const [S, F, M] = x;
    const mating = (M + p.epsilon * p.eta * S) / (p.k + M + p.eta * S);
    const comp = 1 / (1 + p.beta * F);
    return [
      -p.muS * S + (1 - p.delta) * p.sigma,
      -p.muF * F + p.r * (1 - p.rho) * mating * comp * F,
      -p.muM * M + p.r * p.rho * mating * comp * F + p.delta * p.sigma,
    ];
  };
}

export function simulateRF(
  params: Partial<RFParams> = {},
  { tEnd = 300, dt = 0.05, sampleEvery = 1 }: { tEnd?: number; dt?: number; sampleEvery?: number } = {},
  y0: readonly number[] = RF_INITIAL,
): Trajectory {
  const p = { ...RF_DEFAULTS, ...params };
  return integrateRK4(rfDerivative(p), y0, { tEnd, dt, sampleEvery });
}
