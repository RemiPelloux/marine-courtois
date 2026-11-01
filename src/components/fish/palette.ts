import type { Copy } from "@/i18n/config";
import type { Group } from "@/lib/fish/sim";

/** Three schools in bleu Antibes tones, readable on the dark aquarium and on paper. */
export const FISH_COLOR: Record<Group, string> = { NIS: "#8fc1ea", ISNR: "#f5f2eb", ISIR: "#5b95d6" };
/** Darker equivalents for charts on paper (contrast ≥ 3:1). */
export const FISH_INK: Record<Group, string> = { NIS: "#4f86c6", ISNR: "#0b2d4f", ISIR: "#8a9bb0" };

export const GROUP_LABEL: Record<Group, Copy<string>> = {
  NIS: { fr: "Espèces non invasives", en: "Non-invasive species" },
  ISNR: { fr: "Invasives, étudiées dans leur aire native", en: "Invasive, studied in their native range" },
  ISIR: { fr: "Invasives, étudiées dans leur aire d'introduction", en: "Invasive, studied in their introduced range" },
};
export const GROUP_SHORT: Record<Group, Copy<string>> = {
  NIS: { fr: "Non invasives", en: "Non-invasive" },
  ISNR: { fr: "Invasives · aire native", en: "Invasive · native range" },
  ISIR: { fr: "Invasives · aire d'introduction", en: "Invasive · introduced range" },
};
