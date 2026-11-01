import { teachingActivitySchema, type TeachingActivity } from "@/types/portfolio";
import type { z } from "zod";

/**
 * Teaching. Activities stay empty until Marine supplies them (title,
 * institution, level, period, format, objectives, methods, supports):
 * nothing is inferred from the doctorate. `resources` are public teaching
 * material that already exists.
 */
export type TeachingResource = { title: string; text: string; href: string; external: boolean };

const RAW_ACTIVITIES: z.input<typeof teachingActivitySchema>[] = [];

export const TEACHING_ACTIVITIES: TeachingActivity[] = RAW_ACTIVITIES.map((t) => teachingActivitySchema.parse(t)).filter(
  (t) => t.visibility === "public",
);

export const TEACHING_RESOURCES: TeachingResource[] = [
  {
    title: "Notebooks de la thèse",
    text: "Onze notebooks Jupyter qui reconstruisent pas à pas chaque figure du manuscrit, des équations au graphique.",
    href: "https://gitlab.com/marinecourtois/thesisData",
    external: true,
  },
  {
    title: "Un modèle individu-centré commenté",
    text: "Le script Mesa et cinq notebooks d'analyse : un exemple complet de simulation multi-agents, de l'agent aux statistiques.",
    href: "https://gitlab.com/marinecourtois/sit_remating_abm",
    external: true,
  },
  {
    title: "L'explorateur de modèles",
    text: "Observer un mécanisme, faire varier ses paramètres, lire le résultat : trois modèles publiés, manipulables dans le navigateur.",
    href: "/laboratoire#model-explorer",
    external: false,
  },
];
