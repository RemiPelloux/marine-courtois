import { describe, it, expect } from "vitest";
import { PUBLICATIONS, getPublication } from "@/data/publications";
import { toBibtex, formatReference, bibtexKey } from "@/lib/content/citation";
import { matchesQuery } from "@/components/interactions/PublicationIndex";
import { makeTank, step, captureRates, setPrey, rng, SCHOOL } from "@/lib/fish/sim";
import { holling } from "@/components/fish/HollingExplorer";
import { logisticEuler, logisticExact } from "@/lib/scientific/logistic";
import data from "@/data/generated/functional-responses.json";
import { PUBLICATION_DEPTH } from "@/data/publication-depth";

describe("citations", () => {
  const plos = getPublication("pub-2026-polyandry")!;
  it("writes a BibTeX entry with split volume and number", () => {
    const bib = toBibtex(plos);
    expect(bib).toMatch(/^@article\{courtois2026polyandry,/);
    expect(bib).toContain("volume = {22}");
    expect(bib).toContain("number = {4}");
    expect(bib).toContain("author = {Courtois, Marine A. and van Oudenhove, Louise and");
    expect(bib).toContain("doi = {10.1371/journal.pcbi.1014212}");
  });
  it("uses @phdthesis for the thesis", () => {
    expect(toBibtex(getPublication("these-2025")!)).toMatch(/^@phdthesis\{/);
  });
  it("formats a readable reference and unique keys", () => {
    expect(formatReference(plos)).toMatch(/^Courtois, M\. A\., van Oudenhove, L\., .* & Mailleret, L\. \(2026\)\./);
    expect(new Set(PUBLICATIONS.map(bibtexKey)).size).toBe(PUBLICATIONS.length);
  });
});

describe("publication search", () => {
  const jae = getPublication("pub-2026-functional-response")!;
  it("matches title words, authors and themes without accents", () => {
    expect(matchesQuery(jae, "predire invasive")).toBe(true);
    expect(matchesQuery(jae, "écologie invasions")).toBe(true);
    expect(matchesQuery(jae, "dechaume")).toBe(true);
    expect(matchesQuery(jae, "drosophila")).toBe(false);
    expect(matchesQuery(jae, "  ")).toBe(true);
  });
});

describe("aquarium", () => {
  const run = (prey: number) => {
    const rand = rng(3);
    const tank = makeTank(800, 400, prey, 5, rand);
    for (let i = 0; i < 1200; i++) step(tank, 1 / 30, rand);
    return captureRates(tank, 40);
  };
  it("lets captures saturate as prey become abundant (handling time)", () => {
    const low = run(6).ISNR;
    const mid = run(40).ISNR;
    const high = run(160).ISNR;
    expect(mid).toBeGreaterThan(low);
    expect(high).toBeLessThanOrEqual(60 / SCHOOL.ISNR.handling + 1);
    expect(high - mid).toBeLessThan(mid - low);
  });
  it("keeps the prey density constant and follows the article's ordering", () => {
    const rand = rng(5);
    const tank = makeTank(800, 400, 30, 5, rand);
    setPrey(tank, 50, rand);
    expect(tank.prey).toHaveLength(50);
    expect(SCHOOL.ISNR.radius).toBeGreaterThan(SCHOOL.NIS.radius);
    expect(Math.abs(SCHOOL.ISIR.handling - SCHOOL.NIS.handling)).toBeLessThan(0.2);
  });
});

describe("functional responses", () => {
  it("reproduces the article's subset: 269 estimates, 45 species", () => {
    expect(data.observations).toBe(269);
    expect(data.species).toBe(45);
    expect(new Set(data.rows.map((r) => r.group))).toEqual(new Set(["NIS", "ISNR", "ISIR"]));
  });
  it("Holling type II rises with slope a and levels at 1/h", () => {
    expect(holling(0, 1, 0.1)).toBe(0);
    expect(holling(1e6, 1, 0.1)).toBeCloseTo(10, 3);
    expect(holling(0.001, 2, 0.1) / 0.001).toBeCloseTo(2, 2);
  });
  it("gives each featured article three reading depths", () => {
    expect(Object.keys(PUBLICATION_DEPTH).sort()).toEqual(["pub-2025-residual-fertility", "pub-2026-functional-response", "pub-2026-polyandry"]);
  });
});

describe("logistic growth", () => {
  it("converges to K and Euler approaches the exact solution as the step shrinks", () => {
    expect(logisticExact(200, 0.3, 800, 10)).toBeCloseTo(800, 3);
    const err = (dt: number) => Math.abs(logisticEuler(0.3, 800, 10, dt, 20).at(-1)![1] - logisticExact(20, 0.3, 800, 10));
    expect(err(0.5)).toBeLessThan(err(4));
  });
});
