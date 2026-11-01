import { a11y } from "@/i18n";
import { PageHeader } from "@/components/editorial/PageHeader";
import { SectionHeading } from "@/components/editorial/SectionHeading";
import { SourceNote } from "@/components/scientific/SourceNote";
import { ResearchRail } from "@/components/interactions/ResearchRail";
import { AxisBlock } from "@/components/research/AxisBlock";
import { researchRailItems } from "@/data/research-rail";
import { RESEARCH_AXES } from "@/data/research-axes";
import { pageMetadata } from "@/lib/content/metadata";

export const metadata = pageMetadata({
  title: "Recherche",
  description:
    "Dynamique des populations et biocontrôle, comportements reproducteurs et modèles individu-centrés, invasions biologiques et interactions trophiques, questions émergentes.",
  path: "/recherche",
});

const TRIPTYCH = [
  { title: "Simuler", text: "Traduire un mécanisme biologique en équations ou en agents, puis le faire tourner." },
  { title: "Expérimenter les mécanismes", text: "Faire varier un paramètre, une règle de comportement, un scénario de lâcher, et observer ce qui change." },
  { title: "Interpréter", text: "Relier les résultats à la biologie, en dire les conditions de validité et les limites." },
];

export default function ResearchPage() {
  return (
    <>
      <PageHeader
        chapter="Recherche"
        kicker="Quatre axes"
        title="Étudier ce que l'on ne peut pas toujours observer directement."
        intro="Les mathématiques et la simulation permettent d'explorer des mécanismes difficiles à isoler expérimentalement : dynamiques de populations, comportements reproducteurs, interactions écologiques."
      />
      <section aria-label={a11y.demarcheDeRecherche} className="site-gutter mx-auto max-w-site py-16">
        <ol className="grid border-y border-ink md:grid-cols-3">
          {TRIPTYCH.map((t, i) => (
            <li key={t.title} className={i > 0 ? "border-t border-ink/25 py-8 md:border-t-0 md:border-l md:pl-8" : "py-8 md:pr-8"}>
              <h2 className="font-serif text-[2rem] leading-tight">{t.title}</h2>
              <p className="mt-3 text-ink/80">{t.text}</p>
            </li>
          ))}
        </ol>
      </section>
      <div className="site-gutter mx-auto max-w-site">
        {RESEARCH_AXES.map((axis) => (
          <AxisBlock key={axis.id} axis={axis} />
        ))}
      </div>
      <section aria-labelledby="themes" className="mt-10 border-t border-ink pt-20">
        <div className="site-gutter mx-auto max-w-site">
          <SectionHeading title={<span id="themes">Les six thèmes, en détail.</span>} size="title" className="mb-12" />
        </div>
        <ResearchRail items={researchRailItems()} headingLevel="h3" />
      </section>
      <section aria-label={a11y.sourcesDesAxes} className="site-gutter mx-auto max-w-site pb-24">
        <SourceNote className="mt-10" ids={["pubRF", "pubPolyandry", "pubInvasion", "gitThesis", "thesesFr", "hal"]} />
      </section>
    </>
  );
}
