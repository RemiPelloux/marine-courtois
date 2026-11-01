import { copy, type Lang } from "@/i18n/config";
import type { TeachingActivity } from "@/types/portfolio";

const COPY = copy({
  fr: {
    featured: "Enseignements principaux",
    others: "Autres formations",
    source: "Source : informations fournies par Marine Courtois.",
  },
  en: {
    featured: "Main teaching",
    others: "Other programmes",
    source: "Source: information provided by Marine Courtois.",
  },
});

type Props = { activities: TeachingActivity[]; lang: Lang };

/** Teaching by institution and programme: featured ones first, the rest as rows, the summary group last. */
export function TeachingActivities({ activities, lang }: Props) {
  const t = COPY[lang];
  const featured = activities.filter((a) => a.emphasis === "featured");
  const standard = activities.filter((a) => a.emphasis === "standard");
  const summary = activities.filter((a) => a.emphasis === "summary");
  return (
    <div className="space-y-14">
      <ul aria-label={t.featured} className="grid gap-10 md:grid-cols-2">
        {featured.map((a) => (
          <li key={a.id} className="border-t-2 border-antibes pt-5">
            <h3 className="font-serif text-[2rem] leading-tight">{a.institution}</h3>
            <p className="mt-2 text-sm text-accent-deep">{a.programme}</p>
            <p className="mt-4 max-w-xl text-[1.08rem] leading-relaxed text-ink/90">{a.subjects}</p>
          </li>
        ))}
      </ul>
      <ul aria-label={t.others} className="border-b border-ink/15">
        {standard.map((a) => (
          <TeachingRow key={a.id} heading={a.programme} meta={a.institution} text={a.subjects} />
        ))}
        {summary.length > 0 && <SummaryRow items={summary} />}
      </ul>
      <p className="mono-meta text-muted">{t.source}</p>
    </div>
  );
}

function TeachingRow({ heading, meta, text }: { heading: string; meta?: string; text: string }) {
  return (
    <li className="grid gap-2 border-t border-ink/15 py-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] md:gap-8">
      <div>
        <h3 className="font-serif text-[1.45rem] leading-tight">{heading}</h3>
        {meta && <p className="mt-1 text-sm text-muted">{meta}</p>}
      </div>
      <p className="text-[1.02rem] leading-relaxed text-ink/85">{text}</p>
    </li>
  );
}

/** Several programmes of one institution, condensed into one row. */
function SummaryRow({ items }: { items: TeachingActivity[] }) {
  return (
    <li className="grid gap-2 border-t border-ink/15 py-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] md:gap-8">
      <h3 className="font-serif text-[1.45rem] leading-tight">{items[0].institution}</h3>
      <dl className="space-y-2 text-[1.02rem] leading-relaxed text-ink/85">
        {items.map((a) => (
          <div key={a.id}>
            <dt className="text-sm text-accent-deep">{a.programme}</dt>
            <dd>{a.subjects}</dd>
          </div>
        ))}
      </dl>
    </li>
  );
}
