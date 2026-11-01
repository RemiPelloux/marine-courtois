import { projectSchema, type Project } from "@/types/portfolio";
import type { z } from "zod";
import type { Lang } from "@/i18n/config";
import { localizeById } from "@/i18n/localize";
import { EN_PROJECTS } from "@/data/en/projects";

/**
 * Projects & applications. Results list only what the project has actually
 * shown (published results quote the article). Draft entries are templates
 * kept out of the site until Marine documents them — see docs/CONTENT_GUIDE.md.
 */
const RAW: z.input<typeof projectSchema>[] = [
  {
    id: "modele-individu-centre",
    slug: "modele-individu-centre",
    title: "Modèle individu-centré de Drosophila suzukii",
    tagline: "Chaque femelle, chaque accouplement, chaque spermathèque : simuler les biais d'utilisation du sperme face aux lâchers de mâles stériles.",
    kind: "modele",
    status: "publie",
    visibility: "public",
    featured: true,
    context:
      "La technique de l'insecte stérile repose sur des lâchers massifs de mâles stérilisés. Chez de nombreuses espèces, dont Drosophila suzukii, les femelles s'accouplent plusieurs fois, et les mécanismes qui gouvernent l'utilisation du sperme stocké restent mal connus.",
    objective:
      "Suivre chaque insecte un par un (sa durée de vie, ses accouplements, le sperme qu'il stocke, sa ponte) pour voir comment ces comportements individuels décident, à l'échelle de la population, du succès des lâchers de mâles stériles.",
    value:
      "Un modèle en équations décrit des effectifs moyens : il ne sait pas ce que contient la spermathèque de chaque femelle. Le modèle individu-centré le sait. Il compare cinq règles d'utilisation du sperme (premier mâle, dernier mâle, mélange, choix, préférence) là où le modèle compartimental en distingue deux, et il intègre le hasard : chaque scénario est répété 100 fois.",
    question:
      "Selon que la femelle utilise de préférence le premier ou le dernier sperme reçu, le sperme fertile ou stérile, ou un mélange, l'efficacité des lâchers change-t-elle ?",
    methods: [
      "Modèle individu-centré écrit en Python avec Mesa : agents, ordonnanceur, collecte des données",
      "Calibration sur Drosophila suzukii (durées de vie, périodes réfractaires, ponte, capacité)",
      "Scénarios d'utilisation du sperme : premier ou dernier mâle, fertile ou stérile, usage mixte",
      "Exécution par lots sur un cluster de calcul, 100 répétitions par scénario",
      "Comparaison des dynamiques larvaires avec le modèle compartimental du même article (annexe)",
    ],
    toolIds: ["python", "mesa", "numpy", "pandas", "seaborn", "matplotlib", "jupyter"],
    codeFileIds: ["abm-script", "abm-notebook", "ch4-abm-output", "ch4-appendix-1"],
    results: [
      "À long terme, les accouplements multiples sont défavorables : ils demandent davantage de lâchers de mâles stériles pour contrôler la population.",
      "À court terme, ils peuvent être bénéfiques en « défertilisant » des femelles déjà accouplées à des mâles sauvages.",
      "L'influence des biais d'utilisation du sperme reste limitée selon l'effort de lâcher qui peut être déployé.",
    ],
    limits: [
      "Le modèle est calibré sur une seule espèce, Drosophila suzukii.",
      "Les mécanismes d'utilisation du sperme sont encore mal connus : les scénarios encadrent les possibles plutôt qu'ils ne tranchent.",
      "Le démonstrateur de ce site est réduit au cinquantième et illustre le fonctionnement du modèle ; il ne remplace pas les simulations publiées.",
    ],
    nextSteps: ["Une application interactive pour explorer les scénarios du modèle est en développement (information fournie par Marine Courtois)."],
    links: [
      { label: "Code — sit_remating_abm", url: "https://gitlab.com/marinecourtois/sit_remating_abm" },
      { label: "Article — PLOS Computational Biology", url: "https://doi.org/10.1371/journal.pcbi.1014212" },
      { label: "Poster MMEE 2026 (HAL)", url: "https://hal.inrae.fr/hal-05728248" },
    ],
    internalDemo: "abm",
    mediaIds: ["fig-ch4-abm"],
    publicationIds: ["pub-2026-polyandry"],
    axisIds: ["biocontrole"],
    sources: ["pubPolyandry", "gitAbm", "owner"],
  },
  {
    id: "modele-equations-differentielles",
    slug: "modele-equations-differentielles",
    title: "Modèles en équations différentielles de la TIS",
    tagline: "Des effectifs moyens, des équations, des seuils : à partir de quels lâchers une population de ravageurs est-elle éliminée, et non seulement réduite ?",
    kind: "modele",
    status: "publie",
    visibility: "public",
    featured: true,
    context:
      "La plupart des modèles de la technique de l'insecte stérile décrivent la population par des effectifs moyens (mâles stériles, femelles, mâles sauvages, larves) dont l'évolution suit des équations différentielles ordinaires. Ce cadre se prête à l'analyse mathématique : équilibres, stabilité, seuils.",
    objective:
      "Écrire les mécanismes biologiques (compétition entre mâles sauvages et stériles, fertilité résiduelle, ré-accouplement des femelles) sous forme d'équations, puis déterminer pour quelles intensités de lâchers la population est éliminée ou seulement réduite.",
    value:
      "Les équations donnent des résultats généraux plutôt qu'une suite de simulations au cas par cas : l'existence d'un seuil d'élimination, les conditions dans lesquelles une fertilité résiduelle fait passer de la suppression à une simple réduction, la stabilité des équilibres selon la règle d'utilisation du sperme. Elles servent aussi de référence au modèle individu-centré, comparé à elles en annexe de l'article de 2026.",
    question:
      "Pour quelles intensités de lâchers de mâles stériles une population de ravageurs est-elle éliminée, et comment la fertilité résiduelle et le ré-accouplement des femelles modifient-ils cette issue ?",
    methods: [
      "Fertilité résiduelle : trois équations différentielles (mâles stériles, femelles, mâles sauvages)",
      "Ré-accouplement : modèle compartimental à cinq variables (larves, mâles, femelles fertiles et infertiles, mâles stériles)",
      "Calcul symbolique des équilibres (SymPy), intégration numérique (SciPy : odeint, solve_ivp)",
      "Diagrammes de bifurcation et portraits de phase (python-control)",
      "Analyse de sensibilité des paramètres (statsmodels)",
      "Lâchers impulsionnels sous budget limité : solution périodique analytique",
    ],
    toolIds: ["python", "scipy", "sympy", "python-control", "numpy", "matplotlib", "statsmodels", "jupyter"],
    codeFileIds: ["ch2-figures", "ch3-rf", "ch3-sensitivity", "ch4-compartmental", "abm-compartmental", "ch5-impulsive"],
    results: [
      "Les modèles distinguent les conditions favorables à la suppression de la population de celles où les lâchers conduisent essentiellement à une réduction de son abondance (Bulletin of Mathematical Biology, 2025).",
      "Avec le ré-accouplement, les effets diffèrent selon l'horizon temporel : une règle d'utilisation du sperme peut accélérer la baisse initiale de la population sans garantir son élimination à long terme (PLOS Computational Biology, 2026).",
      "Sous budget limité, les lâchers impulsionnels font apparaître un compromis entre fréquence et amplitude des lâchers (thèse, chapitre 5).",
    ],
    limits: [
      "Un modèle en équations décrit des effectifs moyens : il ne représente ni la variabilité entre individus ni le hasard des rencontres, que le modèle individu-centré prend en charge.",
      "Le modèle de fertilité résiduelle ne distingue pas de stade larvaire ; le modèle de ré-accouplement en ajoute un.",
      "Les notebooks reproduisent les figures publiées ; ils ne constituent pas une bibliothèque logicielle réutilisable telle quelle.",
    ],
    nextSteps: [],
    links: [
      { label: "Code — thesisData", url: "https://gitlab.com/marinecourtois/thesisData" },
      { label: "Article — Bulletin of Mathematical Biology", url: "https://doi.org/10.1007/s11538-024-01401-1" },
      { label: "Version ouverte HAL", url: "https://hal.inrae.fr/hal-04403761v2" },
      { label: "Article — PLOS Computational Biology", url: "https://doi.org/10.1371/journal.pcbi.1014212" },
      { label: "Explorateur interactif — laboratoire", url: "/laboratoire#model-explorer" },
    ],
    internalDemo: "explorer",
    mediaIds: ["fig-ch2-bifurcation", "fig-ch3-dynamics", "fig-ch4-first-last", "fig-ch5-impulsive"],
    publicationIds: ["pub-2025-residual-fertility", "pub-2026-polyandry", "these-2025"],
    axisIds: ["biocontrole"],
    sources: ["pubRF", "halRF", "pubPolyandry", "gitThesis", "gitAbm"],
  },
  {
    id: "reponses-fonctionnelles",
    slug: "reponses-fonctionnelles",
    title: "Réponses fonctionnelles des poissons d'eau douce",
    tagline: "269 réponses fonctionnelles, 45 espèces : ce que la consommation de proies dit, et ne dit pas, du caractère invasif.",
    kind: "analyse",
    status: "publie",
    visibility: "public",
    featured: true,
    context:
      "La réponse fonctionnelle relie la consommation d'un prédateur à la densité de ses proies. Elle est souvent mesurée pour comparer espèces invasives et non invasives, en supposant qu'une mesure faite dans l'aire native vaut partout.",
    objective:
      "Vérifier si une mesure courante de la voracité d'un prédateur, la réponse fonctionnelle, distingue vraiment les poissons invasifs des autres, en tenant compte de l'endroit où chaque espèce a été étudiée.",
    value:
      "L'aire d'étude change la comparaison : une mesure faite dans l'aire native d'une espèce ne vaut pas forcément dans son aire d'introduction. Ce résultat repose sur 269 réponses fonctionnelles de 45 espèces, analysées en tenant compte de leur parenté.",
    question: "Les paramètres de réponse fonctionnelle diffèrent-ils entre une espèce invasive étudiée dans son aire native et la même espèce étudiée dans son aire d'introduction ?",
    methods: [
      "Extraction des poissons d'eau douce de la base FoRAGE",
      "Analyse comparative avec correction phylogénétique (MCMCglmm, R)",
      "Taux d'attaque a, temps de manipulation h et rapport a/h, en interaction avec la température",
    ],
    toolIds: ["r"],
    results: [
      "Les espèces invasives présentent une réponse fonctionnelle plus élevée que les non invasives, mais seulement lorsqu'elles sont étudiées dans leur aire native.",
      "Étudiées dans leur aire d'introduction, elles ont des taux d'attaque et des temps de manipulation comparables aux non invasives.",
      "Le taux d'attaque diminue avec la température chez les non invasives et tend à augmenter chez les invasives de l'aire d'introduction.",
    ],
    limits: [
      "Les données proviennent d'expériences publiées, aux protocoles hétérogènes.",
      "Les graphiques de ce site montrent les données brutes ; les conclusions de l'article reposent sur des modèles corrigés de la phylogénie.",
    ],
    nextSteps: [],
    links: [
      { label: "Article — Journal of Animal Ecology", url: "https://doi.org/10.1111/1365-2656.70232" },
      { label: "Données et scripts R — Zenodo", url: "https://doi.org/10.5281/zenodo.18377688" },
      { label: "Préprint bioRxiv", url: "https://doi.org/10.1101/2025.07.26.666957" },
    ],
    internalDemo: "fish",
    mediaIds: ["jae-graphical-abstract"],
    publicationIds: ["pub-2026-functional-response"],
    axisIds: ["invasions"],
    sources: ["pubInvasion", "zenodoInvasion"],
  },
  {
    id: "reproductibilite-these",
    slug: "reproductibilite-these",
    title: "Les figures de la thèse, reproductibles",
    tagline: "Onze notebooks Jupyter rangés par chapitre : chaque figure du manuscrit se reconstruit depuis son code.",
    kind: "outil",
    status: "publie",
    visibility: "public",
    context: "Un manuscrit de thèse rassemble des dizaines de figures issues de modèles différents. Le dépôt thesisData les rend vérifiables et réutilisables.",
    objective: "Permettre à toute personne qui lit la thèse de refaire chaque figure à partir du code, chapitre par chapitre.",
    value: "Les figures deviennent vérifiables : on peut contrôler les paramètres utilisés, relancer les calculs et comparer le résultat à la figure du manuscrit.",
    question: "Comment permettre à un lecteur de refaire chaque figure, du modèle au graphique ?",
    methods: ["Notebooks par chapitre", "Intégration numérique d'EDO, calcul symbolique des équilibres", "Analyse de sensibilité", "Manuscrit et diapositives versionnés"],
    toolIds: ["python", "jupyter", "numpy", "scipy", "sympy", "matplotlib", "python-control", "gitlab"],
    results: ["Les figures des chapitres 1 à 5 sont reproduites par des notebooks publics, avec les versions des bibliothèques indiquées."],
    limits: ["Les notebooks reproduisent les figures ; ils ne constituent pas une bibliothèque logicielle réutilisable telle quelle."],
    nextSteps: [],
    links: [{ label: "Dépôt thesisData", url: "https://gitlab.com/marinecourtois/thesisData" }],
    mediaIds: ["fig-ch2-bifurcation", "fig-ch3-sensitivity", "fig-ch5-impulsive"],
    publicationIds: ["these-2025"],
    axisIds: ["biocontrole"],
    sources: ["gitThesis"],
  },
  {
    id: "explorateur-de-modeles",
    slug: "explorateur-de-modeles",
    title: "L'explorateur de modèles",
    tagline: "Trois modèles publiés, recalculés dans le navigateur : observer, faire varier, comprendre.",
    kind: "visualisation",
    status: "demo",
    visibility: "public",
    context: "Les modèles de la thèse sont publiés sous forme de notebooks. Ce site les porte en TypeScript pour qu'on puisse les manipuler sans installer Python.",
    objective: "Rendre manipulables dans un navigateur trois modèles de la thèse : changer un paramètre et voir la dynamique de la population se recalculer.",
    value: "Un modèle publié devient lisible pour qui ne lit pas les équations : on observe directement l'effet de la fertilité résiduelle ou de la règle d'utilisation du sperme, et chaque panneau renvoie au notebook et à l'article d'origine.",
    question: "Peut-on rendre un modèle de dynamique des populations manipulable par un non-spécialiste, sans le simplifier au point de le trahir ?",
    methods: ["Intégrateur Runge-Kutta d'ordre 4 porté depuis les notebooks", "Paramètres repris des notebooks", "Tests automatiques comparant les courbes aux figures publiées"],
    toolIds: ["python", "scipy"],
    codeFileIds: ["ch3-rf", "ch4-compartmental", "ch2-figures"],
    results: ["Les courbes recalculées reproduisent celles des notebooks pour les paramètres publiés (vérifié par les tests du site)."],
    limits: ["Seuls trois modèles sont portés ; le modèle individu-centré n'est présent que sous forme réduite."],
    nextSteps: [],
    links: [{ label: "Ouvrir l'explorateur", url: "/laboratoire#model-explorer" }],
    internalDemo: "explorer",
    publicationIds: ["pub-2025-residual-fertility", "pub-2026-polyandry"],
    axisIds: ["biocontrole"],
    sources: ["gitThesis", "gitAbm"],
  },
  {
    id: "deep-learning",
    slug: "deep-learning",
    title: "Expérimentations en deep learning",
    tagline: "À documenter : architectures, données, expériences et ce qu'elles ont appris.",
    kind: "deep-learning",
    status: "exploration",
    visibility: "draft",
    context: "",
    question: "",
    methods: [],
    toolIds: ["pytorch", "tensorflow"],
    results: [],
    limits: [],
    nextSteps: [],
    links: [],
    sources: ["owner"],
  },
  {
    id: "application-shiny",
    slug: "application-shiny",
    title: "Application Shiny",
    tagline: "À documenter : objectif, données, captures et lien de démonstration.",
    kind: "application",
    status: "prototype",
    visibility: "draft",
    context: "",
    question: "",
    methods: [],
    toolIds: ["r-shiny"],
    results: [],
    limits: [],
    nextSteps: [],
    links: [],
    sources: ["owner"],
  },
];

export const PROJECTS: Project[] = RAW.map((p) => projectSchema.parse(p));
export const PUBLIC_PROJECTS = PROJECTS.filter((p) => p.visibility === "public");
export const getProject = (slug: string) => PUBLIC_PROJECTS.find((p) => p.slug === slug || p.id === slug);

/** Public projects in a language. */
export const projectsIn = (lang: Lang) => localizeById(PUBLIC_PROJECTS, EN_PROJECTS, lang);
export const getProjectIn = (lang: Lang, slug: string) => projectsIn(lang).find((p) => p.slug === slug || p.id === slug);
