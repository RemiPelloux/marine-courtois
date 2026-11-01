import { PUBLICATIONS, COMMUNICATIONS, getPublication } from "@/data/publications";
import { RESEARCH_THEMES } from "@/data/research";
import { CAPABILITIES, TOOLS } from "@/data/skills";
import { CODE_FILES, FIGURES } from "@/data/code";
import { THESIS_CHAPTERS, THESIS } from "@/data/thesis";
import { SOURCES } from "@/data/sources";
import { RESEARCHER } from "@/data/researcher";
import fs from "node:fs";
import path from "node:path";

describe("content dataset", () => {
  it("contains the three verified journal articles with correct DOIs", () => {
    const dois = PUBLICATIONS.filter((p) => p.publicationType === "article").map((p) => p.doi).sort();
    expect(dois).toEqual(["10.1007/s11538-024-01401-1", "10.1111/1365-2656.70232", "10.1371/journal.pcbi.1014212"]);
  });
  it("keeps Marine as first author of every article", () => {
    for (const p of PUBLICATIONS) expect(p.authors[0]).toBe("Marine A. Courtois");
  });
  it("states the correct PhD defence date", () => {
    expect(RESEARCHER.doctorate.defenseDate).toBe("2025-11-27");
    expect(THESIS.defenseDate).toBe("2025-11-27");
  });
  it("has unique slugs", () => {
    const slugs = [...PUBLICATIONS.map((p) => p.slug), ...RESEARCH_THEMES.map((r) => r.slug)];
    expect(new Set(slugs).size).toBe(slugs.length);
  });
  it("resolves every cross-reference", () => {
    const sourceIds = new Set(Object.keys(SOURCES));
    for (const r of RESEARCH_THEMES) {
      r.publicationIds.forEach((id) => expect(getPublication(id), id).toBeDefined());
      r.codeFileIds.forEach((id) => expect(CODE_FILES.find((c) => c.id === id), id).toBeDefined());
      r.sources.forEach((s) => expect(sourceIds.has(s), s).toBe(true));
    }
    for (const p of PUBLICATIONS) p.sources.forEach((s) => expect(sourceIds.has(s), s).toBe(true));
    for (const c of CAPABILITIES) {
      c.publicationIds.forEach((id) => expect(getPublication(id), id).toBeDefined());
      c.toolIds.forEach((id) => expect(TOOLS.find((t) => t.id === id), id).toBeDefined());
    }
    for (const ch of THESIS_CHAPTERS) {
      ch.codeFileIds.forEach((id) => expect(CODE_FILES.find((c) => c.id === id), id).toBeDefined());
      if (ch.figureId) expect(FIGURES.find((f) => f.id === ch.figureId)).toBeDefined();
    }
  });
  it("ships every referenced figure file", () => {
    for (const f of FIGURES) expect(fs.existsSync(path.join(process.cwd(), "public", f.src)), f.src).toBe(true);
  });
  it("links communications to HAL", () => {
    for (const c of COMMUNICATIONS) expect(c.url).toMatch(/hal/);
  });
});
