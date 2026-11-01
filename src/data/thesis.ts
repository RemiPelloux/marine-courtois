import { thesisChapterSchema, type ThesisChapter } from "@/types/content";
import type { z } from "zod";
import type { Lang } from "@/i18n/config";
import { localizeBy } from "@/i18n/localize";
import { formatDate } from "@/lib/utils/format";
import { EN_THESIS, EN_THESIS_CHAPTERS } from "@/data/en/thesis";

/**
 * Thesis structure taken from the README of gitlab.com/marinecourtois/thesisData
 * ("Thesis Structure and Research Axes") and the repository's chapter folders.
 */
export const THESIS = {
  title:
    "Modélisation de la technique de l'insecte stérile dans un contexte agricole : examen des facteurs biologiques et techniques susceptibles d'atténuer son efficacité",
  titleEn:
    "Modeling the Sterile Insect Technique in an agricultural context: examining biological and technical factors likely to reduce its effectiveness",
  institution: "Université Côte d'Azur",
  defenseDate: "2025-11-27",
  defenseLabel: "27 novembre 2025",
  supervisors: ["Ludovic Mailleret", "Suzanne Touzeau", "Louise van Oudenhove", "Frédéric Grognard"],
  keywords: [
    "Mathematical modeling",
    "Sterile Insect Technique (SIT)",
    "Residual fertility",
    "Multiple mating",
    "Ordinary differential equations",
    "Eradication threshold",
    "Population dynamics",
  ],
  intro: [
    "Comment les comportements biologiques et les contraintes techniques peuvent-ils modifier l'efficacité d'une stratégie de lutte biologique ?",
    "Ma thèse s'intéresse à cette question dans le cadre de la technique de l'insecte stérile. Elle explore notamment les conséquences d'une stérilisation imparfaite, les effets du ré-accouplement et les modalités de lâchers, à travers plusieurs approches de modélisation.",
  ],
  resources: [
    {
      label: "Manuscrit (PDF, version d'archivage)",
      url: "https://gitlab.com/marinecourtois/thesisData/-/blob/main/Thesis%20-%20Manuscript/COURTOIS_2025_archivage-2.pdf",
      kind: "PDF · GitLab",
    },
    {
      label: "Diapositives de soutenance",
      url: "https://gitlab.com/marinecourtois/thesisData/-/blob/main/Defense%20-%20Slides/PhD_Defense_filigrane.pdf",
      kind: "PDF · GitLab",
    },
    { label: "Notice theses.fr", url: "https://theses.fr/s352892", kind: "Notice" },
    { label: "DOI de la thèse", url: "https://doi.org/10.70675/d019d560z1de7z4d84za3e2ze5ba4cf3718f", kind: "DOI" },
    { label: "Dépôt de code thesisData", url: "https://gitlab.com/marinecourtois/thesisData", kind: "Code" },
  ],
} as const;

const RAW: z.input<typeof thesisChapterSchema>[] = [
  {
    number: 1,
    folder: "Chapter 1 - Introduction",
    title: "Introduction",
    titleFr: "Comprendre la technique de l'insecte stérile",
    question: "Qu'est-ce que la technique de l'insecte stérile, et pourquoi la modéliser ?",
    approach: "Contexte, objectifs et organisation de la thèse ; état des lieux bibliométrique des travaux publiés sur la TIS.",
    keyConcept: "Lutte autocide : utiliser les individus d'une espèce pour réduire sa propre reproduction.",
    accessible:
      "On élève et stérilise des insectes, puis on les relâche. Les femelles sauvages qui s'accouplent avec eux n'ont pas de descendance : la population décline si les lâchers sont suffisants.",
    publicationIds: [],
    codeFileIds: ["ch1-articles", "ch1-scopus"],
    figureId: "fig-ch1-articles",
    sources: ["gitThesis"],
  },
  {
    number: 2,
    folder: "Chapter 2 - Modeling SIT",
    title: "Modeling SIT",
    titleFr: "Modéliser la TIS",
    question: "Quels modèles mathématiques décrivent la dynamique d'une population soumise à des lâchers stériles ?",
    approach: "Présentation des modèles développés pour décrire la dynamique de la TIS : modèles discrets, compétition, bifurcations.",
    keyConcept: "Bistabilité : selon la population initiale, le système converge vers l'extinction ou vers un équilibre positif.",
    accessible:
      "Un même niveau de lâchers peut suffire contre une petite population mais échouer contre une population importante : il existe un seuil.",
    publicationIds: [],
    codeFileIds: ["ch2-figures"],
    figureId: "fig-ch2-cobweb",
    sources: ["gitThesis"],
  },
  {
    number: 3,
    folder: "Chapter 3 - Residual Fertility",
    title: "Residual Fertility",
    titleFr: "Fertilité résiduelle",
    question: "Malgré la stérilisation, certains mâles conservent un faible niveau de fertilité. Quelles conséquences pour le contrôle ?",
    approach: "Modèle en équations différentielles, courbes de bifurcation, dynamiques temporelles et analyse de sensibilité.",
    keyConcept: "Fertilité résiduelle « sans coût » (δ) et « coûteuse » (ε) : deux mécanismes, deux effets.",
    accessible:
      "Si une petite part des mâles relâchés reste fertile, on peut, dans certaines conditions, réduire fortement la population sans parvenir à l'éliminer.",
    publicationIds: ["pub-2025-residual-fertility"],
    codeFileIds: ["ch3-rf", "ch3-sensitivity"],
    figureId: "fig-ch3-dynamics",
    sources: ["gitThesis", "pubRF"],
  },
  {
    number: 4,
    folder: "Chapter 4 - Multiple Mating",
    title: "Multiple Mating",
    titleFr: "Accouplements multiples",
    question: "De nombreuses femelles de ravageurs s'accouplent plusieurs fois : comment cela affecte-t-il l'efficacité des lâchers ?",
    approach: "Modèle compartimental et modèle individu-centré (Mesa) appliqués à Drosophila suzukii ; comparaison des deux approches.",
    keyConcept: "Règle d'utilisation du sperme : premier mâle, dernier mâle, mélange, choix ou préférence.",
    accessible:
      "Si une femelle utilise le sperme de son dernier partenaire, un mâle stérile peut « effacer » un accouplement fertile — l'inverse est aussi possible.",
    publicationIds: ["pub-2026-polyandry"],
    codeFileIds: ["ch4-compartmental", "ch4-abm-output", "ch4-appendix-1", "ch4-convergence", "ch4-data"],
    figureId: "fig-ch4-first-last",
    sources: ["gitThesis", "gitAbm", "pubPolyandry"],
  },
  {
    number: 5,
    folder: "Chapter 5 - Agricultural Context",
    title: "Agricultural Context",
    titleFr: "Contexte agricole : lâchers sous budget limité",
    question: "Comment répartir un budget limité de mâles stériles entre fréquence et intensité des lâchers ?",
    approach: "Stratégies de lâchers discrets (modèles impulsionnels) sous budget limité ; prise en compte des piqûres de ponte.",
    keyConcept: "Compromis fréquence–amplitude et « coût caché » des piqûres stériles sur la qualité des fruits.",
    accessible:
      "Relâcher souvent ou relâcher beaucoup ? Les deux ne se valent pas. Et même stériles, les femelles peuvent abîmer les fruits en pondant.",
    publicationIds: [],
    codeFileIds: ["ch5-impulsive", "ch5-oviposition"],
    figureId: "fig-ch5-budget",
    sources: ["gitThesis"],
  },
  {
    number: 6,
    folder: "—",
    title: "Discussion",
    titleFr: "Discussion",
    question: "Que retenir des facteurs biologiques et opérationnels qui conditionnent le succès de la TIS ?",
    approach: "Synthèse des résultats et perspectives (voir le manuscrit).",
    keyConcept: "Facteurs biologiques (fertilité résiduelle, accouplements multiples) et opérationnels (budget, fréquence, intensité).",
    accessible:
      "La thèse montre où se situent les limites de la stratégie et comment les anticiper, pour améliorer le contrôle tout en limitant les pertes de récolte.",
    publicationIds: [],
    codeFileIds: ["manuscript"],
    sources: ["gitThesis"],
  },
];

export const THESIS_CHAPTERS: ThesisChapter[] = RAW.map((c) => thesisChapterSchema.parse(c));

type Resource = { label: string; url: string; kind: string };

/** Thesis facts and text in a language. The official title stays French; `titleEn` is its English version. */
export function thesisIn(lang: Lang) {
  const en = lang === "en";
  const resources: Resource[] = THESIS.resources.map((r, i) => (en ? { ...r, label: EN_THESIS.resourceLabels[i], kind: EN_THESIS.resourceKinds[i] } : r));
  return {
    ...THESIS,
    intro: en ? EN_THESIS.intro : [...THESIS.intro],
    defenseLabel: formatDate(THESIS.defenseDate, lang),
    resources,
  };
}

/** Chapters in a language: questions and summaries translated, repository titles kept. */
export function localizeChapters(chapters: ThesisChapter[], lang: Lang): ThesisChapter[] {
  return localizeBy(chapters, (c) => c.number, EN_THESIS_CHAPTERS, lang);
}

export const thesisChaptersIn = (lang: Lang) => localizeChapters(THESIS_CHAPTERS, lang);
