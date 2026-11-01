import Link from "@/i18n/Link";
import { ArrowRight } from "lucide-react";
import { copy, type Lang } from "@/i18n/config";
import { getA11y, getLang } from "@/i18n/server";
import { PageHeader } from "@/components/editorial/PageHeader";
import { SectionHeading } from "@/components/editorial/SectionHeading";
import { CareerTimeline } from "@/components/timeline/CareerTimeline";
import { CommunicationList } from "@/components/interactions/CommunicationList";
import { RotatingPoster } from "@/components/communications/RotatingPoster";
import { MediaFigure } from "@/components/ui/MediaFigure";
import { NewTabHint } from "@/components/ui/NewTab";
import { SpeciesText } from "@/components/ui/Species";
import { SourceNote } from "@/components/scientific/SourceNote";
import { milestonesIn } from "@/data/milestones";
import { COMMUNICATIONS, getCommunicationIn } from "@/data/communications";
import { featureIn } from "@/data/features";
import { getMediaIn } from "@/data/media";
import { pageMetadata } from "@/lib/content/metadata";

export const generateMetadata = () =>
  pageMetadata({
    path: "/communications",
    fr: {
      title: "Communications",
      description:
        "Communications orales et posters de Marine A. Courtois en congrès (DSABNS, MMEE, JFSMA, SFE², SMAI…), référencés dans l'archive ouverte HAL.",
    },
    en: {
      title: "Talks",
      description: "Talks and posters given by Marine A. Courtois at conferences (DSABNS, MMEE, JFSMA, SFE², SMAI…), recorded in the HAL open archive.",
    },
  });

const COPY = copy({
  fr: {
    chapter: "Communications",
    kicker: "Congrès, posters, séminaires",
    title: "Présenter, discuter, confronter.",
    intro:
      "Exposer un modèle à des mathématiciens, des écologues ou des informaticiens demande chaque fois un autre récit. Toutes les interventions ci-dessous sont référencées dans HAL.",
    talks: "Communications orales",
    posters: "Posters",
    talksTitle: "Communications orales.",
    postersTitle: "Posters scientifiques.",
    hal: "Notice HAL",
    model: "Le modèle présenté",
  },
  en: {
    chapter: "Talks",
    kicker: "Conferences, posters, seminars",
    title: "Present, discuss, compare.",
    intro:
      "Presenting a model to mathematicians, ecologists or computer scientists calls for a different story each time. Every contribution below is recorded in HAL.",
    talks: "Talks",
    posters: "Posters",
    talksTitle: "Talks.",
    postersTitle: "Scientific posters.",
    hal: "HAL record",
    model: "The model presented",
  },
});

const talks = COMMUNICATIONS.filter((c) => c.type === "communication").length;

export default async function CommunicationsPage() {
  const lang = await getLang();
  const t = COPY[lang];
  const a11y = await getA11y();
  return (
    <>
      <PageHeader chapter={t.chapter} kicker={t.kicker} title={t.title} intro={t.intro} aside={<Counts t={t} />} />
      <section aria-label={a11y.frise} className="site-gutter mx-auto max-w-site py-16 md:py-20">
        <CareerTimeline milestones={milestonesIn(lang)} />
      </section>
      <PosterFeature lang={lang} />
      <section aria-labelledby="orales" className="site-gutter mx-auto max-w-site py-20">
        <SectionHeading title={<span id="orales">{t.talksTitle}</span>} size="title" className="mb-10" />
        <CommunicationList type="communication" />
      </section>
      <section aria-labelledby="posters" className="site-gutter mx-auto max-w-site pb-24">
        <SectionHeading title={<span id="posters">{t.postersTitle}</span>} size="title" className="mb-10" />
        <CommunicationList type="poster" />
        <SourceNote className="mt-6" ids={["hal", "orcid", "owner"]} />
      </section>
    </>
  );
}

function Counts({ t }: { t: (typeof COPY)["fr"] }) {
  return (
    <dl className="grid grid-cols-2 gap-4 border-t border-ink pt-4">
      <div>
        <dt className="text-sm text-muted">{t.talks}</dt>
        <dd className="font-serif text-4xl">{talks}</dd>
      </div>
      <div>
        <dt className="text-sm text-muted">{t.posters}</dt>
        <dd className="font-serif text-4xl">{COMMUNICATIONS.length - talks}</dd>
      </div>
    </dl>
  );
}

/** The JFSMA 2024 poster: a physical support with rotating parts. */
function PosterFeature({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  const feature = featureIn(lang, "poster-cargese");
  const comm = feature && getCommunicationIn(lang, feature.communicationId);
  if (!feature || !comm) return null;
  const media = feature.mediaIds.map((id) => getMediaIn(lang, id)).filter((m) => m !== undefined);
  return (
    <section id="poster-cargese" aria-labelledby="poster-titre" className="on-dark scroll-mt-24 bg-antibes text-paper">
      <div className="site-gutter mx-auto grid max-w-site gap-12 py-20 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <p className="text-sm text-accent-light">JFSMA 2024 · Cargèse</p>
          <h2 id="poster-titre" className="mt-3 font-serif text-headline">
            {feature.title}
          </h2>
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-paper/85">
            {feature.concept.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
          <p className="mt-6 font-serif text-xl italic" lang="fr">
            <SpeciesText text={comm.title} />
          </p>
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
            <a href={comm.url} target="_blank" rel="noopener noreferrer" className="link-underline inline-flex items-center gap-2 py-1">
              {t.hal} <NewTabHint />
            </a>
            <Link href="/projets/modele-individu-centre" className="link-underline inline-flex items-center gap-2 py-1">
              {t.model} <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </div>
        <div className="lg:col-span-5 lg:col-start-8">
          {media.length > 0 ? media.map((m) => <MediaFigure key={m.id} media={m} />) : <RotatingPoster />}
        </div>
      </div>
    </section>
  );
}
