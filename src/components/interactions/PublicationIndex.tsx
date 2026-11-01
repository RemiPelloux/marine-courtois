"use client";

import { useMemo, useState } from "react";
import type { Publication } from "@/types/content";
import { FeaturedPublication, PublicationRow } from "@/components/interactions/publications/PublicationEntries";
import { NO_FILTER, PublicationFilters, isFiltering, type FilterOptions, type Filters } from "@/components/interactions/publications/PublicationFilters";

function filterOptions(publications: Publication[]): FilterOptions {
  return {
    years: Array.from(new Set(publications.map((p) => p.year))).sort((a, b) => b - a),
    types: Array.from(new Set(publications.map((p) => p.publicationType))),
    themes: Array.from(new Set(publications.flatMap((p) => p.themes))).sort((a, b) => a.localeCompare(b, "fr")),
  };
}

function matches(p: Publication, { year, type, theme }: Filters): boolean {
  return (year === "all" || p.year === year) && (type === "all" || p.publicationType === type) && (theme === "all" || p.themes.includes(theme));
}

function usePublicationFilters(publications: Publication[]) {
  const options = useMemo(() => filterOptions(publications), [publications]);
  const [filters, setFilters] = useState<Filters>(NO_FILTER);
  const update = (patch: Partial<Filters>) => setFilters((f) => ({ ...f, ...patch }));
  const filtered = publications.filter((p) => matches(p, filters));
  return { options, filters, update, filtered };
}

type PublicationIndexProps = {
  publications: Publication[];
  showFilters?: boolean;
  headingLevel?: "h2" | "h3";
};

export function PublicationIndex({ publications, showFilters = true, headingLevel = "h3" }: PublicationIndexProps) {
  const { options, filters, update, filtered } = usePublicationFilters(publications);
  const [open, setOpen] = useState<string | null>(null);
  const featured = !isFiltering(filters) ? filtered.find((p) => p.featured) : undefined;
  const rows = filtered.filter((p) => p !== featured);

  return (
    <div>
      {showFilters && <PublicationFilters options={options} filters={filters} update={update} count={filtered.length} />}
      {featured && <FeaturedPublication p={featured} H={headingLevel} />}
      {rows.length === 0 && !featured && <p className="py-10 text-muted">Aucune publication ne correspond à ces filtres.</p>}
      <ol className="divide-y divide-rule border-y border-rule">
        {rows.map((p) => (
          <PublicationRow key={p.id} p={p} H={headingLevel} expanded={open === p.id} onToggle={() => setOpen(open === p.id ? null : p.id)} />
        ))}
      </ol>
    </div>
  );
}
