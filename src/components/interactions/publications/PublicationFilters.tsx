"use client";

import { a11y } from "@/i18n";
import type { Publication } from "@/types/content";
import { TYPE_LABEL } from "@/components/interactions/publications/PublicationEntries";

export type Filters = { year: number | "all"; type: Publication["publicationType"] | "all"; theme: string; query: string; order: "desc" | "asc" };
export type FilterOptions = { years: number[]; types: Publication["publicationType"][]; themes: string[] };

export const NO_FILTER: Filters = { year: "all", type: "all", theme: "all", query: "", order: "desc" };

export function isFiltering({ year, type, theme, query }: Filters): boolean {
  return year !== "all" || type !== "all" || theme !== "all" || query.trim() !== "";
}

const SELECT_CLS = "min-h-11 w-full appearance-none rounded-[3px] border border-ink/60 bg-paper px-3 pr-8 text-sm sm:w-auto";

type FiltersProps = {
  options: FilterOptions;
  filters: Filters;
  update: (patch: Partial<Filters>) => void;
  count: number;
};

export function PublicationFilters({ options, filters, update, count }: FiltersProps) {
  return (
    <form className="mb-10 flex flex-col gap-4 border-y border-ink py-4 sm:flex-row sm:flex-wrap sm:items-end" onSubmit={(e) => e.preventDefault()} aria-label={a11y.filtrerLesPublications}>
      <label className="grid min-w-0 flex-1 gap-1.5 sm:min-w-[14rem]">
        <span className="label text-muted">Recherche</span>
        <input
          type="search"
          value={filters.query}
          onChange={(e) => update({ query: e.target.value })}
          placeholder={a11y.rechercherPublications}
          className="min-h-11 rounded-[3px] border border-ink/60 bg-paper px-3 text-sm"
        />
      </label>
      <FilterSelect label="Année" allLabel="Toutes" value={filters.year} options={options.years.map((y) => ({ value: y, label: y }))} onChange={(v) => update({ year: v === "all" ? "all" : Number(v) })} />
      <FilterSelect label="Type" allLabel="Tous" value={filters.type} options={options.types.map((t) => ({ value: t, label: TYPE_LABEL[t] }))} onChange={(v) => update({ type: v as Filters["type"] })} />
      <FilterSelect label="Thème" allLabel="Tous les thèmes" value={filters.theme} options={options.themes.map((t) => ({ value: t, label: t }))} onChange={(v) => update({ theme: v })} />
      <label className="grid gap-1.5">
        <span className="label text-muted">Tri</span>
        <select className={SELECT_CLS} value={filters.order} onChange={(e) => update({ order: e.target.value as Filters["order"] })}>
          <option value="desc">Plus récentes</option>
          <option value="asc">Plus anciennes</option>
        </select>
      </label>
      <p className="mono-meta text-muted sm:ml-auto sm:self-center" role="status" aria-live="polite">
        {count} résultat{count > 1 ? "s" : ""}
      </p>
      {isFiltering(filters) && (
        <button type="button" className="min-h-11 self-start rounded-[3px] px-3 text-sm underline underline-offset-4 sm:self-auto" onClick={() => update(NO_FILTER)}>
          Effacer les filtres
        </button>
      )}
    </form>
  );
}

type SelectProps = {
  label: string;
  allLabel: string;
  value: string | number;
  options: { value: string | number; label: string | number }[];
  onChange: (value: string) => void;
};

function FilterSelect({ label, allLabel, value, options, onChange }: SelectProps) {
  return (
    <label className="grid gap-1.5">
      <span className="label text-muted">{label}</span>
      <select className={SELECT_CLS} value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="all">{allLabel}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
