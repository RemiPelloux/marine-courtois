import Link from "@/i18n/Link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/editorial/PageHeader";
import { SourceNote } from "@/components/scientific/SourceNote";
import { SpeciesText } from "@/components/ui/Species";
import { PUBLICATIONS, getPublicationIn, PUBLICATION_TYPE_LABEL } from "@/data/publications";
import { researchAxesIn } from "@/data/research-axes";
import { RESEARCHER } from "@/data/researcher";
import { publicationDepthIn } from "@/data/publication-depth";
import { DepthSections } from "@/components/publication/DepthSections";
import { modulesFor } from "@/components/publication/PublicationModules";
import { PublicationAside } from "@/components/publication/PublicationAside";
import { CitationTools } from "@/components/publication/CitationTools";
import { formatReference, toBibtex, bibtexKey } from "@/lib/content/citation";
import { copy, OG_LOCALE, type Lang } from "@/i18n/config";
import { localePath } from "@/i18n/paths";
import { getLang } from "@/i18n/server";
import { languageAlternates } from "@/lib/content/metadata";
import type { Publication } from "@/types/content";

/** All known slugs are prerendered; unknown slugs render notFound(). */
export const instant = false;

export function generateStaticParams() {
  return PUBLICATIONS.map((p) => ({ slug: p.slug }));
}

const COPY = copy({
  fr: {
    back: "Index des publications",
    brief: "En bref",
    question: "Question",
    approach: "Approche",
    axes: "Axe de recherche",
    cite: "Citer",
    doi: "Article — DOI",
    pdf: (thesis: boolean): string => (thesis ? "Manuscrit (PDF)" : "Texte intégral en accès ouvert"),
    code: "Code",
    data: "Données",
  },
  en: {
    back: "Publication index",
    brief: "In brief",
    question: "Question",
    approach: "Approach",
    axes: "Research area",
    cite: "Cite",
    doi: "Article — DOI",
    pdf: (thesis: boolean): string => (thesis ? "Manuscript (PDF)" : "Open-access full text"),
    code: "Code",
    data: "Data",
  },
});

export async function generateMetadata({ params }: PageProps<"/[lang]/publications/[slug]">): Promise<Metadata> {
  const [{ slug }, lang] = await Promise.all([params, getLang()]);
  const p = getPublicationIn(lang, slug);
  if (!p) return {};
  const title = p.editorialTitle ?? p.title;
  return {
    title,
    description: p.summary,
    alternates: languageAlternates(lang, `/publications/${p.slug}`),
    openGraph: { type: "article", title, description: p.summary, publishedTime: p.date, authors: p.authors, locale: OG_LOCALE[lang] },
  };
}

/** Schema.org record; `inLanguage` is the language the work is written in, not the page's. */
function jsonLd(p: Publication, lang: Lang) {
  return {
    "@context": "https://schema.org",
    "@type": p.publicationType === "these" ? "Thesis" : "ScholarlyArticle",
    headline: p.title,
    name: p.title,
    description: p.summary,
    author: p.authors.map((name) => ({ "@type": "Person", name })),
    datePublished: p.date,
    ...(p.journal && p.publicationType === "article" ? { isPartOf: { "@type": "Periodical", name: p.journal } } : {}),
    ...(p.doi ? { sameAs: `https://doi.org/${p.doi}`, identifier: { "@type": "PropertyValue", propertyID: "DOI", value: p.doi } } : {}),
    url: `${RESEARCHER.siteUrl}${localePath(lang, `/publications/${p.slug}`)}`,
    inLanguage: p.publicationType === "these" ? "fr" : "en",
  };
}

function externalLinks(p: Publication, lang: Lang) {
  const t = COPY[lang];
  return [
    p.doi && { label: t.doi, value: p.doi, url: `https://doi.org/${p.doi}` },
    p.pdfUrl && { label: t.pdf(p.publicationType === "these"), value: new URL(p.pdfUrl).hostname, url: p.pdfUrl },
    p.codeUrl && { label: t.code, value: p.codeUrl.replace("https://", "").split("/-/")[0], url: p.codeUrl },
    p.datasetUrl && { label: t.data, value: p.datasetUrl.replace("https://doi.org/", "doi:"), url: p.datasetUrl },
    ...p.extraLinks.map((l) => ({ label: l.label, value: new URL(l.url).hostname, url: l.url })),
  ].filter(Boolean) as { label: string; value: string; url: string }[];
}

export default async function PublicationPage({ params }: PageProps<"/[lang]/publications/[slug]">) {
  const [{ slug }, lang] = await Promise.all([params, getLang()]);
  const p = getPublicationIn(lang, slug);
  if (!p) notFound();
  const depth = publicationDepthIn(lang, p.id);
  const thesis = p.publicationType === "these";
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(p, lang)) }} />
      <PageHeader
        chapter={String(p.year)}
        morphName={`pub-${p.slug}`}
        kicker={`${PUBLICATION_TYPE_LABEL[p.publicationType][lang]} · ${p.journal ?? ""}`}
        title={thesis ? <span className="text-[0.72em] leading-[1.05]" lang="fr">{p.title}</span> : p.editorialTitle}
        intro={thesis ? undefined : <p className="font-serif text-2xl italic [&_i]:not-italic" lang="en"><SpeciesText text={p.title} /></p>}
        aside={
          <Link href="/publications" className="link-underline inline-flex items-center gap-2 py-1.5 text-sm">
            <ArrowLeft className="size-4" aria-hidden /> {COPY[lang].back}
          </Link>
        }
      />
      <article className="site-gutter mx-auto max-w-site py-16 md:py-20">
        <div className="grid gap-14 pb-16 lg:grid-cols-12">
          <PublicationBody p={p} lang={lang} />
          <PublicationAside p={p} links={externalLinks(p, lang)} lang={lang} />
        </div>
        {depth && <DepthSections depth={depth} modules={modulesFor(depth.module, lang)} />}
        <SourceNote className="mt-16" ids={p.sources} />
      </article>
    </>
  );
}

function PublicationBody({ p, lang }: { p: Publication; lang: Lang }) {
  const t = COPY[lang];
  const axes = researchAxesIn(lang).filter((a) => a.publicationIds.includes(p.id));
  return (
    <div className="space-y-10 lg:col-span-7">
      <section>
        <h2 className="label mb-3 text-muted">{t.brief}</h2>
        <p className="text-xl leading-relaxed"><SpeciesText text={p.summary} /></p>
      </section>
      <section className="border-l-2 border-accent pl-5">
        <h2 className="label mb-2 text-muted">{t.question}</h2>
        <p className="font-serif text-2xl leading-snug"><SpeciesText text={p.question} /></p>
      </section>
      <section>
        <h2 className="label mb-2 text-muted">{t.approach}</h2>
        <p className="text-lg leading-relaxed text-ink/85"><SpeciesText text={p.approach} /></p>
      </section>
      {axes.length > 0 && (
        <section>
          <h2 className="label mb-3 text-muted">{t.axes}</h2>
          <ul className="flex flex-wrap gap-2">
            {axes.map((a) => (
              <li key={a.id}>
                <Link href={`/recherche#${a.slug}`} className="inline-block bg-ink/[0.06] px-2.5 py-1 text-sm hover:text-accent-deep on-dark:bg-paper/10">
                  {a.letter} · {a.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
      <section aria-labelledby="citer">
        <h2 id="citer" className="label mb-3 text-muted">{t.cite}</h2>
        <CitationTools
          reference={formatReference(p, lang)}
          bibtex={toBibtex(p)}
          fileName={`${bibtexKey(p)}.bib`}
          workLang={p.publicationType === "these" ? "fr" : "en"}
        />
      </section>
    </div>
  );
}
