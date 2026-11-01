import type { Overlay } from "@/i18n/localize";
import type { Figure } from "@/types/content";

/** English overlay for FIGURES (figures.ts), keyed by id: alt text and caption only. */
export const EN_FIGURES: Record<string, Overlay<Figure>> = {
  "fig-ch1-articles": {
    alt: "Histogram of the number of articles per year, from 1960 to 2024, separating modelling articles (blue) from the others (grey). Publications rise sharply after 2005.",
    caption: "Number of articles published per year on the sterile insect technique, with the share of modelling work.",
  },
  "fig-ch2-cobweb": {
    alt: "Cobweb diagram of the discrete model F(t+1) = λF²/(F+S): a trajectory starting below the threshold converges to zero, another starting above it diverges.",
    caption: "Cobweb diagram of a discrete model of sterile releases, with its two equilibria.",
  },
  "fig-ch2-bifurcation": {
    alt: "Bifurcation diagram: equilibrium density of females as a function of the density of sterilised males, with a stable branch, an unstable branch and a saddle-node bifurcation point at S_c.",
    caption: "Bifurcation diagram of a model with competition and sterile releases: beyond S_c, only the zero equilibrium remains.",
  },
  "fig-ch3-dynamics": {
    alt: "Female density curves over 300 days: without releases (constant), and with low or high releases, with or without 1 % residual fertility.",
    caption: "Time dynamics of wild females with and without residual fertility, for two release intensities.",
  },
  "fig-ch3-sensitivity": {
    alt: "Horizontal bar chart of the total sensitivity indices of the model parameters; μF has the highest index.",
    caption: "Sensitivity indices of the parameters of the residual-fertility model.",
  },
  "fig-ch4-first-last": {
    alt: "Two panels of larval density over time for three release intensities, comparing the “First” (blue) and “Last” (orange) sperm-use scenarios under high (A) and low (B) initial infestation.",
    caption: "Compartmental model: larval density by sperm-use rule (first or last male).",
  },
  "fig-ch4-abm": {
    alt: "Left, stochastic trajectories of the number of larvae over 100 days for several sperm-use rules; right, reduction of the area under the curve for each scenario.",
    caption: "Individual-based model: repeated larval dynamics and reduction of the area under the curve by sperm-use scenario.",
  },
  "fig-ch5-impulsive": {
    alt: "Population of sterilised males under periodic releases every 7 days: the simulation converges to the analytical periodic solution.",
    caption: "Impulsive releases: the sterile male population converges to a periodic solution.",
  },
  "fig-ch5-budget": {
    alt: "Optimal number of releases as a function of the total budget of sterile males: an increasing step function from 1 to 7.",
    caption: "Optimal number of releases as a function of the total budget of sterile males.",
  },
};
