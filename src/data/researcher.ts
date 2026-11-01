/**
 * Researcher identity. Only verified facts — see docs/CONTENT_SOURCES.md.
 * Do not add a current job title or institution without a source.
 */
export const RESEARCHER = {
  name: "Marine A. Courtois",
  displayName: "Marine Courtois",
  monogram: "MC",
  title: {
    fr: "Docteure en mathématiques appliquées à la biologie — Analyse de données",
    en: "PhD in applied mathematics for biology — Data analysis",
  },
  /** Short form printed under the name in the header. */
  discipline: { fr: "Mathématiques appliquées — Analyse de données", en: "Applied mathematics — Data analysis" },
  /** Hero line under the name. */
  role: { fr: "Docteure en mathématiques appliquées à la biologie", en: "PhD in applied mathematics for biology" },
  speciality: { fr: "Analyse de données", en: "Data analysis" },
  tagline: { fr: "Modéliser le vivant, simuler, analyser.", en: "Modelling life, simulating, analysing." },
  doctorate: {
    institution: "Université Côte d'Azur",
    defenseDate: "2025-11-27",
    defenseLabel: { fr: "27 novembre 2025", en: "27 November 2025" },
    environment: {
      fr: "Institut Sophia Agrobiotech — INRAE, Université Côte d'Azur",
      en: "Institut Sophia Agrobiotech — INRAE, Université Côte d'Azur",
    },
  },
  /**
   * Professional address, obfuscated against harvesters (see lib/utils/email.ts).
   * Regenerate with encodeEmail("…") if it changes.
   */
  emailCodes: [111, 123, 51, 120, 124, 111, 115, 116, 93, 110, 116, 114, 105, 111, 104, 114, 126, 51, 120, 115, 116, 111, 124, 112],
  profiles: [
    { label: "ORCID", handle: "0009-0002-3623-1460", url: "https://orcid.org/0009-0002-3623-1460" },
    { label: "GitLab", handle: "marinecourtois", url: "https://gitlab.com/marinecourtois" },
    { label: "theses.fr", handle: "s352892", url: "https://theses.fr/s352892" },
    { label: "LinkedIn", handle: "marine-courtois", url: "https://www.linkedin.com/in/marine-courtois-b065612a1/" },
  ],
  interests: {
    fr: [
      "Biologie mathématique",
      "Dynamique des populations",
      "Écologie théorique",
      "Modélisation écologique",
      "Biocontrôle",
      "Modélisation individu-centrée",
      "Écologie des invasions",
      "Analyse de données écologiques",
    ],
    en: [
      "Mathematical biology",
      "Population dynamics",
      "Theoretical ecology",
      "Ecological modelling",
      "Biocontrol",
      "Individual-based modelling",
      "Invasion ecology",
      "Ecological data analysis",
    ],
  },
  /** set NEXT_PUBLIC_SITE_URL in production (canonical URLs, sitemap, Open Graph) */
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;

/** Observe → Formulate → Model → Simulate → Analyze → Understand */
export const RESEARCH_SEQUENCE = [
  { fr: "Observer", en: "Observe" },
  { fr: "Formuler", en: "Formulate" },
  { fr: "Modéliser", en: "Model" },
  { fr: "Simuler", en: "Simulate" },
  { fr: "Analyser", en: "Analyse" },
  { fr: "Comprendre", en: "Understand" },
] as const;

/**
 * Main sections. Teaching has its own entry so it is found at once.
 * `match` lists every internal path that lights the entry up.
 */
export const NAV_ITEMS = [
  { href: "/parcours", label: { fr: "Parcours", en: "Career" }, match: ["/parcours", "/these"] },
  { href: "/recherche", label: { fr: "Recherche", en: "Research" }, match: ["/recherche"] },
  { href: "/publications", label: { fr: "Publications", en: "Publications" }, match: ["/publications"] },
  { href: "/communications", label: { fr: "Communications", en: "Talks" }, match: ["/communications"] },
  { href: "/enseignement", label: { fr: "Enseignement", en: "Teaching" }, match: ["/enseignement"] },
  { href: "/vulgarisation", label: { fr: "Vulgarisation", en: "Outreach" }, match: ["/vulgarisation"] },
  { href: "/projets", label: { fr: "Projets", en: "Projects" }, match: ["/projets", "/laboratoire"] },
  { href: "/outils", label: { fr: "Outils", en: "Tools" }, match: ["/outils"] },
] as const;

/** Pages kept out of the main navigation, listed in the footer. */
export const SECONDARY_NAV = [
  { href: "/these", label: { fr: "Thèse", en: "Thesis" } },
  { href: "/laboratoire", label: { fr: "Laboratoire interactif", en: "Interactive lab" } },
  { href: "/contact", label: { fr: "Contact", en: "Contact" } },
] as const;
