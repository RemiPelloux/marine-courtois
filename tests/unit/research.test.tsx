import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { RESEARCH_AXES, researchAxesIn, getResearchAxis, axisOfTheme } from "@/data/research-axes";
import { RESEARCH_THEMES, researchThemesIn } from "@/data/research";
import { COMMUNICATIONS } from "@/data/communications";
import { axisRelations } from "@/data/relations";
import { researchRailItems } from "@/data/research-rail";
import { domainsIn } from "@/data/domains";
import { activityAxesIn } from "@/data/axes";
import { getSourceIn } from "@/data/sources";
import { publicationDepthIn } from "@/data/publication-depth";
import { getPublication } from "@/data/publications";
import { formatReference } from "@/lib/content/citation";
import { researchAxisSchema } from "@/types/portfolio";
import { titleLang } from "@/components/research/AxisCommunications";
import { ResearchRail } from "@/components/interactions/ResearchRail";
import { LangProvider } from "@/i18n/client";

vi.mock("next/image", () => ({
  default: ({ alt, src }: { alt: string; src: string }) => <span role="img" aria-label={alt} data-src={src} />,
}));
vi.mock("@/i18n/server", () => ({ getLang: async () => "fr", getA11y: async () => ({}) }));

const axis = (letter: string) => RESEARCH_AXES.find((a) => a.letter === letter)!;

describe("research axes", () => {
  it("has exactly three axes, A, B and C, each its own domain", () => {
    expect(RESEARCH_AXES.map((a) => a.letter)).toEqual(["A", "B", "C"]);
    expect(new Set(RESEARCH_AXES.map((a) => a.slug)).size).toBe(3);
    const pubs = RESEARCH_AXES.flatMap((a) => a.publicationIds);
    expect(new Set(pubs).size).toBe(pubs.length);
  });
  it("keeps axis C as declared ongoing work: no publication, no result, sourced owner, PyTorch", () => {
    const c = axis("C");
    expect(c.publicationIds).toEqual([]);
    expect(c.communicationIds).toEqual([]);
    expect(c.projectIds).toEqual([]);
    expect(c.sources).toEqual(["owner"]);
    expect(c.status).toBe("en-cours");
    expect(axisRelations(c).tools.map((t) => t.id)).toContain("pytorch");
  });
  it("attaches all twelve HAL communications to the thesis axis, and only there", () => {
    expect(axisRelations(axis("A")).communications).toHaveLength(COMMUNICATIONS.length);
    expect(COMMUNICATIONS).toHaveLength(12);
    expect(axis("B").communicationIds).toEqual([]);
  });
  it("places every detail page under axis A or B, never as an axis", () => {
    for (const t of RESEARCH_THEMES) expect(["A", "B"]).toContain(axisOfTheme(t.slug)?.letter);
    expect(axisOfTheme("ecologie-des-invasions")?.letter).toBe("B");
    expect(getResearchAxis("questions-emergentes")).toBeUndefined();
  });
  it("translates every axis and detail page into English", () => {
    expect(researchAxesIn("en").map((a) => a.title)).toEqual([
      "Population dynamics and biocontrol",
      "Invasiveness of a species and its functional response",
      "Integrating multi-omics data to study plant responses to multiple stresses",
    ]);
    const fr = researchThemesIn("fr");
    researchThemesIn("en").forEach((t, i) => expect(t.title).not.toBe(fr[i].title));
  });
  it("rejects a fourth axis letter and an axis without a source", () => {
    const base = { ...RESEARCH_AXES[0] };
    expect(() => researchAxisSchema.parse({ ...base, letter: "D" })).toThrow();
    expect(() => researchAxisSchema.parse({ ...base, sources: [] })).toThrow();
  });
});

describe("research rail in English", () => {
  it("labels each figure by its area letter and links to the detail page", () => {
    render(
      <LangProvider lang="en">
        <ResearchRail items={researchRailItems("en")} />
      </LangProvider>,
    );
    expect(screen.getAllByRole("link", { name: /Read the detail/ })).toHaveLength(RESEARCH_THEMES.length);
    expect(screen.getAllByText("Area A").length).toBeGreaterThan(0);
    expect(screen.getByText("Area B")).toBeInTheDocument();
  });
});

describe("links into the research page", () => {
  it("points every hero puzzle theme about research to an existing axis anchor", () => {
    const slugs = RESEARCH_AXES.map((a) => a.slug);
    for (const d of domainsIn("fr").filter((x) => x.href.startsWith("/recherche"))) {
      expect(slugs).toContain(d.href.split("#")[1]);
    }
  });
  it("describes three axes in the activity index, in both languages", () => {
    expect(activityAxesIn("fr")[0].summary).toMatch(/^3 axes \(A, B, C\)/);
    expect(activityAxesIn("en")[0].summary).toMatch(/^3 areas \(A, B, C\)/);
    expect(activityAxesIn("en")[0].summary).not.toMatch(/emerging/);
  });
});

describe("bilingual helpers", () => {
  it("translates source labels but never their URL, and ignores unknown ids", () => {
    expect(getSourceIn("en", "owner")?.label).toBe("Information supplied by Marine Courtois");
    expect(getSourceIn("en", "owner")?.url).toBe(getSourceIn("fr", "owner")?.url);
    expect(getSourceIn("en", "nope")).toBeUndefined();
  });
  it("gives the reading depths in English and nothing for an unknown publication", () => {
    const depth = publicationDepthIn("en", "pub-2026-functional-response");
    expect(depth?.discover.question).toBe("Why do some fish species become invasive?");
    expect(depth?.module).toBe("fish");
    expect(publicationDepthIn("en", "unknown")).toBeUndefined();
  });
  it("names the thesis in the reader's language", () => {
    const thesis = getPublication("these-2025")!;
    expect(formatReference(thesis, "en")).toContain("PhD thesis, Université Côte d'Azur");
    expect(formatReference(thesis)).toContain("Thèse de doctorat, Université Côte d'Azur");
  });
  it("detects the language of a HAL title", () => {
    expect(titleLang("Analyse de l'impact du ré-accouplement chez Drosophila suzukii")).toBe("fr");
    expect(titleLang("Multiple mating: a threat?")).toBe("en");
  });
});

describe("functional-response study", () => {
  it("is presented as an analysis of published estimates, not as an experiment", () => {
    const jae = getPublication("pub-2026-functional-response")!;
    expect(jae.approach).toMatch(/déjà publiées/);
    expect(jae.approach).toMatch(/Aucune nouvelle expérience/);
    expect(publicationDepthIn("fr", jae.id)?.deepen.limits.join(" ")).toMatch(/aucune nouvelle expérience/);
  });
});
