import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { a11y } from "@/i18n";
import { PageHeader } from "@/components/editorial/PageHeader";
import { SectionHeading } from "@/components/editorial/SectionHeading";
import { CareerTimeline } from "@/components/timeline/CareerTimeline";
import { CommunicationList } from "@/components/interactions/CommunicationList";
import { RotatingPoster } from "@/components/communications/RotatingPoster";
import { MediaFigure } from "@/components/ui/MediaFigure";
import { SourceNote } from "@/components/scientific/SourceNote";
import { MILESTONES } from "@/data/milestones";
import { COMMUNICATIONS, getCommunication } from "@/data/communications";
import { getFeature } from "@/data/features";
import { getMedia } from "@/data/media";
import { pageMetadata } from "@/lib/content/metadata";

export const metadata = pageMetadata({
  title: "Communications",
  description: "Communications orales et posters de Marine A. Courtois en congrès (DSABNS, MMEE, JFSMA, SFE², SMAI…), référencés dans l'archive ouverte HAL.",
  path: "/communications",
});

const talks = COMMUNICATIONS.filter((c) => c.type === "communication").length;

export default function CommunicationsPage() {
  return (
    <>
      <PageHeader
        chapter="Communications"
        kicker="Congrès, posters, séminaires"
        title="Présenter, discuter, confronter."
        intro="Exposer un modèle à des mathématiciens, des écologues ou des informaticiens demande chaque fois un autre récit. Toutes les interventions ci-dessous sont référencées dans HAL."
        aside={
          <dl className="grid grid-cols-2 gap-4 border-t border-ink pt-4">
            <div>
              <dt className="text-sm text-muted">Communications orales</dt>
              <dd className="font-serif text-4xl">{talks}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted">Posters</dt>
              <dd className="font-serif text-4xl">{COMMUNICATIONS.length - talks}</dd>
            </div>
          </dl>
        }
      />
      <section aria-label={a11y.frise} className="site-gutter mx-auto max-w-site py-16 md:py-20">
        <CareerTimeline milestones={MILESTONES} />
      </section>
      <PosterFeature />
      <section aria-labelledby="orales" className="site-gutter mx-auto max-w-site py-20">
        <SectionHeading title={<span id="orales">Communications orales.</span>} size="title" className="mb-10" />
        <CommunicationList type="communication" />
      </section>
      <section aria-labelledby="posters" className="site-gutter mx-auto max-w-site pb-24">
        <SectionHeading title={<span id="posters">Posters scientifiques.</span>} size="title" className="mb-10" />
        <CommunicationList type="poster" />
        <SourceNote className="mt-6" ids={["hal", "orcid", "owner"]} />
      </section>
    </>
  );
}

/** The JFSMA 2024 poster: a physical support with rotating parts. */
function PosterFeature() {
  const feature = getFeature("poster-cargese");
  const comm = feature && getCommunication(feature.communicationId);
  if (!feature || !comm) return null;
  const media = feature.mediaIds.map(getMedia).filter((m) => m !== undefined);
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
            {comm.title}
          </p>
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
            <a href={comm.url} target="_blank" rel="noopener noreferrer" className="link-underline inline-flex items-center gap-2 py-1">
              Notice HAL <span className="sr-only">(nouvel onglet)</span>
            </a>
            <Link href="/projets/modele-individu-centre" className="link-underline inline-flex items-center gap-2 py-1">
              Le modèle présenté <ArrowRight className="size-4" aria-hidden />
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
