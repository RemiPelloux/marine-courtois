import type { Overlay } from "@/i18n/localize";
import type { CodeFile } from "@/types/content";

/** English descriptions of the two public repositories, by repository name. */
export const EN_REPOSITORY_DESCRIPTIONS: Record<"thesisData" | "sit_remating_abm", string> = {
  thesisData: "Python scripts and notebooks used to produce the figures of the thesis, organised by chapter.",
  sit_remating_abm: "Data and code of the multiple-mating study: compartmental model and individual-based model (Mesa).",
};

/** English overlay for CODE_FILES (code.ts). Paths, imports and code excerpts stay verbatim. */
export const EN_CODE_FILES: Record<string, Overlay<CodeFile>> = {
  "ch1-articles": { description: "Bibliometric figure of the introduction, built from a Scopus export (scopus_data.csv)." },
  "ch1-scopus": { description: "Bibliographic data used for the introduction figure." },
  "ch2-figures": {
    description: "Figures of the modelling chapter: cobweb diagram, bifurcation diagrams, phase portraits.",
    excerpt: { label: "Discrete model of sterile releases", note: "First lines of the “Cobweb diagram” cell." },
  },
  "ch3-rf": {
    description: "Simulations of the SIT model with residual fertility: function G(F), bifurcation curves, time dynamics.",
    excerpt: { label: "System of differential equations", note: "Cell 28. This system is ported to TypeScript in the model explorer." },
  },
  "ch3-sensitivity": {
    description: "Sensitivity analysis of the parameters of the residual-fertility model.",
    excerpt: { label: "Analysis environment" },
  },
  "ch4-compartmental": {
    description: "Compartmental model with remating: stability of equilibria and larval dynamics depending on sperm use.",
    excerpt: { label: "Compartmental model with remating", note: "Cell 10. This system is ported to TypeScript in the model explorer." },
  },
  "ch4-abm-output": { description: "Analysis of the individual-based model outputs (repeated simulations, reduction of the area under the curve)." },
  "ch4-appendix-1": { description: "Appendix: larval dynamics compared between the compartmental model and the individual-based model." },
  "ch4-convergence": { description: "Supplementary notebook of chapter 4 (convergence)." },
  "ch4-data": { description: "Simulation outputs of the individual-based model as CSV files (archive)." },
  "ch5-impulsive": {
    description: "Impulsive releases under a limited budget: periodic solution, frequency–amplitude trade-off.",
    excerpt: { label: "Periodic solution of impulsive releases" },
  },
  "ch5-oviposition": { description: "Oviposition punctures and fruit quality in the agricultural context." },
  manuscript: { description: "Thesis (archived version, PDF)." },
  slides: { description: "Slides of the thesis defence (PDF)." },
  "abm-script": {
    description: "Complete individual-based model (sterile male, wild male, larva and female agents) and batch runs on a computing cluster.",
    excerpt: { label: "Egg laying under the “mixed” rule", note: "Method Females_Agent.egglaying — fecundity follows the proportion of fertile matings." },
  },
  "abm-release": {
    description: "Periodic sterile male release method in RematingModel.",
    excerpt: { label: "Periodic releases" },
  },
  "abm-notebook": { description: "Complete implementation of the individual-based model with example simulations." },
  "abm-compartmental": { description: "Figures of section 2 of the article: analysis of the compartmental model." },
};
