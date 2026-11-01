import { publicationSchema, type Publication } from "@/types/content";
import { z } from "zod";
import type { Copy, Lang } from "@/i18n/config";
import { localizeById } from "@/i18n/localize";
import { EN_PUBLICATIONS } from "@/data/en/publications";

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
    editorialTitle: "Les accouplements multiples peuvent-ils modifier l'efficacité de la lutte biologique\u00a0?",
    authors: ["Marine A. Courtois", "Louise van Oudenhove", "Suzanne Touzeau", "Frédéric Grognard", "Ludovic Mailleret"],
    year: 2026,
    date: "2026-04-29",
    journal: "PLOS Computational Biology",
    volume: "22(4)",
    pages: "e1014212",
    doi: "10.1371/journal.pcbi.1014212",
    summary:
      "Chez Drosophila suzukii, une femelle peut s'accoupler avec plusieurs mâles et conserver leur sperme. À l'aide d'un modèle mathématique et de simulations qui représentent chaque insecte, l'étude montre que ces accouplements multiples n'ont pas le même effet sur la technique de l'insecte stérile à court terme et à long terme.",
    question:
      "Lorsque les femelles d'un ravageur s'accouplent plusieurs fois, la manière dont elles utilisent le sperme stocké peut-elle changer l'issue des lâchers de mâles stériles\u00a0?",
    approach:
      "Un modèle compartimental (équations différentielles) et un modèle individu-centré écrit en Python avec la bibliothèque Mesa, qui compare plusieurs règles d'utilisation du sperme\u00a0: premier mâle, dernier mâle, mélange, choix et préférence.",
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
    editorialTitle: "Peut-on prédire l'impact écologique d'une espèce invasive à partir de sa réponse fonctionnelle\u00a0?",
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
    summary:
      "Les espèces invasives consomment-elles davantage de proies\u00a0? L'étude rassemble 269 estimations de réponses fonctionnelles déjà publiées pour 45 espèces de poissons d'eau douce et les compare statistiquement. Les espèces invasives ont une réponse fonctionnelle plus élevée lorsqu'elles sont étudiées dans leur aire d'origine, mais pas dans les régions où elles ont été introduites\u00a0: le lieu de la mesure compte.",
    question:
      "La réponse fonctionnelle d'une espèce — la relation entre l'abondance de ses proies et sa consommation — renseigne-t-elle sur son caractère invasif et sur son impact trophique\u00a0?",
    approach:
      "Une analyse statistique comparative de 269 estimations déjà publiées (45 espèces de poissons d'eau douce, base FoRAGE), avec des modèles mixtes bayésiens (MCMCglmm, sous R) qui tiennent compte de la parenté entre espèces et de la température des expériences d'origine. Aucune nouvelle expérience n'a été menée\u00a0; les données et le matériel sont publiés sur Zenodo.",
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
    editorialTitle: "Quand la stérilité n'est pas totale\u00a0: quelles conséquences pour le biocontrôle\u00a0?",
    authors: ["Marine A. Courtois", "Ludovic Mailleret", "Suzanne Touzeau", "Louise van Oudenhove", "Frédéric Grognard"],
    year: 2025,
    date: "2025-01-03",
    journal: "Bulletin of Mathematical Biology",
    volume: "87(2)",
    pages: "25",
    doi: "10.1007/s11538-024-01401-1",
    summary:
      "La stérilisation laisse parfois une partie des mâles relâchés encore fertiles. L'étude mesure ce que cette fertilité résiduelle change à la technique de l'insecte stérile\u00a0: les modèles séparent les situations où la population de ravageurs peut être éliminée de celles où elle est seulement réduite.",
    question:
      "Si une petite fraction des mâles relâchés reste fertile, la technique de l'insecte stérile peut-elle encore conduire à l'élimination d'une population de ravageurs\u00a0?",
    approach:
      "Un modèle de trois équations différentielles (mâles stériles, femelles et mâles sauvages), étudié mathématiquement (équilibres et seuils de basculement, ou bifurcations) et par simulation, avec une analyse de sensibilité des paramètres.",
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
    authorNote: "Direction et encadrement\u00a0: Ludovic Mailleret, Suzanne Touzeau, Louise van Oudenhove, Frédéric Grognard.",
    year: 2025,
    date: "2025-11-27",
    journal: "Thèse de doctorat — Université Côte d'Azur",
    doi: "10.70675/d019d560z1de7z4d84za3e2ze5ba4cf3718f",
    summary:
      "Une thèse sur la technique de l'insecte stérile\u00a0: quels facteurs biologiques (fertilité résiduelle, accouplements multiples) et techniques (budget, fréquence et taille des lâchers) peuvent en réduire l'efficacité\u00a0? Elle s'appuie sur des équations différentielles, des modèles qui représentent chaque insecte (individu-centrés) et des modèles de lâchers ponctuels (impulsionnels).",
    question:
      "Comment les comportements biologiques et les contraintes techniques peuvent-ils modifier l'efficacité d'une stratégie de lutte biologique\u00a0?",
    approach:
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

/** Publications in a language (same order and facts; editorial text translated). */
export const publicationsIn = (lang: Lang) => localizeById(PUBLICATIONS, EN_PUBLICATIONS, lang);
export const getPublicationIn = (lang: Lang, idOrSlug: string) => publicationsIn(lang).find((p) => p.id === idOrSlug || p.slug === idOrSlug);

export const PUBLICATION_TYPE_LABEL: Record<Publication["publicationType"], Copy<string>> = {
  article: { fr: "Article", en: "Article" },
  these: { fr: "Thèse", en: "Thesis" },
  preprint: { fr: "Préprint", en: "Preprint" },
};

export { COMMUNICATIONS } from "@/data/communications";

export function formatAuthors(authors: string[], highlight = "Courtois"): { name: string; self: boolean }[] {
  return authors.map((name) => ({ name, self: name.includes(highlight) }));
}
