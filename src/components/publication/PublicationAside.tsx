import Link from "@/i18n/Link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { projectsForPublication } from "@/data/relations";
import { copy, type Lang } from "@/i18n/config";
import { formatDate } from "@/lib/utils/format";
import type { Publication } from "@/types/content";

type ExtLink = { label: string; value: string; url: string };

const COPY = copy({
  fr: {
    authors: "Auteurs",
    venue: (thesis: boolean): string => (thesis ? "Cadre" : "Revue"),
    date: (thesis: boolean): string => (thesis ? "Soutenance" : "Publication"),
    license: "Licence",
    newTab: "(nouvel onglet)",
    projects: "Projets liés",
  },
  en: {
    authors: "Authors",
    venue: (thesis: boolean): string => (thesis ? "Setting" : "Journal"),
    date: (thesis: boolean): string => (thesis ? "Defence" : "Published"),
    license: "Licence",
    newTab: "(opens in a new tab)",
    projects: "Related projects",
  },
});

/** Everything a researcher needs at a glance: authors, venue, links, citation, related projects. */
export function PublicationAside({ p, links, lang }: { p: Publication; links: ExtLink[]; lang: Lang }) {
  const t = COPY[lang];
  return (
    <aside className="space-y-8 lg:col-span-4 lg:col-start-9">
      <Facts p={p} lang={lang} />
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.url}>
            <a href={l.url} target="_blank" rel="noopener noreferrer" className="group flex items-start justify-between gap-3 rounded-[3px] border border-rule p-3 hover:border-ink">
              <span>
                <span className="block text-sm">{l.label}</span>
                <span className="block tabular-nums text-xs break-all text-muted">{l.value}</span>
              </span>
              <ArrowUpRight className="size-4 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
              <span className="sr-only">{t.newTab}</span>
            </a>
          </li>
        ))}
      </ul>
      <RelatedProjects id={p.id} lang={lang} />
    </aside>
  );
}

function Facts({ p, lang }: { p: Publication; lang: Lang }) {
  const t = COPY[lang];
  const thesis = p.publicationType === "these";
  return (
    <dl className="divide-y divide-rule border-y border-ink text-sm">
      <div className="py-3">
        <dt className="label text-muted">{t.authors}</dt>
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
          <dt className="label text-muted">{t.venue(thesis)}</dt>
          <dd className="mt-1 font-serif text-lg">
            {p.journal}
            {p.volume && <span className="tabular-nums text-xs text-muted"> {p.volume}{p.pages ? `, ${p.pages}` : ""}</span>}
          </dd>
        </div>
      )}
      {p.date && (
        <div className="py-3">
          <dt className="label text-muted">{t.date(thesis)}</dt>
          <dd className="mt-1 tabular-nums">{formatDate(p.date, lang)}</dd>
        </div>
      )}
      {p.license && (
        <div className="py-3">
          <dt className="label text-muted">{t.license}</dt>
          <dd className="mt-1 tabular-nums">{p.license}</dd>
        </div>
      )}
    </dl>
  );
}

function RelatedProjects({ id, lang }: { id: string; lang: Lang }) {
  const projects = projectsForPublication(id, lang);
  if (projects.length === 0) return null;
  return (
    <section aria-labelledby="projets-lies">
      <h2 id="projets-lies" className="mb-3 font-serif text-2xl">
        {COPY[lang].projects}
      </h2>
      <ul className="space-y-2">
        {projects.map((pr) => (
          <li key={pr.id}>
            <Link href={`/projets/${pr.slug}`} className="group flex items-center justify-between gap-3 border-b border-ink/15 py-2 hover:text-accent-deep">
              <span>{pr.title}</span>
              <ArrowRight className="size-4 shrink-0" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
