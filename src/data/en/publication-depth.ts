import type { Overlay } from "@/i18n/localize";
import type { Depth } from "@/data/publication-depth";

/** English overlay for PUBLICATION_DEPTH, keyed by publication id. */
export const EN_PUBLICATION_DEPTH: Record<string, Overlay<Depth>> = {
  "pub-2025-residual-fertility": {
    discover: {
      question: "Why can releasing sterile insects protect a crop?",
      text: "The pest insect is mass-reared, the males are sterilised and then released. A female that mates with a sterile male has no offspring: the more sterile males there are, the less the population renews itself, and it can decline.",
    },
    understand: {
      question: "What if some of the males stayed fertile?",
      paragraphs: [
        "Sterilisation is done by irradiation, and it is not perfect: a proportion of males escape it. This is residual fertility. These males, released with the others, produce offspring.",
        "Irradiation can also weaken the males, which biologists call a fitness cost. The article compares these situations with that of flawless sterilisation.",
      ],
    },
    deepen: {
      model: "Three differential equations describe how sterilised males, wild males and wild females change over time. The equilibrium states of the population and their stability are calculated exactly. To locate the thresholds (bifurcation analyses), the parameters are those of the Mediterranean fruit fly, Ceratitis capitata.",
      hypotheses: [
        "A proportion of irradiated males escape sterilisation (residual fertility).",
        "This residual fertility is studied with or without a fitness cost linked to sterilisation.",
        "Reference: flawless sterilisation of the males.",
      ],
      results: [
        "Below a residual fertility threshold, flooding the landscape with sterilised males can drive the wild population to extinction.",
        "This threshold is higher when residual fertility comes with fitness costs.",
        "Too much residual fertility makes the sterile insect technique less effective and prevents eradication.",
        "The pest population can still be strongly reduced for much higher residual fertility rates.",
      ],
      limits: ["The thresholds come from parameters calibrated on Ceratitis capitata: they depend on the species.", "These are model results, not field trials."],
    },
  },
  "pub-2026-polyandry": {
    discover: {
      question: "Can a female that mates several times defeat biological control?",
      text: "In many insects, females mate with several males and store their sperm. A female mated with a sterile male can therefore still reproduce thanks to a wild male, and the reverse is also true.",
    },
    understand: {
      question: "It all depends on how the sperm is used.",
      paragraphs: [
        "After several matings, which sperm fertilises the eggs? The first received, the last, preferably the fertile, preferably the sterile, or a mix? These mechanisms are still poorly known.",
        "A first model, called compartmental, follows average numbers (how many larvae, males, females): it measures the overall effect of multiple matings. A second, individual-based, follows each female and the sperm she has stored: it compares the ways that sperm can be used.",
      ],
    },
    deepen: {
      model: "A compartmental model based on differential equations measures the overall effect of multiple matings. An individual-based model, calibrated on Drosophila suzukii, compares several ways of using sperm: priority to the first or the last male, to fertile or sterile sperm, or a mix of both.",
      hypotheses: [
        "Females can mate several times and store the sperm of several males.",
        "Several sperm-use rules are explored as scenarios, since no mechanism is established.",
        "Biological parameters of the individual-based model calibrated on Drosophila suzukii.",
      ],
      results: [
        "In the long term, multiple matings are a drawback: more releases of sterilised males are needed to control the population.",
        "In the short term, they can help by “defertilising” females already mated with wild males.",
        "Depending on the release effort that can be deployed, the way sperm is used may have only a limited influence.",
      ],
      limits: [
        "Sperm-use mechanisms remain poorly known: the scenarios cover several possibilities without deciding between them.",
        "The individual-based model is calibrated on a single species.",
      ],
    },
  },
  "pub-2026-functional-response": {
    discover: {
      question: "Why do some fish species become invasive?",
      text: "A common hypothesis: invasive species are better predators, able to eat more prey. Experiments measure this through the functional response, the relationship between prey density and what a predator consumes. This study does not repeat those experiments: it compares their published results statistically.",
    },
    understand: {
      question: "Two parameters, and a question of place.",
      paragraphs: [
        "Two parameters summarise a functional response. The attack rate a measures how efficiently the predator finds prey when prey are rare. The handling time h is the time it needs to capture, handle and digest one prey: it caps consumption.",
        "An invasive species can be studied in its region of origin (native range) or in a region where it was introduced. A measure taken in the native range is often assumed to hold everywhere: this assumption had never been tested.",
      ],
    },
    deepen: {
      model: "A comparative statistical analysis of 269 published functional responses, gathered in the FoRAGE database, for 45 freshwater fish species (23 non-invasive, 22 invasive). Bayesian mixed models (MCMCglmm, in R) account for relatedness between species (phylogenetic correction) and for the temperature of the experiments.",
      hypotheses: [
        "Invasive species are split according to whether they were studied in their native range or in their introduced range.",
        "The temperature at which each original experiment was run is taken into account.",
      ],
      results: [
        "Invasive species have a higher functional response than non-invasive species, but only when they are studied in their native range.",
        "Studied in their introduced range, they have attack rates and handling times comparable to those of non-invasive species.",
        "The attack rate decreases with temperature in non-invasive species and tends to increase in invasive species studied in their introduced range: climate warming could widen the competitive gap between them.",
        "A high functional response predisposes a species to invasiveness, but a measure taken in the native range does not predict trophic impact elsewhere.",
      ],
      limits: ["The study compiles functional responses that were already published: it relies on no new experiment.", "It covers freshwater fish."],
    },
  },
};
