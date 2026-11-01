import { scaleLinear, line, curveMonotoneX } from "d3";
import { simulateRF, RF_DEFAULTS, RF_INITIAL } from "@/lib/scientific/residual-fertility";
import { mulberry32, gaussian } from "@/lib/utils/random";

/**
 * Model and geometry of THE LIVING SYSTEM.
 *
 * Curves: residual-fertility SIT model (Courtois et al. 2025), ported from the
 * public notebook, with the notebook's fixed parameters. The release rate σ is
 * the editable parameter (slider = share of σ_max).
 * Points: an illustrative scatter drawn around the model trajectories. They do
 * not represent data. This is stated on screen.
 */

export const W = 880;
export const H = 560;
export const M = { top: 34, right: 26, bottom: 54, left: 58 };
export const T_END = 300;
export const SIGMA_MAX = 1000; // individuals / day at 100 %
const S_REF = SIGMA_MAX / RF_DEFAULTS.muS; // sterile male density at 100 % release, at equilibrium
const F0 = RF_INITIAL[1];
export const CYCLE_MS = 9000;

export type Mode = "observer" | "comparer";
export type TooltipKind = "wild" | "sterile" | "fan";

export interface Series {
  wild: number[];
  sterile: number[];
}

export const x = scaleLinear().domain([0, T_END]).range([M.left, W - M.right]);
export const y = scaleLinear().domain([0, 1.05]).range([H - M.bottom, M.top]);

export function series(sigma: number, extra: Partial<typeof RF_DEFAULTS> = {}): Series {
  const r = simulateRF({ sigma, ...extra }, { tEnd: T_END, dt: 0.1, sampleEvery: 1 });
  return {
    wild: r.states.map((s) => s[1] / F0),
    sterile: r.states.map((s) => s[0] / S_REF),
  };
}

export const path = line<number>()
  .x((_, i) => x(i))
  .y((d) => y(Math.min(d, 1.05)))
  .curve(curveMonotoneX);

export interface Dot {
  t: number;
  dy: number;
  kind: 0 | 1;
}

export function makeDots(count: number): Dot[] {
  const rand = mulberry32(20251127);
  const dots: Dot[] = [];
  for (let i = 0; i < count; i++) {
    const kind = (i % 2) as 0 | 1;
    dots.push({ t: rand() * T_END, dy: gaussian(rand), kind });
  }
  return dots;
}

export interface SummaryInput {
  share: number;
  sigma: number;
  main: Series;
  withRF: Series;
  mode: Mode;
}

export function buildSummary({ share, sigma, main, withRF, mode }: SummaryInput): string {
  const wildEnd = main.wild[T_END];
  const sterileEnd = main.sterile[T_END];
  const rfEnd = withRF.wild[T_END];
  return `Simulation du modèle de fertilité résiduelle avec des lâchers à ${share} % de l'intensité maximale (σ = ${Math.round(sigma)} mâles stériles par jour). Après ${T_END} jours, la densité de femelles sauvages vaut ${(wildEnd * 100).toFixed(0)} % de sa valeur initiale et celle des mâles stériles ${(sterileEnd * 100).toFixed(0)} % de la densité de référence.${mode === "comparer" ? ` Avec 1 % de mâles relâchés restés fertiles, les femelles sauvages atteignent ${(rfEnd * 100).toFixed(0)} %.` : ""}`;
}
