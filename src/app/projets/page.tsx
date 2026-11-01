import { PageHeader } from "@/components/editorial/PageHeader";
import { SectionHeading } from "@/components/editorial/SectionHeading";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ButtonLink } from "@/components/ui/Links";
import { PUBLIC_PROJECTS } from "@/data/projects";
import { MATURITY_LABEL } from "@/types/portfolio";
import { pageMetadata } from "@/lib/content/metadata";

export const metadata = pageMetadata({
  title: "Projets & applications",
  description: "Modèle individu-centré de Drosophila suzukii, réanalyse des réponses fonctionnelles, figures reproductibles de la thèse, explorateur de modèles : les projets de Marine A. Courtois et leur degré d'avancement.",
  path: "/projets",
});

const featured = PUBLIC_PROJECTS.filter((p) => p.featured);
const others = PUBLIC_PROJECTS.filter((p) => !p.featured);

export default function ProjetsPage() {
  return (
    <>
      <PageHeader
        chapter="Projets"
        kicker="Le laboratoire vivant"
        title="Ce qui se construit, au-delà des articles."
        intro="Modèles, analyses, outils et applications. Chaque fiche dit ce que le projet a réellement montré, ses limites et son degré d'avancement : publié, en cours, prototype, exploration ou démonstration."
        aside={
          <ul className="flex flex-wrap gap-2 border-t border-ink pt-4 text-xs text-muted">
            {Object.values(MATURITY_LABEL).map((l) => (
              <li key={l} className="rounded-full border border-ink/25 px-2.5 py-0.5">
                {l}
              </li>
            ))}
          </ul>
        }
      />
      <section aria-labelledby="phares" className="site-gutter mx-auto max-w-site py-16 md:py-20">
        <h2 id="phares" className="sr-only">
          Projets phares
        </h2>
        <ul className="grid gap-14 lg:grid-cols-2">
          {featured.map((p) => (
            <li key={p.id}>
              <ProjectCard project={p} large />
            </li>
          ))}
        </ul>
      </section>
      <section aria-labelledby="autres" className="border-t border-ink bg-stone">
        <div className="site-gutter mx-auto max-w-site py-20">
          <SectionHeading title={<span id="autres">Outils et visualisations.</span>} size="title" className="mb-12" />
          <ul className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
            {others.map((p) => (
              <li key={p.id}>
                <ProjectCard project={p} />
              </li>
            ))}
          </ul>
          <div className="mt-14 flex flex-wrap gap-3">
            <ButtonLink href="/laboratoire" variant="secondary">
              Le laboratoire interactif
            </ButtonLink>
            <ButtonLink href="/outils" variant="secondary" icon={false}>
              Les outils, reliés aux projets
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
