import { simulateRF } from "@/lib/scientific/residual-fertility";
import { simulateRemating, REMATING_INITIAL_LOW } from "@/lib/scientific/remating";
import { knipling, kniplingThreshold, cobweb } from "@/lib/scientific/knipling";
import { runABM } from "@/lib/scientific/abm";

const F = (o: object, t: number) => simulateRF(o).states[t][1];

describe("residual-fertility model (port of Script_Manuscrit_SIT_RF.ipynb)", () => {
  it("stays at the initial equilibrium without releases", () => {
    expect(F({ sigma: 0 }, 300)).toBeCloseTo(982.6, 0);
  });
  // reference values read from the notebook's temporal-dynamics figure (t = 300 days)
  it.each([
    [{ sigma: 500 }, 18, 6],
    [{ sigma: 500, delta: 0.01 }, 175, 8],
    [{ sigma: 500, epsilon: 0.01 }, 47, 6],
    [{ sigma: 5000, delta: 0.01 }, 74, 6],
    [{ sigma: 5000, epsilon: 0.01 }, 6, 3],
  ])("reproduces the notebook figure for %o", (params, expected, tol) => {
    expect(Math.abs(F(params, 300) - expected)).toBeLessThan(tol);
  });
  it("never produces negative densities", () => {
    const r = simulateRF({ sigma: 5000 });
    expect(r.states.every((s) => s.every((v) => v >= 0))).toBe(true);
  });
});

describe("remating compartmental model (port of Compartmental_model_output_vAvril.ipynb)", () => {
  const L = (o: object, i: number, y0?: readonly number[], tEnd = 5000) => simulateRemating(o, { tEnd, sampleEvery: 10 }, y0).states[i][0];
  it("reaches the larval carrying-capacity equilibrium without releases", () => {
    expect(L({ sigma: 0 }, 499)).toBeGreaterThan(35000);
  });
  it("First eliminates at σ = 450 000 while Last plateaus near 22 700 (figure A)", () => {
    expect(L({ sigma: 450000, tauF: 0, tauI: 0 }, 499)).toBeLessThan(1);
    expect(L({ sigma: 450000 }, 499)).toBeGreaterThan(22000);
    expect(L({ sigma: 450000 }, 499)).toBeLessThan(23500);
  });
  it("Last peaks lower than First under low infestation (figure B)", () => {
    const run = (o: object) => simulateRemating(o, { tEnd: 300, sampleEvery: 1 }, REMATING_INITIAL_LOW).states.map((s) => s[0]);
    expect(Math.max(...run({ sigma: 300000 }))).toBeLessThan(Math.max(...run({ sigma: 300000, tauF: 0, tauI: 0 })));
  });
});

describe("discrete Knipling-type model (chapter 2)", () => {
  it("has the unstable threshold S/(λ−1)", () => {
    expect(kniplingThreshold(3, 5)).toBe(2.5);
    expect(knipling(2.5, 3, 5)).toBeCloseTo(2.5);
  });
  it("decays below and grows above the threshold", () => {
    expect(cobweb(2, 3, 5, 30).series.at(-1)!).toBeLessThan(0.01);
    expect(cobweb(3, 3, 5, 10).series.at(-1)!).toBeGreaterThan(3);
  });
});

describe("agent-based demonstrator", () => {
  it("is deterministic for a given seed", () => {
    expect(runABM({ seed: 4 }, 30).at(-1)).toEqual(runABM({ seed: 4 }, 30).at(-1));
  });
  it("respects the larval capacity", () => {
    const r = runABM({ releasePerDay: 0 }, 60);
    expect(Math.max(...r.map((s) => s.larvae))).toBeLessThanOrEqual(720);
  });
});
