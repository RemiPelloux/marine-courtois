import type { Overlay } from "@/i18n/localize";
import type { Capability, DeclaredTool, Tool } from "@/types/content";

/** English overlay for TOOLS (skills.ts) and DECLARED_TOOLS (toolkit.ts), keyed by id. */
export const EN_TOOLS: Record<string, Overlay<Tool>> = {
  python: {
    role: "Language of every model, simulation and figure",
    evidence: ["thesisData — all notebooks"],
    versionNote: "Python 3.9.12 and 3.12.5 (notebook metadata)",
  },
  jupyter: { role: "Notebooks reproducing every figure of the thesis", evidence: ["thesisData — 11 .ipynb notebooks", "sit_remating_abm — 5 .ipynb notebooks"] },
  numpy: { role: "Numerical computing, random draws for the agents" },
  scipy: { role: "ODE integration (odeint, solve_ivp), statistics" },
  sympy: { role: "Symbolic computation of equilibria" },
  mesa: { role: "Individual-based modelling framework (agents, scheduler, data collection)" },
  pandas: { role: "Handling simulation outputs and result tables" },
  statsmodels: { role: "Linear models for the sensitivity analysis" },
  matplotlib: { role: "Scientific figures of the thesis", evidence: ["thesisData — all notebooks"] },
  seaborn: { role: "Distributions of the individual-based model outputs" },
  "python-control": { role: "Phase portraits (control.phaseplot)" },
  r: { role: "Bayesian comparative analysis (MCMCglmm, phylogeny) and figures of the functional-response study" },
  gitlab: { role: "Public sharing of code, data and thesis" },
};

export const EN_DECLARED: Record<string, Overlay<DeclaredTool>> = {
  "r-shiny": { role: "Interactive web applications written in R" },
  mysql: { role: "Relational databases, SQL queries" },
  "power-bi": { role: "Data dashboards and reports" },
  "scikit-learn": { role: "Machine learning: regression, classification, clustering" },
  pytorch: { role: "Neural networks and deep learning" },
  tensorflow: { role: "Neural networks and deep learning" },
  boosting: { role: "Gradient boosting on tabular data" },
};

/** English overlay for CAPABILITIES (skills.ts). Links keep their URLs. */
export const EN_CAPABILITIES: Record<string, Overlay<Capability>> = {
  formalisation: {
    title: "Mathematical formalisation",
    description: "Defining the variables, stating the assumptions and building models that represent the biological mechanisms under study.",
    evidenceLabel: "Mathematical modelling article, Bulletin of Mathematical Biology (2025)",
    links: [{ label: "Article (DOI)" }, { label: "Open-access version (HAL)" }],
  },
  "systemes-dynamiques": {
    title: "Dynamical systems analysis",
    description: "Studying how the models behave and how key parameters shape population dynamics.",
    evidenceLabel: "Mathematical research on the SIT and doctoral thesis (chapters 2 to 4)",
    links: [{ label: "Chapter 2 — notebook" }, { label: "theses.fr record" }],
  },
  python: {
    title: "Scientific programming in Python",
    description: "Writing scripts to run numerical experiments, analyse scenarios and produce scientific figures.",
    evidenceLabel: "Public GitLab repository of the thesis",
    links: [{ label: "thesisData on GitLab" }],
  },
  "individu-centre": {
    title: "Individual-based modelling",
    description: "Representing the behaviour of individuals and their interactions to study their consequences at the scale of a population.",
    evidenceLabel: "PLOS Computational Biology article (2026) and the sit_remating_abm repository",
    links: [{ label: "Article (DOI)" }, { label: "sit_remating_abm on GitLab" }],
  },
  statistique: {
    title: "Statistical and ecological analysis",
    description: "Using quantitative analyses to study relationships between biological traits, ecological context and observed behaviour.",
    evidenceLabel: "Journal of Animal Ecology article (2026) and the thesis sensitivity analysis",
    links: [{ label: "Article (DOI)" }, { label: "Zenodo data" }],
  },
  reproductibilite: {
    title: "Scientific reproducibility",
    description: "Sharing the scripts, notebooks and resources needed to understand and reproduce the analyses.",
    evidenceLabel: "Thesis repository and published datasets",
  },
};
