import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { projectsForPublication } from "@/data/relations";
import type { Publication } from "@/types/content";

type ExtLink = { label: string; value: string; url: string };

/** Everything a researcher needs at a glance: authors, venue, links, citation, related projects. */
export function PublicationAside({ p, links }: { p: Publication; links: ExtLink[] }) {
  const projects = projectsForPublication(p.id);
  return (
    <aside className="space-y-8 lg:col-span-4 lg:col-start-9">
      <dl className="divide-y divide-rule border-y border-ink text-sm">
        <div className="py-3">
          <dt className="label text-muted">Auteurs</dt>
          <dd className="mt-1">
            {p.authors.map((a, i) => (
              <span key={a}>
                <span className={a.includes("Courtois") ? "font-medium underline decoration-antibes decoration-2 underline-offset-4" : undefined}>{a}</span>
                {i < p.authors.length - 1 ? ", " : ""}
              </span>
            ))}
          </dd>
          {p.authorNote && <dd className="mt-2 text-xs text-muted">{p.authorNote}</dd>}
        </div>
        {p.journal && (
          <div className="py-3">
            <dt className="label text-muted">{p.publicationType === "these" ? "Cadre" : "Revue"}</dt>
            <dd className="mt-1 font-serif text-lg">
              {p.journal}
              {p.volume && <span className="tabular-nums text-xs text-muted"> {p.volume}{p.pages ? `, ${p.pages}` : ""}</span>}
            </dd>
          </div>
        )}
        {p.date && (
          <div className="py-3">
            <dt className="label text-muted">{p.publicationType === "these" ? "Soutenance" : "Publication"}</dt>
            <dd className="mt-1 tabular-nums">{p.date}</dd>
          </div>
        )}
        {p.license && (
          <div className="py-3">
            <dt className="label text-muted">Licence</dt>
            <dd className="mt-1 tabular-nums">{p.license}</dd>
          </div>
        )}
      </dl>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.url}>
            <a href={l.url} target="_blank" rel="noopener noreferrer" className="group flex items-start justify-between gap-3 rounded-[3px] border border-rule p-3 hover:border-ink">
              <span>
                <span className="block text-sm">{l.label}</span>
                <span className="block tabular-nums text-xs break-all text-muted">{l.value}</span>
              </span>
              <ArrowUpRight className="size-4 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
              <span className="sr-only">(nouvel onglet)</span>
            </a>
          </li>
        ))}
      </ul>
      {projects.length > 0 && (
        <section aria-labelledby="projets-lies">
          <h2 id="projets-lies" className="mb-3 font-serif text-2xl">
            Projets liés
          </h2>
          <ul className="space-y-2">
            {projects.map((pr) => (
              <li key={pr.id}>
                <Link href={`/projets/${pr.slug}`} className="group flex items-center justify-between gap-3 border-b border-ink/15 py-2 hover:text-accent-deep">
                  {pr.title}
                  <ArrowRight className="size-4 shrink-0" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </aside>
  );
}
