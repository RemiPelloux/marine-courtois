import type { Overlay } from "@/i18n/localize";
import type { Project } from "@/types/portfolio";

/** English overlay for PROJECTS (projects.ts), keyed by id. Links keep their URLs. */
export const EN_PROJECTS: Record<string, Overlay<Project>> = {
  "modele-individu-centre": {
    title: "Individual-based model of Drosophila suzukii",
    tagline: "Every female, every mating, every spermatheca: simulating sperm-use biases under sterile male releases.",
    context:
      "The sterile insect technique relies on mass releases of sterilised males. In many species, Drosophila suzukii among them, females mate several times, and the mechanisms that govern how stored sperm is used remain poorly known.",
    objective:
      "Follow each insect one by one (its lifespan, its matings, the sperm it stores, its egg laying) to see how these individual behaviours decide, at the scale of the population, whether sterile male releases succeed.",
    value:
      "An equation model describes average numbers: it cannot tell what each female's spermatheca contains. The individual-based model can. It compares five sperm-use rules (first male, last male, mixed, choice, preference) where the compartmental model distinguishes two, and it accounts for chance: each scenario is run 100 times.",
    question:
      "Whether a female preferentially uses the first or the last sperm received, fertile or sterile sperm, or a mixture, does the efficiency of the releases change?",
    methods: [
      "Individual-based model written in Python with Mesa: agents, scheduler, data collection",
      "Calibrated on Drosophila suzukii (lifespans, refractory periods, egg laying, carrying capacity)",
      "Sperm-use scenarios: first or last male, fertile or sterile, mixed use",
      "Batch runs on a computing cluster, 100 repetitions per scenario",
      "Larval dynamics compared with the compartmental model of the same article (appendix)",
    ],
    results: [
      "In the long term, multiple mating is unfavourable: it requires more sterile male releases to control the population.",
      "In the short term, it can be beneficial by “defertilising” females already mated with wild males.",
      "The influence of sperm-use biases remains limited, depending on the release effort that can be deployed.",
    ],
    limits: [
      "The model is calibrated on a single species, Drosophila suzukii.",
      "Sperm-use mechanisms are still poorly known: the scenarios bracket what is possible rather than settle it.",
      "The demonstrator on this site is scaled down fiftyfold and illustrates how the model works; it does not replace the published simulations.",
    ],
    nextSteps: ["An interactive application to explore the model's scenarios is in development (information supplied by Marine Courtois)."],
    links: [{ label: "Code — sit_remating_abm" }, { label: "Article — PLOS Computational Biology" }, { label: "MMEE 2026 poster (HAL)" }],
  },
  "modele-equations-differentielles": {
    title: "Differential-equation models of the SIT",
    tagline: "Average numbers, equations, thresholds: from what release effort is a pest population eliminated, and not merely reduced?",
    context:
      "Most models of the sterile insect technique describe the population through average numbers (sterile males, females, wild males, larvae) whose change over time follows ordinary differential equations. This framework lends itself to mathematical analysis: equilibria, stability, thresholds.",
    objective:
      "Write the biological mechanisms (competition between wild and sterile males, residual fertility, female remating) as equations, then determine for which release intensities the population is eliminated or only reduced.",
    value:
      "Equations give general results rather than a series of case-by-case simulations: the existence of an elimination threshold, the conditions under which residual fertility turns suppression into mere reduction, the stability of equilibria depending on the sperm-use rule. They also serve as the reference for the individual-based model, compared with them in the appendix of the 2026 article.",
    question:
      "For which sterile male release intensities is a pest population eliminated, and how do residual fertility and female remating change that outcome?",
    methods: [
      "Residual fertility: three differential equations (sterile males, females, wild males)",
      "Remating: five-variable compartmental model (larvae, males, fertile and infertile females, sterile males)",
      "Symbolic computation of equilibria (SymPy), numerical integration (SciPy: odeint, solve_ivp)",
      "Bifurcation diagrams and phase portraits (python-control)",
      "Parameter sensitivity analysis (statsmodels)",
      "Impulsive releases under a limited budget: analytic periodic solution",
    ],
    results: [
      "The models separate the conditions that favour suppression of the population from those where releases mainly reduce its abundance (Bulletin of Mathematical Biology, 2025).",
      "With remating, effects differ with the time horizon: a sperm-use rule can speed up the initial decline of the population without guaranteeing its elimination in the long term (PLOS Computational Biology, 2026).",
      "Under a limited budget, impulsive releases reveal a trade-off between release frequency and release size (thesis, chapter 5).",
    ],
    limits: [
      "An equation model describes average numbers: it represents neither the variability between individuals nor chance encounters, which the individual-based model handles.",
      "The residual-fertility model has no larval stage; the remating model adds one.",
      "The notebooks reproduce the published figures; they are not a software library reusable as is.",
    ],
    links: [
      { label: "Code — thesisData" },
      { label: "Article — Bulletin of Mathematical Biology" },
      { label: "Open-access version (HAL)" },
      { label: "Article — PLOS Computational Biology" },
      { label: "Interactive explorer — lab" },
    ],
  },
  "reponses-fonctionnelles": {
    title: "Functional responses of freshwater fish",
    tagline: "269 functional responses, 45 species: what prey consumption says, and does not say, about invasiveness.",
    context:
      "The functional response links a predator's consumption to the density of its prey. It is often measured to compare invasive and non-invasive species, on the assumption that a measurement taken in the native range holds everywhere.",
    objective:
      "Check whether a common measure of a predator's voracity, the functional response, really sets invasive fish apart from the others, taking into account where each species was studied.",
    value:
      "The study range changes the comparison: a measurement taken in a species' native range does not necessarily hold in its introduced range. This result rests on 269 functional responses from 45 species, analysed while accounting for their relatedness.",
    question:
      "Do functional-response parameters differ between an invasive species studied in its native range and the same species studied in its introduced range?",
    methods: [
      "Freshwater fish extracted from the FoRAGE database",
      "Comparative analysis with phylogenetic correction (MCMCglmm, R)",
      "Attack rate a, handling time h and the ratio a/h, in interaction with temperature",
    ],
    results: [
      "Invasive species show a higher functional response than non-invasive ones, but only when studied in their native range.",
      "Studied in their introduced range, they have attack rates and handling times comparable to non-invasive species.",
      "The attack rate decreases with temperature in non-invasive species and tends to increase in invasive species from the introduced range.",
    ],
    limits: [
      "The data come from published experiments with heterogeneous protocols.",
      "The charts on this site show the raw data; the article's conclusions rest on phylogenetically corrected models.",
    ],
    links: [{ label: "Article — Journal of Animal Ecology" }, { label: "Data and R scripts — Zenodo" }, { label: "bioRxiv preprint" }],
  },
  "reproductibilite-these": {
    title: "The thesis figures, reproducible",
    tagline: "Eleven Jupyter notebooks sorted by chapter: every figure of the thesis can be rebuilt from its code.",
    context: "A thesis gathers dozens of figures produced by different models. The thesisData repository makes them checkable and reusable.",
    objective: "Let anyone reading the thesis redo each figure from the code, chapter by chapter.",
    value: "The figures become checkable: one can inspect the parameters used, rerun the computations and compare the result with the figure in the thesis.",
    question: "How can a reader redo each figure, from the model to the chart?",
    methods: ["Notebooks by chapter", "Numerical integration of ODEs, symbolic computation of equilibria", "Sensitivity analysis", "Versioned thesis and slides"],
    results: ["The figures of chapters 1 to 5 are reproduced by public notebooks, with the library versions stated."],
    limits: ["The notebooks reproduce the figures; they are not a software library reusable as is."],
    links: [{ label: "thesisData repository" }],
  },
  "explorateur-de-modeles": {
    title: "The model explorer",
    tagline: "Three published models, recomputed in the browser: observe, vary, understand.",
    context: "The thesis models are published as notebooks. This site ports them to TypeScript so they can be handled without installing Python.",
    objective: "Make three thesis models adjustable in a browser: change a parameter and watch the population dynamics recompute.",
    value: "A published model becomes readable for people who do not read equations: the effect of residual fertility or of the sperm-use rule is visible directly, and each panel points back to the original notebook and article.",
    question: "Can a population-dynamics model be made adjustable by a non-specialist without simplifying it to the point of betraying it?",
    methods: ["Fourth-order Runge-Kutta integrator ported from the notebooks", "Parameters taken from the notebooks", "Automated tests comparing the curves with the published figures"],
    results: ["The recomputed curves reproduce those of the notebooks for the published parameters (checked by the site's tests)."],
    limits: ["Only three models are ported; the individual-based model is present only in reduced form."],
    links: [{ label: "Open the explorer" }],
  },
  "deep-learning": {
    title: "Deep learning experiments",
    tagline: "To be documented: architectures, data, experiments and what they taught.",
  },
  "application-shiny": {
    title: "Shiny application",
    tagline: "To be documented: aim, data, screenshots and demo link.",
  },
};
