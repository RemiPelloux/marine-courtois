import { researchAxisSchema, type ResearchAxis } from "@/types/portfolio";
import type { z } from "zod";
import type { Lang } from "@/i18n/config";
import { localizeById } from "@/i18n/localize";
import { EN_RESEARCH_AXES } from "@/data/en/research-axes";

/**
 * Three research axes, one scientific domain each.
 * A — the thesis (sterile insect technique). Every HAL communication belongs here.
 * B — the comparative statistical study of functional responses (JAE 2026).
 *     Co-author affiliations read on Crossref (10.1111/1365-2656.70232, 2026-11-01).
 * C — ongoing work declared by Marine Courtois (source `owner`): no result, no publication.
 * The detail pages listed in themeSlugs document parts of A or B; they are not sub-axes.
 */
const RAW: z.input<typeof researchAxisSchema>[] = [
  {
    id: "biocontrole",
    letter: "A",
    slug: "biocontrole",
    title: "Dynamique des populations et biocontrôle",
    lede: "Le travail de thèse. Dans quelles conditions des lâchers de mâles stériles réduisent-ils une population de ravageurs, quand la stérilisation est imparfaite (fertilité résiduelle), quand les femelles s'accouplent plusieurs fois (polyandrie) ou quand les lâchers sont ponctuels et limités par un budget\u00a0?",
    status: "publie",
    methods: ["Équations différentielles", "Analyse de bifurcation", "Modèles impulsionnels", "Modèles individu-centrés"],
    themeSlugs: ["technique-insecte-sterile", "fertilite-residuelle", "accouplements-multiples", "modelisation-individu-centree", "strategies-de-lachers"],
    publicationIds: ["pub-2025-residual-fertility", "pub-2026-polyandry", "these-2025"],
    communicationIds: [
      "hal-05728248",
      "hal-05108421",
      "hal-05108413",
      "hal-04808600",
      "hal-04808537",
      "hal-04788971",
      "hal-04664229",
      "hal-04452111",
      "hal-04144121",
      "hal-04144059",
      "hal-04049975",
      "hal-03928222",
    ],
    projectIds: ["modele-equations-differentielles", "modele-individu-centre", "explorateur-de-modeles", "reproductibilite-these"],
    toolIds: ["python", "scipy", "sympy", "python-control", "mesa", "numpy", "pandas", "statsmodels", "seaborn"],
    sources: ["thesesFr", "gitThesis", "pubRF", "pubPolyandry", "gitAbm", "hal"],
  },
  {
    id: "invasions",
    letter: "B",
    slug: "invasions-biologiques",
    title: "Étude du caractère invasif d'une espèce et de sa réponse fonctionnelle",
    lede: "Les espèces invasives consomment-elles davantage de proies que les autres, et cette mesure permet-elle de prévoir leur impact\u00a0? Une analyse statistique de réponses fonctionnelles déjà publiées chez 45 espèces de poissons d'eau douce, menée avec Chloé Souques, Yann Voituron, Loïc Teulier, François-Xavier Dechaume-Moncharmont (LEHNA, Université Claude Bernard Lyon 1) et Vincent Médoc (ENES, Saint-Étienne).",
    status: "publie",
    methods: ["Analyse comparative de données publiées", "Modèles mixtes bayésiens (MCMCglmm)", "Correction phylogénétique"],
    themeSlugs: ["ecologie-des-invasions"],
    publicationIds: ["pub-2026-functional-response"],
    communicationIds: [],
    projectIds: ["reponses-fonctionnelles"],
    toolIds: ["r"],
    sources: ["pubInvasion", "zenodoInvasion", "preprintInvasion"],
  },
  {
    id: "multiomique",
    letter: "C",
    slug: "multiomique",
    title: "Intégration de données multiomiques pour étudier les réponses des plantes aux stress multiples",
    lede: "Un travail en cours. Comment la tomate répond-elle à un stress combinant chaleur et salinité\u00a0? Des données transcriptomiques et métabolomiques sont intégrées à l'aide de modèles d'apprentissage profond, dont un autoencodeur variationnel (VAE), développés avec PyTorch. Aucun résultat n'est publié à ce stade.",
    status: "en-cours",
    methods: ["Apprentissage profond", "Autoencodeur variationnel (VAE)", "Transcriptomique", "Métabolomique"],
    themeSlugs: [],
    publicationIds: [],
    communicationIds: [],
    projectIds: [],
    toolIds: ["pytorch", "python"],
    sources: ["owner"],
  },
];

export const RESEARCH_AXES: ResearchAxis[] = RAW.map((a) => researchAxisSchema.parse(a));
export const getResearchAxis = (idOrSlug: string) => RESEARCH_AXES.find((a) => a.id === idOrSlug || a.slug === idOrSlug);

/** Axes in a language (same ids and relations; text translated). */
export const researchAxesIn = (lang: Lang) => localizeById(RESEARCH_AXES, EN_RESEARCH_AXES, lang);
export const getResearchAxisIn = (lang: Lang, idOrSlug: string) => researchAxesIn(lang).find((a) => a.id === idOrSlug || a.slug === idOrSlug);

/** The axis a detail page belongs to. */
export const axisOfTheme = (slug: string) => RESEARCH_AXES.find((a) => a.themeSlugs.includes(slug));
