import { mediaAssetSchema, type MediaAsset } from "@/types/portfolio";
import { FIGURES } from "@/data/figures";
import type { z } from "zod";

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

export const MEDIA: MediaAsset[] = [
  ...RAW.map((m) => mediaAssetSchema.parse(m)),
  ...FIGURES.map((f) => ({ id: f.id, kind: "image" as const, src: f.src, width: f.width, height: f.height, alt: f.alt, caption: f.caption, credit: `thesisData — ${f.notebook}` })),
];

export const getMedia = (id: string) => MEDIA.find((m) => m.id === id);
