"use client";

import { a11y } from "@/i18n";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Plus, Minus } from "lucide-react";
import type { Publication } from "@/types/content";
import { cn } from "@/lib/utils/cn";

const TYPE_LABEL: Record<Publication["publicationType"], string> = { article: "Article", these: "Thèse", preprint: "Préprint" };

function Authors({ authors }: { authors: string[] }) {
  return (
    <>
      {authors.map((a, i) => (
        <span key={a}>
          <span className={a.includes("Courtois") ? "font-medium text-ink underline decoration-vermilion decoration-2 underline-offset-4" : undefined}>{a}</span>
          {i < authors.length - 1 ? ", " : ""}
        </span>
      ))}
    </>
  );
}

function Links({ p }: { p: Publication }) {
  const links = [
    p.doi && { label: `DOI ${p.doi}`, url: `https://doi.org/${p.doi}` },
    p.pdfUrl && { label: p.publicationType === "these" ? "Manuscrit PDF" : "Texte intégral", url: p.pdfUrl },
    p.codeUrl && { label: "Code", url: p.codeUrl },
    p.datasetUrl && { label: "Données", url: p.datasetUrl },
  ].filter(Boolean) as { label: string; url: string }[];
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
      {links.map((l) => (
        <li key={l.url}>
          <a href={l.url} target="_blank" rel="noopener noreferrer" className="link-underline inline-flex items-center gap-1 tabular-nums text-[0.78rem]">
            {l.label}
            <ArrowUpRight className="size-3.5" aria-hidden />
            <span className="sr-only">(nouvel onglet)</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

export function PublicationIndex({ publications, showFilters = true }: { publications: Publication[]; showFilters?: boolean }) {
  const reduce = useReducedMotion();
  const years = useMemo(() => Array.from(new Set(publications.map((p) => p.year))).sort((a, b) => b - a), [publications]);
  const themes = useMemo(() => Array.from(new Set(publications.flatMap((p) => p.themes))).sort((a, b) => a.localeCompare(b, "fr")), [publications]);
  const types = useMemo(() => Array.from(new Set(publications.map((p) => p.publicationType))), [publications]);

  const [year, setYear] = useState<number | "all">("all");
  const [type, setType] = useState<Publication["publicationType"] | "all">("all");
  const [theme, setTheme] = useState<string>("all");
  const [open, setOpen] = useState<string | null>(null);

  const filtered = publications.filter(
    (p) => (year === "all" || p.year === year) && (type === "all" || p.publicationType === type) && (theme === "all" || p.themes.includes(theme)),
  );
  const isFiltering = year !== "all" || type !== "all" || theme !== "all";
  const featured = !isFiltering ? filtered.find((p) => p.featured) : undefined;
  const rows = filtered.filter((p) => p !== featured);

  const selectCls = "min-h-11 w-full appearance-none rounded-[3px] border border-ink/60 bg-paper px-3 pr-8 text-sm sm:w-auto";

  return (
    <div>
      {showFilters && (
        <form className="mb-10 flex flex-col gap-4 border-y border-ink py-4 sm:flex-row sm:flex-wrap sm:items-end" onSubmit={(e) => e.preventDefault()} aria-label={a11y.filtrerLesPublications}>
          <label className="grid gap-1.5">
            <span className="label text-muted">Année</span>
            <select className={selectCls} value={year} onChange={(e) => setYear(e.target.value === "all" ? "all" : Number(e.target.value))}>
              <option value="all">Toutes</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1.5">
            <span className="label text-muted">Type</span>
            <select className={selectCls} value={type} onChange={(e) => setType(e.target.value as typeof type)}>
              <option value="all">Tous</option>
              {types.map((t) => (
                <option key={t} value={t}>
                  {TYPE_LABEL[t]}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1.5">
            <span className="label text-muted">Thème</span>
            <select className={selectCls} value={theme} onChange={(e) => setTheme(e.target.value)}>
              <option value="all">Tous les thèmes</option>
              {themes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <p className="mono-meta text-muted sm:ml-auto sm:self-center" role="status" aria-live="polite">
            {filtered.length} résultat{filtered.length > 1 ? "s" : ""}
          </p>
          {isFiltering && (
            <button
              type="button"
              className="min-h-11 self-start rounded-[3px] px-3 text-sm underline underline-offset-4 sm:self-auto"
              onClick={() => {
                setYear("all");
                setType("all");
                setTheme("all");
              }}
            >
              Effacer les filtres
            </button>
          )}
        </form>
      )}

      {featured && (
        <article className="mb-14 grid gap-8 border-b border-ink pb-14 lg:grid-cols-12" aria-labelledby={`pub-${featured.id}`}>
          <div className="lg:col-span-5">
            <p className="label mb-5 flex items-center gap-3">
              <span className="text-vermilion-deep">À la une</span>
              <span className="h-px w-6 bg-ink/40" />
              {featured.year} · {featured.journal}
            </p>
            <h3 id={`pub-${featured.id}`} className="font-serif text-title">
              <Link href={`/publications/${featured.slug}`} className="hover:text-vermilion-deep">
                {featured.editorialTitle}
              </Link>
            </h3>
            <p className="mt-4 font-serif text-xl text-ink/70 italic" lang="en">
              {featured.title}
            </p>
          </div>
          <div className="space-y-5 lg:col-span-6 lg:col-start-7">
            <p className="text-[1.05rem] leading-relaxed">{featured.summaryFr}</p>
            <p className="text-sm text-muted">
              <Authors authors={featured.authors} />
            </p>
            <ul className="flex flex-wrap gap-2">
              {featured.themes.map((t) => (
                <li key={t} className="bg-ink/[0.06] px-2.5 py-1 on-dark:bg-paper/10 text-xs text-ink/75">
                  {t}
                </li>
              ))}
            </ul>
            <Links p={featured} />
            <Link href={`/publications/${featured.slug}`} className="link-underline inline-block font-serif text-lg">
              Lire la fiche détaillée →
            </Link>
          </div>
        </article>
      )}

      {rows.length === 0 && !featured && <p className="py-10 text-muted">Aucune publication ne correspond à ces filtres.</p>}

      <ol className="divide-y divide-rule border-y border-rule">
        {rows.map((p) => {
          const expanded = open === p.id;
          return (
            <li key={p.id}>
              <article aria-labelledby={`pub-${p.id}`} className="grid gap-4 py-7 md:grid-cols-12 md:gap-6">
                <div className="flex items-baseline gap-4 md:col-span-2 md:block">
                  <p className="font-serif text-4xl text-vermilion-deep italic">{p.year}</p>
                  <p className="label mt-1 text-muted">{TYPE_LABEL[p.publicationType]}</p>
                </div>
                <div className="md:col-span-8">
                  <p className="mono-meta mb-2 text-muted">{p.journal}</p>
                  <h3 id={`pub-${p.id}`} className="font-serif text-[1.65rem] leading-tight md:text-[1.9rem]">
                    <Link href={`/publications/${p.slug}`} className="hover:text-vermilion-deep">
                      {p.publicationType === "these" ? p.title : p.editorialTitle ?? p.title}
                    </Link>
                  </h3>
                  {p.publicationType !== "these" && (
                    <p className="mt-2 text-[0.95rem] text-ink/70 italic" lang="en">
                      {p.title}
                    </p>
                  )}
                  <p className="mt-3 text-sm text-muted">
                    <Authors authors={p.authors} />
                  </p>
                  <AnimatePresence initial={false}>
                    {expanded && (
                      <motion.div
                        id={`pub-details-${p.id}`}
                        initial={reduce ? false : { height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-4 pt-5">
                          <p className="max-w-2xl leading-relaxed">{p.summaryFr}</p>
                          {p.authorNote && <p className="text-sm text-muted">{p.authorNote}</p>}
                          <ul className="flex flex-wrap gap-2">
                            {p.themes.map((t) => (
                              <li key={t} className="bg-ink/[0.06] px-2.5 py-1 on-dark:bg-paper/10 text-xs text-ink/75">
                                {t}
                              </li>
                            ))}
                          </ul>
                          <Links p={p} />
                          <Link href={`/publications/${p.slug}`} className="link-underline inline-block font-serif text-lg">
                            Fiche détaillée →
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className="md:col-span-2 md:text-right">
                  <button
                    type="button"
                    onClick={() => setOpen(expanded ? null : p.id)}
                    aria-expanded={expanded}
                    aria-controls={`pub-details-${p.id}`}
                    className={cn(
                      "inline-flex min-h-10 items-center gap-2 rounded-[3px] border px-3 text-sm transition-colors",
                      expanded ? "border-ink bg-ink text-paper" : "border-ink/50 hover:border-ink",
                    )}
                  >
                    {expanded ? <Minus className="size-4" aria-hidden /> : <Plus className="size-4" aria-hidden />}
                    {expanded ? "Réduire" : "Résumé"}
                  </button>
                </div>
              </article>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
