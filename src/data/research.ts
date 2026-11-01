import { researchThemeSchema, type ResearchTheme } from "@/types/content";
import type { z } from "zod";
import type { Lang } from "@/i18n/config";
import { localizeBy } from "@/i18n/localize";
import { EN_RESEARCH_THEMES } from "@/data/en/research";

/**
 * Detail pages of the research axes (/recherche/[slug]). Five document parts of
 * the thesis (axis A), one the functional-response study (axis B); they are not
 * axes themselves. `lede` paragraphs are the validated editorial copy; other
 * fields are editorial explanations bounded by the cited sources.
 */
const RAW: z.input<typeof researchThemeSchema>[] = [
  {
    slug: "technique-insecte-sterile",
    index: "01",
    title: "Technique de l'insecte stérile",
    short: "Lâcher des mâles stérilisés pour perturber la reproduction d'un ravageur.",
    lede: "La technique de l'insecte stérile repose sur le lâcher d'individus stérilisés afin de réduire la reproduction d'une population cible. Son efficacité dépend de nombreux facteurs biologiques et techniques, dont les effets peuvent être explorés à l'aide de modèles.",
    question:
      "Dans quelles conditions des lâchers de mâles stériles permettent-ils de réduire, voire d'éliminer, une population de ravageurs agricoles\u00a0?",
    mechanism:
      "Les mâles stériles entrent en compétition avec les mâles sauvages pour l'accouplement. Une femelle accouplée à un mâle stérile ne produit pas de descendance viable\u00a0: plus la proportion de mâles stériles est élevée, plus la reproduction de la population diminue.",
    approach:
      "Modèles discrets et continus de dynamique des populations, analyse des équilibres et des bifurcations, simulations numériques des scénarios de lâchers.",
    keyConcept: {
      term: "Seuil d'élimination",
      definition:
        "Dans de nombreux modèles de TIS, il existe une intensité de lâchers au-delà de laquelle seule l'extinction de la population reste un équilibre. En deçà, la population peut se maintenir à un niveau réduit.",
    },
    methods: ["Dynamique des populations", "Systèmes dynamiques", "Analyse de bifurcation", "Python"],
    publicationIds: ["these-2025", "pub-2025-residual-fertility", "pub-2026-polyandry"],
    thesisChapter: 2,
    codeFileIds: ["ch2-figures", "ch1-articles"],
    figureId: "fig-ch2-bifurcation",
    explorerTab: "dynamique",
    sources: ["gitThesis", "thesesFr", "inriaReport"],
  },
  {
    slug: "fertilite-residuelle",
    index: "02",
    title: "Fertilité résiduelle",
    short: "Quand la stérilisation est imparfaite.",
    lede: "La stérilisation peut être imparfaite. Une fertilité résiduelle chez les insectes relâchés est susceptible de modifier les résultats des stratégies de contrôle. Mes travaux examinent les conditions dans lesquelles ces effets peuvent devenir déterminants.",
    question:
      "Une faible fertilité résiduelle des mâles relâchés compromet-elle la possibilité d'éliminer la population, ou seulement le niveau de réduction atteint\u00a0?",
    mechanism:
      "Le modèle distingue deux formes de fertilité résiduelle\u00a0: une fraction δ de mâles relâchés restant pleinement fertiles, et une fraction ε d'accouplements avec des mâles stériles qui restent fertiles.",
    approach:
      "Un système de trois équations différentielles (mâles stériles, femelles, mâles sauvages), une analyse des équilibres, des simulations temporelles et une analyse de sensibilité.",
    keyConcept: {
      term: "Suppression ou réduction",
      definition:
        "L'étude distingue les conditions favorables à la suppression de la population de celles où la stratégie conduit essentiellement à une réduction de son abondance.",
    },
    methods: ["Équations différentielles", "Analyse d'équilibres", "Analyse de sensibilité", "SciPy", "SymPy"],
    publicationIds: ["pub-2025-residual-fertility", "these-2025"],
    thesisChapter: 3,
    codeFileIds: ["ch3-rf", "ch3-sensitivity"],
    figureId: "fig-ch3-dynamics",
    explorerTab: "fertilite",
    sources: ["pubRF", "halRF", "gitThesis"],
  },
  {
    slug: "accouplements-multiples",
    index: "03",
    title: "Accouplements multiples",
    short: "Polyandrie, ré-accouplement et utilisation du sperme.",
    lede: "Chez certaines espèces, les femelles peuvent s'accoupler plusieurs fois. Le ré-accouplement et les mécanismes d'utilisation du sperme peuvent alors influencer l'efficacité des lâchers d'insectes stériles.",
    question:
      "Le ré-accouplement des femelles de Drosophila suzukii est-il une menace ou une opportunité pour la technique de l'insecte stérile\u00a0?",
    mechanism:
      "Une femelle accouplée peut se ré-accoupler. Selon la règle d'utilisation du sperme — celui du premier mâle, du dernier, un mélange ou un choix — un accouplement stérile ultérieur peut annuler ou non un accouplement fertile antérieur.",
    approach:
      "Un modèle compartimental à cinq variables (larves, mâles, femelles fertiles et infertiles, mâles stériles) et un modèle individu-centré paramétré à partir de la littérature sur D. suzukii.",
    keyConcept: {
      term: "Horizon temporel",
      definition:
        "Les effets du ré-accouplement diffèrent selon l'horizon considéré\u00a0: une règle peut accélérer la baisse initiale de la population sans garantir l'élimination à long terme.",
    },
    methods: ["Modèle compartimental", "Modèle individu-centré", "Mesa", "Simulations répétées"],
    publicationIds: ["pub-2026-polyandry", "these-2025"],
    thesisChapter: 4,
    codeFileIds: ["ch4-compartmental", "ch4-abm-output", "abm-script"],
    figureId: "fig-ch4-first-last",
    explorerTab: "accouplements",
    sources: ["pubPolyandry", "gitAbm", "gitThesis"],
  },
  {
    slug: "modelisation-individu-centree",
    index: "04",
    title: "Modélisation individu-centrée",
    short: "Représenter chaque insecte, ses comportements et ses interactions.",
    lede: "Les modèles individu-centrés représentent chaque organisme, son âge, ses accouplements et sa ponte. Ils permettent d'intégrer une variabilité individuelle et des règles comportementales difficiles à exprimer dans un modèle agrégé.",
    question:
      "Comment des règles comportementales à l'échelle de l'individu — durée de vie, période réfractaire, utilisation du sperme — se traduisent-elles à l'échelle de la population\u00a0?",
    mechanism:
      "Chaque agent (mâle stérile, mâle sauvage, larve, femelle) suit son propre cycle de vie. Les femelles stockent le nombre d'accouplements fertiles et stériles et pondent selon la règle d'utilisation du sperme simulée.",
    approach:
      "Un modèle écrit en Python avec la bibliothèque Mesa, exécuté par lots sur un cluster de calcul, avec 100 répétitions par jeu de paramètres, puis comparé au modèle compartimental.",
    keyConcept: {
      term: "Stochasticité démographique",
      definition:
        "Les répétitions d'un même scénario produisent des trajectoires différentes\u00a0: on analyse donc des distributions de résultats plutôt qu'une trajectoire unique.",
    },
    methods: ["Mesa", "Python", "Calcul par lots", "Comparaison de modèles"],
    publicationIds: ["pub-2026-polyandry"],
    thesisChapter: 4,
    codeFileIds: ["abm-script", "abm-release", "abm-notebook", "ch4-appendix-1"],
    figureId: "fig-ch4-abm",
    sources: ["gitAbm", "pubPolyandry"],
  },
  {
    slug: "strategies-de-lachers",
    index: "05",
    title: "Stratégies de lâchers et contraintes de déploiement",
    short: "Fréquence, amplitude et budget limité.",
    lede: "En pratique, les mâles stériles sont relâchés de manière discrète, avec un budget limité. Le chapitre consacré au contexte agricole étudie comment répartir ce budget entre fréquence et intensité des lâchers.",
    question:
      "Avec un nombre total de mâles stériles fixé, vaut-il mieux des lâchers fréquents et modestes, ou rares et massifs\u00a0?",
    mechanism:
      "Entre deux lâchers, la population de mâles stériles décroît exponentiellement. Des lâchers périodiques font converger cette population vers une solution périodique dont l'amplitude dépend de la période et de la quantité relâchée.",
    approach:
      "Des modèles impulsionnels, une solution périodique analytique, et des simulations numériques sous contrainte de budget.",
    keyConcept: {
      term: "Compromis fréquence–amplitude",
      definition:
        "La thèse met en évidence un compromis entre fréquence et amplitude des lâchers, ainsi qu'un « coût caché » des piqûres de ponte stériles qui dégradent la qualité des fruits, moins fortement que les piqûres fertiles.",
    },
    methods: ["Modèles impulsionnels", "Solution périodique", "SciPy solve_ivp", "Optimisation sous contrainte"],
    publicationIds: ["these-2025"],
    thesisChapter: 5,
    codeFileIds: ["ch5-impulsive", "ch5-oviposition"],
    figureId: "fig-ch5-impulsive",
    sources: ["gitThesis", "thesesFr"],
  },
  {
    slug: "ecologie-des-invasions",
    index: "06",
    title: "Écologie des invasions",
    short: "Réponses fonctionnelles, invasivité et impact trophique.",
    lede: "L'étude des réponses fonctionnelles contribue à comprendre les relations entre la consommation de ressources, les caractéristiques des espèces et leur capacité à devenir invasives. Le contexte géographique et écologique peut influencer l'interprétation de ces relations.",
    question:
      "La réponse fonctionnelle d'une espèce permet-elle de prédire son caractère invasif et l'impact qu'elle exerce sur les réseaux trophiques\u00a0?",
    mechanism:
      "La réponse fonctionnelle décrit comment la consommation d'un prédateur varie avec l'abondance de ses proies. Elle est souvent proposée comme indicateur de l'impact potentiel d'une espèce introduite.",
    approach:
      "Une analyse statistique comparative de 269 estimations de réponses fonctionnelles déjà publiées (45 espèces de poissons d'eau douce, base FoRAGE). Des modèles mixtes bayésiens (MCMCglmm, sous R) tiennent compte de la parenté entre espèces et de la température des expériences d'origine. L'étude ne repose sur aucune nouvelle expérience.",
    keyConcept: {
      term: "Contexte biogéographique",
      definition:
        "Les résultats soulignent l'importance du contexte biogéographique dans l'interprétation des réponses fonctionnelles comme indicateurs d'invasivité et d'impact.",
    },
    methods: ["Analyse statistique comparative", "Modèles mixtes bayésiens (MCMCglmm)", "R", "Données ouvertes (Zenodo)"],
    publicationIds: ["pub-2026-functional-response"],
    codeFileIds: [],
    sources: ["pubInvasion", "zenodoInvasion"],
  },
];

export const RESEARCH_THEMES: ResearchTheme[] = RAW.map((r) => researchThemeSchema.parse(r));
export const getResearchTheme = (slug: string) => RESEARCH_THEMES.find((r) => r.slug === slug);

/** Detail pages in a language (same slugs and relations; text translated). */
export const researchThemesIn = (lang: Lang) =>
  localizeBy(RESEARCH_THEMES, (t) => t.slug, EN_RESEARCH_THEMES, lang);
export const getResearchThemeIn = (lang: Lang, slug: string) => researchThemesIn(lang).find((r) => r.slug === slug);
