import { integrateRK4, type Trajectory } from "./rk4";

/**
 * Port of `modele_SIT` from
 * thesisData / "Chapter 4 - Multiple Mating" / Compartmental_model_output_vAvril.ipynb
 * and sit_remating_abm / Compartmental_model_output.ipynb
 * (Courtois et al., PLOS Comput. Biol. 2026, doi:10.1371/journal.pcbi.1014212).
 *
 * State: L larvae, M wild males, FI infertile(ly mated) females,
 *        FF fertile(ly mated) females, S sterile males.
 * τF, τI: remating rates that switch females between FF and FI.
 * τF = τI = 0 corresponds to the "First" sperm-use scenario in the notebook,
 * τF = τI > 0 to the "Last" scenario.
 */
export interface RematingParams {
  muL: number;
  muF: number;
  muM: number;
  muS: number;
  eta: number;
  omega: number;
  K: number;
  nu: number;
  p: number;
  sigma: number;
  tauF: number;
  tauI: number;
}

export const REMATING_DEFAULTS: RematingParams = {
  muL: 0.037,
  muF: 0.012,
  muM: 0.013,
  muS: 0.054,
  eta: 0.6,
  omega: 6,
  K: 36000,
  nu: 0.08,
  p: 0.5,
  sigma: 450000,
  tauF: 0.12,
  tauI: 0.14,
};

/** "initial_conditions_high" in the notebook: [L, M, FI, FF, S] */
export const REMATING_INITIAL_HIGH: readonly number[] = [30000, 100000, 0, 100000, 0];
/** "initial_conditions_low" in the notebook */
export const REMATING_INITIAL_LOW: readonly number[] = [100, 300, 0, 300, 0];

export function rematingDerivative(q: RematingParams) {
  return (x: readonly number[]) => {
    const [L, M, FI, FF, S] = x;
    const denom = M + q.eta * S;
    const pS = denom > 0 ? (q.eta * S) / denom : 0;
    const pM = denom > 0 ? M / denom : 0;
    return [
      q.omega * (1 - L / q.K) * FF - (q.muL + q.nu) * L,
      q.nu * q.p * L - q.muM * M,
      q.nu * (1 - q.p) * pS * L + q.tauF * pS * FF - (q.muF + q.tauI * pM) * FI,
      q.nu * (1 - q.p) * pM * L + q.tauI * pM * FI - (q.muF + q.tauF * pS) * FF,
      q.sigma - q.muS * S,
    ];
  };
}

export function simulateRemating(
  params: Partial<RematingParams> = {},
  { tEnd = 5000, dt = 0.05, sampleEvery = 10 }: { tEnd?: number; dt?: number; sampleEvery?: number } = {},
  y0: readonly number[] = REMATING_INITIAL_HIGH,
): Trajectory {
  const q = { ...REMATING_DEFAULTS, ...params };
  return integrateRK4(rematingDerivative(q), y0, { tEnd, dt, sampleEvery });
}
