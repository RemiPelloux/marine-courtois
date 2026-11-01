import type { Overlay } from "@/i18n/localize";
import type { ThesisChapter } from "@/types/content";

/** English overlay for THESIS_CHAPTERS (thesis.ts), keyed by chapter number. */
export const EN_THESIS_CHAPTERS: Record<number, Overlay<ThesisChapter>> = {
  1: {
    question: "What is the sterile insect technique, and why model it?",
    approach: "Context, aims and outline of the thesis; a bibliometric review of the published work on SIT.",
    keyConcept: "Autocidal control: using the individuals of a species to reduce its own reproduction.",
    accessible:
      "Insects are reared, sterilised and released. Wild females that mate with them have no offspring: the population declines if releases are large enough.",
  },
  2: {
    question: "Which mathematical models describe the dynamics of a population under sterile releases?",
    approach: "The models developed to describe SIT dynamics: discrete models, competition, bifurcations.",
    keyConcept: "Bistability: depending on the initial population, the system converges to extinction or to a positive equilibrium.",
    accessible: "The same release level may be enough against a small population but fail against a large one: there is a threshold.",
  },
  3: {
    question: "Despite sterilisation, some males keep a low level of fertility. What are the consequences for control?",
    approach: "A differential-equation model, bifurcation curves, time dynamics and sensitivity analysis.",
    keyConcept: "Cost-free (δ) and costly (ε) residual fertility: two mechanisms, two effects.",
    accessible: "If a small share of the released males stays fertile, the population can, under some conditions, be strongly reduced without being eliminated.",
  },
  4: {
    question: "Many pest females mate several times: how does this affect the effectiveness of releases?",
    approach: "A compartmental model and an individual-based model (Mesa) applied to Drosophila suzukii; comparison of the two approaches.",
    keyConcept: "Sperm-use rule: first male, last male, mixing, choice or preference.",
    accessible: "If a female uses the sperm of her last partner, a sterile male can “erase” a fertile mating — the reverse is also possible.",
  },
  5: {
    question: "How should a limited budget of sterile males be split between release frequency and intensity?",
    approach: "Discrete release strategies (impulsive models) under a limited budget; oviposition stings taken into account.",
    keyConcept: "The frequency–amplitude trade-off and the “hidden cost” of sterile stings on fruit quality.",
    accessible: "Release often, or release a lot? The two are not equivalent. And even sterile females can damage fruit when they lay eggs.",
  },
  6: {
    question: "What should be retained about the biological and operational factors that condition the success of SIT?",
    approach: "Synthesis of the results and perspectives (see the thesis).",
    keyConcept: "Biological factors (residual fertility, multiple mating) and operational ones (budget, frequency, intensity).",
    accessible: "The thesis shows where the limits of the strategy lie and how to anticipate them, to improve control while limiting crop losses.",
  },
};

/** English text of THESIS (thesis.ts). Titles of chapters stay as in the repository. */
export const EN_THESIS = {
  intro: [
    "How can biological behaviours and technical constraints change the effectiveness of a biological control strategy?",
    "My thesis addresses this question in the setting of the sterile insect technique. It explores the consequences of imperfect sterilisation, the effects of re-mating and the ways releases are carried out, through several modelling approaches.",
  ],
  resourceLabels: ["Thesis (PDF, archived version)", "Defence slides", "theses.fr record", "Thesis DOI", "thesisData code repository"],
  resourceKinds: ["PDF · GitLab", "PDF · GitLab", "Record", "DOI", "Code"],
};
