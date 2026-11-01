import type { Lang } from "@/i18n/config";

/**
 * Homepage profile: four ways of working. Tools listed here are either in the
 * public code (skills.ts) or declared by the site owner (toolkit.ts).
 */
type Domain = { title: string; text: string; tools: readonly string[] };

const TOOLS = {
  model: ["SymPy", "SciPy", "Mesa", "python-control"],
  code: ["Python", "R", "MySQL", "Jupyter", "GitLab"],
  analyse: ["pandas", "statsmodels", "scikit-learn", "PyTorch", "TensorFlow / Keras", "XGBoost / LightGBM"],
  share: ["Matplotlib", "seaborn", "R Shiny", "Power BI"],
} as const;

const PROFILE_DOMAINS: Record<Lang, Domain[]> = {
  fr: [
    {
      title: "Modéliser",
      text: "Équations différentielles, modèles discrets et individu-centrés : traduire un mécanisme en un système que l'on peut étudier.",
      tools: TOOLS.model,
    },
    {
      title: "Programmer",
      text: "Python au quotidien, R et SQL selon le terrain : des scripts reproductibles aux applications interactives.",
      tools: TOOLS.code,
    },
    {
      title: "Analyser et apprendre",
      text: "Statistiques, analyse de sensibilité et machine learning pour faire parler des données expérimentales ou simulées.",
      tools: TOOLS.analyse,
    },
    {
      title: "Restituer et transmettre",
      text: "Figures, tableaux de bord, articles, congrès et enseignement : rendre un résultat lisible pour chaque public.",
      tools: TOOLS.share,
    },
  ],
  en: [
    {
      title: "Model",
      text: "Differential equations, discrete and individual-based models: turning a mechanism into a system that can be studied.",
      tools: TOOLS.model,
    },
    {
      title: "Program",
      text: "Python every day, R and SQL depending on the field: from reproducible scripts to interactive applications.",
      tools: TOOLS.code,
    },
    {
      title: "Analyse and learn",
      text: "Statistics, sensitivity analysis and machine learning to make experimental or simulated data speak.",
      tools: TOOLS.analyse,
    },
    {
      title: "Report and teach",
      text: "Figures, dashboards, articles, conferences and teaching: making a result readable for every audience.",
      tools: TOOLS.share,
    },
  ],
};

export const profileDomainsIn = (lang: Lang) => PROFILE_DOMAINS[lang];
