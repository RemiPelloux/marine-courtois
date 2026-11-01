import { copy } from "@/i18n/config";
import { getLang } from "@/i18n/server";
import { communicationsIn } from "@/data/communications";
import { SpeciesText } from "@/components/ui/Species";
import { NewTabHint } from "@/components/ui/NewTab";
import type { Communication } from "@/types/content";
import { formatDate } from "@/lib/utils/format";

const TYPE = copy({
  fr: { poster: "Poster", communication: "Communication" },
  en: { poster: "Poster", communication: "Talk" },
});

/** Titles keep the language they were given in on HAL. */
const titleLang = (title: string) => (/[éèàç]/.test(title) ? "fr" : "en");

/** Talks and posters referenced in HAL, newest first; optionally one type only. */
export async function CommunicationList({ type }: { type?: Communication["type"] }) {
  const lang = await getLang();
  const all = communicationsIn(lang);
  const list = type ? all.filter((c) => c.type === type) : all;
  return (
    <ol className="divide-y divide-ink/15 border-y border-ink">
      {list.map((c) => (
        <li key={c.id} id={c.featureId} className="grid scroll-mt-28 gap-2 py-5 md:grid-cols-12 md:gap-6">
          <p className="mono-meta text-muted md:col-span-2">{formatDate(c.date, lang)}</p>
          <div className="md:col-span-7">
            <a href={c.url} target="_blank" rel="noopener noreferrer" className="font-serif text-xl leading-snug hover:text-accent-deep">
              <span lang={titleLang(c.title)}>
                <SpeciesText text={c.title} />
              </span>{" "}
              <NewTabHint />
            </a>
            <p className="mt-1 text-sm text-muted">{c.authors.join(", ")}</p>
            {c.note && <p className="mt-2 text-sm text-accent-deep">{c.note}</p>}
          </div>
          <div className="text-sm md:col-span-3">
            <p className="label text-accent-deep">{TYPE[lang][c.type]}</p>
            <p className="mt-1 text-ink/80">{c.event}</p>
            <p className="text-muted">{c.place}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
