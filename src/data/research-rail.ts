import { researchThemesIn } from "@/data/research";
import { axisOfTheme } from "@/data/research-axes";
import { getPublication } from "@/data/publications";
import { figureIn } from "@/data/code";
import { copy, type Lang } from "@/i18n/config";
import type { ResearchTheme } from "@/types/content";
import type { ResearchAxis } from "@/types/portfolio";

export type RailFigure = { src: string; width: number; height: number; alt: string; notebook: string };

export type RailItem = {
  slug: string;
  /** letter of the research axis the work belongs to */
  axis: ResearchAxis["letter"];
  title: string;
  short: string;
  lede: string;
  /** "Thèse, chapitre 3 · Bulletin of Mathematical Biology 2025" */
  sources: string;
  figure?: RailFigure;
};

const COPY = copy({
  fr: { chapter: (n: number) => `Thèse, chapitre ${n}`, thesis: (year: number) => `Thèse ${year}` },
  en: { chapter: (n: number) => `Thesis, chapter ${n}`, thesis: (year: number) => `Thesis ${year}` },
});

/** Where a piece of work comes from: its thesis chapter first, then the articles. */
function sourcesOf(theme: ResearchTheme, lang: Lang): string {
  const t = COPY[lang];
  const labels = theme.publicationIds.flatMap((id) => {
    const p = getPublication(id);
    if (!p) return [];
    if (p.publicationType !== "these") return [`${p.journal} ${p.year}`];
    return theme.thesisChapter ? [] : [t.thesis(p.year)];
  });
  return [theme.thesisChapter ? t.chapter(theme.thesisChapter) : undefined, ...labels].filter(Boolean).join(" · ");
}

/** One illustrated entry per detail page, with its thesis figure when there is one. */
export function researchRailItems(lang: Lang = "fr"): RailItem[] {
  return researchThemesIn(lang).map((t) => {
    const f = figureIn(lang, t.figureId);
    return {
      slug: t.slug,
      axis: axisOfTheme(t.slug)?.letter ?? "A",
      title: t.title,
      short: t.short,
      lede: t.lede,
      sources: sourcesOf(t, lang),
      figure: f && { src: f.src, width: f.width, height: f.height, alt: f.alt, notebook: f.notebook },
    };
  });
}
