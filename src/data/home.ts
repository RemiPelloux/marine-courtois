/**
 * Homepage profile: four ways of working. Tools listed here are either in the
 * public code (skills.ts) or declared by the site owner (toolkit.ts).
 */
export const PROFILE_DOMAINS = [
  {
    title: "Modéliser",
    text: "Équations différentielles, modèles discrets et individu-centrés : traduire un mécanisme en un système que l'on peut étudier.",
    tools: ["SymPy", "SciPy", "Mesa", "python-control"],
  },
  {
    title: "Programmer",
    text: "Python au quotidien, R et SQL selon le terrain : des scripts reproductibles aux applications interactives.",
    tools: ["Python", "R", "MySQL", "Jupyter", "GitLab"],
  },
  {
    title: "Analyser et apprendre",
    text: "Statistiques, analyse de sensibilité et machine learning pour faire parler des données expérimentales ou simulées.",
    tools: ["pandas", "statsmodels", "scikit-learn", "PyTorch", "TensorFlow / Keras", "XGBoost / LightGBM"],
  },
  {
    title: "Restituer et transmettre",
    text: "Figures, tableaux de bord, articles, congrès et enseignement : rendre un résultat lisible pour chaque public.",
    tools: ["Matplotlib", "seaborn", "R Shiny", "Power BI"],
  },
] as const;
