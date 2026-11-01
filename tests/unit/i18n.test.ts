import { describe, it, expect } from "vitest";
import { localePath, frenchPath, internalPath, switchPath, hasUntranslatedSegment, langOf } from "@/i18n/paths";
import { merge, localizeById } from "@/i18n/localize";
import { fr } from "@/i18n/locales/fr";
import { en } from "@/i18n/locales/en";

describe("localized paths", () => {
  it("keeps French URLs and translates the first segment under /en", () => {
    expect(localePath("fr", "/recherche/x")).toBe("/recherche/x");
    expect(localePath("en", "/recherche/fertilite-residuelle")).toBe("/en/research/fertilite-residuelle");
    expect(localePath("en", "/")).toBe("/en");
    expect(localePath("en", "/laboratoire#model-explorer")).toBe("/en/lab#model-explorer");
    expect(localePath("en", "/publications/a?b=1")).toBe("/en/publications/a?b=1");
  });

  it("leaves external links, anchors and mail links alone", () => {
    expect(localePath("en", "https://doi.org/10.1")).toBe("https://doi.org/10.1");
    expect(localePath("en", "#contenu")).toBe("#contenu");
    expect(localePath("en", "mailto:x@y.z")).toBe("mailto:x@y.z");
  });

  it("maps public URLs to the [lang] routes the app renders", () => {
    expect(internalPath("/")).toBe("/fr");
    expect(internalPath("/projets/x")).toBe("/fr/projets/x");
    expect(internalPath("/en")).toBe("/en");
    expect(internalPath("/en/talks")).toBe("/en/communications");
    expect(internalPath("/en/unknown")).toBe("/en/unknown");
  });

  it("round-trips every page between the two languages", () => {
    for (const p of ["/", "/parcours", "/recherche/a", "/communications", "/vulgarisation", "/enseignement", "/projets/b", "/outils", "/these", "/laboratoire", "/contact"]) {
      const english = localePath("en", p);
      expect(langOf(english)).toBe("en");
      expect(frenchPath(english)).toBe(p);
      expect(switchPath(english, "fr")).toBe(p);
      expect(switchPath(p, "en")).toBe(english);
    }
  });

  it("reads the rewritten routes the server sees while prerendering", () => {
    expect(frenchPath("/fr/parcours")).toBe("/parcours");
    expect(frenchPath("/fr")).toBe("/");
    expect(frenchPath("/en/recherche/x")).toBe("/recherche/x");
    expect(switchPath("/fr/projets/a", "en")).toBe("/en/projects/a");
    expect(switchPath("/en/communications", "fr")).toBe("/communications");
  });

  it("flags English URLs that still use a French segment", () => {
    expect(hasUntranslatedSegment("/en/recherche")).toBe(true);
    expect(hasUntranslatedSegment("/en/research")).toBe(false);
    expect(hasUntranslatedSegment("/en/publications")).toBe(false);
    expect(hasUntranslatedSegment("/recherche")).toBe(false);
  });
});

describe("translation overlays", () => {
  const base = { id: "a", title: "Titre", year: 2025, links: [{ label: "Lien", url: "https://x" }], tags: ["un", "deux"] };

  it("translates only what the overlay names and keeps the facts", () => {
    const out = merge(base, { title: "Title", links: [{ label: "Link" }], tags: ["one"] });
    expect(out).toEqual({ id: "a", title: "Title", year: 2025, links: [{ label: "Link", url: "https://x" }], tags: ["one", "deux"] });
  });

  it("returns French untouched and falls back to French for a missing id", () => {
    expect(localizeById([base], { a: { title: "Title" } }, "fr")[0].title).toBe("Titre");
    expect(localizeById([base], {}, "en")[0].title).toBe("Titre");
  });
});

describe("label dictionaries", () => {
  it("gives every French label an English counterpart", () => {
    expect(Object.keys(en).sort()).toEqual(Object.keys(fr).sort());
    for (const v of Object.values(en)) expect(v.trim()).not.toBe("");
  });
});
