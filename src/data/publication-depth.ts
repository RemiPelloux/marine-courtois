/**
 * Three reading depths for the featured articles. "Approfondir" quotes the
 * published abstracts (Crossref, HAL hal-04403761) without going beyond them;
 * "Découvrir" and "Comprendre" rephrase them for a general audience.
 */
export type Depth = {
  discover: { question: string; text: string };
  understand: { question: string; paragraphs: string[] };
  deepen: { model: string; hypotheses: string[]; results: string[]; limits: string[] };
  /** interactive module shown with the article */
  module: "rf" | "abm" | "fish";
};

export const PUBLICATION_DEPTH: Record<string, Depth> = {
  "pub-2025-residual-fertility": {
    discover: {
      question: "Pourquoi relâcher des insectes stériles peut-il protéger une culture ?",
      text: "On élève en masse l'insecte ravageur, on stérilise les mâles et on les relâche. Une femelle qui s'accouple avec un mâle stérile n'a pas de descendance : plus il y a de mâles stériles, moins la population se renouvelle, et elle peut décliner.",
    },
    understand: {
      question: "Et si une partie des mâles restait fertile ?",
      paragraphs: [
        "La stérilisation se fait par irradiation, et elle n'est pas parfaite : une proportion de mâles y échappe. C'est la fertilité résiduelle. Ces mâles, relâchés avec les autres, engendrent une descendance.",
        "L'irradiation peut aussi affaiblir les mâles (un coût en valeur sélective). L'article compare ces situations à celle d'une stérilisation sans défaut.",
      ],
    },
    deepen: {
      model: "Trois équations différentielles génériques décrivent les mâles stérilisés, les mâles sauvages et les femelles sauvages. Équilibres et stabilité sont calculés analytiquement ; les analyses de bifurcation utilisent des paramètres calibrés sur la mouche méditerranéenne des fruits, Ceratitis capitata.",
      hypotheses: [
        "Une proportion des mâles irradiés échappe à la stérilisation (fertilité résiduelle).",
        "Cette fertilité résiduelle est étudiée avec ou sans coût en valeur sélective associé à la stérilisation.",
        "Référence : une stérilisation des mâles sans défaut.",
      ],
      results: [
        "Sous un seuil de fertilité résiduelle, inonder le paysage de mâles stérilisés peut conduire la population sauvage à l'extinction.",
        "Ce seuil est plus élevé lorsque la fertilité résiduelle s'accompagne de coûts en valeur sélective.",
        "Une fertilité résiduelle trop forte rend la TIS moins efficace et empêche l'éradication.",
        "Des baisses importantes du niveau des pullulations restent possibles pour des taux de fertilité résiduelle bien plus élevés.",
      ],
      limits: [
        "Les seuils sont obtenus avec des paramètres calibrés sur Ceratitis capitata : ils dépendent de l'espèce.",
        "Il s'agit de résultats de modèle, et non d'essais de terrain.",
      ],
    },
    module: "rf",
  },
  "pub-2026-polyandry": {
    discover: {
      question: "Une femelle qui s'accouple plusieurs fois peut-elle déjouer la lutte biologique ?",
      text: "Chez beaucoup d'insectes, les femelles s'accouplent avec plusieurs mâles et stockent leur sperme. Une femelle accouplée à un mâle stérile peut donc encore se reproduire grâce à un mâle sauvage, et l'inverse est aussi vrai.",
    },
    understand: {
      question: "Tout dépend de la façon dont le sperme est utilisé.",
      paragraphs: [
        "Après plusieurs accouplements, quel sperme féconde les œufs ? Le premier reçu, le dernier, plutôt le fertile, plutôt le stérile, ou un mélange ? Ces mécanismes sont encore mal connus.",
        "Un modèle compartimental suit des effectifs moyens : il mesure l'effet global des accouplements multiples. Un modèle individu-centré suit chaque femelle et le contenu de sa spermathèque : il permet de comparer les règles d'utilisation du sperme.",
      ],
    },
    deepen: {
      model: "Un modèle compartimental en équations différentielles pour l'impact global des accouplements multiples, et un modèle individu-centré calibré sur Drosophila suzukii pour les biais d'utilisation du sperme : premier contre dernier sperme, fertile contre stérile, usage mixte.",
      hypotheses: [
        "Les femelles peuvent s'accoupler plusieurs fois et stocker le sperme de plusieurs mâles.",
        "Plusieurs règles d'utilisation du sperme sont explorées comme scénarios, faute de mécanisme établi.",
        "Paramètres biologiques du modèle individu-centré calibrés sur Drosophila suzukii.",
      ],
      results: [
        "À long terme, les accouplements multiples sont défavorables : ils demandent davantage de lâchers de mâles stérilisés pour contrôler la population.",
        "À court terme, ils peuvent être bénéfiques en « défertilisant » des femelles déjà accouplées à des mâles sauvages.",
        "L'influence de la manière dont le sperme est utilisé reste limitée selon l'effort de lâcher qui peut être déployé.",
      ],
      limits: [
        "Les mécanismes d'utilisation du sperme restent mal connus : les scénarios encadrent les possibles.",
        "Le modèle individu-centré est calibré sur une seule espèce.",
      ],
    },
    module: "abm",
  },
  "pub-2026-functional-response": {
    discover: {
      question: "Pourquoi certaines espèces de poissons deviennent-elles envahissantes ?",
      text: "Une hypothèse répandue : les espèces invasives seraient de meilleurs prédateurs, capables de consommer davantage de proies. On le mesure par la réponse fonctionnelle, la relation entre la densité de proies et ce qu'un prédateur consomme.",
    },
    understand: {
      question: "Deux paramètres, et une question de lieu.",
      paragraphs: [
        "Le taux d'attaque a mesure l'efficacité de recherche quand les proies sont rares. Le temps de manipulation h est le temps de capturer, manipuler et digérer une proie : il plafonne la consommation.",
        "Une espèce invasive peut être étudiée dans son aire native ou dans son aire d'introduction. On suppose souvent qu'une mesure prise dans l'aire native vaut partout : cette hypothèse n'avait jamais été testée.",
      ],
    },
    deepen: {
      model: "Analyse comparative corrigée de la phylogénie (modèles mixtes bayésiens MCMCglmm, R) de 269 réponses fonctionnelles chez 45 espèces de poissons d'eau douce : 23 non invasives et 22 invasives, à partir de la base FoRAGE.",
      hypotheses: [
        "Les invasives sont distinguées selon qu'elles ont été étudiées dans leur aire native ou dans leur aire d'introduction.",
        "La température d'expérience est prise en compte.",
      ],
      results: [
        "Les espèces invasives ont une réponse fonctionnelle plus élevée que les non invasives, mais seulement lorsqu'elles sont étudiées dans leur aire native.",
        "Étudiées dans leur aire d'introduction, elles ont des taux d'attaque et des temps de manipulation comparables à ceux des non invasives.",
        "Le taux d'attaque diminue avec la température chez les non invasives et tend à augmenter chez les invasives de l'aire d'introduction : le réchauffement pourrait accentuer les asymétries compétitives.",
        "Une réponse fonctionnelle élevée prédispose à l'invasivité, mais une mesure prise dans l'aire native ne permet pas de prédire l'impact trophique ailleurs.",
      ],
      limits: [
        "L'étude compile des réponses fonctionnelles déjà publiées : elle ne repose pas sur de nouvelles expériences.",
        "Elle porte sur les poissons d'eau douce.",
      ],
    },
    module: "fish",
  },
};
