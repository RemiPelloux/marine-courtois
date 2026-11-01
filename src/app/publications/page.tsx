import { a11y } from "@/i18n";
import { HoverPreview } from "@/components/interactions/HoverPreview";
import { publicationPreviews } from "@/data/research-rail";
import { PageHeader } from "@/components/editorial/PageHeader";
import { PublicationIndex } from "@/components/interactions/PublicationIndex";
import { SectionHeading } from "@/components/editorial/SectionHeading";
import { SourceNote } from "@/components/scientific/SourceNote";
import { PUBLICATIONS, COMMUNICATIONS } from "@/data/publications";
import { CommunicationList } from "@/components/interactions/CommunicationList";
import { pageMetadata } from "@/lib/content/metadata";

export const metadata = pageMetadata({
  title: "Publications",
  description: "Articles dans Bulletin of Mathematical Biology, PLOS Computational Biology et Journal of Animal Ecology, thèse de doctorat et communications scientifiques.",
  path: "/publications",
});

export default function PublicationsPage() {
  return (
    <>
      <PageHeader
        chapter="03"
        kicker="Contributions scientifiques"
        title={
          <>
            Des questions. Des modèles. Des résultats.
          </>
        }
        intro="Mes travaux explorent différents aspects des interactions biologiques, de la dynamique des populations et de l'écologie, en mobilisant des approches mathématiques et computationnelles."
        aside={
          <dl className="grid grid-cols-2 gap-4 border-t border-ink pt-4">
            <div>
              <dt className="label text-muted">Articles</dt>
              <dd className="font-serif text-4xl">{PUBLICATIONS.filter((p) => p.publicationType === "article").length}</dd>
            </div>
            <div>
              <dt className="label text-muted">Communications</dt>
              <dd className="font-serif text-4xl">{COMMUNICATIONS.length}</dd>
            </div>
          </dl>
        }
      />
      <section aria-label={a11y.indexDesPublications} className="site-gutter mx-auto max-w-site py-16 md:py-20">
        <HoverPreview previews={publicationPreviews(PUBLICATIONS)}>
          <PublicationIndex publications={PUBLICATIONS} headingLevel="h2" />
        </HoverPreview>
        <SourceNote className="mt-8" ids={["orcid", "pubRF", "pubPolyandry", "pubInvasion", "thesesFr"]} label="Métadonnées vérifiées" />
      </section>
      <section aria-labelledby="comms" className="border-t border-ink bg-stone">
        <div className="site-gutter mx-auto max-w-site py-20">
          <SectionHeading
            kicker="Communications & posters"
            title={<span id="comms">Présenter, discuter, confronter.</span>}
            intro="Communications orales et posters présentés lors de congrès, référencés dans l'archive ouverte HAL."
            size="title"
          />
          <div className="mt-12">
            <CommunicationList />
          </div>
          <SourceNote className="mt-6" ids={["hal", "orcid"]} />
        </div>
      </section>
    </>
  );
}
