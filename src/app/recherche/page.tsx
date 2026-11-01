import { a11y } from "@/i18n";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/editorial/PageHeader";
import { Reveal } from "@/components/editorial/Reveal";
import { SequenceRail } from "@/components/editorial/Chapters";
import { SourceNote } from "@/components/scientific/SourceNote";
import { RESEARCH_THEMES } from "@/data/research";
import { getPublication } from "@/data/publications";
import { pageMetadata } from "@/lib/content/metadata";

export const metadata = pageMetadata({
  title: "Recherche",
  description:
    "Technique de l'insecte stérile, fertilité résiduelle, accouplements multiples, modélisation individu-centrée, stratégies de lâchers et écologie des invasions.",
  path: "/recherche",
});

export default function ResearchPage() {
  return (
    <>
      <PageHeader
        chapter="01"
        kicker="Recherche"
        title={
          <>
            Étudier ce que l&apos;on ne peut pas toujours observer directement.
          </>
        }
        intro="Les mathématiques et la simulation offrent un cadre pour explorer des mécanismes difficiles à isoler expérimentalement. Mes recherches mobilisent ces approches pour étudier les dynamiques de populations, les comportements reproducteurs et les interactions écologiques."
        aside={
          <p className="border-l-2 border-vermilion pl-4 font-serif text-xl leading-snug">
            Six axes, un fil conducteur : comprendre comment des mécanismes biologiques et des contraintes pratiques façonnent la dynamique
            des populations.
          </p>
        }
      />
      <div className="site-gutter mx-auto max-w-site py-16">
        <SequenceRail active={0} />
      </div>
      <section aria-label={a11y.axesDeRecherche} className="site-gutter mx-auto max-w-site pb-24">
        <ol className="border-t border-ink">
          {RESEARCH_THEMES.map((t, i) => (
            <Reveal as="li" key={t.slug} delay={i * 0.03} className="border-b border-rule">
              <Link href={`/recherche/${t.slug}`} className="group grid gap-4 py-10 md:grid-cols-12 md:gap-8">
                <div className="md:col-span-6">
                  <h2 className="font-serif text-title transition-colors group-hover:text-vermilion-deep">{t.title}</h2>
                  <p className="mt-2 text-muted">{t.short}</p>
                </div>
                <div className="md:col-span-5">
                  <p className="leading-relaxed text-ink/85">{t.lede}</p>
                  <p className="mono-meta mt-4 text-muted">
                    {t.publicationIds
                      .map((id) => getPublication(id))
                      .filter(Boolean)
                      .map((p) => `${p!.publicationType === "these" ? "Thèse" : p!.journal} ${p!.year}`)
                      .join(" · ")}
                  </p>
                </div>
                <span className="hidden items-start justify-end md:col-span-1 md:flex" aria-hidden>
                  <ArrowRight className="mt-2 size-6 transition-transform duration-300 group-hover:translate-x-1.5" />
                </span>
              </Link>
            </Reveal>
          ))}
        </ol>
        <SourceNote className="mt-10" ids={["pubRF", "pubPolyandry", "pubInvasion", "gitThesis", "thesesFr"]} />
      </section>
    </>
  );
}
