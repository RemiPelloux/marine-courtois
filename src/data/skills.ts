import { capabilitySchema, toolSchema, type Capability, type Tool } from "@/types/content";
import type { z } from "zod";

/**
 * Software actually imported in Marine's public notebooks and scripts
 * (inspected 2026-11-01). Versions are those written in the notebooks.
 */
const RAW_TOOLS: z.input<typeof toolSchema>[] = [
  {
    id: "python",
    name: "Python",
    family: "langages",
    role: "Langage de l'ensemble des modèles, simulations et figures",
    evidence: ["thesisData — tous les notebooks", "sit_remating_abm/script_ABM_batchrun.py"],
    versionNote: "Python 3.9.12 et 3.12.5 (métadonnées des notebooks)",
  },
  {
    id: "jupyter",
    name: "Jupyter",
    family: "partage",
    role: "Notebooks reproduisant chaque figure du manuscrit",
    evidence: ["thesisData — 11 notebooks .ipynb", "sit_remating_abm — 5 notebooks .ipynb"],
  },
  {
    id: "numpy",
    name: "NumPy",
    family: "calcul",
    role: "Calcul numérique, tirages aléatoires des agents",
    evidence: ["Script_Manuscrit_SIT_RF.ipynb", "script_ABM_batchrun.py"],
    versionNote: "numpy 1.23.5",
  },
  {
    id: "scipy",
    name: "SciPy",
    family: "calcul",
    role: "Intégration d'EDO (odeint, solve_ivp), statistiques",
    evidence: ["Script_Manuscrit_SIT_RF.ipynb", "Compartmental_model_output_vAvril.ipynb", "Notebook_part_impulsive_releases.ipynb"],
    versionNote: "scipy 1.10.1",
  },
  {
    id: "sympy",
    name: "SymPy",
    family: "calcul",
    role: "Calcul symbolique des équilibres",
    evidence: ["Script_Manuscrit_SIT_RF.ipynb", "Sensitivity_Analysis_SIT.ipynb"],
    versionNote: "sympy 1.11.1",
  },
  {
    id: "mesa",
    name: "Mesa",
    family: "calcul",
    role: "Cadre de modélisation individu-centrée (agents, ordonnanceur, collecte de données)",
    evidence: ["script_ABM_batchrun.py"],
  },
  {
    id: "pandas",
    name: "pandas",
    family: "donnees",
    role: "Gestion des sorties de simulation et des tableaux de résultats",
    evidence: ["script_ABM_batchrun.py", "ABM_model_output.ipynb", "Sensitivity_Analysis_SIT.ipynb"],
    versionNote: "pandas 2.0.1",
  },
  {
    id: "statsmodels",
    name: "statsmodels",
    family: "calcul",
    role: "Modèles linéaires pour l'analyse de sensibilité",
    evidence: ["Sensitivity_Analysis_SIT.ipynb"],
    versionNote: "statsmodels 0.13.5",
  },
  {
    id: "matplotlib",
    name: "Matplotlib",
    family: "visualisation",
    role: "Figures scientifiques du manuscrit",
    evidence: ["thesisData — tous les notebooks"],
    versionNote: "matplotlib 3.7.1",
  },
  {
    id: "seaborn",
    name: "seaborn",
    family: "visualisation",
    role: "Visualisation des distributions de sorties du modèle individu-centré",
    evidence: ["ABM_model_output.ipynb"],
  },
  {
    id: "python-control",
    name: "python-control",
    family: "calcul",
    role: "Portraits de phase (control.phaseplot)",
    evidence: ["fig_chapter2_thesis.ipynb"],
  },
  {
    id: "r",
    name: "R",
    family: "langages",
    role: "Analyse comparative bayésienne (MCMCglmm, phylogénie) et figures de l'étude sur les réponses fonctionnelles",
    evidence: ["Zenodo 10.5281/zenodo.18377688 — analysis/Main_Script.R", "Zenodo — analysis/Supplementary_Script_phylogeny.R"],
  },
  {
    id: "gitlab",
    name: "GitLab",
    family: "partage",
    role: "Partage public du code, des données et du manuscrit",
    evidence: ["gitlab.com/marinecourtois"],
  },
];

export const TOOLS: Tool[] = RAW_TOOLS.map((t) => toolSchema.parse(t));
export const getTool = (id: string) => TOOLS.find((t) => t.id === id);

const RAW_CAPABILITIES: z.input<typeof capabilitySchema>[] = [
  {
    id: "formalisation",
    index: "01",
    title: "Formalisation mathématique",
    description:
      "Définir les variables, poser les hypothèses et construire des modèles représentant les mécanismes biologiques étudiés.",
    stage: "formaliser",
    evidenceLabel: "Article de modélisation mathématique, Bulletin of Mathematical Biology (2025)",
    publicationIds: ["pub-2025-residual-fertility"],
    researchSlugs: ["fertilite-residuelle", "technique-insecte-sterile"],
    toolIds: ["python", "sympy"],
    visual: "equations",
    links: [
      { label: "Article (DOI)", url: "https://doi.org/10.1007/s11538-024-01401-1" },
      { label: "Version ouverte HAL", url: "https://hal.inrae.fr/hal-04403761v2" },
    ],
  },
  {
    id: "systemes-dynamiques",
    index: "02",
    title: "Analyse de systèmes dynamiques",
    description:
      "Étudier le comportement des modèles et les effets de paramètres importants sur les dynamiques des populations.",
    stage: "formaliser",
    evidenceLabel: "Recherches mathématiques sur la TIS et thèse de doctorat (chapitres 2 à 4)",
    publicationIds: ["these-2025", "pub-2025-residual-fertility"],
    researchSlugs: ["technique-insecte-sterile", "fertilite-residuelle"],
    toolIds: ["scipy", "sympy", "python-control"],
    visual: "phase",
    links: [
      { label: "Chapitre 2 — notebook", url: "https://gitlab.com/marinecourtois/thesisData/-/tree/main/Chapter%202%20-%20Modeling%20SIT" },
      { label: "Notice theses.fr", url: "https://theses.fr/s352892" },
    ],
  },
  {
    id: "python",
    index: "03",
    title: "Programmation scientifique en Python",
    description:
      "Développer des scripts pour réaliser des expériences numériques, analyser des scénarios et produire des figures scientifiques.",
    stage: "simuler",
    evidenceLabel: "Dépôt GitLab public de la thèse",
    publicationIds: ["these-2025"],
    researchSlugs: ["strategies-de-lachers", "fertilite-residuelle"],
    toolIds: ["python", "jupyter", "numpy", "scipy", "matplotlib", "pandas"],
    visual: "distribution",
    links: [{ label: "thesisData sur GitLab", url: "https://gitlab.com/marinecourtois/thesisData" }],
  },
  {
    id: "individu-centre",
    index: "04",
    title: "Modélisation individu-centrée",
    description:
      "Représenter les comportements d'individus et leurs interactions pour étudier leurs conséquences à l'échelle d'une population.",
    stage: "simuler",
    evidenceLabel: "Article PLOS Computational Biology (2026) et dépôt sit_remating_abm",
    publicationIds: ["pub-2026-polyandry"],
    researchSlugs: ["modelisation-individu-centree", "accouplements-multiples"],
    toolIds: ["mesa", "numpy", "pandas", "seaborn"],
    visual: "agents",
    links: [
      { label: "Article (DOI)", url: "https://doi.org/10.1371/journal.pcbi.1014212" },
      { label: "sit_remating_abm sur GitLab", url: "https://gitlab.com/marinecourtois/sit_remating_abm" },
    ],
  },
  {
    id: "statistique",
    index: "05",
    title: "Analyse statistique et écologique",
    description:
      "Mobiliser des analyses quantitatives pour étudier des relations entre caractéristiques biologiques, contexte écologique et comportements observés.",
    stage: "interpreter",
    evidenceLabel: "Article Journal of Animal Ecology (2026) et analyse de sensibilité de la thèse",
    publicationIds: ["pub-2026-functional-response", "pub-2025-residual-fertility"],
    researchSlugs: ["ecologie-des-invasions", "fertilite-residuelle"],
    toolIds: ["statsmodels", "scipy", "pandas"],
    visual: "sensitivity",
    links: [
      { label: "Article (DOI)", url: "https://doi.org/10.1111/1365-2656.70232" },
      { label: "Données Zenodo", url: "https://doi.org/10.5281/zenodo.18377688" },
    ],
  },
  {
    id: "reproductibilite",
    index: "06",
    title: "Reproductibilité scientifique",
    description: "Partager les scripts, notebooks et ressources nécessaires pour comprendre et reproduire les analyses.",
    stage: "partager",
    evidenceLabel: "Dépôt de la thèse et jeux de données publiés",
    publicationIds: ["these-2025", "pub-2026-polyandry", "pub-2026-functional-response"],
    researchSlugs: ["modelisation-individu-centree", "ecologie-des-invasions"],
    toolIds: ["gitlab", "jupyter", "python"],
    visual: "repository",
    links: [
      { label: "thesisData", url: "https://gitlab.com/marinecourtois/thesisData" },
      { label: "sit_remating_abm", url: "https://gitlab.com/marinecourtois/sit_remating_abm" },
      { label: "Zenodo", url: "https://doi.org/10.5281/zenodo.18377688" },
    ],
  },
];

export const CAPABILITIES: Capability[] = RAW_CAPABILITIES.map((c) => capabilitySchema.parse(c));
