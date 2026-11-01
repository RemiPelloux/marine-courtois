import Link from "@/i18n/Link";
import { ArrowRight } from "lucide-react";
import { ToolIcon } from "@/components/interactions/tool-icons";
import { SourceNote } from "@/components/scientific/SourceNote";
import { SpeciesText } from "@/components/ui/Species";
import { AxisCommunications } from "@/components/research/AxisCommunications";
import { axisRelations } from "@/data/relations";
import { copy, type Lang } from "@/i18n/config";
import { getLang } from "@/i18n/server";
import type { ResearchAxis } from "@/types/portfolio";
import { cn } from "@/lib/utils/cn";

const COPY = copy({
  fr: {
    inProgress: "En cours",
    methods: "Méthodes\u00a0:",
    publications: "Publications",
    projects: "Projets",
    thesis: "Thèse de doctorat",
    nothingYet: "Pas encore de publication ni de résultat\u00a0: ce travail est en cours.",
    modelsAndTools: "Modèles et outils",
  },
  en: {
    inProgress: "In progress",
    methods: "Methods:",
    publications: "Publications",
    projects: "Projects",
    thesis: "PhD thesis",
    nothingYet: "No publication or result yet: this work is in progress.",
    modelsAndTools: "Models and tools",
  },
});

type Relations = ReturnType<typeof axisRelations>;

/** An axis with neither publication nor project yet (ongoing work). */
const isOngoing = (r: Relations) => r.publications.length === 0 && r.projects.length === 0;

/** One research axis with the work attached to it: articles, projects, talks, tools and methods. */
export async function AxisBlock({ axis }: { axis: ResearchAxis }) {
  const lang = await getLang();
  const r = axisRelations(axis, lang);
  return (
    <section id={axis.slug} aria-labelledby={`${axis.slug}-titre`} className="scroll-mt-24 border-t border-ink py-14">
      <div className="grid gap-10 lg:grid-cols-12">
        <AxisIntro axis={axis} r={r} lang={lang} />
        <div className="grid content-start gap-8 sm:grid-cols-2 lg:col-span-7">
          {isOngoing(r) ? <OngoingWork axis={axis} r={r} lang={lang} /> : <AxisWork r={r} lang={lang} />}
          {r.communications.length > 0 && <AxisCommunications communications={r.communications} />}
        </div>
      </div>
      <SourceNote className="mt-10" ids={axis.sources} />
    </section>
  );
}

type AxisProps = { axis: ResearchAxis; r: Relations; lang: Lang };

function AxisIntro({ axis, r, lang }: AxisProps) {
  const t = COPY[lang];
  return (
    <div className="lg:col-span-5">
      <p className="flex items-baseline gap-4">
        <span className="font-serif text-5xl leading-none text-accent-deep italic">{axis.letter}</span>
        {axis.status === "en-cours" && <span className="border border-antibes px-2 py-0.5 text-sm text-antibes">{t.inProgress}</span>}
      </p>
      <h2 id={`${axis.slug}-titre`} className="mt-3 font-serif text-title">
        {axis.title}
      </h2>
      <p className="mt-5 text-lg leading-relaxed text-ink/85">
        <SpeciesText text={axis.lede} />
      </p>
      {!isOngoing(r) && (
        <>
          <p className="mt-6 text-sm text-ink/80">
            <span className="text-muted">{t.methods} </span>
            {axis.methods.join(" · ")}
          </p>
          <Tools tools={r.tools} className="mt-4" />
        </>
      )}
    </div>
  );
}

function Tools({ tools, className }: { tools: Relations["tools"]; className?: string }) {
  return (
    <ul className={cn("flex flex-wrap gap-3", className)}>
      {tools.map((tool) => (
        <li key={tool.id} className="inline-flex items-center gap-1.5 text-sm text-ink/80">
          <ToolIcon id={tool.id} className="size-4 text-antibes" /> {tool.name}
        </li>
      ))}
    </ul>
  );
}

/** Ongoing work has no result to link to: its models and tools take the space instead. */
function OngoingWork({ axis, r, lang }: AxisProps) {
  const t = COPY[lang];
  return (
    <div className="sm:col-span-2">
      <h3 className="text-sm text-muted">{t.modelsAndTools}</h3>
      <ul className="mt-3 divide-y divide-ink/15 border-y border-ink/15">
        {axis.methods.map((m) => (
          <li key={m} className="py-3 font-serif text-2xl leading-snug">
            {m}
          </li>
        ))}
      </ul>
      <Tools tools={r.tools} className="mt-5" />
      <p className="mt-6 text-sm text-muted">{t.nothingYet}</p>
    </div>
  );
}

function AxisWork({ r, lang }: { r: Relations; lang: Lang }) {
  const t = COPY[lang];
  const pubs = r.publications.map((p) => ({
    key: p.id,
    href: `/publications/${p.slug}`,
    meta: `${p.publicationType === "these" ? t.thesis : p.journal} · ${p.year}`,
    label: p.editorialTitle ?? p.title,
  }));
  const projects = r.projects.map((p) => ({ key: p.id, href: `/projets/${p.slug}`, label: p.title }));
  return (
    <>
      {pubs.length > 0 && <LinkList title={t.publications} items={pubs} />}
      {projects.length > 0 && <LinkList title={t.projects} items={projects} />}
    </>
  );
}

type Item = { key: string; href: string; label: string; meta?: string };

function LinkList({ title, items }: { title: string; items: Item[] }) {
  return (
    <div>
      <h3 className="text-sm text-muted">{title}</h3>
      <ul className="mt-2">
        {items.map((it) => (
          <li key={it.key}>
            <Link href={it.href} className="group flex min-h-10 items-center justify-between gap-3 border-b border-ink/15 py-2 hover:text-accent-deep">
              <span>
                {it.meta && <span className="mono-meta block text-muted">{it.meta}</span>}
                <SpeciesText text={it.label} />
              </span>
              <ArrowRight className="size-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
