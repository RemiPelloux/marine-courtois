import { PUBLICATIONS, COMMUNICATIONS } from "@/data/publications";
import { RESEARCH_AXES } from "@/data/research-axes";
import type { Lang } from "@/i18n/config";

/** The four doors under the hero. Counts come from verified data. */
export type ActivityAxis = { id: string; label: string; href: string; summary: string };

const articles = PUBLICATIONS.filter((p) => p.publicationType === "article").length;
const talks = COMMUNICATIONS.filter((c) => c.type === "communication").length;
const posters = COMMUNICATIONS.filter((c) => c.type === "poster").length;
const letters = RESEARCH_AXES.map((a) => a.letter).join(", ");

const AXES: Record<Lang, ActivityAxis[]> = {
  fr: [
    { id: "recherche", label: "Recherche", href: "/recherche", summary: `${RESEARCH_AXES.length} axes (${letters})\u00a0: biocontrôle des ravageurs, caractère invasif et réponse fonctionnelle, données multiomiques et stress des plantes.` },
    { id: "publications", label: "Publications", href: "/publications", summary: `${articles} articles dans des revues à comité de lecture et une thèse de doctorat, avec code et données.` },
    { id: "projets", label: "Projets", href: "/projets", summary: "Modèle individu-centré, réanalyse de données, figures reproductibles\u00a0: ce qui se construit au-delà des articles." },
    { id: "transmettre", label: "Transmettre", href: "/vulgarisation", summary: `${talks} communications orales, ${posters} posters, des modules de vulgarisation et l'enseignement.` },
  ],
  en: [
    { id: "recherche", label: "Research", href: "/recherche", summary: `${RESEARCH_AXES.length} areas (${letters}): pest biocontrol, invasiveness and functional response, multi-omics data and plant stress.` },
    { id: "publications", label: "Publications", href: "/publications", summary: `${articles} peer-reviewed articles and a doctoral thesis, with code and data.` },
    { id: "projets", label: "Projects", href: "/projets", summary: "An individual-based model, a data reanalysis, reproducible figures: what gets built beyond the articles." },
    { id: "transmettre", label: "Outreach", href: "/vulgarisation", summary: `${talks} talks, ${posters} posters, outreach modules and teaching.` },
  ],
};

export const activityAxesIn = (lang: Lang) => AXES[lang];
