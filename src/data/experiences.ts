import { experienceSchema, type Experience } from "@/types/portfolio";
import type { z } from "zod";
import type { Copy, Lang } from "@/i18n/config";
import { localizeById } from "@/i18n/localize";
import { EN_EXPERIENCES } from "@/data/en/experiences";

/**
 * Dated career events for the chronology of /parcours. Only facts with a
 * public source (ORCID, HAL, DOI, theses.fr, Crossref, Inria report). Degrees
 * and internships are not public yet: add them here, with their source, once
 * the CV is supplied. Competences live in src/data/competences.ts.
 */
const RAW: z.input<typeof experienceSchema>[] = [
  { id: "ecmtb-2022", kind: "communication", label: "ECMTB 2022", title: "Premier poster : la TIS contre la mouche méditerranéenne des fruits", date: "2022-09", place: "Heidelberg, Allemagne", detail: "Modélisation, calibration et effet de la fertilité résiduelle. Le point de départ du fil de la fertilité résiduelle.", href: "https://inria.hal.science/hal-03928222", sources: ["hal"] },
  { id: "doctorat", kind: "doctorat", label: "Doctorat", title: "Doctorante, INRAE et Université Côte d'Azur", date: "2022-10", endDate: "2025-09", place: "Sophia Antipolis", detail: "Trois années consacrées à la modélisation de la technique de l'insecte stérile en contexte agricole.", href: "/these", sources: ["orcidEmployment", "thesesFr"] },
  { id: "isa", kind: "experience", label: "Agrobiotech", title: "Institut Sophia Agrobiotech", date: "2022-10", place: "Sophia Antipolis", detail: "Environnement de recherche de la thèse : INRAE et Université Côte d'Azur.", sources: ["thesesFr"] },
  { id: "macbes", kind: "collaboration", label: "Inria MACBES", title: "Travaux cités par l'équipe Inria MACBES", date: "2025", detail: "Le rapport d'activité 2025 de l'équipe MACBES mentionne la thèse et ses travaux, menés avec Frédéric Grognard, Ludovic Mailleret et Suzanne Touzeau.", href: "https://prod-rex-app.inria.fr/report/2025/macbes/index.html", sources: ["inriaReport", "thesesFr"] },
  { id: "dsabns-2023", kind: "communication", label: "DSABNS 2023", title: "Poster : tenir compte de la fertilité résiduelle", date: "2023-02", place: "Bilbao, Espagne", detail: "Systèmes dynamiques appliqués à la biologie : la fertilité résiduelle dans la protection des cultures.", href: "https://hal.inrae.fr/hal-04049975", sources: ["hal"] },
  { id: "momi-2023", kind: "communication", label: "MOMI 2023", title: "Poster au Monde des Mathématiques Industrielles", date: "2023-04", place: "Sophia Antipolis", detail: "La fertilité résiduelle présentée à un public de mathématiques industrielles.", href: "https://hal.inrae.fr/hal-04144059", sources: ["hal"] },
  { id: "mpdee-2023", kind: "communication", label: "MPDEE 2023", title: "Communication orale sur Ceratitis capitata", date: "2023-04", place: "Marseille", detail: "Comment la fertilité résiduelle modifie-t-elle l'efficacité de la TIS contre la mouche méditerranéenne des fruits ?", href: "https://hal.inrae.fr/hal-04144121", sources: ["hal"] },
  { id: "dsabns-2024", kind: "communication", label: "DSABNS 2024", title: "Les conséquences du ré-accouplement", date: "2024-02", place: "Caparica, Portugal", detail: "Première présentation des accouplements multiples et de leurs effets sur l'efficacité de la TIS.", href: "https://hal.inrae.fr/hal-04452111", sources: ["hal"] },
  { id: "mmee-2024", kind: "communication", label: "MMEE 2024", title: "Multiple mating: a threat?", date: "2024-07", place: "Vienne, Autriche", detail: "Les accouplements multiples, menace ou opportunité pour la lutte par lâchers de mâles stériles.", href: "https://hal.inrae.fr/hal-04664229", sources: ["hal"] },
  { id: "lyon-2024", kind: "communication", label: "Lyon 2024", title: "SFE² et CJC-MA à Lyon", date: "2024-10", place: "Lyon", detail: "Deux communications le même mois : « Sterility on the rocks » au congrès de la SFE², puis la fertilité résiduelle au congrès des jeunes chercheurs en mathématiques appliquées.", href: "/communications", sources: ["hal"] },
  { id: "jfsma-2024", kind: "communication", label: "JFSMA 2024", title: "Modèle individu-centré et poster à éléments rotatifs", date: "2024-11", place: "Cargèse", detail: "Ré-accouplement et biais d'utilisation du sperme chez Drosophila suzukii, présentés avec un poster physique que les visiteurs manipulaient.", href: "/communications#poster-cargese", sources: ["hal", "owner"] },
  { id: "bmb-2025", kind: "publication", label: "Article BMB", title: "Bulletin of Mathematical Biology", date: "2025-01", detail: "Premier article : comment la fertilité résiduelle limite l'efficacité de la TIS.", href: "/publications/fertilite-residuelle-technique-insecte-sterile", sources: ["pubRF"] },
  { id: "jedns-2025", kind: "communication", label: "JEDNs 2025", title: "Journées de l'École doctorale de Nice", date: "2025-05", place: "Nice", detail: "Quand la vie amoureuse des ravageurs met la TIS à l'épreuve.", href: "https://hal.science/hal-05108413", sources: ["hal"] },
  { id: "smai-2025", kind: "communication", label: "SMAI 2025", title: "Biennale de la SMAI", date: "2025-06", place: "Carcans-Maubuisson", detail: "« Sterility in Trouble » devant la communauté des mathématiques appliquées.", href: "https://hal.science/hal-05108421", sources: ["hal"] },
  { id: "preprint-2025", kind: "publication", label: "Préprint bioRxiv", title: "Préprint sur les réponses fonctionnelles", date: "2025-07", detail: "La version préliminaire de l'étude sur les poissons d'eau douce, rendue publique avant évaluation.", href: "https://doi.org/10.1101/2025.07.26.666957", sources: ["preprintInvasion"] },
  { id: "soutenance", kind: "doctorat", label: "Soutenance", title: "Soutenance de thèse", date: "2025-11-27", place: "Université Côte d'Azur", detail: "Modélisation de la technique de l'insecte stérile dans un contexte agricole.", href: "/these", sources: ["thesesFr", "thesisDoi"] },
  { id: "jae-2026", kind: "publication", label: "Article JAE", title: "Journal of Animal Ecology, avec le LEHNA", date: "2026-02", detail: "Une étude comparative sur 45 espèces de poissons d'eau douce, cosignée à parts égales avec Chloé Souques et menée avec des co-auteurs du LEHNA (Université Claude Bernard Lyon 1, Villeurbanne).", href: "/publications/reponse-fonctionnelle-invasivite", sources: ["pubInvasion"] },
  { id: "plos-2026", kind: "publication", label: "PLOS Comp. Biol.", title: "PLOS Computational Biology", date: "2026-04", detail: "Accouplements multiples et biais d'utilisation du sperme : modèle compartimental et modèle individu-centré.", href: "/publications/polyandrie-technique-insecte-sterile", sources: ["pubPolyandry"] },
  { id: "mmee-2026", kind: "communication", label: "MMEE 2026", title: "Poster sur le modèle individu-centré", date: "2026-07", place: "Cork, Irlande", detail: "Ré-accouplement et biais d'utilisation du sperme chez Drosophila suzukii.", href: "https://hal.inrae.fr/hal-05728248", sources: ["hal"] },
];

export const EXPERIENCES: Experience[] = RAW.map((e) => experienceSchema.parse(e));

export const experiencesIn = (lang: Lang) => localizeById(EXPERIENCES, EN_EXPERIENCES, lang);

export const EXPERIENCE_KIND_LABEL: Record<Experience["kind"], Copy<string>> = {
  formation: { fr: "Formation", en: "Education" },
  experience: { fr: "Environnement", en: "Research setting" },
  doctorat: { fr: "Doctorat", en: "PhD" },
  collaboration: { fr: "Collaboration", en: "Collaboration" },
  publication: { fr: "Publication", en: "Publication" },
  communication: { fr: "Communication", en: "Talk or poster" },
  competence: { fr: "Compétence", en: "Competence" },
};
