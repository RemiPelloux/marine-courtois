import { codeFileSchema, type CodeFile } from "@/types/content";
import type { z } from "zod";
import type { Lang } from "@/i18n/config";
import { localizeById, localizeOne } from "@/i18n/localize";
import { EN_CODE_FILES, EN_REPOSITORY_DESCRIPTIONS } from "@/data/en/code";
import { EN_FIGURES } from "@/data/en/figures";
import { FIGURES } from "./figures";
import {
  RF_MODEL_EXCERPT,
  REMATING_MODEL_EXCERPT,
  KNIPLING_EXCERPT,
  ABM_EXCERPT,
  ABM_RELEASE_EXCERPT,
  IMPULSIVE_EXCERPT,
  SENSITIVITY_EXCERPT,
} from "./code-excerpts";

/**
 * Repository content mirrored from the public GitLab API on 2026-11-01.
 * Paths, imports and excerpts are copied verbatim from Marine Courtois's
 * repositories. Excerpts are short and always link to the full file.
 */
export const REPOSITORIES = {
  thesisData: {
    name: "thesisData",
    url: "https://gitlab.com/marinecourtois/thesisData",
    description:
      "Scripts Python et notebooks utilisés pour générer les figures du manuscrit de thèse, organisés par chapitre.",
    branch: "main",
  },
  sit_remating_abm: {
    name: "sit_remating_abm",
    url: "https://gitlab.com/marinecourtois/sit_remating_abm",
    description:
      "Données et code associés à l'étude sur les accouplements multiples : modèle compartimental et modèle individu-centré (Mesa).",
    branch: "main",
  },
} as const;

export function fileUrl(repo: keyof typeof REPOSITORIES, path: string) {
  const r = REPOSITORIES[repo];
  return `${r.url}/-/blob/${r.branch}/${path.split("/").map(encodeURIComponent).join("/")}`;
}

export function folderUrl(repo: keyof typeof REPOSITORIES, path: string) {
  const r = REPOSITORIES[repo];
  return `${r.url}/-/tree/${r.branch}/${path.split("/").map(encodeURIComponent).join("/")}`;
}

export { FIGURES, getFigure } from "./figures";

const RAW_CODE_FILES: z.input<typeof codeFileSchema>[] = [
  {
    id: "ch1-articles",
    repository: "thesisData",
    path: "Chapter 1 - Introduction/fig_number_article_SIT_published.ipynb",
    kind: "notebook",
    chapter: 1,
    description: "Figure bibliométrique de l'introduction, construite à partir d'un export Scopus (scopus_data.csv).",
    language: "python",
    pythonVersion: "3.12.5",
    imports: ["matplotlib"],
    figureIds: ["fig-ch1-articles"],
  },
  {
    id: "ch1-scopus",
    repository: "thesisData",
    path: "Chapter 1 - Introduction/scopus_data.csv",
    kind: "data",
    chapter: 1,
    description: "Données bibliographiques utilisées pour la figure d'introduction.",
  },
  {
    id: "ch2-figures",
    repository: "thesisData",
    path: "Chapter 2 - Modeling SIT/fig_chapter2_thesis.ipynb",
    kind: "notebook",
    chapter: 2,
    description: "Figures du chapitre de modélisation : diagramme en toile d'araignée, diagrammes de bifurcation, portraits de phase.",
    language: "python",
    pythonVersion: "3.12.5",
    imports: ["numpy", "matplotlib", "scipy.integrate.odeint", "control.phaseplot"],
    excerpt: {
      label: "Modèle discret de lâchers stériles",
      code: KNIPLING_EXCERPT,
      note: "Premières lignes de la cellule « Cobweb diagram ».",
    },
    figureIds: ["fig-ch2-cobweb", "fig-ch2-bifurcation"],
  },
  {
    id: "ch3-rf",
    repository: "thesisData",
    path: "Chapter 3 - Residual Fertility/Script_Manuscrit_SIT_RF.ipynb",
    kind: "notebook",
    chapter: 3,
    description: "Simulations du modèle de TIS avec fertilité résiduelle : fonction G(F), courbes de bifurcation, dynamiques temporelles.",
    language: "python",
    pythonVersion: "3.9.12",
    imports: ["numpy 1.23.5", "matplotlib 3.7.1", "scipy 1.10.1 (odeint)", "sympy 1.11.1"],
    excerpt: {
      label: "Système d'équations différentielles",
      code: RF_MODEL_EXCERPT,
      note: "Cellule 28. Ce système est porté en TypeScript dans le Model Explorer.",
    },
    figureIds: ["fig-ch3-dynamics"],
  },
  {
    id: "ch3-sensitivity",
    repository: "thesisData",
    path: "Chapter 3 - Residual Fertility/Sensitivity_Analysis_SIT.ipynb",
    kind: "notebook",
    chapter: 3,
    description: "Analyse de sensibilité des paramètres du modèle de fertilité résiduelle.",
    language: "python",
    pythonVersion: "3.9.12",
    imports: ["numpy", "pandas 2.0.1", "statsmodels 0.13.5", "scipy.stats", "sympy", "matplotlib"],
    excerpt: { label: "Environnement d'analyse", code: SENSITIVITY_EXCERPT },
    figureIds: ["fig-ch3-sensitivity"],
  },
  {
    id: "ch4-compartmental",
    repository: "thesisData",
    path: "Chapter 4 - Multiple Mating/Compartmental_model_output_vAvril.ipynb",
    kind: "notebook",
    chapter: 4,
    description: "Modèle compartimental avec ré-accouplement : stabilité des équilibres et dynamiques larvaires selon l'utilisation du sperme.",
    language: "python",
    pythonVersion: "3.12.5",
    imports: ["numpy", "matplotlib", "scipy.integrate.odeint"],
    excerpt: {
      label: "Modèle compartimental avec ré-accouplement",
      code: REMATING_MODEL_EXCERPT,
      note: "Cellule 10. Ce système est porté en TypeScript dans le Model Explorer.",
    },
    figureIds: ["fig-ch4-first-last"],
  },
  {
    id: "ch4-abm-output",
    repository: "thesisData",
    path: "Chapter 4 - Multiple Mating/ABM_model_output.ipynb",
    kind: "notebook",
    chapter: 4,
    description: "Analyse des sorties du modèle individu-centré (simulations répétées, réduction de l'aire sous la courbe).",
    language: "python",
    pythonVersion: "3.12.5",
    imports: ["numpy", "pandas", "matplotlib", "seaborn"],
    figureIds: ["fig-ch4-abm"],
  },
  {
    id: "ch4-appendix-1",
    repository: "thesisData",
    path: "Chapter 4 - Multiple Mating/Appendix_Comparison_ABM_1.ipynb",
    kind: "notebook",
    chapter: 4,
    description: "Annexe : comparaison des dynamiques larvaires entre modèle compartimental et modèle individu-centré.",
    language: "python",
  },
  {
    id: "ch4-convergence",
    repository: "thesisData",
    path: "Chapter 4 - Multiple Mating/Convergence_model_low_fast.ipynb",
    kind: "notebook",
    chapter: 4,
    description: "Notebook complémentaire du chapitre 4 (convergence).",
    language: "python",
  },
  {
    id: "ch4-data",
    repository: "thesisData",
    path: "Chapter 4 - Multiple Mating/df_MM_ABM.zip",
    kind: "archive",
    chapter: 4,
    description: "Sorties de simulation du modèle individu-centré au format CSV (archive).",
  },
  {
    id: "ch5-impulsive",
    repository: "thesisData",
    path: "Chapter 5 - Agricultural Context/Notebook_part_impulsive_releases.ipynb",
    kind: "notebook",
    chapter: 5,
    description: "Lâchers impulsionnels sous budget limité : solution périodique, compromis fréquence–amplitude.",
    language: "python",
    pythonVersion: "3.12.5",
    imports: ["numpy", "pandas", "matplotlib", "scipy.integrate.solve_ivp"],
    excerpt: { label: "Solution périodique des lâchers impulsionnels", code: IMPULSIVE_EXCERPT },
    figureIds: ["fig-ch5-impulsive", "fig-ch5-budget"],
  },
  {
    id: "ch5-oviposition",
    repository: "thesisData",
    path: "Chapter 5 - Agricultural Context/Notebook_part_oviposition.ipynb",
    kind: "notebook",
    chapter: 5,
    description: "Piqûres de ponte et qualité des fruits dans le contexte agricole.",
    language: "python",
  },
  {
    id: "manuscript",
    repository: "thesisData",
    path: "Thesis - Manuscript/COURTOIS_2025_archivage-2.pdf",
    kind: "document",
    description: "Manuscrit de thèse (version d'archivage, PDF).",
  },
  {
    id: "slides",
    repository: "thesisData",
    path: "Defense - Slides/PhD_Defense_filigrane.pdf",
    kind: "document",
    description: "Diapositives de la soutenance de thèse (PDF).",
  },
  {
    id: "abm-script",
    repository: "sit_remating_abm",
    path: "script_ABM_batchrun.py",
    kind: "script",
    description:
      "Modèle individu-centré complet (agents mâles stériles, mâles sauvages, larves, femelles) et exécution par lots sur un cluster de calcul.",
    language: "python",
    imports: ["mesa", "numpy", "pandas", "matplotlib", "argparse"],
    excerpt: {
      label: "Ponte selon la règle « mixed »",
      code: ABM_EXCERPT,
      note: "Méthode Females_Agent.egglaying — la fécondité suit la proportion d'accouplements fertiles.",
    },
  },
  {
    id: "abm-release",
    repository: "sit_remating_abm",
    path: "script_ABM_batchrun.py",
    kind: "script",
    description: "Méthode de lâchers périodiques de mâles stériles dans RematingModel.",
    language: "python",
    imports: ["mesa"],
    excerpt: { label: "Lâchers périodiques", code: ABM_RELEASE_EXCERPT },
  },
  {
    id: "abm-notebook",
    repository: "sit_remating_abm",
    path: "Notebook_ABM.ipynb",
    kind: "notebook",
    description: "Implémentation complète du modèle individu-centré avec simulations d'exemple.",
    language: "python",
  },
  {
    id: "abm-compartmental",
    repository: "sit_remating_abm",
    path: "Compartmental_model_output.ipynb",
    kind: "notebook",
    description: "Figures de la section 2 de l'article : analyse du modèle compartimental.",
    language: "python",
  },
];

export const CODE_FILES: CodeFile[] = RAW_CODE_FILES.map((c) => codeFileSchema.parse(c));
export const getCodeFile = (id: string) => CODE_FILES.find((c) => c.id === id);
export const codeFilesIn = (lang: Lang) => localizeById(CODE_FILES, EN_CODE_FILES, lang);
export const codeFileIn = (lang: Lang, id: string) => codeFilesIn(lang).find((c) => c.id === id);

/** Thesis figures (alt text, captions) in a language. */
export const figuresIn = (lang: Lang) => localizeById(FIGURES, EN_FIGURES, lang);
export const figureIn = (lang: Lang, id?: string) => figuresIn(lang).find((f) => f.id === id);

/** Repositories with their description in a language. */
export function repositoriesIn(lang: Lang) {
  return Object.values(REPOSITORIES).map((r) => localizeOne<{ name: string; url: string; description: string }>(r, { description: EN_REPOSITORY_DESCRIPTIONS[r.name] }, lang));
}

/** Thesis repository tree, by chapter folder (verbatim folder names). */
export const THESIS_TREE = [
  "Chapter 1 - Introduction",
  "Chapter 2 - Modeling SIT",
  "Chapter 3 - Residual Fertility",
  "Chapter 4 - Multiple Mating",
  "Chapter 5 - Agricultural Context",
  "Defense - Slides",
  "Thesis - Manuscript",
] as const;
