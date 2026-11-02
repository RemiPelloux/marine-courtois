import Link from "@/i18n/Link";
import { ArrowUpRight } from "lucide-react";
import { SpeciesText } from "@/components/ui/Species";
import { copy } from "@/i18n/config";
import { getLang } from "@/i18n/server";
import type { Communication } from "@/types/content";

const COPY = copy({
  fr: {
    title: (n: number) => `${n} communications et posters`,
    poster: "Poster",
    talk: "Communication orale",
    all: "Toutes les communications",
    newTab: "(nouvel onglet)",
  },
  en: {
    title: (n: number) => `${n} talks and posters`,
    poster: "Poster",
    talk: "Talk",
    all: "All talks and posters",
    newTab: "(opens in a new tab)",
  },
});

/** HAL titles are kept in their original language; French ones carry French words or accents. */
export const titleLang = (title: string) => (/[àâçéèêëîïôûùœ]|\b(de|du|des|chez|et|le|la|les)\b/i.test(title) ? "fr" : "en");

/** Every communication of an axis, compact, newest first: the same records and count as /communications. */
export async function AxisCommunications({ communications }: { communications: Communication[] }) {
  const t = COPY[await getLang()];
  return (
    <div className="sm:col-span-2">
      <h3 className="text-sm text-muted">{t.title(communications.length)}</h3>
      <ol className="mt-2">
        {communications.map((c) => (
          <li key={c.id} className="border-b border-ink/15">
            <a href={c.url} target="_blank" rel="noopener noreferrer" className="group grid gap-x-4 py-2 hover:text-accent-deep sm:grid-cols-[9rem_1fr_auto]">
              <span className="mono-meta text-muted">
                {c.event.split(" — ")[0]} · {c.type === "poster" ? t.poster : t.talk}
              </span>
              <span lang={titleLang(c.title)} className="text-note leading-snug">
                <SpeciesText text={c.title} />
              </span>
              <ArrowUpRight className="hidden size-3.5 shrink-0 self-center sm:block" aria-hidden />
              <span className="sr-only">{t.newTab}</span>
            </a>
          </li>
        ))}
      </ol>
      <Link href="/communications" className="link-underline mt-4 inline-block py-1 text-sm">
        {t.all}
      </Link>
    </div>
  );
}
