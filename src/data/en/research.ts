import type { Overlay } from "@/i18n/localize";
import type { ResearchTheme } from "@/types/content";

/** English overlay for RESEARCH_THEMES (the detail pages), keyed by slug. */
export const EN_RESEARCH_THEMES: Record<string, Overlay<ResearchTheme>> = {
  "technique-insecte-sterile": {
    title: "The sterile insect technique",
    short: "Releasing sterilised males to disrupt the reproduction of a pest.",
    lede: "The sterile insect technique relies on releasing sterilised individuals to reduce the reproduction of a target population. How well it works depends on many biological and technical factors, whose effects can be explored with models.",
    question: "Under what conditions can releases of sterile males reduce, or even eliminate, a population of agricultural pests?",
    mechanism:
      "Sterile males compete with wild males for mates. A female that mates with a sterile male produces no viable offspring: the higher the proportion of sterile males, the lower the reproduction of the population.",
    approach: "Discrete and continuous population dynamics models, analysis of equilibria and bifurcations, numerical simulations of release scenarios.",
    keyConcept: {
      term: "Elimination threshold",
      definition:
        "In many SIT models there is a release intensity above which extinction of the population is the only remaining equilibrium. Below it, the population can persist at a reduced level.",
    },
    methods: ["Population dynamics", "Dynamical systems", "Bifurcation analysis", "Python"],
  },
  "fertilite-residuelle": {
    title: "Residual fertility",
    short: "When sterilisation is imperfect.",
    lede: "Sterilisation can be imperfect. Residual fertility in the released insects can change the outcome of control strategies. This work examines when these effects become decisive.",
    question: "Does a low residual fertility in the released males compromise the possibility of eliminating the population, or only the level of reduction reached?",
    mechanism:
      "The model separates two forms of residual fertility: a fraction δ of released males that stay fully fertile, and a fraction ε of matings with sterile males that remain fertile.",
    approach: "A system of three differential equations (sterile males, females, wild males), an analysis of equilibria, time simulations and a sensitivity analysis.",
    keyConcept: {
      term: "Suppression or reduction",
      definition: "The study separates the conditions that favour suppression of the population from those where the strategy mainly reduces its abundance.",
    },
    methods: ["Differential equations", "Equilibrium analysis", "Sensitivity analysis", "SciPy", "SymPy"],
  },
  "accouplements-multiples": {
    title: "Multiple matings",
    short: "Polyandry, re-mating and sperm use.",
    lede: "In some species, females can mate several times. Re-mating and the way sperm is used can then influence how well sterile insect releases work.",
    question: "Is re-mating by Drosophila suzukii females a threat or an opportunity for the sterile insect technique?",
    mechanism:
      "A mated female can mate again. Depending on the sperm-use rule (first male, last male, a mix, or a choice), a later sterile mating may or may not cancel an earlier fertile one.",
    approach:
      "A compartmental model with five variables (larvae, males, fertile and infertile females, sterile males) and an individual-based model parameterised from the literature on D. suzukii.",
    keyConcept: {
      term: "Time horizon",
      definition: "The effects of re-mating differ with the horizon considered: a rule can speed up the initial decline of the population without guaranteeing elimination in the long run.",
    },
    methods: ["Compartmental model", "Individual-based model", "Mesa", "Repeated simulations"],
  },
  "modelisation-individu-centree": {
    title: "Individual-based modelling",
    short: "Representing each insect, its behaviour and its interactions.",
    lede: "Individual-based models represent each organism, its age, its matings and its egg laying. They can include individual variability and behavioural rules that are hard to express in an aggregated model.",
    question: "How do behavioural rules at the scale of the individual (lifespan, refractory period, sperm use) play out at the scale of the population?",
    mechanism:
      "Each agent (sterile male, wild male, larva, female) follows its own life cycle. Females store the number of fertile and sterile matings and lay eggs according to the simulated sperm-use rule.",
    approach:
      "A model written in Python with the Mesa library, run in batches on a computing cluster with 100 replicates per parameter set, then compared with the compartmental model.",
    keyConcept: {
      term: "Demographic stochasticity",
      definition: "Replicates of the same scenario produce different trajectories, so the analysis looks at distributions of outcomes rather than a single trajectory.",
    },
    methods: ["Mesa", "Python", "Batch computing", "Model comparison"],
  },
  "strategies-de-lachers": {
    title: "Release strategies and deployment constraints",
    short: "Frequency, size and a limited budget.",
    lede: "In practice, sterile males are released at discrete times, with a limited budget. The thesis chapter on the agricultural context studies how to split that budget between the frequency and the size of releases.",
    question: "With a fixed total number of sterile males, is it better to release often in small numbers, or rarely in large numbers?",
    mechanism:
      "Between two releases, the sterile male population declines exponentially. Periodic releases make this population converge to a periodic solution whose amplitude depends on the period and on the number released.",
    approach: "Impulsive models, an analytical periodic solution, and numerical simulations under a budget constraint.",
    keyConcept: {
      term: "Frequency–size trade-off",
      definition:
        "The thesis shows a trade-off between the frequency and the size of releases, and a “hidden cost”: sterile egg-laying punctures still degrade fruit quality, though less than fertile ones.",
    },
    methods: ["Impulsive models", "Periodic solution", "SciPy solve_ivp", "Constrained optimisation"],
  },
  "ecologie-des-invasions": {
    title: "Invasion ecology",
    short: "Functional responses, invasiveness and trophic impact.",
    lede: "Studying functional responses helps understand how resource consumption, species traits and the ability to become invasive are linked. The geographical and ecological context can change how these links are read.",
    question: "Does a species' functional response predict its invasiveness and the impact it has on food webs?",
    mechanism:
      "The functional response describes how a predator's consumption changes with the abundance of its prey. It is often put forward as an indicator of the potential impact of an introduced species.",
    approach:
      "A comparative statistical analysis of 269 functional-response estimates already published (45 freshwater fish species, FoRAGE database). Bayesian mixed models (MCMCglmm, in R) account for relatedness between species and for the temperature of the original experiments. The study relies on no new experiment.",
    keyConcept: {
      term: "Biogeographic context",
      definition: "The results show how much the biogeographic context matters when functional responses are used as indicators of invasiveness and impact.",
    },
    methods: ["Comparative statistical analysis", "Bayesian mixed models (MCMCglmm)", "R", "Open data (Zenodo)"],
  },
};
