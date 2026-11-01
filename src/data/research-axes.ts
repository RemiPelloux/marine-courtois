import { researchAxisSchema, type ResearchAxis } from "@/types/portfolio";
import type { z } from "zod";

/**
 * Four research axes. A–C group the six verified themes; D gathers questions
 * still in progress (see questions.ts) and only shows what has been documented.
 */
const RAW: z.input<typeof researchAxisSchema>[] = [
  {
    id: "biocontrole",
    letter: "A",
    slug: "biocontrole",
    title: "Dynamique des populations et biocontrôle",
    lede: "Dans quelles conditions des lâchers de mâles stériles réduisent-ils une population de ravageurs, quand la stérilisation est imparfaite ou que les lâchers sont contraints par un budget ?",
    themeSlugs: ["technique-insecte-sterile", "fertilite-residuelle", "strategies-de-lachers"],
    publicationIds: ["pub-2025-residual-fertility", "these-2025"],
    communicationIds: ["hal-03928222", "hal-04049975", "hal-04144059", "hal-04144121", "hal-04808537"],
    projectIds: ["reproductibilite-these", "explorateur-de-modeles"],
    toolIds: ["python", "scipy", "sympy", "python-control", "statsmodels"],
  },
  {
    id: "comportements",
    letter: "B",
    slug: "comportements-reproducteurs",
    title: "Comportements reproducteurs et modèles individu-centrés",
    lede: "Quand les femelles s'accouplent plusieurs fois, la manière dont elles utilisent le sperme stocké change-t-elle l'issue des lâchers ? Le cas de Drosophila suzukii.",
    themeSlugs: ["accouplements-multiples", "modelisation-individu-centree"],
    publicationIds: ["pub-2026-polyandry"],
    communicationIds: ["hal-04452111", "hal-04664229", "hal-04788971", "hal-04808600", "hal-05108413", "hal-05108421", "hal-05728248"],
    projectIds: ["modele-individu-centre"],
    toolIds: ["mesa", "numpy", "pandas", "seaborn"],
  },
  {
    id: "invasions",
    letter: "C",
    slug: "invasions-biologiques",
    title: "Invasions biologiques et interactions trophiques",
    lede: "La réponse fonctionnelle d'une espèce de poisson renseigne-t-elle sur son caractère invasif et sur son impact trophique ? Tout dépend de l'aire où elle a été étudiée.",
    themeSlugs: ["ecologie-des-invasions"],
    publicationIds: ["pub-2026-functional-response"],
    communicationIds: [],
    projectIds: ["reponses-fonctionnelles"],
    toolIds: ["r"],
  },
  {
    id: "emergentes",
    letter: "D",
    slug: "questions-emergentes",
    title: "Questions émergentes",
    lede: "Les pistes en cours d'exploration, publiées ici au fur et à mesure qu'elles sont documentées, avec leur degré d'avancement.",
    themeSlugs: [],
    publicationIds: [],
    communicationIds: [],
    projectIds: [],
    toolIds: [],
  },
];

export const RESEARCH_AXES: ResearchAxis[] = RAW.map((a) => researchAxisSchema.parse(a));
export const getResearchAxis = (idOrSlug: string) => RESEARCH_AXES.find((a) => a.id === idOrSlug || a.slug === idOrSlug);
