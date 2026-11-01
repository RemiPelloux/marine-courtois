import { Equation } from "@/components/scientific/Equation";
import { ModelExplorer, type ExplorerContent, type ExplorerTab } from "@/components/visualizations/ModelExplorer";
import { fileUrl } from "@/data/code";
import { copy, type Lang } from "@/i18n/config";
import { getLang } from "@/i18n/server";

/** Text of the explorer panels that changes with the language; equations and citations do not. */
const TEXT = copy({
  fr: {
    teaching: "Exploration pédagogique : elle ne remplace pas les analyses publiées.",
    classic: "Modèle pédagogique classique : il illustre un mécanisme, pas un résultat de recherche.",
    stable: "stable",
    unstable: "instable",
    axisRF: "Axe de recherche : fertilité résiduelle",
    axisMM: "Axe de recherche : accouplements multiples",
    axisSIT: "Axe de recherche : technique de l'insecte stérile",
    thesisCitation: "Thèse de doctorat, chapitre 2 « Modeling SIT », Université Côte d'Azur (2025).",
    thesis: "Thèse de doctorat, 2025",
  },
  en: {
    teaching: "Teaching exploration: it does not replace the published analyses.",
    classic: "Classic teaching model: it illustrates a mechanism, not a research result.",
    stable: "stable",
    unstable: "unstable",
    axisRF: "Research theme: residual fertility",
    axisMM: "Research theme: multiple mating",
    axisSIT: "Research theme: sterile insect technique",
    thesisCitation: "Doctoral thesis, chapter 2 “Modeling SIT”, Université Côte d'Azur (2025).",
    thesis: "Doctoral thesis, 2025",
  },
});

/**
 * Server wrapper: equations are rendered with KaTeX on the server (no client
 * KaTeX bundle) and passed into the interactive explorer. Every equation below
 * is transcribed from the cited notebook.
 */
const content = (lang: Lang): Record<ExplorerTab, ExplorerContent> => {
  const t = TEXT[lang];
  return {
    fertilite: {
      equations: (
        <div className="space-y-1">
          <Equation display tex={String.raw`\dot S = (1-\delta)\,\sigma - \mu_S S`} />
          <Equation
            display
            tex={String.raw`\dot F = r(1-\rho)\,\frac{M + \varepsilon\eta S}{k + M + \eta S}\,\frac{F}{1+\beta F} - \mu_F F`}
          />
          <Equation
            display
            tex={String.raw`\dot M = r\rho\,\frac{M + \varepsilon\eta S}{k + M + \eta S}\,\frac{F}{1+\beta F} - \mu_M M + \delta\sigma`}
          />
        </div>
      ),
      citation: {
        text: "Courtois, Mailleret, Touzeau, van Oudenhove & Grognard (2025). Bulletin of Mathematical Biology 87, 25.",
        doi: "10.1007/s11538-024-01401-1",
        url: "https://doi.org/10.1007/s11538-024-01401-1",
      },
      code: {
        label: "Script_Manuscrit_SIT_RF.ipynb — thesisData",
        url: fileUrl("thesisData", "Chapter 3 - Residual Fertility/Script_Manuscrit_SIT_RF.ipynb"),
      },
      publication: {
        label: "Bulletin of Mathematical Biology, 2025",
        href: "/publications/fertilite-residuelle-technique-insecte-sterile",
      },
      methodology: { label: t.axisRF, href: "/recherche/fertilite-residuelle" },
      figure: t.teaching,
    },
    accouplements: {
      equations: (
        <div className="space-y-1 text-[0.86rem]">
          <Equation display tex={String.raw`\dot L = \omega\left(1-\tfrac{L}{K}\right)F_F - (\mu_L+\nu)L`} />
          <Equation display tex={String.raw`\dot M = \nu p L - \mu_M M,\qquad \dot S = \sigma - \mu_S S`} />
          <Equation display tex={String.raw`\dot F_F = \nu(1-p)\,\pi_M L + \tau_I \pi_M F_I - (\mu_F + \tau_F \pi_S)F_F`} />
          <Equation display tex={String.raw`\dot F_I = \nu(1-p)\,\pi_S L + \tau_F \pi_S F_F - (\mu_F + \tau_I \pi_M)F_I`} />
          <p className="text-mist pt-1 text-xs">
            <Equation tex={String.raw`\pi_M = \frac{M}{M+\eta S},\ \pi_S = \frac{\eta S}{M+\eta S}`} />
          </p>
        </div>
      ),
      citation: {
        text: "Courtois, van Oudenhove, Touzeau, Grognard & Mailleret (2026). PLOS Computational Biology 22(4): e1014212.",
        doi: "10.1371/journal.pcbi.1014212",
        url: "https://doi.org/10.1371/journal.pcbi.1014212",
      },
      code: {
        label: "Compartmental_model_output_vAvril.ipynb — thesisData",
        url: fileUrl("thesisData", "Chapter 4 - Multiple Mating/Compartmental_model_output_vAvril.ipynb"),
      },
      publication: { label: "PLOS Computational Biology, 2026", href: "/publications/polyandrie-technique-insecte-sterile" },
      methodology: { label: t.axisMM, href: "/recherche/accouplements-multiples" },
      figure: t.teaching,
    },
    dynamique: {
      equations: (
        <div className="space-y-1">
          <Equation display tex={String.raw`F_{t+1} = g(F_t) = \frac{\lambda F_t^{2}}{F_t + S}`} />
          <Equation display tex={String.raw`F^* = 0 \ \text{(${t.stable})},\qquad F^* = \frac{S}{\lambda-1}\ \text{(${t.unstable})}`} />
        </div>
      ),
      citation: {
        text: t.thesisCitation,
        url: "https://theses.fr/s352892",
      },
      code: {
        label: "fig_chapter2_thesis.ipynb — thesisData",
        url: fileUrl("thesisData", "Chapter 2 - Modeling SIT/fig_chapter2_thesis.ipynb"),
      },
      publication: { label: t.thesis, href: "/publications/these-modelisation-technique-insecte-sterile" },
      methodology: { label: t.axisSIT, href: "/recherche/technique-insecte-sterile" },
      figure: t.classic,
    },
  };
};

/**
 * The explorer is drawn in light ink: on a light page it brings its own dark band.
 * Pass `onDark` when the parent is already a dark section (the lab).
 */
export async function ModelExplorerSection({ initialTab, onDark = false }: { initialTab?: ExplorerTab; onDark?: boolean }) {
  const explorer = <ModelExplorer content={content(await getLang())} initialTab={initialTab} />;
  if (onDark) return explorer;
  return <div className="on-dark bg-antibes px-5 pt-2 pb-10 text-paper md:px-10 md:pb-14">{explorer}</div>;
}
