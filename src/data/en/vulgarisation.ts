import type { Overlay } from "@/i18n/localize";
import type { OutreachModule } from "@/data/vulgarisation";

/** English overlay for OUTREACH_MODULES (vulgarisation.ts), keyed by id. */
export const EN_OUTREACH: Record<string, Overlay<OutreachModule>> = {
  population: {
    title: "What is a population?",
    lede: "All the individuals of one species that live in the same place and can breed with one another.",
    paragraphs: [
      "The flies of an orchard, the fish of a lake: we count them, sort them by sex (females, males) and by life stage (juveniles, adults), and follow how these numbers change.",
      "In biological control, the population to follow is the pest's. The question becomes: how can its numbers be brought down, and kept down?",
    ],
  },
  evolution: {
    title: "How does a population change?",
    lede: "Births, deaths, and an environment that eventually limits growth.",
    paragraphs: [
      "When resources are plentiful, each individual has on average the same number of offspring, whatever the size of the population: the larger it is, the faster it grows. Then space and food run short, growth slows down and the numbers level off.",
      "The logistic curve sums up this scenario with two numbers: the growth rate r (births minus deaths, per individual) and the carrying capacity K (the number of individuals the environment can support). Vary them.",
    ],
  },
  pourquoi: {
    title: "Why model living systems?",
    lede: "To isolate a mechanism, and to test what cannot be tested in the field.",
    paragraphs: [
      "Nobody can release millions of insects to try every strategy, or make sterilisation imperfect on purpose. A model lets us ask “what if…?” without risk, and find the thresholds where everything tips over.",
      "A model is not reality: it keeps what is useful for one specific question, and its conclusions hold within the limits of its assumptions.",
    ],
    next: { label: "Simulate, experiment, interpret" },
  },
  simulation: {
    title: "How does a simulation work?",
    lede: "The computer moves forward in time step by step, applying the rules of the model.",
    paragraphs: [
      "At each step, it computes how many individuals are born and die during that short interval, then updates the numbers. The smaller the step, the more closely the simulation follows the exact solution.",
    ],
  },
  compartimental: {
    title: "What is a compartmental model?",
    lede: "Individuals are sorted into boxes, and the model describes the flows between them.",
    paragraphs: [
      "In the residual-fertility model, three boxes are enough: the released sterile males, the wild females and the wild males. Each arrow is a term of a differential equation.",
      "The model follows average numbers: it is quick to analyse mathematically (equilibria, thresholds), but it does not see individuals.",
    ],
    next: { label: "The residual-fertility article" },
  },
  "individu-centre": {
    title: "What is an individual-based model?",
    lede: "Each individual becomes an agent, with its own history and rules.",
    paragraphs: [
      "Here, each female keeps track of the sperm of the males she has mated with. This is essential to compare sperm-use rules that a compartmental model cannot represent.",
      "The demonstrator below is a version of the published model scaled down fifty times: it shows how the model works, it does not replace the simulations of the article.",
    ],
    next: { label: "The individual-based model" },
  },
  collectif: {
    title: "From individual behaviour to collective dynamics",
    lede: "A detail in the life of each female can change the fate of the whole population.",
    paragraphs: [
      "Whether females mate once or several times seems a minor detail. Yet in the 2026 article, in the long run, multiple mating calls for more releases to control the population, while in the short run it can “defertilise” females that have already mated with wild males.",
      "This is the whole point of models: linking an individual mechanism to its effect on the population, and showing that this effect depends on the time horizon.",
    ],
    next: { label: "Polyandry: threat or opportunity?" },
  },
  interpreter: {
    title: "How do you interpret a result?",
    lede: "Look for the threshold, read the conditions, name the limits.",
    paragraphs: [
      "This diagram, redrawn from the thesis, plots the density of sterile males S present in the environment on the horizontal axis, and the equilibrium density of females F* on the vertical axis. Each curve is a possible equilibrium: solid if it is stable, dashed if it is unstable.",
      "Below the critical value Sc, two outcomes coexist: the population persists at the stable equilibrium, or collapses if it starts too low; the unstable equilibrium acts as a threshold. Beyond Sc, only the zero equilibrium remains: the population can be eliminated.",
      "Interpreting means stating under which conditions this threshold exists, what shifts it (residual fertility, for instance), and what the model does not say: here, the density of sterile males is assumed constant, whereas real releases make it vary.",
    ],
    next: { label: "The thesis, chapter by chapter" },
  },
};
