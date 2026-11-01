import type { Overlay } from "@/i18n/localize";
import type { Communication } from "@/types/content";

const POLYANDRY_ABM = ["Polyandry", "Individual-based simulation"];
const POLYANDRY_SIT = ["Polyandry", "SIT"];
const RF = ["Residual fertility"];

/**
 * English overlay for COMMUNICATIONS (communications.ts), keyed by id. Titles
 * stay in the language they were given in (HAL); events, places, notes and
 * themes are translated.
 */
export const EN_COMMUNICATIONS: Record<string, Overlay<Communication>> = {
  "hal-05728248": { place: "Cork, Ireland", themes: POLYANDRY_ABM },
  "hal-05108421": { event: "SMAI 2025 — 12th biennial congress of the French Society for Applied and Industrial Mathematics", themes: POLYANDRY_SIT },
  "hal-05108413": { event: "JEDNs 2025 — Nice Doctoral School Days", themes: POLYANDRY_SIT },
  "hal-04808600": {
    event: "JFSMA 2024 — 32nd French-speaking Conference on Multi-Agent Systems",
    note: "Presented with a physical poster with rotating parts, designed so that visitors could handle the model (information supplied by Marine Courtois).",
    themes: POLYANDRY_ABM,
  },
  "hal-04808537": { event: "CJC-MA 2024 — Young Researchers' Congress in Applied Mathematics", themes: RF },
  "hal-04788971": { event: "SFE² 2024 — International Congress in Ecology and Evolution, French Society for Ecology and Evolution", themes: POLYANDRY_SIT },
  "hal-04664229": { place: "Vienna, Austria", themes: POLYANDRY_SIT },
  "hal-04452111": { themes: POLYANDRY_SIT },
  "hal-04144121": { themes: RF },
  "hal-04144059": { event: "MOMI 2023 — The World of Industrial Mathematics (MOMI)", themes: RF },
  "hal-04049975": { place: "Bilbao, Spain", themes: RF },
  "hal-03928222": { place: "Heidelberg, Germany", themes: RF },
};
