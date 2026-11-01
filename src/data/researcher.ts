/**
 * Researcher identity. Only verified facts — see docs/CONTENT_SOURCES.md.
 * Do not add a current job title or institution without a source.
 */
export const RESEARCHER = {
  name: "Marine A. Courtois",
  displayName: "Marine Courtois",
  monogram: "MC",
  title: "Docteure en biologie mathématique — modélisation, simulation et analyse de données",
  discipline: "Biologie mathématique & données",
  tagline: "Modéliser le vivant, simuler, analyser.",
  taglineEn: "Modelling life, simulating, analysing.",
  doctorate: {
    institution: "Université Côte d'Azur",
    defenseDate: "2025-11-27",
    defenseLabel: "27 novembre 2025",
    environment: "Institut Sophia Agrobiotech — INRAE, Université Côte d'Azur",
    collaborations: "Collaborations avec des chercheuses et chercheurs d'Inria et du CNRS",
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
  ],
  interests: [
    "Biologie mathématique",
    "Dynamique des populations",
    "Écologie théorique",
    "Modélisation écologique",
    "Biocontrôle",
    "Modélisation individu-centrée",
    "Écologie des invasions",
    "Analyse de données écologiques",
  ],
  /** set NEXT_PUBLIC_SITE_URL in production (canonical URLs, sitemap, Open Graph) */
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;

/** Observe → Formulate → Model → Simulate → Analyze → Understand */
export const RESEARCH_SEQUENCE = [
  { fr: "Observer", en: "Observe" },
  { fr: "Formuler", en: "Formulate" },
  { fr: "Modéliser", en: "Model" },
  { fr: "Simuler", en: "Simulate" },
  { fr: "Analyser", en: "Analyze" },
  { fr: "Comprendre", en: "Understand" },
] as const;

/**
 * Eight universes, seven entries: Vulgarisation and Enseignement share
 * "Transmettre". `match` lists every path that lights the entry up.
 */
export const NAV_ITEMS = [
  { href: "/parcours", label: "Parcours", match: ["/parcours", "/these"] },
  { href: "/recherche", label: "Recherche", match: ["/recherche"] },
  { href: "/publications", label: "Publications", match: ["/publications"] },
  { href: "/communications", label: "Communications", match: ["/communications"] },
  { href: "/vulgarisation", label: "Transmettre", match: ["/vulgarisation", "/enseignement"] },
  { href: "/projets", label: "Projets", match: ["/projets", "/laboratoire"] },
  { href: "/outils", label: "Outils", match: ["/outils"] },
] as const;

/** Pages kept out of the main navigation, listed in the footer. */
export const SECONDARY_NAV = [
  { href: "/vulgarisation", label: "Vulgarisation" },
  { href: "/enseignement", label: "Enseignement" },
  { href: "/these", label: "Thèse" },
  { href: "/laboratoire", label: "Laboratoire interactif" },
  { href: "/contact", label: "Contact" },
] as const;
