import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { TEACHING_ACTIVITIES, teachingIn } from "@/data/teaching";
import { EN_TEACHING } from "@/data/en/teaching";
import { outreachModulesIn, OUTREACH_MODULES } from "@/data/vulgarisation";
import { TeachingActivities } from "@/components/teaching/TeachingActivities";
import { HollingExplorer } from "@/components/fish/HollingExplorer";
import { bifurcationBranches, sterileForEquilibrium } from "@/components/vulgarisation/BifurcationDiagram";
import { LangProvider } from "@/i18n/client";
import { teachingActivitySchema } from "@/types/portfolio";

const YEAR = /\b(19|20)\d{2}\b/;

describe("teaching", () => {
  it("renders the six supplied entries, Polytech and ISA first, with no year", () => {
    const { container } = render(<TeachingActivities activities={teachingIn("fr")} lang="fr" />);
    const featured = screen.getByRole("list", { name: "Enseignements principaux" });
    const names = within(featured).getAllByRole("heading", { level: 3 }).map((h) => h.textContent);
    expect(names).toEqual(["Polytech Nice Sophia", "Institut Sophia Agrobiotech"]);
    for (const t of TEACHING_ACTIVITIES) expect(container.textContent).toContain(t.subjects);
    expect(TEACHING_ACTIVITIES).toHaveLength(6);
    expect(container.textContent).not.toMatch(YEAR);
    expect(container).toHaveTextContent("informations fournies par Marine Courtois");
  });

  it("keeps the Valrose campus as one summary and names no host for the two masters", () => {
    expect(TEACHING_ACTIVITIES.filter((t) => t.emphasis === "summary").map((t) => t.programme)).toEqual(["L2", "L3"]);
    for (const id of ["m1-biocontrol", "m2-bioinformatique"]) expect(TEACHING_ACTIVITIES.find((t) => t.id === id)?.institution).toBeUndefined();
    expect(TEACHING_ACTIVITIES.every((t) => t.sources.includes("owner"))).toBe(true);
  });

  it("translates every entry and keeps institution names", () => {
    expect(Object.keys(EN_TEACHING).sort()).toEqual(TEACHING_ACTIVITIES.map((t) => t.id).sort());
    const en = teachingIn("en");
    expect(en.find((t) => t.id === "isa-licence-pro")).toMatchObject({ institution: "Institut Sophia Agrobiotech", subjects: "Data analysis in Excel" });
    expect(en.find((t) => t.id === "m1-biocontrol")?.subjects).toBe("Statistics in R, linear models and ANOVA, taught in English");
    render(<TeachingActivities activities={en} lang="en" />);
    expect(screen.getByRole("list", { name: "Main teaching" })).toBeInTheDocument();
    expect(screen.getByText("Source: information provided by Marine Courtois.")).toBeInTheDocument();
  });

  it("rejects an entry without a source or with an unknown emphasis", () => {
    const base = { id: "x", programme: "M1", subjects: "R", sources: ["owner"], visibility: "public" };
    expect(() => teachingActivitySchema.parse({ ...base, sources: [] })).toThrow();
    expect(() => teachingActivitySchema.parse({ ...base, emphasis: "hero" })).toThrow();
    expect(teachingActivitySchema.parse(base).emphasis).toBe("standard");
  });
});

describe("outreach", () => {
  it("has an English version of every step and no gendered 'young' wording", () => {
    const en = outreachModulesIn("en");
    expect(en).toHaveLength(OUTREACH_MODULES.length);
    en.forEach((m, i) => {
      expect(m.title).not.toBe(OUTREACH_MODULES[i].title);
      expect(m.paragraphs).toHaveLength(OUTREACH_MODULES[i].paragraphs.length);
    });
    expect(JSON.stringify(OUTREACH_MODULES)).not.toMatch(/jeunes? femelle/i);
  });

  it("redraws the thesis bifurcation diagram with the notebook's numbers", () => {
    expect(sterileForEquilibrium(500)).toBeCloseTo(0, 6);
    const b = bifurcationBranches();
    expect(b.Sc).toBeCloseTo(210.1, 1);
    expect(b.Fc).toBeGreaterThan(140);
    expect(b.Fc).toBeLessThan(150);
    expect(b.stable.every((d) => d.F >= b.Fc)).toBe(true);
    expect(b.unstable.every((d) => d.F <= b.Fc)).toBe(true);
  });
});

describe("Holling explorer in English", () => {
  it("labels sliders and chart in English, with English number format", () => {
    render(
      <LangProvider lang="en">
        <HollingExplorer equation={null} />
      </LangProvider>,
    );
    expect(screen.getByLabelText(/Attack rate/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Handling time/)).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAccessibleName(/Type II functional response with a = 1 and h = 0.1/);
    expect(document.body.textContent).not.toMatch(/Taux d'attaque|Plafond/);
  });
});
