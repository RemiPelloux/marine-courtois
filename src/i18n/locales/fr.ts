/**
 * French UI strings (accessibility labels and interface text).
 * An English dictionary can be added as locales/en.ts with the same keys.
 */
export const a11y = {
  indexDesPublications: "Index des publications",
  axesDeRecherche: "Axes de recherche",
  axesVoisins: "Axes voisins",
  sourcesDesAxes: "Sources des axes de recherche",
  biographie: "Biographie",
  monogram: "MC",
  competencesScientifiques: "Compétences scientifiques",
  chapitresDeLaThese: "Chapitres de la thèse",
  filtrerLesPublications: "Filtrer les publications",
  fichiersDesDepots: "Fichiers des dépôts",
  metadonneesDuFichier: "Métadonnées du fichier",
  indexDeLAtlas: "Index de l'atlas",
  heroTitle: "Mathématiques, code et données : tout s'assemble.",
  puzzleFamilies: "Mettre en évidence une famille d'outils",
  axesDActivite: "Axes d'activité",
  frise: "Frise des communications, articles et soutenance",
  listeDesCommunications: "Liste des communications et posters",
  votreProjet: "Votre projet : me contacter",
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
  filmDuParcours: "Film du parcours : chaque jalon vérifié de 2022 à 2026, placé sur un axe du temps",
  mettreEnEvidenceLesOutils: "Mettre en évidence les outils",
  revealEmail: "Afficher l'adresse électronique",
  copyEmail: "Copier l'adresse électronique",
} as const;

export type A11yKey = keyof typeof a11y;
