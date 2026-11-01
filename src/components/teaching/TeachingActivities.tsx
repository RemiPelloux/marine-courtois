import type { TeachingActivity } from "@/types/portfolio";

/** Teaching cards, each one expandable to its objectives, methods and supports. */
export function TeachingActivities({ activities }: { activities: TeachingActivity[] }) {
  if (activities.length === 0) {
    return (
      <p className="max-w-3xl border border-dashed border-antibes p-6 text-[1.02rem] leading-relaxed text-ink/80">
        Les enseignements réalisés (intitulé, établissement, niveau, période, format, objectifs et supports) seront présentés ici dès
        qu&apos;ils seront renseignés. Aucun enseignement n&apos;est déduit du parcours doctoral.
      </p>
    );
  }
  return (
    <ul className="grid gap-8 md:grid-cols-2">
      {activities.map((t) => (
        <li key={t.id} className="border-t-2 border-antibes pt-5">
          <p className="text-sm text-accent-deep">
            {t.institution} · {t.level} · {t.period}
          </p>
          <h3 className="mt-2 font-serif text-[1.8rem] leading-tight">{t.title}</h3>
          <p className="mt-1 text-sm text-muted">
            {t.format}
            {t.hours ? ` · ${t.hours} h` : ""}
          </p>
          <details className="mt-4">
            <summary className="cursor-pointer py-1 text-sm hover:text-accent-deep">Objectifs, méthodes et supports</summary>
            <div className="mt-3 space-y-3 text-[0.98rem] text-ink/85">
              <p>{t.objectives.join(" · ")}</p>
              <p>{t.methods.join(" · ")}</p>
              <ul className="space-y-1">
                {t.supports.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} className="link-underline">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </details>
        </li>
      ))}
    </ul>
  );
}
