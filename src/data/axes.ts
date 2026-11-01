import { PUBLICATIONS, COMMUNICATIONS } from "@/data/publications";
import { RESEARCH_AXES } from "@/data/research-axes";

/** The four activity axes, as supplied by the site owner (2026-11-01). Counts come from verified data. */
export type ActivityAxis = { id: string; label: string; href: string; summary: string };

const articles = PUBLICATIONS.filter((p) => p.publicationType === "article").length;
const talks = COMMUNICATIONS.filter((c) => c.type === "communication").length;
const posters = COMMUNICATIONS.filter((c) => c.type === "poster").length;

export const ACTIVITY_AXES: ActivityAxis[] = [
  {
    id: "recherche",
    label: "Recherche",
    href: "/recherche",
    summary: `${RESEARCH_AXES.length} axes : lutte biologique, simulation de stratégies, écologie des invasions.`,
  },
  {
    id: "communication",
    label: "Communication",
    href: "/communication",
    summary: `${talks} communications orales et ${posters} posters en congrès, en français et en anglais.`,
  },
  {
    id: "enseignement",
    label: "Enseignement",
    href: "/enseignement",
    summary: "Transmettre la modélisation, la programmation et l'analyse de données.",
  },
  {
    id: "publications",
    label: "Publications",
    href: "/publications",
    summary: `${articles} articles dans des revues à comité de lecture et une thèse de doctorat.`,
  },
];
