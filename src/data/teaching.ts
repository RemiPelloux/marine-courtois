/**
 * Teaching. `courses` stays empty until the site owner supplies the courses
 * (title, level, institution, year, hours): nothing here is inferred.
 * `resources` are public teaching material that already exists.
 */
export type Course = { title: string; level: string; institution: string; year: string; hours?: number };
export type TeachingResource = { title: string; text: string; href: string; external: boolean };

export const COURSES: Course[] = [];

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
    href: "/methodes#model-explorer",
    external: false,
  },
];
