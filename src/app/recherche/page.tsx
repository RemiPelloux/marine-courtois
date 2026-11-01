import { a11y } from "@/i18n";
import { PageHeader } from "@/components/editorial/PageHeader";
import { SequenceRail } from "@/components/editorial/Chapters";
import { SourceNote } from "@/components/scientific/SourceNote";
import { ResearchRail } from "@/components/interactions/ResearchRail";
import { researchRailItems } from "@/data/research-rail";
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
      <ResearchRail items={researchRailItems()} />
      <section aria-label={a11y.sourcesDesAxes} className="site-gutter mx-auto max-w-site pb-24">
        <SourceNote className="mt-10" ids={["pubRF", "pubPolyandry", "pubInvasion", "gitThesis", "thesesFr"]} />
      </section>
    </>
  );
}
