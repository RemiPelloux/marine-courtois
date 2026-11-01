import type { Overlay } from "@/i18n/localize";
import type { Feature } from "@/data/features";

/** English overlay for FEATURES (features.ts), keyed by id. */
export const EN_FEATURES: Record<string, Overlay<Feature>> = {
  "poster-cargese": {
    title: "A poster you can handle",
    concept: [
      "At the French-speaking conference on multi-agent systems (JFSMA) in Cargèse, Marine Courtois presented her individual-based model with a physical poster fitted with rotating parts.",
      "The rotating parts were designed to improve exchanges with visitors: the poster is handled, and the discussion starts from that gesture rather than from silent reading.",
    ],
  },
};
