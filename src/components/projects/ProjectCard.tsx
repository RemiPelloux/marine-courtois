import Link from "@/i18n/Link";
import { ArrowRight } from "lucide-react";
import { MaturityBadge } from "@/components/projects/MaturityBadge";
import { ToolIcon } from "@/components/interactions/tool-icons";
import { SpeciesText } from "@/components/ui/Species";
import { projectRelations } from "@/data/relations";
import { getMediaIn } from "@/data/media";
import type { Project } from "@/types/portfolio";
import Image from "next/image";
import { getLang } from "@/i18n/server";
import { a11yFor } from "@/i18n/locales";

/** A project in the index: picture when there is one, question, maturity, tools. Expects a project already in the page language. */
export async function ProjectCard({ project, large = false }: { project: Project; large?: boolean }) {
  const lang = await getLang();
  const a11y = a11yFor(lang);
  const { tools } = projectRelations(project);
  const cover = project.mediaIds.map((id) => getMediaIn(lang, id)).find((m) => m?.kind === "image");
  return (
    <article className="group relative flex h-full flex-col border-t-2 border-antibes pt-5">
      {large && cover && (
        <div className="mb-6 overflow-hidden border border-ink/10 bg-white">
          <Image src={cover.src} alt="" width={cover.width} height={cover.height} sizes="(min-width: 1024px) 50vw, 100vw" className="block h-auto w-full transition-transform duration-700 group-hover:scale-[1.02]" />
        </div>
      )}
      <MaturityBadge status={project.status} />
      <h3 className={large ? "mt-4 font-serif text-[2.2rem] leading-[1.05]" : "mt-4 font-serif text-[1.65rem] leading-tight"}>
        <Link href={`/projets/${project.slug}`} className="after:absolute after:inset-0 hover:text-accent-deep">
          <SpeciesText text={project.title} />
        </Link>
      </h3>
      <p className="mt-3 text-[1rem] leading-relaxed text-ink/80">
        <SpeciesText text={project.tagline} />
      </p>
      <ul className="mt-auto flex flex-wrap items-center gap-3 pt-6" aria-label={`${a11y.technologies} ${tools.map((t) => t.name).join(", ")}`}>
        {tools.slice(0, 6).map((t) => (
          <li key={t.id} title={t.name}>
            <ToolIcon id={t.id} className="size-5 text-antibes" />
          </li>
        ))}
        <li className="ml-auto">
          <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
        </li>
      </ul>
    </article>
  );
}
