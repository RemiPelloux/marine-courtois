"use client";

import Link from "next/link";
import { ViewTransition, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Plus, Minus } from "lucide-react";
import type { Publication } from "@/types/content";
import { cn } from "@/lib/utils/cn";

export const TYPE_LABEL: Record<Publication["publicationType"], string> = { article: "Article", these: "Thèse", preprint: "Préprint" };

type Heading = "h2" | "h3";

function Authors({ authors }: { authors: string[] }) {
  return (
    <>
      {authors.map((a, i) => (
        <span key={a}>
          <span className={a.includes("Courtois") ? "font-medium text-ink underline decoration-antibes decoration-2 underline-offset-4" : undefined}>{a}</span>
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
          <a href={l.url} target="_blank" rel="noopener noreferrer" className="link-underline inline-flex min-h-6 items-center gap-1 py-1 tabular-nums text-[0.8rem]">
            {l.label}
            <ArrowUpRight className="size-3.5" aria-hidden />
            <span className="sr-only">(nouvel onglet)</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

function ThemeTags({ themes }: { themes: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {themes.map((t) => (
        <li key={t} className="bg-ink/[0.06] px-2.5 py-1 on-dark:bg-paper/10 text-xs text-ink/75">
          {t}
        </li>
      ))}
    </ul>
  );
}

function PublicationTitle({ p, H, className, children }: { p: Publication; H: Heading; className: string; children: ReactNode }) {
  return (
    <H id={`pub-${p.id}`} className={className}>
      <ViewTransition name={`pub-${p.slug}`} share="morph" default="none">
        <Link href={`/publications/${p.slug}`} className="hover:text-accent-deep">
          {children}
        </Link>
      </ViewTransition>
    </H>
  );
}

export function FeaturedPublication({ p, H }: { p: Publication; H: Heading }) {
  return (
    <article className="mb-14 grid gap-8 border-b border-ink pb-14 lg:grid-cols-12" aria-labelledby={`pub-${p.id}`}>
      <FeaturedLead p={p} H={H} />
      <div className="space-y-5 lg:col-span-6 lg:col-start-7">
        <p className="text-[1.05rem] leading-relaxed">{p.summaryFr}</p>
        <p className="text-sm text-muted">
          <Authors authors={p.authors} />
        </p>
        <ThemeTags themes={p.themes} />
        <Links p={p} />
        <Link href={`/publications/${p.slug}`} className="link-underline inline-block font-serif text-lg">
          Lire la fiche détaillée →
        </Link>
      </div>
    </article>
  );
}

function FeaturedLead({ p, H }: { p: Publication; H: Heading }) {
  return (
    <div className="lg:col-span-5">
      <p className="label mb-5 flex items-center gap-3">
        <span className="text-accent-deep">À la une</span>
        <span className="h-px w-6 bg-ink/40" />
        {p.year} · {p.journal}
      </p>
      <PublicationTitle p={p} H={H} className="font-serif text-title">
        {p.editorialTitle}
      </PublicationTitle>
      <p className="mt-4 font-serif text-xl text-ink/70 italic" lang="en">
        {p.title}
      </p>
    </div>
  );
}

type RowProps = { p: Publication; H: Heading; expanded: boolean; onToggle: () => void };

export function PublicationRow({ p, H, expanded, onToggle }: RowProps) {
  return (
    <li>
      <article aria-labelledby={`pub-${p.id}`} className="grid gap-4 py-7 md:grid-cols-12 md:gap-6">
        <div className="flex items-baseline gap-4 md:col-span-2 md:block">
          <p className="font-serif text-4xl text-accent-deep italic">{p.year}</p>
          <p className="label mt-1 text-muted">{TYPE_LABEL[p.publicationType]}</p>
        </div>
        <RowBody p={p} H={H} expanded={expanded} />
        <div className="md:col-span-2 md:text-right">
          <SummaryToggle id={p.id} expanded={expanded} onToggle={onToggle} />
        </div>
      </article>
    </li>
  );
}

function RowBody({ p, H, expanded }: Omit<RowProps, "onToggle">) {
  return (
    <div className="md:col-span-8">
      <p className="mono-meta mb-2 text-muted">{p.journal}</p>
      <PublicationTitle p={p} H={H} className="font-serif text-[1.65rem] leading-tight md:text-[1.9rem]">
        {p.publicationType === "these" ? p.title : p.editorialTitle ?? p.title}
      </PublicationTitle>
      {p.publicationType !== "these" && (
        <p className="mt-2 text-[0.95rem] text-ink/70 italic" lang="en">
          {p.title}
        </p>
      )}
      <p className="mt-3 text-sm text-muted">
        <Authors authors={p.authors} />
      </p>
      <AnimatePresence initial={false}>{expanded && <RowDetails p={p} />}</AnimatePresence>
    </div>
  );
}

function RowDetails({ p }: { p: Publication }) {
  const reduce = useReducedMotion();
  return (
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
        <ThemeTags themes={p.themes} />
        <Links p={p} />
        <Link href={`/publications/${p.slug}`} className="link-underline inline-block font-serif text-lg">
          Fiche détaillée →
        </Link>
      </div>
    </motion.div>
  );
}

function SummaryToggle({ id, expanded, onToggle }: { id: string; expanded: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={expanded}
      aria-controls={`pub-details-${id}`}
      className={cn(
        "inline-flex min-h-10 items-center gap-2 rounded-[3px] border px-3 text-sm transition-colors",
        expanded ? "border-ink bg-ink text-paper" : "border-ink/50 hover:border-ink",
      )}
    >
      {expanded ? <Minus className="size-4" aria-hidden /> : <Plus className="size-4" aria-hidden />}
      {expanded ? "Réduire" : "Résumé"}
    </button>
  );
}
