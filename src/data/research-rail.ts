import { RESEARCH_THEMES } from "@/data/research";
import { getPublication } from "@/data/publications";
import { getFigure } from "@/data/code";

export type RailFigure = { src: string; width: number; height: number; alt: string; notebook: string };

export type RailItem = {
  slug: string;
  index: string;
  title: string;
  short: string;
  lede: string;
  /** "Thèse 2025 · Bulletin of Mathematical Biology 2025" */
  sources: string;
  figure?: RailFigure;
};

const sourceLabel = (id: string) => {
  const p = getPublication(id);
  if (!p) return undefined;
  return `${p.publicationType === "these" ? "Thèse" : p.journal} ${p.year}`;
};

/** One entry per research theme, with its thesis figure when the theme has one. */
export function researchRailItems(): RailItem[] {
  return RESEARCH_THEMES.map((t) => {
    const f = getFigure(t.figureId);
    return {
      slug: t.slug,
      index: t.index,
      title: t.title,
      short: t.short,
      lede: t.lede,
      sources: t.publicationIds.map(sourceLabel).filter(Boolean).join(" · "),
      figure: f && { src: f.src, width: f.width, height: f.height, alt: f.alt, notebook: f.notebook },
    };
  });
}

/** Thesis figure of the first research theme a publication belongs to, keyed by publication id. */
export function publicationPreviews(publications: { id: string; researchSlugs: string[] }[]): Record<string, RailFigure> {
  const bySlug = new Map(researchRailItems().map((t) => [t.slug, t.figure]));
  const entries = publications.flatMap((p) => {
    const figure = p.researchSlugs.map((s) => bySlug.get(s)).find(Boolean);
    return figure ? [[p.id, figure] as const] : [];
  });
  return Object.fromEntries(entries);
}
