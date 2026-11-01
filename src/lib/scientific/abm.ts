import { mulberry32 } from "@/lib/utils/random";

/**
 * Simplified, down-scaled JavaScript adaptation of the agent-based model in
 * gitlab.com/marinecourtois/sit_remating_abm — script_ABM_batchrun.py (Mesa).
 *
 * Kept from the source (with the literature references cited in the script):
 *  - sterile male lifespan 1–36 days; wild males 31–129; females 21–144
 *  - larval stage mortality schedule, emergence after 6–11 days, sex ratio 0.5
 *  - mating: wild male with probability W / (W + η·S), η = 0.59
 *  - refractory periods 3–13 days (fertile mating) and 4–11 days (sterile)
 *  - Poisson egg laying (mean 6 / day), larval load-carrying capacity
 *  - sperm-use rules "first", "last", "mixed"
 * Simplified: populations scaled by SCALE (default 1/50), no harvest, no
 * "choice"/"preference" rules, initial ages drawn as in the script.
 * This is a didactic demonstrator — results are not comparable with the article.
 */

export type SpermRule = "first" | "last" | "mixed";

export interface ABMParams {
  rule: SpermRule;
  /** sterile males released per day (already scaled) */
  releasePerDay: number;
  /** larval load-carrying capacity (scaled) */
  capacity: number;
  initialWildMales: number;
  initialFemales: number;
  seed: number;
}

export const ABM_SCALE = 1 / 50;

export const ABM_DEFAULTS: ABMParams = {
  rule: "last",
  releasePerDay: 200, // 10 000 × 1/50
  capacity: Math.round(36000 * ABM_SCALE),
  initialWildMales: Math.round(1000 * ABM_SCALE),
  initialFemales: Math.round(1000 * ABM_SCALE),
  seed: 1,
};

interface Female {
  death: number;
  wait: number;
  fertile: number;
  sterile: number;
  first: 0 | 1 | null;
  last: 0 | 1 | null;
}

interface Larva {
  death: number | null;
  emergence: number;
}

export interface ABMSnapshot {
  t: number;
  larvae: number;
  females: number;
  wildMales: number;
  sterileMales: number;
  /** females by spermatheca content: only fertile / only sterile / both / unmated */
  femaleStates: { fertile: number; sterile: number; mixed: number; unmated: number };
}

const ETA = 0.59;
const EGGS = 6;

export class RematingABM {
  t = 0;
  private rand: () => number;
  private females: Female[] = [];
  private larvae: Larva[] = [];
  /** death-day histograms for males (individuals are identical apart from death date) */
  private wildDeaths = new Map<number, number>();
  private sterileDeaths = new Map<number, number>();
  private wild = 0;
  private sterile = 0;

  constructor(readonly p: ABMParams) {
    this.rand = mulberry32(p.seed * 7919 + 13);
    for (let i = 0; i < p.initialWildMales; i++) {
      const life = this.randint(31, 129);
      this.addWild(life - this.randint(0, life));
    }
    for (let i = 0; i < p.initialFemales; i++) {
      const life = this.randint(21, 144);
      this.females.push({ death: life - this.randint(0, life), wait: 0, fertile: 1, sterile: 0, first: 1, last: 1 });
    }
  }

  /** numpy.random.randint(a, b): integer in [a, b) */
  private randint(a: number, b: number) {
    return a + Math.floor(this.rand() * (b - a));
  }
  private bernoulli(p: number) {
    return this.rand() < p;
  }
  private poisson(lambda: number) {
    if (lambda <= 0) return 0;
    const L = Math.exp(-lambda);
    let k = 0;
    let p = 1;
    do {
      k++;
      p *= this.rand();
    } while (p > L);
    return k - 1;
  }
  private addWild(daysLeft: number) {
    const d = this.t + daysLeft;
    this.wildDeaths.set(d, (this.wildDeaths.get(d) ?? 0) + 1);
    this.wild++;
  }
  private addSterile(n: number) {
    for (let i = 0; i < n; i++) {
      const d = this.t + this.randint(1, 36);
      this.sterileDeaths.set(d, (this.sterileDeaths.get(d) ?? 0) + 1);
    }
    this.sterile += n;
  }
  private larvaMortality(): number | null {
    if (this.bernoulli(0.132)) return this.t + 1;
    if (this.bernoulli(0.087)) return this.t + 2;
    if (this.bernoulli(0.048)) return this.t + 3;
    if (this.bernoulli(0.1)) return this.t + this.randint(4, 6);
    if (this.bernoulli(0.056)) return this.t + this.randint(7, 12);
    return null;
  }

  step() {
    this.t += 1;
    // releases (continuous: one event per day)
    this.addSterile(this.p.releasePerDay);

    // male deaths
    const dw = this.wildDeaths.get(this.t) ?? 0;
    this.wild -= dw;
    this.wildDeaths.delete(this.t);
    const ds = this.sterileDeaths.get(this.t) ?? 0;
    this.sterile -= ds;
    this.sterileDeaths.delete(this.t);

    // larvae: death or emergence
    const nextLarvae: Larva[] = [];
    for (const l of this.larvae) {
      if (l.death !== null && this.t >= l.death) continue;
      if (this.t >= l.emergence) {
        if (this.bernoulli(0.5)) this.addWild(this.randint(31, 129));
        else this.females.push({ death: this.t + this.randint(21, 144), wait: 0, fertile: 0, sterile: 0, first: null, last: null });
        continue;
      }
      nextLarvae.push(l);
    }
    this.larvae = nextLarvae;

    // females: death, mating, egg laying
    const alive: Female[] = [];
    for (const f of this.females) {
      if (this.t >= f.death) continue;
      if (f.wait === 0) {
        const pWild = this.wild + ETA * this.sterile > 0 ? this.wild / (this.wild + ETA * this.sterile) : 0;
        if (this.wild + this.sterile > 0) {
          if (this.bernoulli(pWild)) {
            f.fertile += 1;
            f.wait = this.randint(3, 13);
            f.last = 1;
            if (f.first === null) f.first = 1;
          } else {
            f.sterile += 1;
            f.wait = this.randint(4, 11);
            f.last = 0;
            if (f.first === null) f.first = 0;
          }
        }
      } else {
        f.wait -= 1;
      }
      this.layEggs(f);
      alive.push(f);
    }
    this.females = alive;
  }

  private layEggs(f: Female) {
    if (f.fertile <= 0) return;
    let n = 0;
    if (this.p.rule === "first") {
      if (f.first === 1) n = this.poisson(EGGS);
    } else if (this.p.rule === "last") {
      if (f.last === 1) n = this.poisson(EGGS);
    } else {
      n = this.poisson((f.fertile / (f.fertile + f.sterile)) * EGGS);
    }
    if (n > 0 && this.larvae.length + n < this.p.capacity) {
      for (let i = 0; i < n; i++) this.larvae.push({ death: this.larvaMortality(), emergence: this.t + this.randint(6, 12) });
    }
  }

  snapshot(): ABMSnapshot {
    const s = { fertile: 0, sterile: 0, mixed: 0, unmated: 0 };
    for (const f of this.females) {
      if (f.fertile > 0 && f.sterile > 0) s.mixed++;
      else if (f.fertile > 0) s.fertile++;
      else if (f.sterile > 0) s.sterile++;
      else s.unmated++;
    }
    return {
      t: this.t,
      larvae: this.larvae.length,
      females: this.females.length,
      wildMales: this.wild,
      sterileMales: this.sterile,
      femaleStates: s,
    };
  }
}

export function runABM(params: Partial<ABMParams>, days: number): ABMSnapshot[] {
  const m = new RematingABM({ ...ABM_DEFAULTS, ...params });
  const out = [m.snapshot()];
  for (let i = 0; i < days; i++) {
    m.step();
    out.push(m.snapshot());
  }
  return out;
}
