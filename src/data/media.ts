import { mediaAssetSchema, type MediaAsset } from "@/types/portfolio";
import { FIGURES } from "@/data/figures";
import { figuresIn } from "@/data/code";
import type { z } from "zod";
import type { Lang } from "@/i18n/config";
import { merge, type Overlay } from "@/i18n/localize";

/**
 * Media library. Thesis figures are registered automatically; add photos,
 * screenshots, GIFs or videos here (files in public/media/) and reference
 * them by id from a project, a feature or a communication.
 */
const RAW: z.input<typeof mediaAssetSchema>[] = [
  {
    id: "jae-graphical-abstract",
    kind: "image",
    src: "/figures/jae/graphical-abstract.webp",
    width: 1400,
    height: 788,
    alt: "Résumé graphique de l'article : à gauche, les poissons invasifs consomment plus que les non invasifs ; à droite, en séparant l'aire d'étude, seuls les invasifs étudiés dans leur aire native se distinguent, ceux étudiés dans leur aire d'introduction rejoignant les non invasifs.",
    caption: "Résumé graphique de l'étude : la différence de réponse fonctionnelle tient aux espèces invasives étudiées dans leur aire native.",
    credit: "Courtois et al. 2026, Journal of Animal Ecology — Zenodo 10.5281/zenodo.18377688, CC BY 4.0",
  },
];

/** English alt text and captions of the media above; thesis figures come from their own overlay. */
const EN_MEDIA: Record<string, Overlay<MediaAsset>> = {
  "jae-graphical-abstract": {
    alt: "Graphical abstract of the article: on the left, invasive fish consume more than non-invasive ones; on the right, once the study range is separated, only invasive species studied in their native range stand out, those studied in their introduced range joining the non-invasive ones.",
    caption: "Graphical abstract of the study: the difference in functional response comes from invasive species studied in their native range.",
  },
};

const figureMedia = (figures: typeof FIGURES): MediaAsset[] =>
  figures.map((f) => ({ id: f.id, kind: "image", src: f.src, width: f.width, height: f.height, alt: f.alt, caption: f.caption, credit: `thesisData — ${f.notebook}` }));

const PHOTOS: MediaAsset[] = RAW.map((m) => mediaAssetSchema.parse(m));

export const MEDIA: MediaAsset[] = [...PHOTOS, ...figureMedia(FIGURES)];

export const getMedia = (id: string) => MEDIA.find((m) => m.id === id);

/** The media library in a language. */
export function mediaIn(lang: Lang): MediaAsset[] {
  if (lang === "fr") return MEDIA;
  return [...PHOTOS.map((m) => merge(m, EN_MEDIA[m.id])), ...figureMedia(figuresIn(lang))];
}

export const getMediaIn = (lang: Lang, id: string) => mediaIn(lang).find((m) => m.id === id);
