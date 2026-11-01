import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/editorial/PageHeader";
import { SourceNote } from "@/components/scientific/SourceNote";
import { MaturityBadge } from "@/components/projects/MaturityBadge";
import { ProjectDemo } from "@/components/projects/ProjectDemo";
import { ProjectFacts } from "@/components/projects/ProjectFacts";
import { MediaFigure } from "@/components/ui/MediaFigure";
import { PUBLIC_PROJECTS, getProject } from "@/data/projects";
import { projectRelations } from "@/data/relations";

const DEMO_TITLE: Partial<Record<string, string>> = {
  modele: "Voir le modèle fonctionner",
  analyse: "Explorer les données",
  visualisation: "Manipuler les modèles",
};

/** All public projects are prerendered; drafts and unknown slugs render notFound(). */
export const instant = false;

export function generateStaticParams() {
  return PUBLIC_PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projets/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return { title: p.title, description: p.tagline, alternates: { canonical: `/projets/${p.slug}` } };
}

export default async function ProjectPage({ params }: PageProps<"/projets/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const { media } = projectRelations(project);
  const hasDemo = Boolean(project.internalDemo || project.demoUrl || !["publie", "demo"].includes(project.status));

  return (
    <>
      <PageHeader
        chapter="Projet"
        kicker={project.kind === "modele" ? "Modèle" : project.kind === "analyse" ? "Analyse de données" : "Outil et visualisation"}
        title={project.title}
        intro={project.tagline}
        aside={
          <div className="space-y-4">
            <MaturityBadge status={project.status} />
            <Link href="/projets" className="link-underline flex items-center gap-2 py-1.5 text-sm">
              <ArrowLeft className="size-4" aria-hidden /> Tous les projets
            </Link>
          </div>
        }
      />
      <article className="site-gutter mx-auto max-w-site py-16 md:py-20">
        <ProjectFacts project={project} />
        {hasDemo && (
          <section aria-labelledby="demo" className="mt-20 border-t border-ink pt-10">
            <h2 id="demo" className="font-serif text-title">
              {DEMO_TITLE[project.kind] ?? "Démonstration"}
            </h2>
            <div className="mt-8">
              <ProjectDemo project={project} />
            </div>
          </section>
        )}
        {media.length > 0 && (
          <section aria-labelledby="medias" className="mt-20 border-t border-ink pt-10">
            <h2 id="medias" className="font-serif text-title">
              Figures et médias
            </h2>
            <div className="mt-8 grid gap-10 md:grid-cols-2">
              {media.map((m) => (
                <MediaFigure key={m.id} media={m} />
              ))}
            </div>
          </section>
        )}
        <section aria-labelledby="liens" className="mt-20 border-t border-ink pt-10">
          <h2 id="liens" className="font-serif text-title">
            Code, article et ressources
          </h2>
          <ul className="mt-6 grid gap-3 md:grid-cols-3">
            {project.links.map((l) => (
              <li key={l.url}>
                <a href={l.url} {...(l.url.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="group flex h-full items-start justify-between gap-3 border border-rule p-4 hover:border-ink">
                  <span>{l.label}</span>
                  <ArrowUpRight className="size-4 shrink-0" aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </section>
        <SourceNote className="mt-16" ids={project.sources} />
      </article>
    </>
  );
}
