"use client";

import type { Publication } from "@/types/content";
import { TYPE_LABEL } from "@/components/interactions/publications/PublicationEntries";
import { copy } from "@/i18n/config";
import { useA11y, useLang } from "@/i18n/client";

const COPY = copy({
  fr: {
    search: "Recherche",
    year: "Année",
    allYears: "Toutes",
    type: "Type",
    allTypes: "Tous",
    theme: "Thème",
    allThemes: "Tous les thèmes",
    order: "Tri",
    newest: "Plus récentes",
    oldest: "Plus anciennes",
    results: (n: number) => `${n} résultat${n > 1 ? "s" : ""}`,
    clear: "Effacer les filtres",
  },
  en: {
    search: "Search",
    year: "Year",
    allYears: "All",
    type: "Type",
    allTypes: "All",
    theme: "Theme",
    allThemes: "All themes",
    order: "Order",
    newest: "Newest first",
    oldest: "Oldest first",
    results: (n: number) => `${n} result${n > 1 ? "s" : ""}`,
    clear: "Clear filters",
  },
});

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
  const lang = useLang();
  const a11y = useA11y();
  const t = COPY[lang];
  return (
    <form className="mb-10 flex flex-col gap-4 border-y border-ink py-4 sm:flex-row sm:flex-wrap sm:items-end" onSubmit={(e) => e.preventDefault()} aria-label={a11y.filtrerLesPublications}>
      <label className="grid min-w-0 flex-1 gap-1.5 sm:min-w-[14rem]">
        <span className="label text-muted">{t.search}</span>
        <input
          type="search"
          value={filters.query}
          onChange={(e) => update({ query: e.target.value })}
          placeholder={a11y.rechercherPublications}
          className="min-h-11 rounded-[3px] border border-ink/60 bg-paper px-3 text-sm"
        />
      </label>
      <FilterSelect label={t.year} allLabel={t.allYears} value={filters.year} options={options.years.map((y) => ({ value: y, label: y }))} onChange={(v) => update({ year: v === "all" ? "all" : Number(v) })} />
      <FilterSelect label={t.type} allLabel={t.allTypes} value={filters.type} options={options.types.map((type) => ({ value: type, label: TYPE_LABEL[lang][type] }))} onChange={(v) => update({ type: v as Filters["type"] })} />
      <FilterSelect label={t.theme} allLabel={t.allThemes} value={filters.theme} options={options.themes.map((theme) => ({ value: theme, label: theme }))} onChange={(v) => update({ theme: v })} />
      <label className="grid gap-1.5">
        <span className="label text-muted">{t.order}</span>
        <select className={SELECT_CLS} value={filters.order} onChange={(e) => update({ order: e.target.value as Filters["order"] })}>
          <option value="desc">{t.newest}</option>
          <option value="asc">{t.oldest}</option>
        </select>
      </label>
      <p className="mono-meta text-muted sm:ml-auto sm:self-center" role="status" aria-live="polite">
        {t.results(count)}
      </p>
      {isFiltering(filters) && (
        <button type="button" className="min-h-11 self-start rounded-[3px] px-3 text-sm underline underline-offset-4 sm:self-auto" onClick={() => update(NO_FILTER)}>
          {t.clear}
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
