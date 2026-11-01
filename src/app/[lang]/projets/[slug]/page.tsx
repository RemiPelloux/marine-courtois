import Link from "@/i18n/Link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/editorial/PageHeader";
import { SourceNote } from "@/components/scientific/SourceNote";
import { MaturityBadge } from "@/components/projects/MaturityBadge";
import { ProjectDemo } from "@/components/projects/ProjectDemo";
import { ProjectFacts } from "@/components/projects/ProjectFacts";
import { MediaFigure } from "@/components/ui/MediaFigure";
import { SpeciesText } from "@/components/ui/Species";
import { PUBLIC_PROJECTS, getProjectIn } from "@/data/projects";
import { getMediaIn } from "@/data/media";
import { languageAlternates } from "@/lib/content/metadata";
import { copy, type Lang } from "@/i18n/config";
import { getLang } from "@/i18n/server";
import type { MediaAsset, Project } from "@/types/portfolio";

const COPY = copy({
  fr: {
    chapter: "Projet",
    kind: { modele: "Modèle", analyse: "Analyse de données", other: "Outil et visualisation" },
    all: "Tous les projets",
    demo: { modele: "Voir le modèle fonctionner", analyse: "Explorer les données", visualisation: "Manipuler les modèles", other: "Démonstration" },
    media: "Figures et médias",
    links: "Code, articles et ressources",
    newTab: "(nouvel onglet)",
  },
  en: {
    chapter: "Project",
    kind: { modele: "Model", analyse: "Data analysis", other: "Tool and visualisation" },
    all: "All projects",
    demo: { modele: "See the model at work", analyse: "Explore the data", visualisation: "Adjust the models", other: "Demo" },
    media: "Figures and media",
    links: "Code, articles and resources",
    newTab: "(new tab)",
  },
});

const pick = <T extends { other: string }>(table: T, key: string) => (table as Record<string, string>)[key] ?? table.other;

/** Media of a project, alt text and captions in the page language. */
function projectMedia(project: Project, lang: Lang): MediaAsset[] {
  return project.mediaIds.map((id) => getMediaIn(lang, id)).filter((m) => m !== undefined);
}

/** All public projects are prerendered; drafts and unknown slugs render notFound(). */
export const instant = false;

export function generateStaticParams() {
  return PUBLIC_PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/projets/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const lang = await getLang();
  const p = getProjectIn(lang, slug);
  if (!p) return {};
  return { title: p.title, description: p.tagline, alternates: languageAlternates(lang, `/projets/${p.slug}`) };
}

export default async function ProjectPage({ params }: PageProps<"/[lang]/projets/[slug]">) {
  const { slug } = await params;
  const lang = await getLang();
  const t = COPY[lang];
  const project = getProjectIn(lang, slug);
  if (!project) notFound();
  const media = projectMedia(project, lang);
  const hasDemo = Boolean(project.internalDemo || project.demoUrl || !["publie", "demo"].includes(project.status));

  return (
    <>
      <PageHeader
        chapter={t.chapter}
        kicker={pick(t.kind, project.kind)}
        title={<SpeciesText text={project.title} />}
        intro={<SpeciesText text={project.tagline} />}
        aside={
          <div className="space-y-4">
            <MaturityBadge status={project.status} />
            <Link href="/projets" className="link-underline flex items-center gap-2 py-1.5 text-sm">
              <ArrowLeft className="size-4" aria-hidden /> {t.all}
            </Link>
          </div>
        }
      />
      <article className="site-gutter mx-auto max-w-site py-16 md:py-20">
        <ProjectFacts project={project} />
        {hasDemo && (
          <section aria-labelledby="demo" className="mt-20 border-t border-ink pt-10">
            <h2 id="demo" className="font-serif text-title">
              {pick(t.demo, project.kind)}
            </h2>
            <div className="mt-8">
              <ProjectDemo project={project} />
            </div>
          </section>
        )}
        {media.length > 0 && (
          <section aria-labelledby="medias" className="mt-20 border-t border-ink pt-10">
            <h2 id="medias" className="font-serif text-title">
              {t.media}
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
            {t.links}
          </h2>
          <ul className="mt-6 grid gap-3 md:grid-cols-3">
            {project.links.map((l) => (
              <li key={l.url}>
                <ResourceLink label={l.label} url={l.url} newTab={t.newTab} />
              </li>
            ))}
          </ul>
        </section>
        <SourceNote className="mt-16" ids={project.sources} />
      </article>
    </>
  );
}

const LINK_CLASS = "group flex h-full items-start justify-between gap-3 border border-rule p-4 hover:border-ink";

/** External resources open in a new tab; internal ones stay in the current language. */
function ResourceLink({ label, url, newTab }: { label: string; url: string; newTab: string }) {
  if (!url.startsWith("http")) {
    return (
      <Link href={url} className={LINK_CLASS}>
        <span>{label}</span>
        <ArrowUpRight className="size-4 shrink-0" aria-hidden />
      </Link>
    );
  }
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
      <span>{label}</span>
      <ArrowUpRight className="size-4 shrink-0" aria-hidden />
      <span className="sr-only">{newTab}</span>
    </a>
  );
}
