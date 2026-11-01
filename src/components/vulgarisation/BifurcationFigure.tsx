import { BifurcationDiagram } from "@/components/vulgarisation/BifurcationDiagram";
import { copy, type Lang } from "@/i18n/config";

type Key = { mark: "solid" | "dashed" | "zero" | "critical" | "point"; text: string };

const COPY = copy({
  fr: {
    keys: [
      { mark: "solid", text: "Équilibre stable : la population se maintient à ce niveau." },
      { mark: "dashed", text: "Équilibre instable : il joue le rôle de seuil ; une population partie trop bas s'effondre." },
      { mark: "zero", text: "Équilibre nul : la population est éliminée." },
      { mark: "critical", text: "Sc, densité critique de mâles stériles : au-delà (zone grisée), seul l'équilibre nul subsiste." },
      { mark: "point", text: "Bifurcation nœud-col : les deux équilibres se rejoignent puis disparaissent." },
    ] as Key[],
    caption:
      "Redessiné d'après la figure du chapitre 2 de la thèse, avec les paramètres du notebook public (r = 6, p = 0,5, μF = μM = 0,5, β = 0,01). Seule la mise en forme change : axes et annotations en clair.",
    credit: "thesisData — Chapter 2 - Modeling SIT/fig_chapter2_thesis.ipynb",
  },
  en: {
    keys: [
      { mark: "solid", text: "Stable equilibrium: the population persists at this level." },
      { mark: "dashed", text: "Unstable equilibrium: it acts as a threshold; a population that starts too low collapses." },
      { mark: "zero", text: "Zero equilibrium: the population is eliminated." },
      { mark: "critical", text: "Sc, critical density of sterile males: beyond it (shaded area), only the zero equilibrium remains." },
      { mark: "point", text: "Saddle-node bifurcation: the two equilibria meet, then vanish." },
    ] as Key[],
    caption:
      "Redrawn from the chapter 2 figure of the thesis, with the parameters of the public notebook (r = 6, p = 0.5, μF = μM = 0.5, β = 0.01). Only the presentation changes: plain-language axes and annotations.",
    credit: "thesisData — Chapter 2 - Modeling SIT/fig_chapter2_thesis.ipynb",
  },
});

/** Legend swatch drawn like the matching mark of the diagram. */
function Swatch({ mark }: { mark: Key["mark"] }) {
  if (mark === "point") return <circle cx={13} cy={6} r={5} fill="#1d5a9e" />;
  const stroke = { solid: "#0f1d2e", dashed: "#2468b3", zero: "#0f1d2e", critical: "#1d5a9e" }[mark];
  const dash = { solid: undefined, dashed: "7 4", zero: undefined, critical: "2 3" }[mark];
  return <path d="M1,6H25" stroke={stroke} strokeWidth={mark === "critical" ? 1.5 : 3} strokeDasharray={dash} />;
}

/** The bifurcation diagram of outreach step 8, with a legend that says how to read each mark. */
export function BifurcationFigure({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  return (
    <figure className="max-w-3xl">
      <div className="border border-ink/15 bg-paper p-3 sm:p-5">
        <BifurcationDiagram lang={lang} />
      </div>
      <ul className="mt-4 grid gap-2 text-sm leading-snug text-ink/85 sm:grid-cols-2">
        {t.keys.map((k) => (
          <li key={k.mark} className="flex items-start gap-3">
            <svg width="26" height="12" className="mt-1 shrink-0" aria-hidden>
              <Swatch mark={k.mark} />
            </svg>
            {k.text}
          </li>
        ))}
      </ul>
      <figcaption className="mt-4 text-sm leading-snug text-ink/80">
        {t.caption}
        <span className="mt-1 block text-xs text-muted">{t.credit}</span>
      </figcaption>
    </figure>
  );
}
