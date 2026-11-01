/**
 * French UI strings (accessibility labels and interface text).
 * An English dictionary can be added as locales/en.ts with the same keys.
 */
export const a11y = {
  indexDesPublications: "Index des publications",
  axesDeRecherche: "Axes de recherche",
  axesVoisins: "Axes voisins",
  biographie: "Biographie",
  monogram: "MC",
  competencesScientifiques: "Compétences scientifiques",
  chapitresDeLaThese: "Chapitres de la thèse",
  filtrerLesPublications: "Filtrer les publications",
  fichiersDesDepots: "Fichiers des dépôts",
  metadonneesDuFichier: "Métadonnées du fichier",
  indexDeLAtlas: "Index de l'atlas",
  heroTitle: "Comprendre le vivant. Par le modèle.",
  researchSequence: "Démarche : observer, formuler, modéliser, simuler, analyser, comprendre",
  parcoursDuModelExplorer: "Parcours du Model Explorer",
  demarcheDeRecherche: "Démarche de recherche",
  piedDePage: "Pied de page",
  navigationPrincipale: "Navigation principale",
  navigationMobile: "Navigation mobile",
  scenarioComparisonChart: "Densité de femelles après 300 jours en fonction de l'intensité des lâchers σ, pour trois niveaux de fertilité résiduelle δ. Plus δ est élevé, plus la densité résiduelle reste haute à forte intensité de lâchers.",
  etapes: "Étapes",
  legendeDuSchema: "Légende du schéma",
  modeles: "Modèles",
} as const;

export type A11yKey = keyof typeof a11y;
