import { PUBLICATIONS, COMMUNICATIONS } from "@/data/publications";
import { RESEARCH_AXES } from "@/data/research-axes";

/** The four doors of the hero puzzle and index. Counts come from verified data. */
export type ActivityAxis = { id: string; label: string; href: string; summary: string };

const articles = PUBLICATIONS.filter((p) => p.publicationType === "article").length;
const talks = COMMUNICATIONS.filter((c) => c.type === "communication").length;
const posters = COMMUNICATIONS.filter((c) => c.type === "poster").length;

export const ACTIVITY_AXES: ActivityAxis[] = [
  {
    id: "recherche",
    label: "Recherche",
    href: "/recherche",
    summary: `${RESEARCH_AXES.length - 1} axes et des questions émergentes : biocontrôle, comportements reproducteurs, invasions biologiques.`,
  },
  {
    id: "publications",
    label: "Publications",
    href: "/publications",
    summary: `${articles} articles dans des revues à comité de lecture et une thèse de doctorat, avec code et données.`,
  },
  {
    id: "projets",
    label: "Projets",
    href: "/projets",
    summary: "Modèle individu-centré, réanalyse de données, figures reproductibles : ce qui se construit au-delà des articles.",
  },
  {
    id: "transmettre",
    label: "Transmettre",
    href: "/vulgarisation",
    summary: `${talks} communications orales, ${posters} posters, des modules de vulgarisation et l'enseignement.`,
  },
];
