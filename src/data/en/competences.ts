import type { Overlay } from "@/i18n/localize";
import type { RawCompetence } from "@/data/competences";

/** English overlay for COMPETENCES (competences.ts), keyed by id. */
export const EN_COMPETENCES: Record<string, Overlay<RawCompetence>> = {
  edo: { label: "ODE models", title: "Ordinary differential equations", detail: "Models of populations under sterile insect releases, with and without residual fertility." },
  stabilite: { label: "Stability", title: "Equilibria and stability", detail: "Computing equilibria and their stability; bistability: depending on the initial population, extinction or a positive equilibrium." },
  bifurcations: { label: "Bifurcations", title: "Bifurcation analysis", detail: "Bifurcation curves as a function of release intensity and residual fertility level." },
  impulsionnel: { label: "Impulsive", title: "Impulsive models", detail: "Discrete releases described by impulsive equations; convergence to a periodic solution." },
  "individu-centre": { label: "Individual-based", title: "Individual-based modelling", detail: "Agent-based model written with Mesa, calibrated on Drosophila suzukii and compared with a compartmental model." },
  algebre: { label: "Linear algebra", title: "Linear algebra and matrix models", detail: "Matrices and matrix models applied to biology, taught in linear algebra." },

  bayes: { label: "Bayesian stats", title: "Bayesian comparative analysis", detail: "MCMCglmm mixed models with phylogenetic correction, on the functional responses of 45 freshwater fish species." },
  sensibilite: { label: "Sensitivity", title: "Sensitivity analysis", detail: "Sensitivity indices of the residual-fertility model parameters, estimated with linear models." },
  lineaire: { label: "Linear models", title: "Linear models and ANOVA", detail: "Linear models and analysis of variance, taught in statistics with R." },
  r: { label: "R programming", title: "Programming in R", detail: "Analysis scripts published on Zenodo; R, ggplot2 and Shiny taught to students." },
  excel: { label: "Excel analysis", title: "Data analysis in Excel", detail: "Spreadsheet data analysis, taught to students." },
  "deep-learning": { label: "Deep learning", title: "Deep learning (VAE)", detail: "Variational autoencoders applied to plant multi-omics data." },

  tis: { label: "Sterile insects", title: "Sterile insect technique", detail: "Autocidal control: sterilised, released insects reduce the reproduction of their own species." },
  fertilite: { label: "Fertility", title: "Residual fertility", detail: "Released males that keep a low fertility: two mechanisms, cost-free and costly, with distinct effects." },
  polyandrie: { label: "Polyandry", title: "Reproductive behaviour", detail: "Multiple mating by females and sperm-use rules: first male, last male, mixing." },
  ravageurs: { label: "Crop pests", title: "Insect crop pests", detail: "Ceratitis capitata and Drosophila suzukii; oviposition stings that damage fruit even without offspring." },
  physiologie: { label: "Plant biology", title: "Plant physiology", detail: "Water and mineral nutrition, photosynthesis, secondary metabolism: plant biology practical classes." },
  "multi-omique": { label: "Multi-omics", title: "Plant multi-omics", detail: "Plant transcriptomics and metabolomics." },

  populations: { label: "Populations", title: "Population dynamics", detail: "Decline of a wild population under sterile releases, and elimination thresholds." },
  predation: { label: "Predation", title: "Functional responses", detail: "A predator's consumption as a function of prey density: 269 observations on 45 freshwater fish species." },
  invasions: { label: "Invasions", title: "Biological invasions", detail: "The functional response sets invasive species apart, but the difference comes from those studied in their native range." },
  trophique: { label: "Trophic impact", title: "Trophic interactions", detail: "Linking a predator's consumption to its impact on prey: the functional response does not predict trophic impact." },
  competition: { label: "Competition", title: "Competition and thresholds", detail: "Sterile-release models with competition: beyond a release threshold, only the zero equilibrium remains." },
  "lutte-biologique": { label: "Biocontrol", title: "Biological control and release strategies", detail: "Allocating a limited budget of sterile males between release frequency and intensity." },
};
