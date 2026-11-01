import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ToolIcon } from "@/components/interactions/tool-icons";
import { MaturityBadge } from "@/components/projects/MaturityBadge";
import { axisRelations } from "@/data/relations";
import type { ResearchAxis } from "@/types/portfolio";

/** One research axis with everything attached to it: themes, articles, talks, projects, tools, questions. */
export function AxisBlock({ axis }: { axis: ResearchAxis }) {
  const r = axisRelations(axis);
  return (
    <section id={axis.slug} aria-labelledby={`${axis.slug}-titre`} className="scroll-mt-24 border-t border-ink py-14">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="font-serif text-5xl leading-none text-accent-deep italic">{axis.letter}</p>
          <h2 id={`${axis.slug}-titre`} className="mt-3 font-serif text-title">
            {axis.title}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-ink/85">{axis.lede}</p>
          {r.tools.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-3">
              {r.tools.map((t) => (
                <li key={t.id} className="inline-flex items-center gap-1.5 text-sm text-ink/80">
                  <ToolIcon id={t.id} className="size-4 text-antibes" /> {t.name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:col-span-7">
          {r.themes.length > 0 && (
            <LinkList title="Thèmes" items={r.themes.map((t) => ({ key: t.slug, href: `/recherche/${t.slug}`, label: t.title }))} />
          )}
          {r.publications.length > 0 && (
            <LinkList title="Publications" items={r.publications.map((p) => ({ key: p.id, href: `/publications/${p.slug}`, label: `${p.publicationType === "these" ? "Thèse" : p.journal} ${p.year}` }))} />
          )}
          {r.projects.length > 0 && <LinkList title="Projets" items={r.projects.map((p) => ({ key: p.id, href: `/projets/${p.slug}`, label: p.title }))} />}
          {r.communications.length > 0 && (
            <LinkList title={`${r.communications.length} communications`} items={r.communications.slice(0, 4).map((c) => ({ key: c.id, href: "/communications", label: c.event.split(" — ")[0] }))} />
          )}
          {axis.letter === "D" && <Questions questions={r.questions} />}
        </div>
      </div>
    </section>
  );
}

function LinkList({ title, items }: { title: string; items: { key: string; href: string; label: string }[] }) {
  return (
    <div>
      <h3 className="text-sm text-muted">{title}</h3>
      <ul className="mt-2">
        {items.map((it) => (
          <li key={it.key}>
            <Link href={it.href} className="group flex min-h-10 items-center justify-between gap-3 border-b border-ink/15 py-2 hover:text-accent-deep">
              {it.label}
              <ArrowRight className="size-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Questions({ questions }: { questions: ReturnType<typeof axisRelations>["questions"] }) {
  if (questions.length === 0) {
    return (
      <p className="border border-dashed border-antibes p-5 text-[0.98rem] leading-relaxed text-ink/80 sm:col-span-2">
        Aucune question en cours n&apos;est encore documentée publiquement. Les pistes apparaîtront ici avec leur degré d&apos;avancement,
        sans être présentées comme des résultats.
      </p>
    );
  }
  return (
    <ul className="space-y-6 sm:col-span-2">
      {questions.map((q) => (
        <li key={q.id}>
          <MaturityBadge status={q.status} />
          <p className="mt-2 font-serif text-2xl leading-snug">{q.question}</p>
          <p className="mt-1 text-sm text-ink/80">{q.context}</p>
        </li>
      ))}
    </ul>
  );
}
