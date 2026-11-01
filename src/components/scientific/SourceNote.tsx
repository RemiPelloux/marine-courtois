import { getSourceIn } from "@/data/sources";
import { copy } from "@/i18n/config";
import { getLang } from "@/i18n/server";
import { cn } from "@/lib/utils/cn";

const COPY = copy({
  fr: { sources: "Sources", colon: " :" },
  en: { sources: "Sources", colon: ":" },
});

/** Compact list of sources backing a block of content, labelled in the current language. */
export async function SourceNote({ ids, className, label }: { ids: string[]; className?: string; label?: string }) {
  const lang = await getLang();
  const t = COPY[lang];
  const sources = ids.map((id) => getSourceIn(lang, id)).filter((s) => s !== undefined);
  if (!sources.length) return null;
  return (
    <div className={cn("mono-meta text-muted on-dark:text-mist", className)}>
      <span className="mr-2 font-semibold">
        {label ?? t.sources}
        {t.colon}
      </span>
      {sources.map((s, i) => (
        <span key={s.id}>
          <a href={s.url} target="_blank" rel="noopener noreferrer" className="py-1 underline decoration-rule underline-offset-4 hover:text-ink on-dark:hover:text-paper">
            {s.label}
          </a>
          {i < sources.length - 1 && <span aria-hidden> · </span>}
        </span>
      ))}
    </div>
  );
}
