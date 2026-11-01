import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { LangProvider } from "@/i18n/client";
import { COMPETENCES, DOMAIN_IDS, competencesIn } from "@/data/competences";
import { EN_COMPETENCES } from "@/data/en/competences";
import { EXPERIENCES, experiencesIn } from "@/data/experiences";
import { COMMUNICATIONS } from "@/data/communications";
import { PUBLICATIONS } from "@/data/publications";
import { getSource } from "@/data/sources";
import { localizeChapters, thesisIn, THESIS_CHAPTERS } from "@/data/thesis";
import { milestonesIn } from "@/data/milestones";
import { maskBumps } from "@/lib/puzzle/mask";
import { blockMask, buildCompetenceBoard } from "@/components/parcours/board";
import { CareerPuzzle } from "@/components/parcours/CareerPuzzle";
import { splitSpecies, SpeciesText } from "@/components/ui/Species";
import CatchAll from "@/app/[lang]/[...rest]/page";
import sitemap from "@/app/sitemap";

describe("career puzzle: competences by domain", () => {
  const board = buildCompetenceBoard("fr");
  const pieces = board.domains.flatMap((d) => d.pieces);

  it("puts every piece in one of the four scientific domains", () => {
    expect(board.domains.map((d) => d.id)).toEqual([...DOMAIN_IDS]);
    expect(pieces).toHaveLength(COMPETENCES.length);
    for (const d of board.domains) for (const p of d.pieces) expect(p.domain).toBe(d.id);
  });
  it("holds no talk, publication or career event at the level of the domains", () => {
    const events = new Set([...EXPERIENCES.map((e) => e.id), ...COMMUNICATIONS.map((c) => c.id), ...PUBLICATIONS.map((p) => p.id)]);
    expect(pieces.filter((p) => events.has(p.id))).toEqual([]);
    expect(pieces.every((p) => !("kind" in p))).toBe(true);
  });
  it("sources every competence and links only to internal pages", () => {
    for (const c of competencesIn("fr")) {
      expect(c.sources.length, c.id).toBeGreaterThan(0);
      for (const s of c.sources) expect(getSource(s), `${c.id} → ${s}`).toBeDefined();
      for (const u of c.uses) expect(u.href.startsWith("/"), u.href).toBe(true);
      if (c.uses.length === 0) expect(c.ongoing || c.sources.includes("owner"), c.id).toBeTruthy();
    }
  });
  it("translates every competence", () => {
    expect(Object.keys(EN_COMPETENCES).sort()).toEqual(COMPETENCES.map((c) => c.id).sort());
    const en = competencesIn("en");
    expect(en.find((c) => c.id === "bayes")?.title).toBe("Bayesian comparative analysis");
    expect(en.find((c) => c.id === "edo")?.uses[0].label).toMatch(/^Article/);
  });
  it("refuses a competence outside the four domains", () => {
    const stray = { ...competencesIn("fr")[0], id: "talk", domain: "communication" } as unknown as ReturnType<typeof competencesIn>[number];
    expect(() => buildCompetenceBoard("fr", [stray])).toThrow(/outside the four domains/);
  });
  it("interlocks pieces inside a block and keeps block outlines flat", () => {
    expect(blockMask(6)).toEqual(["###", "###"]);
    expect(blockMask(4)).toEqual(["###", "#.."]);
    const mask = blockMask(6);
    for (let r = 0; r < 2; r++)
      for (let c = 0; c < 3; c++) {
        const b = maskBumps(mask, r, c);
        if (c < 2) expect(b.right).toBe(-maskBumps(mask, r, c + 1).left);
        else expect(b.right).toBe(0);
        if (r === 0) expect(b.bottom).toBe(-maskBumps(mask, 1, c).top);
        else expect(b.bottom).toBe(0);
      }
  });
  it("selects a domain, lists its competences with their uses, and moves with the arrow keys", () => {
    render(<CareerPuzzle board={board} />);
    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent("Mathématiques");
    const maths = screen.getByRole("button", { name: /^Mathématiques/ });
    expect(maths).toHaveAttribute("aria-pressed", "true");
    expect(screen.getAllByRole("link", { name: /Bulletin of Mathematical Biology/ })[0]).toHaveAttribute("href", "/publications/fertilite-residuelle-technique-insecte-sterile");
    fireEvent.keyDown(maths, { key: "ArrowRight" });
    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent("Statistiques");
    fireEvent.keyDown(maths, { key: "End" });
    expect(screen.getByRole("button", { name: /^Écologie/ })).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(screen.getByRole("button", { name: /^Biologie/ }));
    expect(screen.getByText("Comportement reproducteur")).toBeInTheDocument();
  });
  it("renders the English board with English labels and English links", () => {
    const { container } = render(
      <LangProvider lang="en">
        <CareerPuzzle board={buildCompetenceBoard("en")} initial="ecologie" />
      </LangProvider>,
    );
    expect(screen.getByRole("button", { name: /^Mathematics/ })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent("Ecology");
    expect(container.querySelector("svg text")?.textContent).toBe("ODE models");
    expect(within(container).getByRole("link", { name: /Research: release strategies/ })).toHaveAttribute("href", "/en/research/strategies-de-lachers");
  });
});

describe("career chronology", () => {
  it("never names CNRS and keeps only dated events", () => {
    for (const e of [...experiencesIn("fr"), ...experiencesIn("en")]) {
      expect(`${e.title} ${e.detail} ${e.label}`, e.id).not.toMatch(/CNRS/);
      expect(e.date, e.id).toBeDefined();
      expect(e.kind).not.toBe("competence");
    }
  });
  it("translates the entries and their places", () => {
    const en = experiencesIn("en");
    expect(en.find((e) => e.id === "ecmtb-2022")?.place).toBe("Heidelberg, Germany");
    expect(en.find((e) => e.id === "soutenance")?.title).toBe("PhD defence");
  });
  it("labels the defence in each language on the milestone axis", () => {
    expect(milestonesIn("en").find((m) => m.id === "soutenance")?.short).toBe("PhD defence");
    expect(milestonesIn("fr").find((m) => m.id === "soutenance")?.short).toBe("Soutenance de thèse");
  });
});

describe("thesis in two languages", () => {
  it("keeps the official French title and gives the English one", () => {
    const en = thesisIn("en");
    expect(en.titleEn).toMatch(/^Modeling the Sterile Insect Technique/);
    expect(en.title).toMatch(/^Modélisation/);
    expect(en.defenseLabel).toBe("27 November 2025");
    expect(en.resources[0].label).toBe("Thesis (PDF, archived version)");
  });
  it("translates the chapter questions, French stays untouched", () => {
    expect(localizeChapters(THESIS_CHAPTERS, "en")[2].question).toMatch(/^Despite sterilisation/);
    expect(localizeChapters(THESIS_CHAPTERS, "fr")).toEqual(THESIS_CHAPTERS);
  });
});

describe("species names", () => {
  it("italicises known binomials only", () => {
    expect(splitSpecies("SIT against Ceratitis capitata and D. suzukii")).toEqual([
      { text: "SIT against ", italic: false },
      { text: "Ceratitis capitata", italic: true },
      { text: " and ", italic: false },
      { text: "D. suzukii", italic: true },
    ]);
    expect(splitSpecies("Residual fertility")).toEqual([{ text: "Residual fertility", italic: false }]);
    const { container } = render(<SpeciesText text="Chez Drosophila suzukii" />);
    expect(container.querySelector("i")).toHaveTextContent("Drosophila suzukii");
  });
});

describe("routing leftovers", () => {
  it("has a catch-all page that renders the localized not-found", () => {
    expect(existsSync(resolve(__dirname, "../../src/app/[lang]/[...rest]/page.tsx"))).toBe(true);
    expect(() => CatchAll()).toThrow();
  });
  it("lists every page in both languages with its alternates", () => {
    const entries = sitemap();
    const career = entries.filter((e) => e.url.endsWith("/parcours") || e.url.endsWith("/en/career"));
    expect(career).toHaveLength(2);
    for (const e of entries) expect(Object.keys(e.alternates?.languages ?? {})).toEqual(["fr", "en"]);
    expect(entries.filter((e) => e.url.includes("/en/")).length * 2).toBe(entries.length - 2);
  });
});
