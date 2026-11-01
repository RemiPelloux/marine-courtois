import { a11y } from "@/i18n";
import { PageHeader } from "@/components/editorial/PageHeader";
import { PublicationIndex } from "@/components/interactions/PublicationIndex";
import { SectionHeading } from "@/components/editorial/SectionHeading";
import { SourceNote } from "@/components/scientific/SourceNote";
import { PUBLICATIONS, COMMUNICATIONS } from "@/data/publications";
import { formatDateFr } from "@/lib/utils/format";
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
        <PublicationIndex publications={PUBLICATIONS} />
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
          <ol className="mt-12 divide-y divide-ink/15 border-y border-ink">
            {COMMUNICATIONS.map((c) => (
              <li key={c.id} className="grid gap-2 py-5 md:grid-cols-12 md:gap-6">
                <p className="mono-meta text-muted md:col-span-2">{formatDateFr(c.date)}</p>
                <div className="md:col-span-7">
                  <a href={c.url} target="_blank" rel="noopener noreferrer" className="font-serif text-xl leading-snug hover:text-vermilion-deep" lang={/[éèàç]/.test(c.title) ? "fr" : "en"}>
                    {c.title} <span className="sr-only">(nouvel onglet)</span>
                  </a>
                  <p className="mt-1 text-sm text-muted">{c.authors.join(", ")}</p>
                </div>
                <div className="text-sm md:col-span-3">
                  <p className="label text-vermilion-deep">{c.type === "poster" ? "Poster" : "Communication"}</p>
                  <p className="mt-1 text-ink/80">{c.event}</p>
                  <p className="text-muted">{c.place}</p>
                </div>
              </li>
            ))}
          </ol>
          <SourceNote className="mt-6" ids={["hal", "orcid"]} />
        </div>
      </section>
    </>
  );
}
