import { Equation } from "@/components/scientific/Equation";
import { ModelExplorer, type ExplorerContent, type ExplorerTab } from "@/components/visualizations/ModelExplorer";
import { fileUrl } from "@/data/code";

/**
 * Server wrapper: equations are rendered with KaTeX on the server (no client
 * KaTeX bundle) and passed into the interactive explorer. Every equation below
 * is transcribed from the cited notebook.
 */
const CONTENT: Record<ExplorerTab, ExplorerContent> = {
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
    publication: { label: "Bulletin of Mathematical Biology, 2025", href: "/publications/fertilite-residuelle-technique-insecte-sterile" },
    methodology: { label: "Axe de recherche : fertilité résiduelle", href: "/recherche/fertilite-residuelle" },
    figure: "Exploration pédagogique : elle ne remplace pas les analyses publiées.",
  },
  accouplements: {
    equations: (
      <div className="space-y-1 text-[0.86rem]">
        <Equation display tex={String.raw`\dot L = \omega\left(1-\tfrac{L}{K}\right)F_F - (\mu_L+\nu)L`} />
        <Equation display tex={String.raw`\dot M = \nu p L - \mu_M M,\qquad \dot S = \sigma - \mu_S S`} />
        <Equation
          display
          tex={String.raw`\dot F_F = \nu(1-p)\,\pi_M L + \tau_I \pi_M F_I - (\mu_F + \tau_F \pi_S)F_F`}
        />
        <Equation
          display
          tex={String.raw`\dot F_I = \nu(1-p)\,\pi_S L + \tau_F \pi_S F_F - (\mu_F + \tau_I \pi_M)F_I`}
        />
        <p className="pt-1 text-xs text-mist">
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
    methodology: { label: "Axe de recherche : accouplements multiples", href: "/recherche/accouplements-multiples" },
    figure: "Exploration pédagogique : elle ne remplace pas les analyses publiées.",
  },
  dynamique: {
    equations: (
      <div className="space-y-1">
        <Equation display tex={String.raw`F_{t+1} = g(F_t) = \frac{\lambda F_t^{2}}{F_t + S}`} />
        <Equation display tex={String.raw`F^* = 0 \ \text{(stable)},\qquad F^* = \frac{S}{\lambda-1}\ \text{(instable)}`} />
      </div>
    ),
    citation: {
      text: "Thèse de doctorat, chapitre 2 « Modeling SIT », Université Côte d'Azur (2025).",
      url: "https://theses.fr/s352892",
    },
    code: {
      label: "fig_chapter2_thesis.ipynb — thesisData",
      url: fileUrl("thesisData", "Chapter 2 - Modeling SIT/fig_chapter2_thesis.ipynb"),
    },
    publication: { label: "Thèse de doctorat, 2025", href: "/publications/these-modelisation-technique-insecte-sterile" },
    methodology: { label: "Axe de recherche : technique de l'insecte stérile", href: "/recherche/technique-insecte-sterile" },
    figure: "Modèle pédagogique classique : il illustre un mécanisme, pas un résultat de recherche.",
  },
};

export function ModelExplorerSection({ initialTab }: { initialTab?: ExplorerTab }) {
  return <ModelExplorer content={CONTENT} initialTab={initialTab} />;
}
