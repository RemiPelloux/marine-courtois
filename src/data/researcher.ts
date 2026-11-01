/**
 * Researcher identity. Only verified facts — see docs/CONTENT_SOURCES.md.
 * Do not add a current job title or institution without a source.
 */
export const RESEARCHER = {
  name: "Marine A. Courtois",
  displayName: "Marine Courtois",
  monogram: "MC",
  title: "Docteure — Biologie mathématique & modélisation écologique",
  discipline: "Biologie mathématique",
  tagline: "Comprendre le vivant. Par le modèle.",
  taglineEn: "Understanding life through mathematical models.",
  doctorate: {
    institution: "Université Côte d'Azur",
    defenseDate: "2025-11-27",
    defenseLabel: "27 novembre 2025",
    environment: "Institut Sophia Agrobiotech — INRAE, Université Côte d'Azur",
    collaborations: "Collaborations avec des chercheuses et chercheurs d'Inria et du CNRS",
  },
  email: "marine.courtois@inrae.fr",
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
  { href: "/methodes", label: "Méthodes" },
  { href: "/publications", label: "Publications" },
  { href: "/these", label: "Thèse" },
  { href: "/laboratoire", label: "Laboratoire" },
  { href: "/a-propos", label: "À propos" },
] as const;
