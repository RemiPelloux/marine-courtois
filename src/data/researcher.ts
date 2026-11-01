/**
 * Researcher identity. Only verified facts — see docs/CONTENT_SOURCES.md.
 * Do not add a current job title or institution without a source.
 */
export const RESEARCHER = {
  name: "Marine A. Courtois",
  displayName: "Marine Courtois",
  monogram: "MC",
  title: "Docteure en biologie mathématique — modélisation, data science et écologie",
  discipline: "Modélisation & data science",
  tagline: "Mathématiques, code et données : tout s'assemble.",
  taglineEn: "Mathematics, code and data, fitted together.",
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

export const NAV_ITEMS = [
  { href: "/recherche", label: "Recherche" },
  { href: "/communication", label: "Communication" },
  { href: "/enseignement", label: "Enseignement" },
  { href: "/publications", label: "Publications" },
  { href: "/methodes", label: "Méthodes" },
  { href: "/a-propos", label: "À propos" },
] as const;

/** Pages kept out of the main navigation, listed in the footer. */
export const SECONDARY_NAV = [
  { href: "/these", label: "Thèse" },
  { href: "/laboratoire", label: "Laboratoire" },
  { href: "/contact", label: "Contact" },
] as const;
