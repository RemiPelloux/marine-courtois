import type { Overlay } from "@/i18n/localize";
import type { Publication } from "@/types/content";

/** English overlay for PUBLICATIONS, keyed by id. Article titles are already in English. */
export const EN_PUBLICATIONS: Record<string, Overlay<Publication>> = {
  "pub-2026-polyandry": {
    editorialTitle: "Can multiple matings change how well biological control works?",
    summary:
      "In Drosophila suzukii, a female can mate with several males and keep their sperm. Using a mathematical model and simulations that represent every insect, the study shows that these multiple matings do not affect the sterile insect technique in the same way in the short term and in the long term.",
    question:
      "When the females of a pest mate several times, can the way they use stored sperm change the outcome of sterile male releases?",
    approach:
      "A compartmental model (differential equations) and an individual-based model written in Python with the Mesa library, comparing several sperm-use rules: first male, last male, mixing, choice and preference.",
    themes: ["Polyandry", "SIT", "Reproductive behaviour", "Individual-based simulation"],
  },
  "pub-2026-functional-response": {
    editorialTitle: "Can the ecological impact of an invasive species be predicted from its functional response?",
    authorNote: "Marine A. Courtois and Chloé Souques contributed equally to this study.",
    summary:
      "Do invasive species consume more prey? The study gathers 269 functional-response estimates already published for 45 freshwater fish species and compares them statistically. Invasive species have a higher functional response when studied in their native range, but not in the regions where they were introduced: where the measure is taken matters.",
    question:
      "Does a species' functional response — the relationship between prey abundance and its consumption — tell us about its invasiveness and its trophic impact?",
    approach:
      "A comparative statistical analysis of 269 published estimates (45 freshwater fish species, FoRAGE database), with Bayesian mixed models (MCMCglmm, in R) that account for relatedness between species and for the temperature of the original experiments. No new experiment was run; the data and material are published on Zenodo.",
    themes: ["Invasion ecology", "Functional responses", "Comparative statistical analysis", "Trophic interactions"],
    extraLinks: [{ label: "bioRxiv preprint" }],
  },
  "pub-2025-residual-fertility": {
    editorialTitle: "When sterility is not complete: what does it mean for biocontrol?",
    summary:
      "Sterilisation sometimes leaves part of the released males still fertile. The study measures what this residual fertility changes for the sterile insect technique: the models separate the situations where the pest population can be eliminated from those where it is only reduced.",
    question:
      "If a small fraction of the released males stays fertile, can the sterile insect technique still eliminate a pest population?",
    approach:
      "A model of three differential equations (sterile males, wild females and wild males), studied mathematically (equilibria and tipping thresholds, or bifurcations) and by simulation, with a sensitivity analysis of the parameters.",
    themes: ["Residual fertility", "SIT", "Population dynamics", "Mathematical modelling"],
    extraLinks: [{ label: "Open-access version (HAL)" }],
  },
  "these-2025": {
    editorialTitle: "Three years to understand the limits of a biological control strategy.",
    authorNote: "Supervision: Ludovic Mailleret, Suzanne Touzeau, Louise van Oudenhove, Frédéric Grognard.",
    journal: "PhD thesis — Université Côte d'Azur",
    summary:
      "A thesis on the sterile insect technique: which biological factors (residual fertility, multiple matings) and technical factors (budget, frequency and size of releases) can reduce its efficiency? It relies on differential equations, models that represent every insect (individual-based) and models of releases made at discrete times (impulsive).",
    question: "How can biological behaviour and technical constraints change the efficiency of a biological control strategy?",
    approach:
      "Several complementary modelling frameworks — differential equations, individual-based models, impulsive models — and a public repository of notebooks that reproduce the figures of the thesis.",
    themes: ["SIT", "Residual fertility", "Polyandry", "Impulsive releases", "Mathematical modelling"],
    extraLinks: [{ label: "Thesis DOI" }, { label: "Defence slides" }],
  },
};
