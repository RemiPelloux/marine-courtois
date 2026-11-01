import type { Copy, Lang } from "@/i18n/config";
import { localizeById } from "@/i18n/localize";
import type { SourceId } from "@/data/sources";
import { EN_COMPETENCES } from "@/data/en/competences";

/**
 * Scientific competences, grouped in four domains, for the career puzzle.
 * Each one comes from published work (articles, thesis repository, Zenodo) or
 * from what Marine Courtois declared (teaching, ongoing plant multi-omics work:
 * source "owner"). `uses` points to where the competence is put to work.
 */
export const DOMAIN_IDS = ["mathematiques", "statistiques", "biologie", "ecologie"] as const;
export type DomainId = (typeof DOMAIN_IDS)[number];

export const COMPETENCE_DOMAINS: { id: DomainId; title: Copy<string>; subtitle: Copy<string> }[] = [
  { id: "mathematiques", title: { fr: "Mathématiques", en: "Mathematics" }, subtitle: { fr: "modélisation et algèbre", en: "modelling and algebra" } },
  { id: "statistiques", title: { fr: "Statistiques", en: "Statistics" }, subtitle: { fr: "analyses et méthodes", en: "analyses and methods" } },
  { id: "biologie", title: { fr: "Biologie", en: "Biology" }, subtitle: { fr: "systèmes biologiques", en: "biological systems" } },
  { id: "ecologie", title: { fr: "Écologie", en: "Ecology" }, subtitle: { fr: "populations et interactions", en: "populations and interactions" } },
];

/** Places where a competence is used; internal paths are written in French. */
const USES = {
  bmb: { href: "/publications/fertilite-residuelle-technique-insecte-sterile", label: { fr: "Article, Bulletin of Mathematical Biology (2025)", en: "Article, Bulletin of Mathematical Biology (2025)" } },
  plos: { href: "/publications/polyandrie-technique-insecte-sterile", label: { fr: "Article, PLOS Computational Biology (2026)", en: "Article, PLOS Computational Biology (2026)" } },
  jae: { href: "/publications/reponse-fonctionnelle-invasivite", label: { fr: "Article, Journal of Animal Ecology (2026)", en: "Article, Journal of Animal Ecology (2026)" } },
  ch2: { href: "/these", label: { fr: "Thèse, chapitre 2", en: "Thesis, chapter 2" } },
  ch3: { href: "/these", label: { fr: "Thèse, chapitre 3", en: "Thesis, chapter 3" } },
  ch4: { href: "/these", label: { fr: "Thèse, chapitre 4", en: "Thesis, chapter 4" } },
  ch5: { href: "/these", label: { fr: "Thèse, chapitre 5", en: "Thesis, chapter 5" } },
  abm: { href: "/projets/modele-individu-centre", label: { fr: "Projet : modèle individu-centré", en: "Project: individual-based model" } },
  fishProject: { href: "/projets/reponses-fonctionnelles", label: { fr: "Projet : réponses fonctionnelles", en: "Project: functional responses" } },
  sit: { href: "/recherche/technique-insecte-sterile", label: { fr: "Recherche : technique de l'insecte stérile", en: "Research: sterile insect technique" } },
  rf: { href: "/recherche/fertilite-residuelle", label: { fr: "Recherche : fertilité résiduelle", en: "Research: residual fertility" } },
  mating: { href: "/recherche/accouplements-multiples", label: { fr: "Recherche : accouplements multiples", en: "Research: multiple mating" } },
  releases: { href: "/recherche/strategies-de-lachers", label: { fr: "Recherche : stratégies de lâchers", en: "Research: release strategies" } },
  invasions: { href: "/recherche/ecologie-des-invasions", label: { fr: "Recherche : écologie des invasions", en: "Research: invasion ecology" } },
  talks: { href: "/communications", label: { fr: "Communications en congrès", en: "Conference talks" } },
  teaching: { href: "/enseignement", label: { fr: "Enseignement", en: "Teaching" } },
} as const satisfies Record<string, { href: string; label: Copy<string> }>;
type UseId = keyof typeof USES;

export type RawCompetence = {
  id: string;
  domain: DomainId;
  /** printed on the puzzle piece: one short line */
  label: string;
  title: string;
  detail: string;
  uses: UseId[];
  sources: SourceId[];
  /** work in progress, not yet published */
  ongoing?: boolean;
};

export type Competence = Omit<RawCompetence, "uses"> & { uses: { href: string; label: string }[] };

export const COMPETENCES: RawCompetence[] = [
  { id: "edo", domain: "mathematiques", label: "Équations diff.", title: "Équations différentielles ordinaires", detail: "Modèles de populations soumises à des lâchers d'insectes stériles, avec et sans fertilité résiduelle.", uses: ["bmb", "ch3"], sources: ["pubRF", "gitThesis"] },
  { id: "stabilite", domain: "mathematiques", label: "Stabilité", title: "Équilibres et stabilité", detail: "Calcul des équilibres et de leur stabilité ; bistabilité : selon la population initiale, extinction ou équilibre positif.", uses: ["ch2", "bmb"], sources: ["gitThesis", "pubRF"] },
  { id: "bifurcations", domain: "mathematiques", label: "Bifurcations", title: "Analyse de bifurcation", detail: "Courbes de bifurcation selon l'intensité des lâchers et le niveau de fertilité résiduelle.", uses: ["ch2", "ch3"], sources: ["gitThesis"] },
  { id: "impulsionnel", domain: "mathematiques", label: "Impulsionnel", title: "Modèles impulsionnels", detail: "Lâchers discrets décrits par des équations impulsionnelles ; convergence vers une solution périodique.", uses: ["ch5", "releases"], sources: ["gitThesis"] },
  { id: "individu-centre", domain: "mathematiques", label: "Individu-centré", title: "Modélisation individu-centrée", detail: "Modèle multi-agents écrit avec Mesa, calibré sur Drosophila suzukii et comparé à un modèle compartimental.", uses: ["plos", "abm", "ch4"], sources: ["gitAbm", "pubPolyandry"] },
  { id: "algebre", domain: "mathematiques", label: "Algèbre linéaire", title: "Algèbre linéaire et modèles matriciels", detail: "Matrices et modèles matriciels appliqués à la biologie, enseignés en algèbre linéaire.", uses: ["teaching"], sources: ["owner"] },

  { id: "bayes", domain: "statistiques", label: "Stat. bayésienne", title: "Analyse comparative bayésienne", detail: "Modèles mixtes MCMCglmm avec correction phylogénétique, sur les réponses fonctionnelles de 45 espèces de poissons d'eau douce.", uses: ["jae", "fishProject"], sources: ["pubInvasion", "zenodoInvasion"] },
  { id: "sensibilite", domain: "statistiques", label: "Sensibilité", title: "Analyse de sensibilité", detail: "Indices de sensibilité des paramètres du modèle de fertilité résiduelle, estimés avec des modèles linéaires.", uses: ["ch3"], sources: ["gitThesis"] },
  { id: "lineaire", domain: "statistiques", label: "Modèle linéaire", title: "Modèles linéaires et ANOVA", detail: "Modèles linéaires et analyse de variance, enseignés en statistiques avec R.", uses: ["teaching"], sources: ["owner"] },
  { id: "r", domain: "statistiques", label: "Programmation R", title: "Programmation en R", detail: "Scripts d'analyse publiés sur Zenodo ; R, ggplot2 et Shiny enseignés aux étudiants.", uses: ["fishProject", "teaching"], sources: ["zenodoInvasion", "owner"] },
  { id: "excel", domain: "statistiques", label: "Données, Excel", title: "Analyse de données sous Excel", detail: "Analyse de données avec un tableur, enseignée aux étudiants.", uses: ["teaching"], sources: ["owner"] },
  { id: "deep-learning", domain: "statistiques", label: "Deep learning", title: "Apprentissage profond (VAE)", detail: "Auto-encodeurs variationnels appliqués à des données multi-omiques de plantes.", uses: [], sources: ["owner"], ongoing: true },

  { id: "tis", domain: "biologie", label: "Insecte stérile", title: "Technique de l'insecte stérile", detail: "Lutte autocide : des insectes stérilisés puis relâchés réduisent la reproduction de leur propre espèce.", uses: ["sit", "ch2"], sources: ["thesesFr", "gitThesis"] },
  { id: "fertilite", domain: "biologie", label: "Fertilité", title: "Fertilité résiduelle", detail: "Des mâles relâchés qui gardent une faible fertilité : deux mécanismes, « sans coût » et « coûteux », aux effets distincts.", uses: ["bmb", "rf"], sources: ["pubRF", "gitThesis"] },
  { id: "polyandrie", domain: "biologie", label: "Polyandrie", title: "Comportement reproducteur", detail: "Accouplements multiples des femelles et règles d'utilisation du sperme : premier mâle, dernier mâle, mélange.", uses: ["plos", "mating"], sources: ["pubPolyandry", "gitThesis"] },
  { id: "ravageurs", domain: "biologie", label: "Ravageurs", title: "Insectes ravageurs des cultures", detail: "Ceratitis capitata et Drosophila suzukii ; piqûres de ponte qui abîment les fruits, même sans descendance.", uses: ["talks", "ch5"], sources: ["hal", "gitThesis"] },
  { id: "physiologie", domain: "biologie", label: "Physiologie", title: "Physiologie végétale", detail: "Nutrition hydrique et minérale, photosynthèse, métabolisme secondaire : travaux pratiques de biologie végétale.", uses: ["teaching"], sources: ["owner"] },
  { id: "multi-omique", domain: "biologie", label: "Multi-omique", title: "Multi-omique végétale", detail: "Transcriptomique et métabolomique de plantes.", uses: [], sources: ["owner"], ongoing: true },

  { id: "populations", domain: "ecologie", label: "Populations", title: "Dynamique des populations", detail: "Déclin d'une population sauvage sous lâchers stériles, et seuils d'élimination.", uses: ["sit", "ch2"], sources: ["gitThesis", "inriaReport"] },
  { id: "predation", domain: "ecologie", label: "Prédation", title: "Réponses fonctionnelles", detail: "Consommation d'un prédateur selon la densité de ses proies : 269 observations sur 45 espèces de poissons d'eau douce.", uses: ["jae", "invasions"], sources: ["pubInvasion"] },
  { id: "invasions", domain: "ecologie", label: "Invasions", title: "Invasions biologiques", detail: "La réponse fonctionnelle distingue les espèces invasives, mais la différence tient à celles étudiées dans leur aire native.", uses: ["jae", "fishProject"], sources: ["pubInvasion", "zenodoInvasion"] },
  { id: "trophique", domain: "ecologie", label: "Impact trophique", title: "Interactions trophiques", detail: "Relier la consommation d'un prédateur à son impact sur les proies : la réponse fonctionnelle ne prédit pas l'impact trophique.", uses: ["jae"], sources: ["pubInvasion"] },
  { id: "competition", domain: "ecologie", label: "Compétition", title: "Compétition et seuils", detail: "Modèles de lâchers stériles avec compétition : au-delà d'un seuil de lâchers, seul l'équilibre nul subsiste.", uses: ["ch2"], sources: ["gitThesis"] },
  { id: "lutte-biologique", domain: "ecologie", label: "Lutte biologique", title: "Lutte biologique et stratégies de lâchers", detail: "Répartir un budget limité de mâles stériles entre la fréquence et l'intensité des lâchers.", uses: ["releases", "ch5"], sources: ["gitThesis"] },
];

/** Competences in a language, with their uses resolved to links. */
export function competencesIn(lang: Lang): Competence[] {
  return localizeById(COMPETENCES, EN_COMPETENCES, lang).map((c) => ({
    ...c,
    uses: c.uses.map((u) => ({ href: USES[u].href, label: USES[u].label[lang] })),
  }));
}
