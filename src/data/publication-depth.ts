import type { Lang } from "@/i18n/config";
import { localizeOne } from "@/i18n/localize";
import { EN_PUBLICATION_DEPTH } from "@/data/en/publication-depth";

/**
 * Three reading depths for the featured articles. "Approfondir" follows the
 * published abstracts (Crossref, HAL hal-04403761) without going beyond them;
 * "Découvrir" and "Comprendre" rephrase them in plain language.
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
      question: "Pourquoi relâcher des insectes stériles peut-il protéger une culture\u00a0?",
      text: "On élève en masse l'insecte ravageur, on stérilise les mâles et on les relâche. Une femelle qui s'accouple avec un mâle stérile n'a pas de descendance\u00a0: plus il y a de mâles stériles, moins la population se renouvelle, et elle peut décliner.",
    },
    understand: {
      question: "Et si une partie des mâles restait fertile\u00a0?",
      paragraphs: [
        "La stérilisation se fait par irradiation, et elle n'est pas parfaite\u00a0: une proportion de mâles y échappe. C'est la fertilité résiduelle. Ces mâles, relâchés avec les autres, engendrent une descendance.",
        "L'irradiation peut aussi affaiblir les mâles, ce que les biologistes appellent un coût en valeur sélective. L'article compare ces situations à celle d'une stérilisation sans défaut.",
      ],
    },
    deepen: {
      model: "Trois équations différentielles décrivent l'évolution des mâles stérilisés, des mâles sauvages et des femelles sauvages. Les états d'équilibre de la population et leur stabilité sont calculés exactement. Pour situer les seuils (analyses de bifurcation), les paramètres sont ceux de la mouche méditerranéenne des fruits, Ceratitis capitata.",
      hypotheses: [
        "Une proportion des mâles irradiés échappe à la stérilisation (fertilité résiduelle).",
        "Cette fertilité résiduelle est étudiée avec ou sans coût en valeur sélective associé à la stérilisation.",
        "Référence\u00a0: une stérilisation des mâles sans défaut.",
      ],
      results: [
        "Sous un seuil de fertilité résiduelle, inonder le paysage de mâles stérilisés peut conduire la population sauvage à l'extinction.",
        "Ce seuil est plus élevé lorsque la fertilité résiduelle s'accompagne de coûts en valeur sélective.",
        "Une fertilité résiduelle trop forte rend la technique de l'insecte stérile moins efficace et empêche l'éradication.",
        "La population de ravageurs peut toutefois encore être fortement réduite pour des taux de fertilité résiduelle bien plus élevés.",
      ],
      limits: [
        "Les seuils sont obtenus avec des paramètres calibrés sur Ceratitis capitata\u00a0: ils dépendent de l'espèce.",
        "Il s'agit de résultats de modèle, et non d'essais de terrain.",
      ],
    },
    module: "rf",
  },
  "pub-2026-polyandry": {
    discover: {
      question: "Une femelle qui s'accouple plusieurs fois peut-elle déjouer la lutte biologique\u00a0?",
      text: "Chez beaucoup d'insectes, les femelles s'accouplent avec plusieurs mâles et stockent leur sperme. Une femelle accouplée à un mâle stérile peut donc encore se reproduire grâce à un mâle sauvage, et l'inverse est aussi vrai.",
    },
    understand: {
      question: "Tout dépend de la façon dont le sperme est utilisé.",
      paragraphs: [
        "Après plusieurs accouplements, quel sperme féconde les œufs\u00a0? Le premier reçu, le dernier, plutôt le fertile, plutôt le stérile, ou un mélange\u00a0? Ces mécanismes sont encore mal connus.",
        "Un premier modèle, dit compartimental, suit des effectifs moyens (combien de larves, de mâles, de femelles)\u00a0: il mesure l'effet global des accouplements multiples. Un second, individu-centré, suit chaque femelle et le sperme qu'elle a stocké\u00a0: il permet de comparer les façons d'utiliser ce sperme.",
      ],
    },
    deepen: {
      model: "Un modèle compartimental en équations différentielles mesure l'effet global des accouplements multiples. Un modèle individu-centré, calibré sur Drosophila suzukii, compare plusieurs façons d'utiliser le sperme\u00a0: priorité au premier ou au dernier mâle, au sperme fertile ou au sperme stérile, ou mélange des deux.",
      hypotheses: [
        "Les femelles peuvent s'accoupler plusieurs fois et stocker le sperme de plusieurs mâles.",
        "Plusieurs règles d'utilisation du sperme sont explorées comme scénarios, faute de mécanisme établi.",
        "Paramètres biologiques du modèle individu-centré calibrés sur Drosophila suzukii.",
      ],
      results: [
        "À long terme, les accouplements multiples sont défavorables\u00a0: ils demandent davantage de lâchers de mâles stérilisés pour contrôler la population.",
        "À court terme, ils peuvent être bénéfiques en « défertilisant » des femelles déjà accouplées à des mâles sauvages.",
        "Selon l'effort de lâcher qu'il est possible de déployer, la façon dont le sperme est utilisé peut n'avoir qu'une influence limitée.",
      ],
      limits: [
        "Les mécanismes d'utilisation du sperme restent mal connus\u00a0: les scénarios couvrent plusieurs possibilités, sans trancher entre elles.",
        "Le modèle individu-centré est calibré sur une seule espèce.",
      ],
    },
    module: "abm",
  },
  "pub-2026-functional-response": {
    discover: {
      question: "Pourquoi certaines espèces de poissons deviennent-elles envahissantes\u00a0?",
      text: "Une hypothèse répandue\u00a0: les espèces invasives seraient de meilleurs prédateurs, capables de consommer davantage de proies. Des expériences le mesurent par la réponse fonctionnelle, la relation entre la densité de proies et ce qu'un prédateur consomme. Cette étude ne refait pas ces expériences\u00a0: elle compare statistiquement les résultats déjà publiés.",
    },
    understand: {
      question: "Deux paramètres, et une question de lieu.",
      paragraphs: [
        "Deux paramètres résument une réponse fonctionnelle. Le taux d'attaque a mesure l'efficacité du prédateur à trouver ses proies quand elles sont rares. Le temps de manipulation h est le temps qu'il lui faut pour capturer, manipuler et digérer une proie\u00a0: il plafonne la consommation.",
        "Une espèce invasive peut être étudiée dans sa région d'origine (aire native) ou dans une région où elle a été introduite. On suppose souvent qu'une mesure prise dans l'aire native vaut partout\u00a0: cette hypothèse n'avait jamais été testée.",
      ],
    },
    deepen: {
      model: "Une analyse statistique comparative de 269 réponses fonctionnelles déjà publiées, rassemblées dans la base FoRAGE, chez 45 espèces de poissons d'eau douce (23 non invasives, 22 invasives). Des modèles mixtes bayésiens (MCMCglmm, sous R) tiennent compte de la parenté entre espèces (correction phylogénétique) et de la température des expériences.",
      hypotheses: [
        "Les invasives sont distinguées selon qu'elles ont été étudiées dans leur aire native ou dans leur aire d'introduction.",
        "La température à laquelle chaque expérience d'origine a été menée est prise en compte.",
      ],
      results: [
        "Les espèces invasives ont une réponse fonctionnelle plus élevée que les non invasives, mais seulement lorsqu'elles sont étudiées dans leur aire native.",
        "Étudiées dans leur aire d'introduction, elles ont des taux d'attaque et des temps de manipulation comparables à ceux des non invasives.",
        "Le taux d'attaque diminue avec la température chez les espèces non invasives et tend à augmenter chez les invasives étudiées dans leur aire d'introduction\u00a0: le réchauffement climatique pourrait creuser l'écart de compétitivité entre elles.",
        "Une réponse fonctionnelle élevée prédispose à l'invasivité, mais une mesure prise dans l'aire native ne permet pas de prédire l'impact trophique ailleurs.",
      ],
      limits: [
        "L'étude compile des réponses fonctionnelles déjà publiées\u00a0: elle ne repose sur aucune nouvelle expérience.",
        "Elle porte sur les poissons d'eau douce.",
      ],
    },
    module: "fish",
  },
};

/** The reading depths of a publication in a language. */
export function publicationDepthIn(lang: Lang, id: string): Depth | undefined {
  const depth = PUBLICATION_DEPTH[id];
  return depth && localizeOne(depth, EN_PUBLICATION_DEPTH[id], lang);
}
