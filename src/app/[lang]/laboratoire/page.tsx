import type { ReactNode } from "react";
import { PageHeader } from "@/components/editorial/PageHeader";
import { SectionHeading } from "@/components/editorial/SectionHeading";
import { ModelExplorerSection } from "@/components/scientific/ModelExplorerSection";
import { CodeChapter } from "@/components/editorial/Chapters";
import { SITSequence } from "@/components/visualizations/SITSequence";
import { ImpulsiveReleases } from "@/components/visualizations/ImpulsiveReleases";
import { AgentSimulator } from "@/components/visualizations/AgentSimulator";
import { SourceNote } from "@/components/scientific/SourceNote";
import { TextLink } from "@/components/ui/Links";
import { fileUrl } from "@/data/code";
import { pageMetadata } from "@/lib/content/metadata";
import { copy, type Lang } from "@/i18n/config";
import { getLang } from "@/i18n/server";

export const generateMetadata = () =>
  pageMetadata({
    path: "/laboratoire",
    fr: {
      title: "Laboratoire",
      description:
        "Démonstrateurs interactifs : modèles de fertilité résiduelle et d'accouplements multiples transcrits des notebooks publics, principe de la TIS, lâchers impulsionnels, modèle individu-centré et explorateur de code.",
    },
    en: {
      title: "Lab",
      description:
        "Interactive demonstrators: residual-fertility and multiple-mating models transcribed from the public notebooks, the principle of the SIT, impulsive releases, an individual-based model and a code explorer.",
    },
  });

const COPY = copy({
  fr: {
    chapter: "Laboratoire",
    kicker: "Démonstrateurs interactifs",
    title: "Explorer les modèles. Comprendre les mécanismes.",
    intro:
      "Chaque module indique clairement sa nature : modèle publié transcrit depuis le code public, démonstrateur simplifié ou schéma pédagogique. Aucun ne remplace les analyses publiées.",
    nav: ["01 — Dynamique des populations", "02 — Lâchers d'insectes stériles", "03 — Modélisation individu-centrée", "04 — Code & reproductibilité"],
    m1: "Comparer des trajectoires sous différentes hypothèses.",
    m1Intro:
      "Trois modèles, trois échelles de lecture. Les deux premiers sont les systèmes publiés, transcrits depuis les notebooks ; le troisième est le modèle discret pédagogique du chapitre 2.",
    m2: "Du principe à la trajectoire, en cinq étapes.",
    m2Intro:
      "Un lâcher de mâles stériles ne conduit pas automatiquement à la suppression d'une population : la compétition, la fertilité résiduelle et le ré-accouplement peuvent en modifier l'issue.",
    impulsive: "Lâcher souvent, ou lâcher beaucoup ? Lâchers impulsionnels.",
    m3: "Des individus à la population.",
    m3Intro:
      "Un modèle de population décrit des effectifs agrégés par des équations. Un modèle individu-centré simule chaque insecte (sa durée de vie, ses accouplements, sa ponte) et la dynamique de la population émerge de ces règles.",
    method: "Note méthodologique",
    simplifications: "Simplifications",
  },
  en: {
    chapter: "Lab",
    kicker: "Interactive demonstrators",
    title: "Explore the models. Understand the mechanisms.",
    intro:
      "Each module states what it is: a published model transcribed from the public code, a simplified demonstrator or a teaching diagram. None replaces the published analyses.",
    nav: ["01 — Population dynamics", "02 — Sterile insect releases", "03 — Individual-based modelling", "04 — Code & reproducibility"],
    m1: "Compare trajectories under different assumptions.",
    m1Intro:
      "Three models, three scales of reading. The first two are the published systems, transcribed from the notebooks; the third is the discrete teaching model of chapter 2.",
    m2: "From principle to trajectory, in five steps.",
    m2Intro:
      "Releasing sterile males does not automatically suppress a population: competition, residual fertility and remating can change the outcome.",
    impulsive: "Release often, or release a lot? Impulsive releases.",
    m3: "From individuals to the population.",
    m3Intro:
      "A population model describes aggregated numbers through equations. An individual-based model simulates each insect (its lifespan, its matings, its egg laying) and the population dynamics emerge from these rules.",
    method: "Methodological note",
    simplifications: "Simplifications",
  },
});

const ANCHORS = ["#module-1", "#module-2", "#module-3", "#code"];

export default async function LabPage() {
  const lang = await getLang();
  const t = COPY[lang];
  return (
    <>
      <PageHeader
        dark
        chapter={t.chapter}
        kicker={t.kicker}
        title={t.title}
        intro={t.intro}
        aside={
          <ol className="label space-y-2 text-mist">
            {t.nav.map((label, i) => (
              <li key={ANCHORS[i]}>
                <a href={ANCHORS[i]} className="inline-block py-1 hover:text-paper">
                  {label}
                </a>
              </li>
            ))}
          </ol>
        }
      />

      <section id="module-1" aria-labelledby="m1" className="on-dark scroll-mt-20 bg-antibes text-paper">
        <div id="model-explorer" className="site-gutter mx-auto max-w-site scroll-mt-24 pb-24">
          <SectionHeading title={<span id="m1">{t.m1}</span>} intro={t.m1Intro} size="title" className="mb-12 pt-16" />
          <ModelExplorerSection onDark />
        </div>
      </section>

      <section id="module-2" aria-labelledby="m2" className="site-gutter mx-auto max-w-site scroll-mt-20 py-24 md:py-28">
        <SectionHeading title={<span id="m2">{t.m2}</span>} intro={t.m2Intro} size="title" className="mb-12" />
        <SITSequence />
        <div className="mt-24 border-t border-ink pt-12">
          <h3 className="mb-8 font-serif text-title">{t.impulsive}</h3>
          <ImpulsiveReleases />
        </div>
      </section>

      <section id="module-3" aria-labelledby="m3" className="scroll-mt-20 border-y border-ink bg-stone">
        <div className="site-gutter mx-auto max-w-site py-24 md:py-28">
          <SectionHeading title={<span id="m3">{t.m3}</span>} intro={t.m3Intro} size="title" className="mb-12" />
          <AgentSimulator />
          <AbmNotes lang={lang} />
          <SourceNote className="mt-8" ids={["gitAbm", "pubPolyandry"]} />
        </div>
      </section>

      <CodeChapter />
    </>
  );
}

/** What the demonstrator keeps from the Mesa model, and what it leaves out. */
/** The two notes under the agent simulator; the method note embeds the script link. */
const ABM_NOTES: Record<Lang, { method: (script: ReactNode) => ReactNode; simplifications: string }> = {
  fr: {
    method: (script) => (
      <>
        Adaptation simplifiée en JavaScript du modèle Mesa de {script}. Sont conservés : durées de vie (mâles stériles 1–36 j, sauvages
        31–129 j, femelles 21–144 j), mortalité larvaire par stade, émergence après 6–11 j, sex-ratio 0,5, probabilité d&apos;accouplement
        avec un mâle sauvage W/(W + ηS) avec η = 0,59, périodes réfractaires, ponte de Poisson (6 œufs/j), capacité de charge larvaire et
        règles « first », « last », « mixed ».
      </>
    ),
    simplifications:
      "Effectifs réduits d'un facteur 50, lâchers quotidiens, pas de récolte, règles « choice » et « preference » non incluses, une seule réplique affichée. Il s'agit d'un démonstrateur : ses sorties ne sont pas comparables aux résultats de l'article, obtenus avec 100 répétitions par scénario.",
  },
  en: {
    method: (script) => (
      <>
        Simplified JavaScript adaptation of the Mesa model in {script}. Kept: lifespans (sterile males 1–36 days, wild males 31–129 days,
        females 21–144 days), larval mortality by stage, emergence after 6–11 days, sex ratio 0.5, probability of mating with a wild male
        W/(W + ηS) with η = 0.59, refractory periods, Poisson egg laying (6 eggs/day), larval carrying capacity and the “first”, “last”
        and “mixed” rules.
      </>
    ),
    simplifications:
      "Numbers scaled down by a factor of 50, daily releases, no harvest, “choice” and “preference” rules not included, a single replicate shown. This is a demonstrator: its outputs are not comparable with the article's results, obtained with 100 repetitions per scenario.",
  },
};

function AbmNotes({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  const script = <TextLink href={fileUrl("sit_remating_abm", "script_ABM_batchrun.py")}>script_ABM_batchrun.py</TextLink>;
  return (
    <div className="mt-12 grid gap-8 border-t border-ink pt-8 md:grid-cols-2">
      <div className="text-sm leading-relaxed">
        <p className="label mb-2 text-muted">{t.method}</p>
        <p>{ABM_NOTES[lang].method(script)}</p>
      </div>
      <div className="text-sm leading-relaxed">
        <p className="label mb-2 text-muted">{t.simplifications}</p>
        <p>{ABM_NOTES[lang].simplifications}</p>
      </div>
    </div>
  );
}
