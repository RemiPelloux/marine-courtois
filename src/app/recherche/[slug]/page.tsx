import { a11y } from "@/i18n";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/editorial/PageHeader";
import { SourceNote } from "@/components/scientific/SourceNote";
import { ButtonLink } from "@/components/ui/Links";
import { RESEARCH_THEMES, getResearchTheme } from "@/data/research";
import { getPublication } from "@/data/publications";
import { getCodeFile, getFigure, fileUrl } from "@/data/code";

/** All known slugs are prerendered; unknown slugs render notFound(). */
export const instant = false;

export function generateStaticParams() {
  return RESEARCH_THEMES.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PageProps<"/recherche/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const t = getResearchTheme(slug);
  if (!t) return {};
  return { title: t.title, description: t.lede, alternates: { canonical: `/recherche/${t.slug}` } };
}

export default async function ResearchStory({ params }: PageProps<"/recherche/[slug]">) {
  const { slug } = await params;
  const t = getResearchTheme(slug);
  if (!t) notFound();
  const idx = RESEARCH_THEMES.findIndex((r) => r.slug === t.slug);
  const next = RESEARCH_THEMES[(idx + 1) % RESEARCH_THEMES.length];
  const prev = RESEARCH_THEMES[(idx - 1 + RESEARCH_THEMES.length) % RESEARCH_THEMES.length];
  const fig = getFigure(t.figureId);
  const pubs = t.publicationIds.map((id) => getPublication(id)).filter((p) => p !== undefined);
  const files = t.codeFileIds.map((id) => getCodeFile(id)).filter((f) => f !== undefined);

  return (
    <>
      <PageHeader
        chapter={`Axe ${t.index}`}
        kicker="Recherche"
        title={t.title}
        intro={t.lede}
        aside={
          <Link href="/recherche" className="link-underline inline-flex items-center gap-2 text-sm">
            <ArrowLeft className="size-4" aria-hidden /> Tous les axes de recherche
          </Link>
        }
      />
      <article className="site-gutter mx-auto max-w-site py-20">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="space-y-12 lg:col-span-6">
            <section aria-labelledby="q">
              <p id="q" className="label mb-3 text-vermilion-deep">Question de recherche</p>
              <p className="font-serif text-[2rem] leading-tight">{t.question}</p>
            </section>
            <section aria-labelledby="m">
              <h2 id="m" className="label mb-3 text-muted">Mécanisme biologique</h2>
              <p className="text-lg leading-relaxed">{t.mechanism}</p>
            </section>
            <section aria-labelledby="a">
              <h2 id="a" className="label mb-3 text-muted">Approche</h2>
              <p className="text-lg leading-relaxed">{t.approach}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {t.methods.map((m) => (
                  <li key={m} className="bg-ink/[0.06] px-2.5 py-1 on-dark:bg-paper/10 text-xs">
                    {m}
                  </li>
                ))}
              </ul>
            </section>
            <section aria-labelledby="k" className="border-y border-ink py-6">
              <h2 id="k" className="label mb-2 text-muted">Concept clé</h2>
              <p className="font-serif text-2xl">{t.keyConcept.term}</p>
              <p className="mt-2 leading-relaxed text-ink/85">{t.keyConcept.definition}</p>
            </section>
          </div>
          <aside className="space-y-10 lg:col-span-5 lg:col-start-8">
            {fig && (
              <figure className="border border-rule bg-white/40 p-3">
                <Image src={fig.src} alt={fig.alt} width={fig.width} height={fig.height} className="h-auto w-full" sizes="(min-width: 1024px) 36vw, 100vw" />
                <figcaption className="mono-meta mt-3 text-[0.7rem] text-muted">
                  {fig.caption} Figure de <a className="underline" href={fileUrl(fig.repository, fig.notebook)} target="_blank" rel="noopener noreferrer">{fig.notebook.split("/").at(-1)}</a>.
                </figcaption>
              </figure>
            )}
            <section aria-labelledby="pubs">
              <h2 id="pubs" className="label mb-3 text-muted">Publications associées</h2>
              <ul className="divide-y divide-rule border-y border-rule">
                {pubs.map((p) => (
                  <li key={p.id}>
                    <Link href={`/publications/${p.slug}`} className="group block py-4">
                      <span className="mono-meta text-muted">{p.journal} · {p.year}</span>
                      <span className="mt-1 block font-serif text-xl leading-snug group-hover:text-vermilion-deep">{p.publicationType === "these" ? "Thèse de doctorat" : p.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
            {files.length > 0 && (
              <section aria-labelledby="code">
                <h2 id="code" className="label mb-3 text-muted">Code et notebooks</h2>
                <ul className="space-y-2">
                  {files.map((f) => (
                    <li key={f.id}>
                      <a href={fileUrl(f.repository, f.path)} target="_blank" rel="noopener noreferrer" className="group flex items-start gap-2 tabular-nums text-[0.8rem] hover:text-vermilion-deep">
                        <ArrowUpRight className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                        <span>
                          {f.repository}/{f.path.split("/").at(-1)}
                          <span className="block font-sans text-xs text-muted">{f.description}</span>
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {t.explorerTab && (
              <ButtonLink href={`/laboratoire#modele-${t.explorerTab}`}>Explorer le modèle interactif</ButtonLink>
            )}
          </aside>
        </div>
        <SourceNote className="mt-16" ids={t.sources} />
        <nav aria-label={a11y.axesVoisins} className="mt-16 grid gap-px border-y border-ink sm:grid-cols-2">
          <Link href={`/recherche/${prev.slug}`} className="group py-6 sm:pr-6">
            <span className="label text-muted">← Axe précédent</span>
            <span className="mt-2 block font-serif text-2xl group-hover:text-vermilion-deep">{prev.title}</span>
          </Link>
          <Link href={`/recherche/${next.slug}`} className="group border-t border-rule py-6 sm:border-t-0 sm:border-l sm:pl-6 sm:text-right">
            <span className="label text-muted">Axe suivant →</span>
            <span className="mt-2 flex items-center gap-2 font-serif text-2xl group-hover:text-vermilion-deep sm:justify-end">
              {next.title} <ArrowRight className="size-5" aria-hidden />
            </span>
          </Link>
        </nav>
      </article>
    </>
  );
}
