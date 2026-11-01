import { COMMUNICATIONS } from "@/data/publications";
import { formatDateFr } from "@/lib/utils/format";

/** Talks and posters referenced in HAL, newest first. */
export function CommunicationList() {
  return (
    <ol className="divide-y divide-ink/15 border-y border-ink">
      {COMMUNICATIONS.map((c) => (
        <li key={c.id} className="grid gap-2 py-5 md:grid-cols-12 md:gap-6">
          <p className="mono-meta text-muted md:col-span-2">{formatDateFr(c.date)}</p>
          <div className="md:col-span-7">
            <a href={c.url} target="_blank" rel="noopener noreferrer" className="font-serif text-xl leading-snug hover:text-accent-deep" lang={/[éèàç]/.test(c.title) ? "fr" : "en"}>
              {c.title} <span className="sr-only">(nouvel onglet)</span>
            </a>
            <p className="mt-1 text-sm text-muted">{c.authors.join(", ")}</p>
          </div>
          <div className="text-sm md:col-span-3">
            <p className="label text-accent-deep">{c.type === "poster" ? "Poster" : "Communication"}</p>
            <p className="mt-1 text-ink/80">{c.event}</p>
            <p className="text-muted">{c.place}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
