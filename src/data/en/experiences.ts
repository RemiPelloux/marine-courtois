import type { Overlay } from "@/i18n/localize";
import type { Experience } from "@/types/portfolio";

/** English overlay for EXPERIENCES (experiences.ts), keyed by id. */
export const EN_EXPERIENCES: Record<string, Overlay<Experience>> = {
  "ecmtb-2022": { title: "First poster: SIT against the Mediterranean fruit fly", place: "Heidelberg, Germany", detail: "Modelling, calibration and effect of residual fertility. Where the residual-fertility thread began." },
  doctorat: { label: "PhD", title: "PhD student, INRAE and Université Côte d'Azur", detail: "Three years spent modelling the sterile insect technique in an agricultural context." },
  isa: { detail: "Research setting of the thesis: INRAE and Université Côte d'Azur." },
  macbes: { title: "Work cited by the Inria MACBES team", detail: "The MACBES team's 2025 activity report mentions the thesis and its work, carried out with Frédéric Grognard, Ludovic Mailleret and Suzanne Touzeau." },
  "dsabns-2023": { title: "Poster: accounting for residual fertility", place: "Bilbao, Spain", detail: "Dynamical systems applied to biology: residual fertility in crop protection." },
  "momi-2023": { title: "Poster at MOMI, the World of Industrial Mathematics", detail: "Residual fertility presented to an industrial mathematics audience." },
  "mpdee-2023": { title: "Talk on Ceratitis capitata", detail: "How does residual fertility change the effectiveness of SIT against the Mediterranean fruit fly?" },
  "dsabns-2024": { title: "The consequences of re-mating", detail: "First presentation of multiple mating and its effects on the effectiveness of SIT." },
  "mmee-2024": { place: "Vienna, Austria", detail: "Multiple mating: a threat or an opportunity for control by sterile male releases." },
  "lyon-2024": { title: "SFE² and CJC-MA in Lyon", detail: "Two talks in the same month: “Sterility on the rocks” at the SFE² congress, then residual fertility at the young researchers' congress in applied mathematics." },
  "jfsma-2024": { title: "Individual-based model and a poster with rotating parts", detail: "Re-mating and sperm-use biases in Drosophila suzukii, presented with a physical poster that visitors handled." },
  "bmb-2025": { label: "BMB article", detail: "First article: how residual fertility limits the effectiveness of SIT." },
  "jedns-2025": { title: "Nice Doctoral School Days", detail: "When the love life of pests puts SIT to the test." },
  "smai-2025": { title: "SMAI biennial congress", detail: "“Sterility in Trouble” before the applied mathematics community." },
  "preprint-2025": { label: "bioRxiv preprint", title: "Preprint on functional responses", detail: "The preliminary version of the freshwater fish study, made public before peer review." },
  soutenance: { label: "Defence", title: "PhD defence", detail: "Modelling the sterile insect technique in an agricultural context." },
  "jae-2026": { label: "JAE article", title: "Journal of Animal Ecology, with LEHNA", detail: "A comparative study of 45 freshwater fish species, co-first-authored with Chloé Souques and carried out with co-authors from LEHNA (Université Claude Bernard Lyon 1, Villeurbanne)." },
  "plos-2026": { detail: "Multiple mating and sperm-use biases: a compartmental model and an individual-based model." },
  "mmee-2026": { title: "Poster on the individual-based model", place: "Cork, Ireland", detail: "Re-mating and sperm-use biases in Drosophila suzukii." },
};
