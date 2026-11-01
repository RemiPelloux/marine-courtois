import { describe, expect, it } from "vitest";
import { cardMetadata, slugCardMetadata } from "@/lib/og/meta";
import { SECTIONS, sectionMetadata } from "@/lib/og/sections";
import { titleSize, titleWords } from "@/lib/og/title";
import { getProjectIn, PROJECTS } from "@/data/projects";

describe("share card metadata", () => {
  it("gives each language its own alt text with the page title", () => {
    const [fr] = sectionMetadata("parcours", { lang: "fr" });
    const [en] = sectionMetadata("parcours", { lang: "en" });
    expect(fr.alt).toMatch(/^Parcours — Marine A\. Courtois, Mathématiques appliquées/);
    expect(en.alt).toMatch(/^Career — Marine A\. Courtois, Applied mathematics/);
    expect(en.alt).toContain("Garoupe lighthouse");
    expect(fr.size).toEqual({ width: 1200, height: 630 });
  });

  it("uses the localized title of a detail page", () => {
    const [meta] = slugCardMetadata({ lang: "en", slug: "modele-individu-centre" }, "puzzle", (l, s) => getProjectIn(l, s)?.title);
    expect(meta.alt).toMatch(/^Individual-based model of Drosophila suzukii — /);
  });

  it("has no card for an unknown slug or a draft project", () => {
    const draft = PROJECTS.find((p) => p.visibility !== "public");
    const find = (l: "fr" | "en", s: string) => getProjectIn(l, s)?.title;
    expect(slugCardMetadata({ lang: "fr", slug: "nope" }, "puzzle", find)).toEqual([]);
    if (draft) expect(slugCardMetadata({ lang: "fr", slug: draft.slug }, "puzzle", find)).toEqual([]);
  });

  it("keeps one bilingual card while params are unknown", () => {
    expect(cardMetadata(undefined, "coast", () => "x")[0].alt).toContain(" / ");
    expect(slugCardMetadata({ lang: "fr" }, "puzzle", () => undefined)).toHaveLength(1);
    expect(cardMetadata("de", "coast", () => "x")).toHaveLength(1);
  });

  it("titles every section in both languages", () => {
    for (const s of Object.values(SECTIONS)) expect(s.title.en).not.toBe("");
  });
});

describe("title layout", () => {
  it("sets species in italics and keeps French punctuation on the word before", () => {
    const words = titleWords("Modèle de Drosophila suzukii : quelles conséquences ?");
    expect(words.filter((w) => w.italic).map((w) => w.text)).toEqual(["Drosophila", "suzukii :"]);
    expect(words.at(-1)?.text).toBe("conséquences ?");
  });

  it("shrinks long titles", () => {
    expect(titleSize("Contact")).toBeGreaterThan(titleSize("Peut-on prédire l'impact écologique d'une espèce invasive à partir de sa réponse fonctionnelle ?"));
  });
});
