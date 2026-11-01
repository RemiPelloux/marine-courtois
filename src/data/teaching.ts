import { teachingActivitySchema, type TeachingActivity } from "@/types/portfolio";
import { EN_TEACHING, EN_TEACHING_RESOURCES } from "@/data/en/teaching";
import type { Lang } from "@/i18n/config";
import { localizeById } from "@/i18n/localize";
import type { z } from "zod";

/**
 * Teaching, exactly as supplied by Marine (source "owner"): institution,
 * programme and level, what is taught. No years, course codes, hours or
 * objectives. The host of the M2 Bioinformatique and of the M1 BioControl for
 * Plant Health was not given, so it is left out. `resources` are public
 * teaching material that already exists.
 */
export type TeachingResource = { id: string; title: string; text: string; href: string; external: boolean };

const RAW_ACTIVITIES: z.input<typeof teachingActivitySchema>[] = [
  {
    id: "polytech-genie-biologique",
    institution: "Polytech Nice Sophia",
    programme: "Génie biologique, 3e année",
    subjects: "Mathématiques, algèbre linéaire, matrices, statistiques et programmation R",
    emphasis: "featured",
    sources: ["owner"],
    visibility: "public",
  },
  {
    id: "isa-licence-pro",
    institution: "Institut Sophia Agrobiotech",
    programme: "Licence professionnelle",
    subjects: "Analyse de données sous Excel",
    emphasis: "featured",
    sources: ["owner"],
    visibility: "public",
  },
  {
    id: "m1-biocontrol",
    programme: "M1 BioControl for Plant Health",
    subjects: "Statistiques sous R, modèles linéaires et ANOVA, enseignements en anglais",
    sources: ["owner"],
    visibility: "public",
  },
  {
    id: "m2-bioinformatique",
    programme: "M2 Bioinformatique",
    subjects: "Programmation R, ggplot, Shiny",
    sources: ["owner"],
    visibility: "public",
  },
  {
    id: "uca-l2",
    institution: "Université Côte d'Azur, campus Valrose",
    programme: "L2",
    subjects: "Travaux pratiques de biologie : nutrition hydrique et minérale, photosynthèse, métabolisme secondaire",
    emphasis: "summary",
    sources: ["owner"],
    visibility: "public",
  },
  {
    id: "uca-l3",
    institution: "Université Côte d'Azur, campus Valrose",
    programme: "L3",
    subjects: "Modèles matriciels en biologie, algèbre linéaire",
    emphasis: "summary",
    sources: ["owner"],
    visibility: "public",
  },
];

export const TEACHING_ACTIVITIES: TeachingActivity[] = RAW_ACTIVITIES.map((t) => teachingActivitySchema.parse(t)).filter(
  (t) => t.visibility === "public",
);

export const TEACHING_RESOURCES: TeachingResource[] = [
  {
    id: "notebooks",
    title: "Notebooks de la thèse",
    text: "Onze notebooks Jupyter qui reconstruisent pas à pas chaque figure du manuscrit, des équations au graphique.",
    href: "https://gitlab.com/marinecourtois/thesisData",
    external: true,
  },
  {
    id: "abm",
    title: "Un modèle individu-centré commenté",
    text: "Le script Mesa et cinq notebooks d'analyse : un exemple complet de simulation multi-agents, de l'agent aux statistiques.",
    href: "https://gitlab.com/marinecourtois/sit_remating_abm",
    external: true,
  },
  {
    id: "explorer",
    title: "L'explorateur de modèles",
    text: "Observer un mécanisme, faire varier ses paramètres, lire le résultat : trois modèles publiés, manipulables dans le navigateur.",
    href: "/laboratoire#model-explorer",
    external: false,
  },
];

export const teachingIn = (lang: Lang) => localizeById(TEACHING_ACTIVITIES, EN_TEACHING, lang);
export const teachingResourcesIn = (lang: Lang) => localizeById(TEACHING_RESOURCES, EN_TEACHING_RESOURCES, lang);
