import Link from "next/link";
import { EXPERIENCE_KIND_LABEL } from "@/data/experiences";
import { orderedExperiences } from "@/components/parcours/board";
import { formatDateFr } from "@/lib/utils/format";
import type { Experience } from "@/types/portfolio";

/** The same pieces as the leaf, as a plain chronological list: readable without the puzzle. */
export function Chronology({ list }: { list: Experience[] }) {
  const ordered = orderedExperiences(list);
  const dated = ordered.filter((e) => e.date);
  const skills = ordered.filter((e) => !e.date);
  const years = [...new Set(dated.map((e) => e.date!.slice(0, 4)))];
  return (
    <div className="grid gap-12 lg:grid-cols-12">
      <ol className="space-y-10 lg:col-span-8">
        {years.map((y) => (
          <li key={y} className="grid gap-4 border-t border-ink pt-4 sm:grid-cols-[6rem_1fr]">
            <p className="font-serif text-4xl leading-none tabular-nums">{y}</p>
            <ul className="space-y-4">
              {dated.filter((e) => e.date!.startsWith(y)).map((e) => (
                <li key={e.id}>
                  <EntryTitle e={e} />
                  <p className="text-sm text-muted">
                    {EXPERIENCE_KIND_LABEL[e.kind]} · {formatDateFr(e.date!)}
                    {e.place ? ` · ${e.place}` : ""}
                  </p>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
      <div className="lg:col-span-4">
        <h3 className="border-t border-ink pt-4 font-serif text-2xl">Compétences construites</h3>
        <ul className="mt-4 space-y-4">
          {skills.map((e) => (
            <li key={e.id}>
              <EntryTitle e={e} />
              <p className="text-sm text-muted">{e.detail}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function EntryTitle({ e }: { e: Experience }) {
  if (!e.href) return <p className="font-serif text-xl leading-snug">{e.title}</p>;
  if (e.href.startsWith("http")) {
    return (
      <a href={e.href} target="_blank" rel="noopener noreferrer" className="font-serif text-xl leading-snug hover:text-accent-deep">
        {e.title} <span className="sr-only">(nouvel onglet)</span>
      </a>
    );
  }
  return (
    <Link href={e.href} className="font-serif text-xl leading-snug hover:text-accent-deep">
      {e.title}
    </Link>
  );
}
