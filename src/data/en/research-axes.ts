import type { Overlay } from "@/i18n/localize";
import type { ResearchAxis } from "@/types/portfolio";

/** English overlay for RESEARCH_AXES, keyed by id. */
export const EN_RESEARCH_AXES: Record<string, Overlay<ResearchAxis>> = {
  biocontrole: {
    title: "Population dynamics and biocontrol",
    lede: "The doctoral work. Under what conditions do releases of sterile males reduce a pest population, when sterilisation is imperfect (residual fertility), when females mate several times (polyandry), or when releases are periodic and limited by a budget?",
    methods: ["Differential equations", "Bifurcation analysis", "Impulsive models", "Individual-based models"],
  },
  invasions: {
    title: "Invasiveness of a species and its functional response",
    lede: "Do invasive species consume more prey than other species, and does that measure predict their impact? A statistical analysis of functional responses already published for 45 freshwater fish species, carried out with Chloé Souques, Yann Voituron, Loïc Teulier, François-Xavier Dechaume-Moncharmont (LEHNA, Université Claude Bernard Lyon 1) and Vincent Médoc (ENES, Saint-Étienne).",
    methods: ["Comparative analysis of published data", "Bayesian mixed models (MCMCglmm)", "Phylogenetic correction"],
  },
  multiomique: {
    title: "Integrating multi-omics data to study plant responses to multiple stresses",
    lede: "Work in progress. How does tomato respond to a stress that combines heat and salinity? Transcriptomic and metabolomic data are integrated with deep learning models, including a variational autoencoder (VAE), built with PyTorch. No result has been published yet.",
    methods: ["Deep learning", "Variational autoencoder (VAE)", "Transcriptomics", "Metabolomics"],
  },
};
