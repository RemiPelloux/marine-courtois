import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/editorial/PageHeader";
import { SourceNote } from "@/components/scientific/SourceNote";
import { PUBLICATIONS, getPublication, PUBLICATION_TYPE_LABEL } from "@/data/publications";
import { getResearchTheme } from "@/data/research";
import { RESEARCHER } from "@/data/researcher";
import { PUBLICATION_DEPTH } from "@/data/publication-depth";
import { DepthSections } from "@/components/publication/DepthSections";
import { modulesFor } from "@/components/publication/PublicationModules";
import { PublicationAside } from "@/components/publication/PublicationAside";
import { CitationTools } from "@/components/publication/CitationTools";
import { formatReference, toBibtex, bibtexKey } from "@/lib/content/citation";

/** All known slugs are prerendered; unknown slugs render notFound(). */
export const instant = false;

export function generateStaticParams() {
  return PUBLICATIONS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/publications/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getPublication(slug);
  if (!p) return {};
  return {
    title: p.editorialTitle ?? p.title,
    description: p.summaryFr,
    alternates: { canonical: `/publications/${p.slug}` },
    openGraph: { type: "article", title: p.title, description: p.summaryFr, publishedTime: p.date, authors: p.authors },
  };
}

export default async function PublicationPage({ params }: PageProps<"/publications/[slug]">) {
  const { slug } = await params;
  const p = getPublication(slug);
  if (!p) notFound();
  const themes = p.researchSlugs.map(getResearchTheme).filter((t) => t !== undefined);
  const depth = PUBLICATION_DEPTH[p.id];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": p.publicationType === "these" ? "Thesis" : "ScholarlyArticle",
    headline: p.title,
    name: p.title,
    author: p.authors.map((name) => ({ "@type": "Person", name })),
    datePublished: p.date,
    ...(p.journal && p.publicationType === "article" ? { isPartOf: { "@type": "Periodical", name: p.journal } } : {}),
    ...(p.doi ? { sameAs: `https://doi.org/${p.doi}`, identifier: { "@type": "PropertyValue", propertyID: "DOI", value: p.doi } } : {}),
    url: `${RESEARCHER.siteUrl}/publications/${p.slug}`,
    inLanguage: p.publicationType === "these" ? "fr" : "en",
  };

  const links = [
    p.doi && { label: "Article — DOI", value: p.doi, url: `https://doi.org/${p.doi}` },
    p.pdfUrl && { label: p.publicationType === "these" ? "Manuscrit (PDF)" : "Texte intégral en accès ouvert", value: new URL(p.pdfUrl).hostname, url: p.pdfUrl },
    p.codeUrl && { label: "Code", value: p.codeUrl.replace("https://", "").split("/-/")[0], url: p.codeUrl },
    p.datasetUrl && { label: "Données", value: p.datasetUrl.replace("https://doi.org/", "doi:"), url: p.datasetUrl },
    ...p.extraLinks.map((l) => ({ label: l.label, value: new URL(l.url).hostname, url: l.url })),
  ].filter(Boolean) as { label: string; value: string; url: string }[];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHeader
        chapter={String(p.year)}
        morphName={`pub-${p.slug}`}
        kicker={`${PUBLICATION_TYPE_LABEL[p.publicationType]} · ${p.journal ?? ""}`}
        title={p.publicationType === "these" ? <span className="text-[0.72em] leading-[1.05]">{p.title}</span> : p.editorialTitle}
        intro={p.publicationType !== "these" ? <p className="font-serif text-2xl italic" lang="en">{p.title}</p> : undefined}
        aside={
          <Link href="/publications" className="link-underline inline-flex items-center gap-2 py-1.5 text-sm">
            <ArrowLeft className="size-4" aria-hidden /> Index des publications
          </Link>
        }
      />
      <article className="site-gutter mx-auto max-w-site py-16 md:py-20">
        <div className="grid gap-14 pb-16 lg:grid-cols-12">
          <div className="space-y-10 lg:col-span-7">
            <section>
              <h2 className="label mb-3 text-muted">En bref</h2>
              <p className="text-xl leading-relaxed">{p.summaryFr}</p>
            </section>
            <section className="border-l-2 border-accent pl-5">
              <h2 className="label mb-2 text-muted">Question</h2>
              <p className="font-serif text-2xl leading-snug">{p.questionFr}</p>
            </section>
            <section>
              <h2 className="label mb-2 text-muted">Approche</h2>
              <p className="text-lg leading-relaxed text-ink/85">{p.approachFr}</p>
            </section>
            {themes.length > 0 && (
              <section>
                <h2 className="label mb-3 text-muted">Axes de recherche</h2>
                <ul className="flex flex-wrap gap-2">
                  {themes.map((t) => (
                    <li key={t.slug}>
                      <Link href={`/recherche/${t.slug}`} className="inline-block bg-ink/[0.06] px-2.5 py-1 on-dark:bg-paper/10 text-sm hover:border-ink">
                        {t.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            <section aria-labelledby="citer">
              <h2 id="citer" className="label mb-3 text-muted">
                Citer
              </h2>
              <CitationTools reference={formatReference(p)} bibtex={toBibtex(p)} fileName={`${bibtexKey(p)}.bib`} />
            </section>
          </div>
          <PublicationAside p={p} links={links} />
        </div>
        {depth && <DepthSections depth={depth} modules={modulesFor(depth.module)} />}
        <SourceNote className="mt-16" ids={p.sources} />
      </article>
    </>
  );
}
