import type { Copy, Lang } from "@/i18n/config";

/**
 * The nine themes of the hero puzzle: the first four close the cross around the
 * centre, the next five form the bottom row. Each summary names only methods
 * and subjects present in the published work or declared by Marine Courtois
 * (axis C, source `owner`), and links to its research axis on /recherche.
 */
type DomainSource = { id: string; href: string; short: Copy<string>; label: Copy<string>; summary: Copy<string> };

const CROSS_THEMES: DomainSource[] = [
  {
    id: "mathematiques",
    href: "/recherche#biocontrole",
    short: { fr: "Maths", en: "Maths" },
    label: { fr: "Mathématiques appliquées", en: "Applied mathematics" },
    summary: {
      fr: "Équations différentielles, systèmes dynamiques, équilibres et stabilité.",
      en: "Differential equations, dynamical systems, equilibria and stability.",
    },
  },
  {
    id: "statistiques",
    href: "/recherche#invasions-biologiques",
    short: { fr: "Stats", en: "Stats" },
    label: { fr: "Statistiques", en: "Statistics" },
    summary: {
      fr: "Analyse statistique bayésienne de 269 réponses fonctionnelles déjà publiées, analyse de sensibilité des modèles.",
      en: "Bayesian statistical analysis of 269 published functional responses, model sensitivity analysis.",
    },
  },
  {
    id: "biologie",
    href: "/recherche#biocontrole",
    short: { fr: "Biologie", en: "Biology" },
    label: { fr: "Biologie", en: "Biology" },
    summary: {
      fr: "Comportements reproducteurs\u00a0: accouplements multiples, fertilité résiduelle des mâles stériles.",
      en: "Reproductive behaviour: multiple mating, residual fertility of sterile males.",
    },
  },
  {
    id: "ecologie",
    href: "/recherche#invasions-biologiques",
    short: { fr: "Écologie", en: "Ecology" },
    label: { fr: "Écologie", en: "Ecology" },
    summary: {
      fr: "Invasions biologiques, réponses fonctionnelles, interactions trophiques.",
      en: "Biological invasions, functional responses, trophic interactions.",
    },
  },
];

const ROW_THEMES: DomainSource[] = [
  {
    id: "populations",
    href: "/recherche#biocontrole",
    short: { fr: "Populations", en: "Populations" },
    label: { fr: "Dynamique des populations", en: "Population dynamics" },
    summary: {
      fr: "Déclin d'une population sauvage sous lâchers d'insectes stériles.",
      en: "How a wild population declines under sterile insect releases.",
    },
  },
  {
    id: "biocontrole",
    href: "/recherche#biocontrole",
    short: { fr: "Biocontrôle", en: "Biocontrol" },
    label: { fr: "Biocontrôle", en: "Biocontrol" },
    summary: {
      fr: "Technique de l'insecte stérile\u00a0: stratégies de lâchers et contraintes de déploiement.",
      en: "Sterile insect technique: release strategies and deployment constraints.",
    },
  },
  {
    id: "modelisation",
    href: "/recherche#biocontrole",
    short: { fr: "Modèles", en: "Models" },
    label: { fr: "Modélisation", en: "Modelling" },
    summary: {
      fr: "Modèles compartimentaux et modèles individu-centrés (Mesa).",
      en: "Compartmental and individual-based models (Mesa).",
    },
  },
  {
    id: "donnees",
    href: "/recherche#multiomique",
    short: { fr: "Data & ML", en: "Data & ML" },
    label: { fr: "Data science et machine learning", en: "Data science and machine learning" },
    summary: {
      fr: "Apprentissage profond (autoencodeur variationnel, PyTorch) appliqué à des données multiomiques\u00a0: travail en cours.",
      en: "Deep learning (variational autoencoder, PyTorch) applied to multi-omics data: work in progress.",
    },
  },
  {
    id: "calcul",
    href: "/outils",
    short: { fr: "Calcul", en: "Computing" },
    label: { fr: "Calcul scientifique", en: "Scientific computing" },
    summary: {
      fr: "Simulation numérique, code et figures reproductibles.",
      en: "Numerical simulation, reproducible code and figures.",
    },
  },
];

export type Domain = { id: string; href: string; short: string; label: string; summary: string };

export function domainsIn(lang: Lang): Domain[] {
  return [...CROSS_THEMES, ...ROW_THEMES].map((d) => ({ id: d.id, href: d.href, short: d.short[lang], label: d.label[lang], summary: d.summary[lang] }));
}
