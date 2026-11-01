import { a11y } from "@/i18n";
import { HoverPreview } from "@/components/interactions/HoverPreview";
import { publicationPreviews } from "@/data/research-rail";
import { PageHeader } from "@/components/editorial/PageHeader";
import { PublicationIndex } from "@/components/interactions/PublicationIndex";
import { ButtonLink } from "@/components/ui/Links";
import { SourceNote } from "@/components/scientific/SourceNote";
import { PUBLICATIONS, COMMUNICATIONS } from "@/data/publications";
import { ExportBibtex } from "@/components/publication/ExportBibtex";
import { toBibtex } from "@/lib/content/citation";
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
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <SourceNote ids={["orcid", "pubRF", "pubPolyandry", "pubInvasion", "thesesFr"]} label="Métadonnées vérifiées" />
          <ExportBibtex bibtex={PUBLICATIONS.map(toBibtex).join("\n\n")} />
        </div>
      </section>
      <section aria-labelledby="comms" className="border-t border-ink bg-stone">
        <div className="site-gutter mx-auto flex max-w-site flex-wrap items-end justify-between gap-6 py-16">
          <div>
            <h2 id="comms" className="font-serif text-title">
              Communications et posters
            </h2>
            <p className="mt-3 max-w-2xl text-ink/80">
              Présentés en congrès et référencés dans HAL, ils ont leur propre page, distincte des publications évaluées.
            </p>
          </div>
          <ButtonLink href="/communications" variant="secondary">
            {`Les ${COMMUNICATIONS.length} communications`}
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
