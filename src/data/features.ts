import type { Lang } from "@/i18n/config";
import { localizeById } from "@/i18n/localize";
import { EN_FEATURES } from "@/data/en/features";

/**
 * Editorial features: a communication or a result that deserves its own
 * staging. Media ids point to src/data/media.ts; empty until photos exist.
 */
export type Feature = {
  id: string;
  communicationId: string;
  title: string;
  concept: string[];
  mediaIds: string[];
  sources: string[];
};

export const FEATURES: Feature[] = [
  {
    id: "poster-cargese",
    communicationId: "hal-04808600",
    title: "Un poster que l'on manipule",
    concept: [
      "Aux Journées francophones sur les systèmes multi-agents, à Cargèse, Marine Courtois a présenté son modèle individu-centré avec un poster physique doté d'éléments rotatifs.",
      "Les éléments rotatifs ont été conçus pour améliorer les échanges avec les visiteurs : le poster se manipule, et la discussion part de ce geste plutôt que d'une lecture silencieuse.",
    ],
    mediaIds: [],
    sources: ["hal", "owner"],
  },
];

export const getFeature = (id: string) => FEATURES.find((f) => f.id === id);
export const featureIn = (lang: Lang, id: string) => localizeById(FEATURES, EN_FEATURES, lang).find((f) => f.id === id);
