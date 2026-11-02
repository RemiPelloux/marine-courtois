import Link from "@/i18n/Link";
import { copy } from "@/i18n/config";
import { getLang } from "@/i18n/server";
import { EXPERIENCE_KIND_LABEL, experiencesIn } from "@/data/experiences";
import { SpeciesText } from "@/components/ui/Species";
import { formatDate } from "@/lib/utils/format";
import type { Experience } from "@/types/portfolio";

const COPY = copy({ fr: { newTab: "(nouvel onglet)" }, en: { newTab: "(opens in a new tab)" } });

/** Dated career events, oldest first. */
export function datedExperiences(list: Experience[]) {
  return list.filter((e) => e.date).sort((a, b) => a.date!.localeCompare(b.date!));
}

/** Dated career events (talks, articles, defence…) by year, each with its source. */
export async function Chronology() {
  const lang = await getLang();
  const dated = datedExperiences(experiencesIn(lang));
  const years = [...new Set(dated.map((e) => e.date!.slice(0, 4)))];
  return (
    <ol className="max-w-4xl space-y-10">
      {years.map((y) => (
        <li key={y} className="grid gap-4 border-t border-ink pt-4 sm:grid-cols-[6rem_1fr]">
          <p className="font-serif text-4xl leading-none tabular-nums">{y}</p>
          <ul className="space-y-4">
            {dated.filter((e) => e.date!.startsWith(y)).map((e) => (
              <li key={e.id}>
                <EntryTitle e={e} newTab={COPY[lang].newTab} />
                <p className="text-sm text-muted">
                  {EXPERIENCE_KIND_LABEL[e.kind][lang]} · {formatDate(e.date!, lang)}
                  {e.place ? ` · ${e.place}` : ""}
                </p>
                <p className="mt-1 max-w-2xl text-note leading-relaxed text-ink/80">
                  <SpeciesText text={e.detail} />
                </p>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}

function EntryTitle({ e, newTab }: { e: Experience; newTab: string }) {
  const cls = "font-serif text-xl leading-snug";
  const title = <SpeciesText text={e.title} />;
  if (!e.href) return <p className={cls}>{title}</p>;
  if (e.href.startsWith("http")) {
    return (
      <a href={e.href} target="_blank" rel="noopener noreferrer" className={`${cls} hover:text-accent-deep`}>
        {title} <span className="sr-only">{newTab}</span>
      </a>
    );
  }
  return (
    <Link href={e.href} className={`${cls} hover:text-accent-deep`}>
      {title}
    </Link>
  );
}
