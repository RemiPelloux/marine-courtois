import Link from "@/i18n/Link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/editorial/PageHeader";
import { SourceNote } from "@/components/scientific/SourceNote";
import { SpeciesText } from "@/components/ui/Species";
import { ThemeAside } from "@/components/research/ThemeAside";
import { RESEARCH_THEMES, getResearchThemeIn, researchThemesIn } from "@/data/research";
import { axisOfTheme, getResearchAxisIn } from "@/data/research-axes";
import { copy, OG_LOCALE, type Lang } from "@/i18n/config";
import { getLang } from "@/i18n/server";
import { languageAlternates } from "@/lib/content/metadata";
import type { ResearchTheme } from "@/types/content";

/** All known slugs are prerendered; unknown slugs render notFound(). */
export const instant = false;

export function generateStaticParams() {
  return RESEARCH_THEMES.map((t) => ({ slug: t.slug }));
}

const COPY = copy({
  fr: {
    chapter: (letter: string) => `Détail de l'axe ${letter}`,
    back: (letter: string) => `Retour à l'axe ${letter}`,
    question: "Question de recherche",
    mechanism: "Mécanisme biologique",
    approach: "Approche",
    concept: "Concept clé",
    nav: "Autres détails de la recherche",
    prev: "← Détail précédent",
    next: "Détail suivant →",
  },
  en: {
    chapter: (letter: string) => `Detail of area ${letter}`,
    back: (letter: string) => `Back to area ${letter}`,
    question: "Research question",
    mechanism: "Biological mechanism",
    approach: "Approach",
    concept: "Key concept",
    nav: "Other research details",
    prev: "← Previous detail",
    next: "Next detail →",
  },
});

export async function generateMetadata({ params }: PageProps<"/[lang]/recherche/[slug]">): Promise<Metadata> {
  const [{ slug }, lang] = await Promise.all([params, getLang()]);
  const t = getResearchThemeIn(lang, slug);
  if (!t) return {};
  const path = `/recherche/${t.slug}`;
  return {
    title: t.title,
    description: t.lede,
    alternates: languageAlternates(lang, path),
    openGraph: { title: t.title, description: t.lede, type: "article", locale: OG_LOCALE[lang] },
  };
}

export default async function ResearchDetail({ params }: PageProps<"/[lang]/recherche/[slug]">) {
  const [{ slug }, lang] = await Promise.all([params, getLang()]);
  const t = getResearchThemeIn(lang, slug);
  const axis = getResearchAxisIn(lang, axisOfTheme(slug)?.id ?? "");
  if (!t || !axis) notFound();
  const c = COPY[lang];
  return (
    <>
      <PageHeader
        chapter={c.chapter(axis.letter)}
        morphName={`research-${t.slug}`}
        kicker={axis.title}
        title={t.title}
        intro={<SpeciesText text={t.lede} />}
        aside={
          <Link href={`/recherche#${axis.slug}`} className="link-underline inline-flex items-center gap-2 py-1.5 text-sm">
            <ArrowLeft className="size-4" aria-hidden /> {c.back(axis.letter)}
          </Link>
        }
      />
      <article className="site-gutter mx-auto max-w-site py-20">
        <div className="grid gap-14 lg:grid-cols-12">
          <ThemeBody t={t} lang={lang} />
          <ThemeAside theme={t} lang={lang} />
        </div>
        <SourceNote className="mt-16" ids={t.sources} />
        <DetailNav slug={t.slug} lang={lang} />
      </article>
    </>
  );
}

function ThemeBody({ t, lang }: { t: ResearchTheme; lang: Lang }) {
  const c = COPY[lang];
  return (
    <div className="space-y-12 lg:col-span-6">
      <section aria-labelledby="q">
        <h2 id="q" className="label mb-3 text-accent-deep">{c.question}</h2>
        <p className="font-serif text-[2rem] leading-tight">
          <SpeciesText text={t.question} />
        </p>
      </section>
      <section aria-labelledby="m">
        <h2 id="m" className="label mb-3 text-muted">{c.mechanism}</h2>
        <p className="text-lg leading-relaxed">{t.mechanism}</p>
      </section>
      <section aria-labelledby="a">
        <h2 id="a" className="label mb-3 text-muted">{c.approach}</h2>
        <p className="text-lg leading-relaxed">
          <SpeciesText text={t.approach} />
        </p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {t.methods.map((m) => (
            <li key={m} className="bg-ink/[0.06] px-2.5 py-1 text-xs on-dark:bg-paper/10">
              {m}
            </li>
          ))}
        </ul>
      </section>
      <section aria-labelledby="k" className="border-y border-ink py-6">
        <h2 id="k" className="label mb-2 text-muted">{c.concept}</h2>
        <p className="font-serif text-2xl">{t.keyConcept.term}</p>
        <p className="mt-2 leading-relaxed text-ink/85">{t.keyConcept.definition}</p>
      </section>
    </div>
  );
}

function DetailNav({ slug, lang }: { slug: string; lang: Lang }) {
  const themes = researchThemesIn(lang);
  const idx = themes.findIndex((r) => r.slug === slug);
  const next = themes[(idx + 1) % themes.length];
  const prev = themes[(idx - 1 + themes.length) % themes.length];
  const c = COPY[lang];
  return (
    <nav aria-label={c.nav} className="mt-16 grid gap-px border-y border-ink sm:grid-cols-2">
      <Link href={`/recherche/${prev.slug}`} className="group py-6 sm:pr-6">
        <span className="label text-muted">{c.prev}</span>
        <span className="mt-2 block font-serif text-2xl group-hover:text-accent-deep">{prev.title}</span>
      </Link>
      <Link href={`/recherche/${next.slug}`} className="group border-t border-rule py-6 sm:border-t-0 sm:border-l sm:pl-6 sm:text-right">
        <span className="label text-muted">{c.next}</span>
        <span className="mt-2 flex items-center gap-2 font-serif text-2xl group-hover:text-accent-deep sm:justify-end">
          {next.title} <ArrowRight className="size-5" aria-hidden />
        </span>
      </Link>
    </nav>
  );
}
