import { publicationSchema, communicationSchema, type Publication, type Communication } from "@/types/content";
import { z } from "zod";

/**
 * Journal articles and thesis. Titles, authors, volumes and DOIs verified
 * against Crossref and ORCID (see docs/CONTENT_SOURCES.md).
 * To add a publication: append an object below — every page updates automatically.
 */
const RAW_PUBLICATIONS: z.input<typeof publicationSchema>[] = [
  {
    id: "pub-2026-polyandry",
    slug: "polyandrie-technique-insecte-sterile",
    title: "Polyandry: A threat or an opportunity for the sterile insect technique?",
    editorialTitle: "Les accouplements multiples peuvent-ils modifier l'efficacité de la lutte biologique ?",
    authors: ["Marine A. Courtois", "Louise van Oudenhove", "Suzanne Touzeau", "Frédéric Grognard", "Ludovic Mailleret"],
    year: 2026,
    date: "2026-04-29",
    journal: "PLOS Computational Biology",
    volume: "22(4)",
    pages: "e1014212",
    doi: "10.1371/journal.pcbi.1014212",
    summaryFr:
      "Cette recherche explore l'influence des accouplements multiples et des mécanismes d'utilisation du sperme sur l'efficacité de la technique de l'insecte stérile. En combinant des approches mathématiques et des simulations individu-centrées appliquées à Drosophila suzukii, elle met en évidence des effets différents selon l'horizon temporel considéré.",
    questionFr:
      "Lorsque les femelles d'un ravageur s'accouplent plusieurs fois, la manière dont elles utilisent le sperme stocké peut-elle changer l'issue des lâchers de mâles stériles ?",
    approachFr:
      "Un modèle compartimental (équations différentielles) et un modèle individu-centré écrit en Python avec la bibliothèque Mesa, qui compare plusieurs règles d'utilisation du sperme : premier mâle, dernier mâle, mélange, choix et préférence.",
    themes: ["Polyandrie", "TIS", "Comportement reproducteur", "Simulation individu-centrée"],
    publicationType: "article",
    sourceUrl: "https://doi.org/10.1371/journal.pcbi.1014212",
    codeUrl: "https://gitlab.com/marinecourtois/sit_remating_abm",
    license: "CC BY 4.0",
    featured: true,
    researchSlugs: ["accouplements-multiples", "modelisation-individu-centree", "technique-insecte-sterile"],
    sources: ["pubPolyandry", "orcid", "gitAbm"],
  },
  {
    id: "pub-2026-functional-response",
    slug: "reponse-fonctionnelle-invasivite",
    title: "Functional response predicts invasiveness but not trophic impact",
    editorialTitle: "Peut-on prédire l'impact écologique d'une espèce invasive à partir de sa réponse fonctionnelle ?",
    authors: [
      "Marine A. Courtois",
      "Chloé Souques",
      "Yann Voituron",
      "Loïc Teulier",
      "Vincent Médoc",
      "François-Xavier Dechaume-Moncharmont",
    ],
    authorNote: "Marine A. Courtois et Chloé Souques ont contribué à parts égales à cette étude.",
    year: 2026,
    date: "2026-02-16",
    journal: "Journal of Animal Ecology",
    volume: "95(5)",
    pages: "808–823",
    doi: "10.1111/1365-2656.70232",
    summaryFr:
      "À partir d'une analyse comparative de 269 observations de réponses fonctionnelles concernant 45 espèces de poissons d'eau douce, cette étude examine les relations entre efficacité de consommation, invasivité et impact trophique. Les résultats soulignent l'importance du contexte biogéographique dans l'interprétation de ces indicateurs.",
    questionFr:
      "La réponse fonctionnelle d'une espèce — la relation entre l'abondance de ses proies et sa consommation — renseigne-t-elle sur son caractère invasif et sur son impact trophique ?",
    approachFr:
      "Une analyse statistique comparative de 269 observations de réponses fonctionnelles (45 espèces de poissons d'eau douce), accompagnée d'un jeu de données et de matériel publiés sur Zenodo.",
    themes: ["Écologie des invasions", "Réponses fonctionnelles", "Analyse statistique comparative", "Interactions trophiques"],
    publicationType: "article",
    sourceUrl: "https://doi.org/10.1111/1365-2656.70232",
    datasetUrl: "https://doi.org/10.5281/zenodo.18377688",
    extraLinks: [{ label: "Préprint bioRxiv", url: "https://doi.org/10.1101/2025.07.26.666957" }],
    license: "CC BY 4.0",
    featured: false,
    researchSlugs: ["ecologie-des-invasions"],
    sources: ["pubInvasion", "orcid", "zenodoInvasion", "preprintInvasion"],
  },
  {
    id: "pub-2025-residual-fertility",
    slug: "fertilite-residuelle-technique-insecte-sterile",
    title: "How Residual Fertility Impacts the Efficiency of Crop Pest Control by the Sterile Insect Technique",
    editorialTitle: "Quand la stérilité n'est pas totale : quelles conséquences pour le biocontrôle ?",
    authors: ["Marine A. Courtois", "Ludovic Mailleret", "Suzanne Touzeau", "Louise van Oudenhove", "Frédéric Grognard"],
    year: 2025,
    date: "2025-01-03",
    journal: "Bulletin of Mathematical Biology",
    volume: "87(2)",
    pages: "25",
    doi: "10.1007/s11538-024-01401-1",
    summaryFr:
      "Cette étude examine comment une fertilité résiduelle chez les insectes stérilisés influence l'efficacité de la technique de l'insecte stérile. Les modèles permettent de distinguer des conditions favorables à la suppression des populations de celles où la stratégie conduit essentiellement à une réduction de leur abondance.",
    questionFr:
      "Si une petite fraction des mâles relâchés reste fertile, la technique de l'insecte stérile peut-elle encore conduire à l'élimination d'une population de ravageurs ?",
    approachFr:
      "Un modèle en équations différentielles ordinaires décrivant mâles stériles, femelles et mâles sauvages, analysé mathématiquement (équilibres, bifurcations) et numériquement, complété par une analyse de sensibilité.",
    themes: ["Fertilité résiduelle", "TIS", "Dynamique des populations", "Modélisation mathématique"],
    publicationType: "article",
    sourceUrl: "https://doi.org/10.1007/s11538-024-01401-1",
    pdfUrl: "https://hal.inrae.fr/hal-04403761v2",
    codeUrl: "https://gitlab.com/marinecourtois/thesisData/-/tree/main/Chapter%203%20-%20Residual%20Fertility",
    extraLinks: [{ label: "Version ouverte HAL", url: "https://hal.inrae.fr/hal-04403761v2" }],
    featured: false,
    researchSlugs: ["fertilite-residuelle", "technique-insecte-sterile"],
    sources: ["pubRF", "halRF", "orcid", "gitThesis"],
  },
  {
    id: "these-2025",
    slug: "these-modelisation-technique-insecte-sterile",
    title:
      "Modélisation de la technique de l'insecte stérile dans un contexte agricole : examen des facteurs biologiques et techniques susceptibles d'atténuer son efficacité",
    editorialTitle: "Trois années pour comprendre les limites d'une stratégie de lutte biologique.",
    authors: ["Marine A. Courtois"],
    authorNote: "Direction et encadrement : Ludovic Mailleret, Suzanne Touzeau, Louise van Oudenhove, Frédéric Grognard.",
    year: 2025,
    date: "2025-11-27",
    journal: "Thèse de doctorat — Université Côte d'Azur",
    doi: "10.70675/d019d560z1de7z4d84za3e2ze5ba4cf3718f",
    summaryFr:
      "Une recherche doctorale sur la technique de l'insecte stérile et les facteurs biologiques (fertilité résiduelle, accouplements multiples) et techniques (budget, fréquence et intensité des lâchers) qui influencent son efficacité, à travers des équations différentielles, des modèles individu-centrés et des approches impulsionnelles.",
    questionFr:
      "Comment les comportements biologiques et les contraintes techniques peuvent-ils modifier l'efficacité d'une stratégie de lutte biologique ?",
    approachFr:
      "Plusieurs cadres de modélisation complémentaires — équations différentielles, modèles individu-centrés, modèles impulsionnels — et un dépôt public de notebooks reproduisant les figures du manuscrit.",
    themes: ["TIS", "Fertilité résiduelle", "Polyandrie", "Lâchers impulsionnels", "Modélisation mathématique"],
    publicationType: "these",
    sourceUrl: "https://theses.fr/s352892",
    pdfUrl:
      "https://gitlab.com/marinecourtois/thesisData/-/blob/main/Thesis%20-%20Manuscript/COURTOIS_2025_archivage-2.pdf",
    codeUrl: "https://gitlab.com/marinecourtois/thesisData",
    extraLinks: [
      { label: "DOI de la thèse", url: "https://doi.org/10.70675/d019d560z1de7z4d84za3e2ze5ba4cf3718f" },
      {
        label: "Diapositives de soutenance",
        url: "https://gitlab.com/marinecourtois/thesisData/-/blob/main/Defense%20-%20Slides/PhD_Defense_filigrane.pdf",
      },
    ],
    featured: false,
    researchSlugs: ["technique-insecte-sterile", "fertilite-residuelle", "accouplements-multiples", "strategies-de-lachers"],
    sources: ["thesesFr", "thesisDoi", "orcid", "gitThesis", "inriaReport"],
  },
];

export const PUBLICATIONS: Publication[] = RAW_PUBLICATIONS.map((p) => publicationSchema.parse(p)).sort(
  (a, b) => (b.date ?? `${b.year}`).localeCompare(a.date ?? `${a.year}`),
);

export const ARTICLES = PUBLICATIONS.filter((p) => p.publicationType === "article");

export function getPublication(idOrSlug: string): Publication | undefined {
  return PUBLICATIONS.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
}

export const PUBLICATION_TYPE_LABEL: Record<Publication["publicationType"], string> = {
  article: "Article",
  these: "Thèse",
  preprint: "Préprint",
};

/** Communications and posters — verified on HAL (titles, events, places, dates). */
const RAW_COMMUNICATIONS: z.input<typeof communicationSchema>[] = [
  {
    id: "hal-04808600",
    title:
      "Analyse de l'impact du ré-accouplement et des biais d'utilisation du sperme chez Drosophila suzukii : élaboration d'un modèle individu-centré",
    type: "communication",
    event: "JFSMA 2024 — 32es Journées Francophones sur les Systèmes Multi-Agents",
    place: "Cargèse, France",
    date: "2024-11",
    authors: ["Marine Courtois", "Frédéric Grognard", "Suzanne Touzeau", "Ludovic Mailleret", "Louise van Oudenhove"],
    halId: "hal-04808600",
    url: "https://hal.inrae.fr/hal-04808600",
    themes: ["Polyandrie", "Simulation individu-centrée"],
  },
  {
    id: "hal-04808537",
    title: "Sterile Insect Technique: accounting for residual fertility",
    type: "communication",
    event: "CJC-MA 2024 — Congrès Jeunes Chercheur·e·s en Mathématiques Appliquées",
    place: "Lyon, France",
    date: "2024-10",
    authors: ["Marine Courtois", "Kévan Rastello", "Frédéric Grognard", "Ludovic Mailleret", "Suzanne Touzeau", "Louise van Oudenhove"],
    halId: "hal-04808537",
    url: "https://hal.inrae.fr/hal-04808537",
    themes: ["Fertilité résiduelle"],
  },
  {
    id: "hal-04788971",
    title: "Sterility on the rocks",
    type: "communication",
    event: "SFE² 2024 — International Congress in Ecology and Evolution, Société Française d'Écologie et d'Évolution",
    place: "Lyon, France",
    date: "2024-10",
    authors: [
      "Marine Courtois",
      "Taha Belkhayate",
      "Crésus Kounoudji",
      "Frédéric Grognard",
      "Suzanne Touzeau",
      "Ludovic Mailleret",
      "Louise van Oudenhove",
    ],
    halId: "hal-04788971",
    url: "https://hal.inrae.fr/hal-04788971",
    themes: ["Polyandrie", "TIS"],
  },
  {
    id: "hal-04452111",
    title: "Re-mating consequences on the efficiency of the sterile insect technique",
    type: "communication",
    event: "DSABNS 2024 — 15th Conference on Dynamical Systems Applied to Biology and Natural Sciences",
    place: "Caparica, Portugal",
    date: "2024-02",
    authors: [
      "Marine A. Courtois",
      "Taha Belkhayate",
      "Crésus Kounoudji",
      "Frédéric Grognard",
      "Suzanne Touzeau",
      "Ludovic Mailleret",
      "Louise van Oudenhove",
    ],
    halId: "hal-04452111",
    url: "https://hal.inrae.fr/hal-04452111",
    themes: ["Polyandrie", "TIS"],
  },
  {
    id: "hal-04144121",
    title: "How does residual fertility impact the effectiveness of the sterile insect technique in controlling Ceratitis capitata?",
    type: "communication",
    event: "MPDEE 2023 — Mathematical Population Dynamics, Ecology and Evolution",
    place: "Marseille, France",
    date: "2023-04",
    authors: ["Marine Courtois", "Kévan Rastello", "Frédéric Grognard", "Ludovic Mailleret", "Suzanne Touzeau", "Louise van Oudenhove"],
    halId: "hal-04144121",
    url: "https://hal.inrae.fr/hal-04144121",
    themes: ["Fertilité résiduelle"],
  },
  {
    id: "hal-04144059",
    title: "Sterile Insect Technique for crop protection: accounting for residual fertility",
    type: "poster",
    event: "MOMI 2023 — Le MOnde des Mathématiques Industrielles",
    place: "Sophia Antipolis, France",
    date: "2023-04",
    authors: ["Marine Courtois", "Kévan Rastello", "Frédéric Grognard", "Ludovic Mailleret", "Suzanne Touzeau", "Louise van Oudenhove"],
    halId: "hal-04144059",
    url: "https://hal.inrae.fr/hal-04144059",
    themes: ["Fertilité résiduelle"],
  },
  {
    id: "hal-04049975",
    title: "Sterile insect technique for crop protection: accounting for residual fertility",
    type: "poster",
    event: "DSABNS 2023 — 14th Conference on Dynamical Systems Applied to Biology and Natural Sciences",
    place: "Bilbao, Espagne",
    date: "2023-02",
    authors: ["Marine Courtois", "Kévan Rastello", "Frédéric Grognard", "Ludovic Mailleret", "Suzanne Touzeau", "Louise van Oudenhove"],
    halId: "hal-04049975",
    url: "https://hal.inrae.fr/hal-04049975",
    themes: ["Fertilité résiduelle"],
  },
  {
    id: "hal-03928222",
    title: "Sterile insect technique against the medfly: modelling, calibration and effect of residual fertility",
    type: "poster",
    event: "ECMTB 2022 — 12th European Conference on Mathematical and Theoretical Biology",
    place: "Heidelberg, Allemagne",
    date: "2022-09",
    authors: ["Marine Courtois", "Kévan Rastello", "Frédéric Grognard", "Ludovic Mailleret", "Suzanne Touzeau", "Louise van Oudenhove"],
    halId: "hal-03928222",
    url: "https://inria.hal.science/hal-03928222",
    themes: ["Fertilité résiduelle"],
  },
];

export const COMMUNICATIONS: Communication[] = RAW_COMMUNICATIONS.map((c) => communicationSchema.parse(c));

export function formatAuthors(authors: string[], highlight = "Courtois"): { name: string; self: boolean }[] {
  return authors.map((name) => ({ name, self: name.includes(highlight) }));
}
