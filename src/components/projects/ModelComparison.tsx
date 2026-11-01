import Link from "@/i18n/Link";
import { copy } from "@/i18n/config";
import { getLang } from "@/i18n/server";

type Row = { label: string; ode: string; ibm: string };

const COPY = copy({
  fr: {
    caption: "Les deux approches de modélisation, point par point",
    aspect: "Aspect",
    ode: "Équations différentielles",
    ibm: "Individu-centré",
    rows: [
      {
        label: "Ce que le modèle suit",
        ode: "Des effectifs moyens par compartiment : mâles stériles, femelles, mâles sauvages, larves",
        ibm: "Chaque insecte : durée de vie, accouplements, contenu de la spermathèque, ponte",
      },
      { label: "Hasard", ode: "Aucun : une trajectoire par jeu de paramètres", ibm: "Tirages aléatoires ; 100 répétitions par scénario" },
      {
        label: "Règles d'utilisation du sperme",
        ode: "Deux : premier ou dernier mâle",
        ibm: "Cinq : premier, dernier, mélange, choix, préférence",
      },
      {
        label: "Ce qu'on en tire",
        ode: "Équilibres, stabilité, seuils d'élimination",
        ibm: "Distributions de trajectoires, réduction de l'aire sous la courbe",
      },
      { label: "Outils", ode: "SciPy, SymPy, python-control", ibm: "Mesa, NumPy, pandas, seaborn" },
      { label: "Code publié", ode: "thesisData (chapitres 2 à 5)", ibm: "sit_remating_abm" },
    ] satisfies Row[],
  },
  en: {
    caption: "The two modelling approaches, point by point",
    aspect: "Aspect",
    ode: "Differential equations",
    ibm: "Individual-based",
    rows: [
      {
        label: "What the model follows",
        ode: "Average numbers per compartment: sterile males, females, wild males, larvae",
        ibm: "Each insect: lifespan, matings, spermatheca content, egg laying",
      },
      { label: "Chance", ode: "None: one trajectory per parameter set", ibm: "Random draws; 100 repetitions per scenario" },
      { label: "Sperm-use rules", ode: "Two: first or last male", ibm: "Five: first, last, mixed, choice, preference" },
      {
        label: "What it yields",
        ode: "Equilibria, stability, elimination thresholds",
        ibm: "Distributions of trajectories, reduction of the area under the curve",
      },
      { label: "Tools", ode: "SciPy, SymPy, python-control", ibm: "Mesa, NumPy, pandas, seaborn" },
      { label: "Published code", ode: "thesisData (chapters 2 to 5)", ibm: "sit_remating_abm" },
    ],
  },
});

/** Side-by-side reading of the equation model and the individual-based model of the same question. */
export async function ModelComparison() {
  const t = COPY[await getLang()];
  return (
    <div>
      <h3 id="comparaison-modeles" className="pb-4 font-serif text-2xl text-balance">
        {t.caption}
      </h3>
      <div className="overflow-x-auto" role="region" aria-labelledby="comparaison-modeles" tabIndex={0}>
        <table className="border-ink w-full min-w-[40rem] border-y text-left text-sm">
          <thead>
            <tr className="border-ink border-b">
              <th scope="col" className="text-muted w-[22%] py-3 pr-4 font-medium">
                {t.aspect}
              </th>
              <th scope="col" className="py-3 pr-4 font-serif text-lg font-normal">
                <Link href="/projets/modele-equations-differentielles" className="link-underline">
                  {t.ode}
                </Link>
              </th>
              <th scope="col" className="py-3 font-serif text-lg font-normal">
                <Link href="/projets/modele-individu-centre" className="link-underline">
                  {t.ibm}
                </Link>
              </th>
            </tr>
          </thead>
          <tbody className="divide-rule divide-y">
            {t.rows.map((r) => (
              <tr key={r.label}>
                <th scope="row" className="text-ink/70 py-3 pr-4 align-top font-medium">
                  {r.label}
                </th>
                <td className="text-ink/85 py-3 pr-4 align-top">{r.ode}</td>
                <td className="text-ink/85 py-3 align-top">{r.ibm}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
