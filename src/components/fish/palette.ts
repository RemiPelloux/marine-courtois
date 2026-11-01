import type { Group } from "@/lib/fish/sim";

/** Three schools in bleu Antibes tones, readable on the dark aquarium and on paper. */
export const FISH_COLOR: Record<Group, string> = { NIS: "#8fc1ea", ISNR: "#f5f2eb", ISIR: "#5b95d6" };
/** Darker equivalents for charts on paper (contrast ≥ 3:1). */
export const FISH_INK: Record<Group, string> = { NIS: "#4f86c6", ISNR: "#0b2d4f", ISIR: "#8a9bb0" };

export const GROUP_LABEL: Record<Group, string> = {
  NIS: "Espèces non invasives",
  ISNR: "Invasives, étudiées dans leur aire native",
  ISIR: "Invasives, étudiées dans leur aire d'introduction",
};
export const GROUP_SHORT: Record<Group, string> = { NIS: "Non invasives", ISNR: "Invasives · aire native", ISIR: "Invasives · aire d'introduction" };
