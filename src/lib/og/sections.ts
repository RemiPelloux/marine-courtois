import type { ImageResponse } from "next/og";
import type { Copy } from "@/i18n/config";
import { renderCard } from "@/lib/og/card";
import { cardMetadata, langParam, type ImageMeta, type Motif } from "@/lib/og/meta";

/**
 * Share card of each section page: its title (the same as the page metadata title)
 * and its motif. The coast goes to the pages about the person and her teaching,
 * the puzzle to the research, its outputs and its tools.
 */
export const SECTIONS = {
  parcours: { motif: "coast", title: { fr: "Parcours", en: "Career" } },
  recherche: { motif: "puzzle", title: { fr: "Recherche", en: "Research" } },
  publications: { motif: "puzzle", title: { fr: "Publications", en: "Publications" } },
  communications: { motif: "coast", title: { fr: "Communications", en: "Talks" } },
  enseignement: { motif: "coast", title: { fr: "Enseignement", en: "Teaching" } },
  vulgarisation: { motif: "coast", title: { fr: "Vulgarisation", en: "Outreach" } },
  projets: { motif: "puzzle", title: { fr: "Projets & applications", en: "Projects & applications" } },
  outils: { motif: "puzzle", title: { fr: "Outils", en: "Tools" } },
  these: { motif: "coast", title: { fr: "Thèse", en: "Thesis" } },
  laboratoire: { motif: "puzzle", title: { fr: "Laboratoire", en: "Lab" } },
  contact: { motif: "coast", title: { fr: "Contact", en: "Contact" } },
} satisfies Record<string, { motif: Motif; title: Copy<string> }>;

export type Section = keyof typeof SECTIONS;
export type LangParams = { lang?: string };

/** Label beside the name on a detail page (publication, project, research theme). */
export const DETAIL_LABEL = {
  publication: { fr: "Publication", en: "Publication" },
  project: { fr: "Projet", en: "Project" },
  theme: { fr: "Recherche", en: "Research" },
} satisfies Record<string, Copy<string>>;

export function sectionMetadata(section: Section, params: LangParams): ImageMeta[] {
  const { motif, title } = SECTIONS[section];
  return cardMetadata(params.lang, motif, (lang) => title[lang]);
}

export async function sectionCard(section: Section, params: Promise<LangParams>): Promise<ImageResponse> {
  const lang = langParam((await params).lang);
  const { motif, title } = SECTIONS[section];
  return renderCard({ lang, motif, title: title[lang] });
}
