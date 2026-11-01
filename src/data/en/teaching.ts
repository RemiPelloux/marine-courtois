import type { Overlay } from "@/i18n/localize";
import type { TeachingActivity } from "@/types/portfolio";
import type { TeachingResource } from "@/data/teaching";

/** English overlay for TEACHING_ACTIVITIES (teaching.ts), keyed by id. Institution names stay as they are. */
export const EN_TEACHING: Record<string, Overlay<TeachingActivity>> = {
  "polytech-genie-biologique": {
    programme: "Génie biologique (biological engineering), 3rd year",
    subjects: "Mathematics, linear algebra, matrices, statistics and R programming",
  },
  "isa-licence-pro": {
    programme: "Licence professionnelle (professional bachelor's degree)",
    subjects: "Data analysis in Excel",
  },
  "m1-biocontrol": { subjects: "Statistics in R, linear models and ANOVA, taught in English" },
  "m2-bioinformatique": { programme: "M2 Bioinformatics", subjects: "R programming, ggplot, Shiny" },
  "uca-l2": {
    institution: "Université Côte d'Azur, Valrose campus",
    programme: "Bachelor's degree, 2nd year (L2)",
    subjects: "Biology practicals: water and mineral nutrition, photosynthesis, secondary metabolism",
  },
  "uca-l3": {
    institution: "Université Côte d'Azur, Valrose campus",
    programme: "Bachelor's degree, 3rd year (L3)",
    subjects: "Matrix models in biology, linear algebra",
  },
};

/** English overlay for TEACHING_RESOURCES. */
export const EN_TEACHING_RESOURCES: Record<string, Overlay<TeachingResource>> = {
  notebooks: {
    title: "The thesis notebooks",
    text: "Eleven Jupyter notebooks that rebuild every figure of the manuscript step by step, from the equations to the plot.",
  },
  abm: {
    title: "An annotated individual-based model",
    text: "The Mesa script and five analysis notebooks: a complete multi-agent simulation, from the agent to the statistics.",
  },
  explorer: {
    title: "The model explorer",
    text: "Watch a mechanism, vary its parameters, read the result: three published models to handle in the browser.",
  },
};
