import { getSource } from "@/data/sources";
import { cn } from "@/lib/utils/cn";

/** Compact list of sources backing a block of content. */
export function SourceNote({ ids, className, label = "Sources" }: { ids: string[]; className?: string; label?: string }) {
  const sources = ids.map(getSource).filter((s) => s !== undefined);
  if (!sources.length) return null;
  return (
    <div className={cn("mono-meta text-muted on-dark:text-mist", className)}>
      <span className="mr-2 uppercase tracking-[0.14em]">{label} —</span>
      {sources.map((s, i) => (
        <span key={s.id}>
          <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline decoration-rule underline-offset-4 hover:text-ink on-dark:hover:text-paper">
            {s.label}
          </a>
          {i < sources.length - 1 && <span aria-hidden> · </span>}
        </span>
      ))}
    </div>
  );
}
