"use client";

import { useMemo, useState } from "react";
import type { Publication } from "@/types/content";
import { FeaturedPublication, PublicationRow } from "@/components/interactions/publications/PublicationEntries";
import { NO_FILTER, PublicationFilters, isFiltering, type FilterOptions, type Filters } from "@/components/interactions/publications/PublicationFilters";
import { copy, type Lang } from "@/i18n/config";
import { useLang } from "@/i18n/client";

const COPY = copy({
  fr: { empty: "Aucune publication ne correspond à ces filtres." },
  en: { empty: "No publication matches these filters." },
});

function filterOptions(publications: Publication[], lang: Lang): FilterOptions {
  return {
    years: Array.from(new Set(publications.map((p) => p.year))).sort((a, b) => b - a),
    types: Array.from(new Set(publications.map((p) => p.publicationType))),
    themes: Array.from(new Set(publications.flatMap((p) => p.themes))).sort((a, b) => a.localeCompare(b, lang)),
  };
}

const fold = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

/** Free-text search over titles, summary, approach, authors, venue and themes, accent-insensitive. */
export function matchesQuery(p: Publication, query: string): boolean {
  const q = fold(query.trim());
  if (!q) return true;
  const haystack = fold([p.title, p.editorialTitle, p.journal, p.doi, p.summary, p.approach, ...p.authors, ...p.themes].filter(Boolean).join(" "));
  return q.split(/\s+/).every((w) => haystack.includes(w));
}

function matches(p: Publication, { year, type, theme, query }: Filters): boolean {
  return (year === "all" || p.year === year) && (type === "all" || p.publicationType === type) && (theme === "all" || p.themes.includes(theme)) && matchesQuery(p, query);
}

const dateKey = (p: Publication) => p.date ?? String(p.year);

function usePublicationFilters(publications: Publication[], lang: Lang) {
  const options = useMemo(() => filterOptions(publications, lang), [publications, lang]);
  const [filters, setFilters] = useState<Filters>(NO_FILTER);
  const update = (patch: Partial<Filters>) => setFilters((f) => ({ ...f, ...patch }));
  const filtered = publications
    .filter((p) => matches(p, filters))
    .sort((a, b) => (filters.order === "desc" ? dateKey(b).localeCompare(dateKey(a)) : dateKey(a).localeCompare(dateKey(b))));
  return { options, filters, update, filtered };
}

type PublicationIndexProps = {
  publications: Publication[];
  showFilters?: boolean;
  headingLevel?: "h2" | "h3";
  /** Show the featured article as a large block above the list (off where it is already featured, e.g. the home page). */
  highlightFeatured?: boolean;
};

export function PublicationIndex({ publications, showFilters = true, headingLevel = "h3", highlightFeatured = true }: PublicationIndexProps) {
  const lang = useLang();
  const { options, filters, update, filtered } = usePublicationFilters(publications, lang);
  const [open, setOpen] = useState<string | null>(null);
  const featured = highlightFeatured && !isFiltering(filters) ? filtered.find((p) => p.featured) : undefined;
  const rows = filtered.filter((p) => p !== featured);

  return (
    <div>
      {showFilters && <PublicationFilters options={options} filters={filters} update={update} count={filtered.length} />}
      {featured && <FeaturedPublication p={featured} H={headingLevel} />}
      {rows.length === 0 && !featured && <p className="py-10 text-muted">{COPY[lang].empty}</p>}
      <ol className="divide-y divide-rule border-y border-rule">
        {rows.map((p) => (
          <PublicationRow key={p.id} p={p} H={headingLevel} expanded={open === p.id} onToggle={() => setOpen(open === p.id ? null : p.id)} />
        ))}
      </ol>
    </div>
  );
}
