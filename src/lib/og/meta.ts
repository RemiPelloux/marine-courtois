import { notFound } from "next/navigation";
import { copy, isLang, type Lang } from "@/i18n/config";
import { RESEARCHER } from "@/data/researcher";

/**
 * Metadata of the share images. Image routes cannot read root params, so the
 * language comes from the `params` Next.js hands to the route and to
 * `generateImageMetadata` (which also gives each language its own alt text).
 */
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_ID = "card";

/** Background drawing of a card: the tool puzzle, or the Garoupe lighthouse at night. */
export type Motif = "puzzle" | "coast";

const MOTIF_ALT = copy({
  fr: {
    puzzle: "Puzzle des outils et des domaines de recherche, en bleu Antibes.",
    coast: "Le phare de la Garoupe, la nuit, son faisceau au-dessus de la mer.",
  },
  en: {
    puzzle: "Puzzle of research tools and domains, in Antibes blue.",
    coast: "The Garoupe lighthouse at night, its beam sweeping over the sea.",
  },
});

export type ImageMeta = { id: string; alt: string; size: typeof OG_SIZE; contentType: "image/png" };

/** "Contact — Marine A. Courtois, Mathématiques appliquées — Analyse de données. Le phare …" */
export function cardAlt(lang: Lang, title: string, motif: Motif): string {
  return `${title.replace(/\.$/, "")} — ${RESEARCHER.name}, ${RESEARCHER.discipline[lang]}. ${MOTIF_ALT[lang][motif]}`;
}

const entry = (alt: string): ImageMeta => ({ id: OG_ID, alt, size: OG_SIZE, contentType: "image/png" });

/** Used while params are still unknown (static generation): one card must exist for the route to prerender. */
const genericEntry = () => entry(`${RESEARCHER.name} — ${RESEARCHER.discipline.fr} / ${RESEARCHER.discipline.en}`);

/** One card in the page language; none when the title cannot be found (unknown slug, draft). */
export function cardMetadata(lang: string | undefined, motif: Motif, titleIn: (lang: Lang) => string | undefined): ImageMeta[] {
  if (!isLang(lang)) return [genericEntry()];
  const title = titleIn(lang);
  return title === undefined ? [] : [entry(cardAlt(lang, title, motif))];
}

export type SlugParams = { lang?: string; slug?: string };

/** Same as cardMetadata for a [slug] route; `find` gets the slug once it is known. */
export function slugCardMetadata(params: SlugParams, motif: Motif, find: (lang: Lang, slug: string) => string | undefined): ImageMeta[] {
  const { slug } = params;
  return slug === undefined ? [genericEntry()] : cardMetadata(params.lang, motif, (lang) => find(lang, slug));
}

/** Language of an image route, or a 404. */
export function langParam(value: string | undefined): Lang {
  if (!isLang(value)) notFound();
  return value;
}
