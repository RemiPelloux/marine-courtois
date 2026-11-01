import { a11y } from "@/i18n";
import type { ReactNode } from "react";
import { SectionHeading } from "@/components/editorial/SectionHeading";
import { Reveal } from "@/components/editorial/Reveal";
import { Kicker } from "@/components/ui/Kicker";
import { AgentSimulator } from "@/components/visualizations/AgentSimulator";
import { BifurcationVisual, ScenarioComparisonVisual } from "@/components/visualizations/MethodVisuals";
import { ModelExplorerSection } from "@/components/scientific/ModelExplorerSection";
import { METHOD_PANELS } from "@/data/skills";

/* ---------------- Chapter 02 — methods ---------------- */

const CAPTIONS = [
  "Branches d'équilibre d'un modèle avec compétition (chapitre 2 de la thèse) : au-delà de S_c, seul l'équilibre nul subsiste.",
  "Démonstrateur individu-centré adapté du modèle Mesa : chaque point est une femelle, colorée selon le contenu de sa spermathèque.",
  "Expérience numérique sur le modèle de fertilité résiduelle : densité de femelles après 300 jours selon σ, pour trois valeurs de δ.",
];

const EXPLORER_STEPS = [
  { t: "Observer", s: "le mécanisme", d: "Les hypothèses et les équations du modèle, telles qu'écrites dans le code publié." },
  { t: "Explorer", s: "les paramètres", d: "Modifiez l'intensité des lâchers ou la biologie : les trajectoires sont recalculées en direct." },
  { t: "Comprendre", s: "les résultats", d: "Une lecture de la courbe, puis la publication, le DOI, le code et la méthodologie." },
];

export function MethodsChapter({ withExplorer = true }: { withExplorer?: boolean }) {
  return (
    <section id="methodes" aria-labelledby="methodes-titre" className="on-dark scroll-mt-20 bg-antibes text-paper">
      <div className="site-gutter mx-auto max-w-site py-24 md:py-32">
        <SectionHeading
          kicker="De la question au modèle"
          title={
            <span id="methodes-titre">
              Transformer une question biologique en système étudiable.
            </span>
          }
          intro="Une question de recherche devient un ensemble d'hypothèses, de variables et de mécanismes. Les mathématiques et la simulation permettent ensuite d'explorer les conséquences de ces choix."
        />
        <MethodPanels />

        {withExplorer && <ModelExplorerIntro />}
      </div>
    </section>
  );
}

function MethodPanels() {
  const visuals = [
    <BifurcationVisual key="a" className="h-auto w-full text-paper" />,
    <AgentSimulator key="b" compact dark />,
    <ScenarioComparisonVisual key="c" className="h-auto w-full text-paper" />,
  ];
  return (
    <div className="mt-16 grid divide-y divide-paper/15 border-y border-paper/15 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
      {METHOD_PANELS.map((p, i) => (
        <Reveal key={p.title} delay={i * 0.08} as="article" className="flex flex-col py-8 lg:px-8">
          <MethodPanelBody panel={p} visual={visuals[i]} caption={CAPTIONS[i]} />
        </Reveal>
      ))}
    </div>
  );
}

type MethodPanelBodyProps = { panel: (typeof METHOD_PANELS)[number]; visual: ReactNode; caption: string };

function MethodPanelBody({ panel: p, visual, caption }: MethodPanelBodyProps) {
  return (
    <>
      <h3 className="font-serif text-[2.1rem] leading-none">
        <span className="mr-2 tabular-nums text-sm align-middle text-accent-light">{p.index}.</span>
        {p.title}
      </h3>
      <p className="mt-4 text-[0.95rem] leading-relaxed text-paper/80">{p.description}</p>
      <figure className="mt-8 flex-1">
        <div className="min-h-48">{visual}</div>
        <figcaption className="mono-meta mt-3 text-xs leading-relaxed text-mist">{caption}</figcaption>
      </figure>
      <ul className="mt-6 flex flex-wrap gap-2 border-t border-paper/15 pt-5">
        {p.capabilities.map((c) => (
          <li key={c} className="bg-ink/[0.06] px-2.5 py-1 on-dark:bg-paper/10 text-xs text-paper/85">
            {c}
          </li>
        ))}
      </ul>
    </>
  );
}

function ModelExplorerIntro() {
  return (
    <div id="model-explorer" className="mt-28 scroll-mt-24">
      <div className="mb-10 grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Kicker accent="Model Explorer">A Research Playground</Kicker>
          <h3 className="mt-5 font-serif text-headline">
            Expérimenter les mécanismes.
          </h3>
        </div>
        <p className="max-w-xl self-end text-paper/85 lg:col-span-5">
          Plutôt que de lire qu&apos;une méthode est maîtrisée, expérimentez-la. Chaque module part du modèle publié, transcrit
          depuis les notebooks de la thèse, et mène à la publication, au DOI et au code d&apos;origine.
        </p>
      </div>
      <ExplorerSteps />

      <ModelExplorerSection />
    </div>
  );
}

function ExplorerSteps() {
  return (
    <ol className="mb-14 grid gap-px bg-paper/10 md:grid-cols-3" aria-label={a11y.parcoursDuModelExplorer}>
      {EXPLORER_STEPS.map((step) => (
        <li key={step.t} className="bg-antibes p-6">
          <p className="font-serif text-3xl">
            {step.t} <span className="font-sans text-sm text-paper/60">{step.s}</span>
          </p>
          <p className="mt-2 text-sm leading-relaxed text-paper/80">{step.d}</p>
        </li>
      ))}
    </ol>
  );
}
