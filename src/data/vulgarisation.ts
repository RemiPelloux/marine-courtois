/**
 * Outreach modules, from the population to the interpretation of a result.
 * Each one ends on real work (an article, a project, a thesis figure).
 */
export type OutreachModule = {
  id: string;
  title: string;
  lede: string;
  paragraphs: string[];
  visual: "population" | "logistic" | "why" | "euler" | "compartments" | "agents" | "collective" | "interpret";
  next?: { label: string; href: string };
};

export const OUTREACH_MODULES: OutreachModule[] = [
  {
    id: "population",
    title: "Qu'est-ce qu'une population ?",
    lede: "L'ensemble des individus d'une même espèce qui vivent au même endroit et peuvent se reproduire entre eux.",
    paragraphs: [
      "Les mouches d'un verger, les poissons d'un lac : on les compte, on les classe (femelles, mâles, jeunes, adultes), et l'on suit comment ces effectifs changent.",
      "En lutte biologique, la population à suivre est celle du ravageur. La question devient : comment faire baisser son effectif, durablement ?",
    ],
    visual: "population",
  },
  {
    id: "evolution",
    title: "Comment une population évolue-t-elle ?",
    lede: "Des naissances, des décès, et un milieu qui finit par limiter la croissance.",
    paragraphs: [
      "Quand les ressources abondent, chaque individu se reproduit au même rythme : la population croît de plus en plus vite. Puis la place et la nourriture manquent, la croissance ralentit et l'effectif se stabilise.",
      "La courbe logistique résume ce scénario avec deux nombres : le taux de croissance r et la capacité d'accueil K. Faites-les varier.",
    ],
    visual: "logistic",
  },
  {
    id: "pourquoi",
    title: "Pourquoi modéliser le vivant ?",
    lede: "Pour isoler un mécanisme, et tester ce que l'on ne peut pas tester au champ.",
    paragraphs: [
      "On ne peut pas relâcher des millions d'insectes pour essayer chaque stratégie, ni rendre la stérilisation imparfaite à volonté. Un modèle permet de poser la question « et si… ? » sans risque, et de repérer les seuils où tout bascule.",
      "Un modèle n'est pas la réalité : il en garde ce qui est utile pour une question précise, et ses conclusions valent dans les limites de ses hypothèses.",
    ],
    visual: "why",
    next: { label: "Simuler, expérimenter, interpréter", href: "/recherche" },
  },
  {
    id: "simulation",
    title: "Comment fonctionne une simulation ?",
    lede: "L'ordinateur avance pas à pas dans le temps, en appliquant les règles du modèle.",
    paragraphs: [
      "À chaque pas, il calcule combien d'individus naissent et meurent pendant ce court intervalle, puis met l'effectif à jour. Plus le pas est petit, plus la simulation suit fidèlement la solution exacte.",
    ],
    visual: "euler",
  },
  {
    id: "compartimental",
    title: "Qu'est-ce qu'un modèle compartimental ?",
    lede: "On range les individus dans des cases, et l'on décrit les flux entre elles.",
    paragraphs: [
      "Dans le modèle de fertilité résiduelle, trois cases suffisent : les mâles stériles relâchés, les femelles et les mâles sauvages. Chaque flèche est un terme d'une équation différentielle.",
      "Le modèle suit des effectifs moyens : il est rapide à analyser mathématiquement (équilibres, seuils), mais il ne voit pas les individus.",
    ],
    visual: "compartments",
    next: { label: "L'article sur la fertilité résiduelle", href: "/publications/fertilite-residuelle-technique-insecte-sterile" },
  },
  {
    id: "individu-centre",
    title: "Qu'est-ce qu'un modèle individu-centré ?",
    lede: "Chaque individu devient un agent, avec son histoire et ses règles.",
    paragraphs: [
      "Ici, chaque femelle garde en mémoire le sperme des mâles avec lesquels elle s'est accouplée. C'est indispensable pour comparer des règles d'utilisation du sperme qu'un modèle compartimental ne peut pas représenter.",
      "Le démonstrateur ci-dessous est une version réduite au cinquantième du modèle publié : il illustre le fonctionnement, il ne remplace pas les simulations de l'article.",
    ],
    visual: "agents",
    next: { label: "Le modèle individu-centré", href: "/projets/modele-individu-centre" },
  },
  {
    id: "collectif",
    title: "Du comportement individuel à la dynamique collective",
    lede: "Un détail de la vie de chaque femelle peut changer le destin de toute la population.",
    paragraphs: [
      "Que les femelles s'accouplent une ou plusieurs fois semble anecdotique. Pourtant, dans l'article de 2026, les accouplements multiples demandent à long terme davantage de lâchers pour contrôler la population, alors qu'à court terme ils peuvent « défertiliser » des femelles déjà accouplées à des mâles sauvages.",
      "C'est tout l'intérêt des modèles : relier un mécanisme individuel à son effet sur la population, et montrer que cet effet dépend de l'horizon temporel.",
    ],
    visual: "collective",
    next: { label: "Polyandrie : menace ou opportunité ?", href: "/publications/polyandrie-technique-insecte-sterile" },
  },
  {
    id: "interpreter",
    title: "Comment interpréter un résultat ?",
    lede: "Chercher le seuil, lire les conditions, nommer les limites.",
    paragraphs: [
      "Sur ce diagramme de la thèse, chaque branche est un équilibre possible de la population selon l'intensité des lâchers. Au-delà d'une valeur critique, seul l'équilibre nul subsiste : la population peut être éliminée.",
      "Interpréter, c'est dire dans quelles conditions ce seuil existe, ce qui le déplace (la fertilité résiduelle, par exemple), et ce que le modèle ne dit pas.",
    ],
    visual: "interpret",
    next: { label: "La thèse, chapitre par chapitre", href: "/these" },
  },
];
