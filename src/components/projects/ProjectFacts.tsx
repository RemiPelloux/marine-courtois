import Link from "next/link";
import { ToolIcon } from "@/components/interactions/tool-icons";
import { projectRelations } from "@/data/relations";
import type { Project } from "@/types/portfolio";

/** Context, question, methods, technologies, results, limits, next steps — the project file. */
export function ProjectFacts({ project }: { project: Project }) {
  const { tools, publications } = projectRelations(project);
  return (
    <div className="grid gap-14 lg:grid-cols-12">
      <div className="space-y-10 lg:col-span-7">
        <Block title="Contexte">
          <p className="text-lg leading-relaxed text-ink/85">{project.context}</p>
        </Block>
        <Block title="Question">
          <p className="font-serif text-[1.7rem] leading-snug">{project.question}</p>
        </Block>
        <Block title="Résultats démontrés">
          <Bullets items={project.results} />
        </Block>
        <div className="grid gap-10 md:grid-cols-2">
          <Block title="Limites">
            <Bullets items={project.limits} />
          </Block>
          {project.nextSteps.length > 0 && (
            <Block title="Prochaines étapes">
              <Bullets items={project.nextSteps} />
            </Block>
          )}
        </div>
      </div>
      <aside className="space-y-10 lg:col-span-4 lg:col-start-9">
        <Block title="Méthodes">
          <Bullets items={project.methods} />
        </Block>
        <Block title="Technologies">
          <ul className="flex flex-wrap gap-2">
            {tools.map((t) => (
              <li key={t.id}>
                <Link href="/outils" className="inline-flex min-h-9 items-center gap-2 border border-ink/20 px-2.5 text-sm hover:border-antibes">
                  <ToolIcon id={t.id} className="size-4 text-antibes" /> {t.name}
                </Link>
              </li>
            ))}
          </ul>
        </Block>
        {publications.length > 0 && (
          <Block title="Publication associée">
            <ul className="space-y-2">
              {publications.map((p) => (
                <li key={p.id}>
                  <Link href={`/publications/${p.slug}`} className="font-serif text-lg leading-snug hover:text-accent-deep">
                    {p.editorialTitle ?? p.title}
                  </Link>
                  <p className="text-sm text-muted">
                    {p.journal}, {p.year}
                  </p>
                </li>
              ))}
            </ul>
          </Block>
        )}
      </aside>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 border-t-2 border-antibes pt-3 font-serif text-2xl">{title}</h2>
      {children}
    </section>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5 text-[1rem] leading-relaxed text-ink/85">
      {items.map((it) => (
        <li key={it.slice(0, 30)} className="relative pl-5 before:absolute before:top-[0.7em] before:left-0 before:h-px before:w-2.5 before:bg-antibes">
          {it}
        </li>
      ))}
    </ul>
  );
}
