import { a11y } from "@/i18n";
import { PageHeader } from "@/components/editorial/PageHeader";
import { CareerTimeline } from "@/components/timeline/CareerTimeline";
import { CommunicationList } from "@/components/interactions/CommunicationList";
import { SourceNote } from "@/components/scientific/SourceNote";
import { MILESTONES } from "@/data/milestones";
import { COMMUNICATIONS } from "@/data/publications";
import { pageMetadata } from "@/lib/content/metadata";

export const metadata = pageMetadata({
  title: "Communication",
  description: "Communications orales et posters présentés en congrès (JFSMA, CJC-MA, SFE²…), référencés dans l'archive ouverte HAL.",
  path: "/communication",
});

const talks = COMMUNICATIONS.filter((c) => c.type === "communication").length;

export default function CommunicationPage() {
  return (
    <>
      <PageHeader
        chapter="Communication"
        kicker="Congrès, posters, séminaires"
        title="Présenter, discuter, confronter."
        intro="Exposer un modèle à des mathématiciens, des écologues ou des informaticiens demande à chaque fois un autre récit. Toutes les interventions ci-dessous sont référencées dans HAL."
        aside={
          <dl className="grid grid-cols-2 gap-4 border-t border-ink pt-4">
            <div>
              <dt className="label text-muted">Communications orales</dt>
              <dd className="font-serif text-4xl">{talks}</dd>
            </div>
            <div>
              <dt className="label text-muted">Posters</dt>
              <dd className="font-serif text-4xl">{COMMUNICATIONS.length - talks}</dd>
            </div>
          </dl>
        }
      />
      <section aria-label={a11y.frise} className="site-gutter mx-auto max-w-site py-16 md:py-20">
        <CareerTimeline milestones={MILESTONES} />
      </section>
      <section aria-label={a11y.listeDesCommunications} className="site-gutter mx-auto max-w-site pb-24">
        <CommunicationList />
        <SourceNote className="mt-6" ids={["hal", "orcid"]} />
      </section>
    </>
  );
}
