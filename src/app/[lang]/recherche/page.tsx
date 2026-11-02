import { PageHeader } from "@/components/editorial/PageHeader";
import { SectionHeading } from "@/components/editorial/SectionHeading";
import { ResearchRail } from "@/components/interactions/ResearchRail";
import { AxisBlock } from "@/components/research/AxisBlock";
import { researchRailItems } from "@/data/research-rail";
import { researchAxesIn } from "@/data/research-axes";
import { copy } from "@/i18n/config";
import { getA11y, getLang } from "@/i18n/server";
import { pageMetadata } from "@/lib/content/metadata";

export const generateMetadata = () =>
  pageMetadata({
    path: "/recherche",
    fr: {
      title: "Recherche",
      description:
        "Trois axes : dynamique des populations et biocontrôle (la thèse), caractère invasif d'une espèce et réponse fonctionnelle, intégration de données multiomiques pour étudier les réponses des plantes aux stress multiples.",
    },
    en: {
      title: "Research",
      description:
        "Three areas: population dynamics and biocontrol (the thesis), the invasiveness of a species and its functional response, and multi-omics data integration to study plant responses to multiple stresses.",
    },
  });

const COPY = copy({
  fr: {
    chapter: "Recherche",
    kicker: "Trois axes",
    title: "Étudier ce que l'on ne peut pas toujours observer directement.",
    intro:
      "Les mathématiques, la statistique et l'apprentissage automatique permettent d'explorer des mécanismes difficiles à isoler expérimentalement : dynamique des populations, invasions biologiques, réponses des plantes aux stress.",
    figures: "Les travaux en figures.",
    figuresIntro: "Chaque figure illustre une partie des axes A et B, avec la source dont elle provient : chapitre de thèse ou article.",
    triptych: [
      { title: "Simuler", text: "Traduire un mécanisme biologique en équations ou en agents, puis le faire tourner." },
      { title: "Expérimenter les mécanismes", text: "Faire varier un paramètre, une règle de comportement, un scénario de lâcher, et observer ce qui change." },
      { title: "Interpréter", text: "Relier les résultats à la biologie, en dire les conditions de validité et les limites." },
    ],
  },
  en: {
    chapter: "Research",
    kicker: "Three areas",
    title: "Studying what cannot always be observed directly.",
    intro:
      "Mathematics, statistics and machine learning make it possible to explore mechanisms that are hard to isolate in experiments: population dynamics, biological invasions, plant responses to stress.",
    figures: "The work in figures.",
    figuresIntro: "Each figure illustrates part of areas A and B, with the source it comes from: a thesis chapter or an article.",
    triptych: [
      { title: "Simulate", text: "Turn a biological mechanism into equations or agents, then run it." },
      { title: "Test the mechanisms", text: "Vary a parameter, a behavioural rule or a release scenario, and watch what changes." },
      { title: "Interpret", text: "Relate the results back to biology, and state their conditions of validity and their limits." },
    ],
  },
});

export default async function ResearchPage() {
  const lang = await getLang();
  const t = COPY[lang];
  const a11y = await getA11y();
  return (
    <>
      <PageHeader chapter={t.chapter} kicker={t.kicker} title={t.title} intro={t.intro} />
      <section aria-label={a11y.demarcheDeRecherche} className="site-gutter mx-auto max-w-site py-16">
        <ol className="grid border-y border-ink md:grid-cols-3">
          {t.triptych.map((step, i) => (
            <li key={step.title} className={i > 0 ? "border-t border-ink/25 py-8 md:border-t-0 md:border-l md:pl-8" : "py-8 md:pr-8"}>
              <h2 className="font-serif text-subhead leading-tight">{step.title}</h2>
              <p className="mt-3 text-ink/80">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>
      <div className="site-gutter mx-auto max-w-site">
        {researchAxesIn(lang).map((axis) => (
          <AxisBlock key={axis.id} axis={axis} />
        ))}
      </div>
      <section aria-labelledby="figures" className="mt-10 border-t border-ink pt-20 pb-24">
        <div className="site-gutter mx-auto max-w-site">
          <SectionHeading title={<span id="figures">{t.figures}</span>} intro={t.figuresIntro} size="title" className="mb-12" />
        </div>
        <ResearchRail items={researchRailItems(lang)} headingLevel="h3" />
      </section>
    </>
  );
}
