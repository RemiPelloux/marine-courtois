/**
 * The six verified research themes, grouped into three axes (grouping chosen
 * by the site owner, 2026-11-01). Texts stay within the themes' sourced content.
 */
export type ResearchAxis = { id: string; title: string; question: string; themeSlugs: string[]; publicationIds: string[] };

export const RESEARCH_AXES: ResearchAxis[] = [
  {
    id: "lutte-biologique",
    title: "Lutte biologique et insecte stérile",
    question:
      "Dans quelles conditions des lâchers de mâles stériles réduisent-ils une population de ravageurs, quand la stérilisation est imparfaite ou que les femelles s'accouplent plusieurs fois ?",
    themeSlugs: ["technique-insecte-sterile", "fertilite-residuelle", "accouplements-multiples"],
    publicationIds: ["pub-2025-residual-fertility", "pub-2026-polyandry"],
  },
  {
    id: "simulation",
    title: "Simulation et stratégies de déploiement",
    question:
      "Comment représenter chaque insecte et ses interactions, et comment répartir des lâchers dans le temps avec un budget limité ?",
    themeSlugs: ["modelisation-individu-centree", "strategies-de-lachers"],
    publicationIds: ["pub-2026-polyandry", "these-2025"],
  },
  {
    id: "invasions",
    title: "Écologie des invasions",
    question:
      "La réponse fonctionnelle d'une espèce renseigne-t-elle sur son caractère invasif et sur son impact trophique ?",
    themeSlugs: ["ecologie-des-invasions"],
    publicationIds: ["pub-2026-functional-response"],
  },
];
