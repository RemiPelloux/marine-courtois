import Link from "@/i18n/Link";
import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { ToolIcon } from "@/components/interactions/tool-icons";
import { SpeciesText } from "@/components/ui/Species";
import { getToolEntry } from "@/data/relations";
import { getPublicationIn } from "@/data/publications";
import { codeFileIn, fileUrl } from "@/data/code";
import { copy, type Lang } from "@/i18n/config";
import { getLang } from "@/i18n/server";
import type { Project } from "@/types/portfolio";
import type { CodeFile } from "@/types/content";

const COPY = copy({
  fr: {
    objective: "Objectif",
    value: "Intérêt scientifique",
    context: "Contexte",
    question: "Question",
    results: "Résultats démontrés",
    limits: "Limites",
    next: "Prochaines étapes",
    methods: "Méthodes",
    tools: "Technologies",
    publications: "Publications associées",
    code: "Code publié",
    newTab: "(nouvel onglet)",
  },
  en: {
    objective: "Aim",
    value: "Scientific value",
    context: "Context",
    question: "Question",
    results: "Results shown",
    limits: "Limitations",
    next: "Next steps",
    methods: "Methods",
    tools: "Technologies",
    publications: "Related publications",
    code: "Published code",
    newTab: "(new tab)",
  },
});

type Text = (typeof COPY)["fr"];

const defined = <T,>(xs: (T | undefined)[]) => xs.filter((x): x is T => x !== undefined);

/** Aim, value, context, question, results, limits, methods, technologies, publications and code — the project file. */
export async function ProjectFacts({ project }: { project: Project }) {
  const lang = await getLang();
  const t = COPY[lang];
  return (
    <div className="grid gap-14 lg:grid-cols-12">
      <div className="space-y-10 lg:col-span-7">
        {project.objective && (
          <Block title={t.objective}>
            <p className="font-serif text-[1.55rem] leading-snug">
              <SpeciesText text={project.objective} />
            </p>
          </Block>
        )}
        {project.value && <Block title={t.value}><Prose text={project.value} /></Block>}
        <Block title={t.context}><Prose text={project.context} /></Block>
        <Block title={t.question}>
          <p className="text-lg leading-relaxed text-ink/85 italic">
            <SpeciesText text={project.question} />
          </p>
        </Block>
        <Block title={t.results}><Bullets items={project.results} /></Block>
        <div className="grid gap-10 md:grid-cols-2">
          <Block title={t.limits}><Bullets items={project.limits} /></Block>
          {project.nextSteps.length > 0 && <Block title={t.next}><Bullets items={project.nextSteps} /></Block>}
        </div>
      </div>
      <ProjectAside project={project} lang={lang} t={t} />
    </div>
  );
}

function ProjectAside({ project, lang, t }: { project: Project; lang: Lang; t: Text }) {
  const tools = defined(project.toolIds.map(getToolEntry));
  const publications = defined(project.publicationIds.map((id) => getPublicationIn(lang, id)));
  const files = defined(project.codeFileIds.map((id) => codeFileIn(lang, id)));
  return (
    <aside className="space-y-10 lg:col-span-4 lg:col-start-9">
      <Block title={t.methods}><Bullets items={project.methods} /></Block>
      <Block title={t.tools}>
        <ul className="flex flex-wrap gap-2">
          {tools.map((tool) => (
            <li key={tool.id}>
              <Link href="/outils" className="inline-flex min-h-9 items-center gap-2 border border-ink/20 px-2.5 text-sm hover:border-antibes">
                <ToolIcon id={tool.id} className="size-4 text-antibes" /> {tool.name}
              </Link>
            </li>
          ))}
        </ul>
      </Block>
      {files.length > 0 && <Block title={t.code}><CodeFiles files={files} newTab={t.newTab} /></Block>}
      {publications.length > 0 && (
        <Block title={t.publications}>
          <ul className="space-y-3">
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
  );
}

/** Published files the project rests on, each linked to GitLab. */
function CodeFiles({ files, newTab }: { files: CodeFile[]; newTab: string }) {
  return (
    <ul className="divide-y divide-rule border-y border-rule">
      {files.map((f) => (
        <li key={f.id}>
          <a href={fileUrl(f.repository, f.path)} target="_blank" rel="noopener noreferrer" className="group block py-2.5 hover:text-accent-deep">
            <span className="flex items-center gap-1.5 font-mono text-[0.8rem] [overflow-wrap:anywhere]">
              {f.repository} / {f.path.split("/").at(-1)}
              <ArrowUpRight className="size-3.5 shrink-0" aria-hidden />
            </span>
            <span className="mt-0.5 block text-sm text-muted">{f.description}</span>
            <span className="sr-only">{newTab}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

function Prose({ text }: { text: string }) {
  return (
    <p className="text-lg leading-relaxed text-ink/85">
      <SpeciesText text={text} />
    </p>
  );
}

function Block({ title, children }: { title: string; children: ReactNode }) {
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
          <SpeciesText text={it} />
        </li>
      ))}
    </ul>
  );
}
