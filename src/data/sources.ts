import type { Source } from "@/types/content";

/**
 * Registry of every external source used to verify a claim on the site.
 * Each entry in docs/CONTENT_SOURCES.md points to one of these ids.
 */
export const SOURCES = {
  inriaReport: {
    id: "inriaReport",
    label: "Inria — Rapport annuel d'activité 2025, équipe MACBES",
    url: "https://prod-rex-app.inria.fr/report/2025/macbes/index.html",
    kind: "report",
    verifies: "Doctorat soutenu le 27 novembre 2025 ; contexte de recherche (dynamique des populations, modèles individu-centrés, TIS).",
  },
  thesesFr: {
    id: "thesesFr",
    label: "theses.fr — notice de thèse",
    url: "https://theses.fr/s352892",
    kind: "thesis",
    verifies: "Titre de la thèse, Université Côte d'Azur.",
  },
  thesisDoi: {
    id: "thesisDoi",
    label: "DOI de la thèse (via ORCID)",
    url: "https://doi.org/10.70675/d019d560z1de7z4d84za3e2ze5ba4cf3718f",
    kind: "thesis",
    verifies: "Thèse de doctorat, date de soutenance 2025-11-27.",
  },
  orcid: {
    id: "orcid",
    label: "ORCID 0009-0002-3623-1460",
    url: "https://orcid.org/0009-0002-3623-1460",
    kind: "registry",
    verifies: "Liste des travaux : articles, thèse, préprint, communications.",
  },
  pubRF: {
    id: "pubRF",
    label: "Bulletin of Mathematical Biology 87, 25 (2025)",
    url: "https://doi.org/10.1007/s11538-024-01401-1",
    kind: "article",
    verifies: "Titre, auteurs, revue et DOI de l'article sur la fertilité résiduelle (Crossref).",
  },
  halRF: {
    id: "halRF",
    label: "HAL INRAE — hal-04403761",
    url: "https://hal.inrae.fr/hal-04403761v2",
    kind: "archive",
    verifies: "Version en accès ouvert de l'article sur la fertilité résiduelle.",
  },
  pubPolyandry: {
    id: "pubPolyandry",
    label: "PLOS Computational Biology 22(4): e1014212 (2026)",
    url: "https://doi.org/10.1371/journal.pcbi.1014212",
    kind: "article",
    verifies: "Titre, auteurs, revue et DOI de l'article sur la polyandrie (Crossref, licence CC BY 4.0).",
  },
  pubInvasion: {
    id: "pubInvasion",
    label: "Journal of Animal Ecology 95(5): 808–823 (2026)",
    url: "https://doi.org/10.1111/1365-2656.70232",
    kind: "article",
    verifies: "Titre, auteurs, revue et DOI de l'article sur les réponses fonctionnelles (Crossref, licence CC BY 4.0).",
  },
  preprintInvasion: {
    id: "preprintInvasion",
    label: "bioRxiv 2025.07.26.666957",
    url: "https://doi.org/10.1101/2025.07.26.666957",
    kind: "preprint",
    verifies: "Préprint de l'étude sur les réponses fonctionnelles (via ORCID).",
  },
  zenodoInvasion: {
    id: "zenodoInvasion",
    label: "Zenodo — 10.5281/zenodo.18377688",
    url: "https://doi.org/10.5281/zenodo.18377688",
    kind: "dataset",
    verifies: "Données et matériel associés à l'étude sur les réponses fonctionnelles (DataCite).",
  },
  gitThesis: {
    id: "gitThesis",
    label: "GitLab — marinecourtois/thesisData",
    url: "https://gitlab.com/marinecourtois/thesisData",
    kind: "repository",
    verifies: "Notebooks et scripts Python des figures de la thèse, structure en chapitres, manuscrit et diapositives de soutenance.",
  },
  gitAbm: {
    id: "gitAbm",
    label: "GitLab — marinecourtois/sit_remating_abm",
    url: "https://gitlab.com/marinecourtois/sit_remating_abm",
    kind: "repository",
    verifies: "Modèle compartimental et modèle individu-centré (Mesa) de l'article sur la polyandrie.",
  },
  gitProfile: {
    id: "gitProfile",
    label: "GitLab — profil marinecourtois",
    url: "https://gitlab.com/marinecourtois",
    kind: "repository",
    verifies: "Espace public de partage de code.",
  },
  hal: {
    id: "hal",
    label: "HAL — communications et posters",
    url: "https://hal.science/search/index/?q=Marine+Courtois+sterile+insect",
    kind: "archive",
    verifies: "Titres, événements, lieux et dates des communications scientifiques.",
  },
  orcidEmployment: {
    id: "orcidEmployment",
    label: "ORCID — activités professionnelles",
    url: "https://orcid.org/0009-0002-3623-1460",
    kind: "registry",
    verifies: "Doctorante, INRAE et Université Côte d'Azur, Sophia Antipolis, d'octobre 2022 à septembre 2025.",
  },
  owner: {
    id: "owner",
    label: "Informations fournies par Marine Courtois",
    url: "https://orcid.org/0009-0002-3623-1460",
    kind: "registry",
    verifies: "Éléments déclarés par la chercheuse (outils hors code publié, format des posters, projets en cours), sans preuve publique à ce jour.",
  },
} as const satisfies Record<string, Source>;

export type SourceId = keyof typeof SOURCES;

export function getSource(id: string): Source | undefined {
  return (SOURCES as Record<string, Source>)[id];
}
