"use client";

import { a11y } from "@/i18n";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import type { Capability, Publication, ResearchTheme, Tool } from "@/types/content";
import { cn } from "@/lib/utils/cn";

const STAGE_LABEL: Record<Capability["stage"], string> = {
  formaliser: "Formaliser",
  simuler: "Simuler",
  interpreter: "Interpréter",
  partager: "Partager",
};

export function CapabilityExplorer({
  capabilities,
  publications,
  research,
  tools,
  visuals,
}: {
  capabilities: Capability[];
  publications: Publication[];
  research: ResearchTheme[];
  tools: Tool[];
  visuals: Record<Capability["visual"], ReactNode>;
}) {
  const [active, setActive] = useState(capabilities[0].id);
  const reduce = useReducedMotion();
  const cap = capabilities.find((c) => c.id === active)!;
  const pubs = cap.publicationIds.map((id) => publications.find((p) => p.id === id)).filter(Boolean) as Publication[];
  const themes = cap.researchSlugs.map((s) => research.find((r) => r.slug === s)).filter(Boolean) as ResearchTheme[];
  const capTools = cap.toolIds.map((id) => tools.find((t) => t.id === id)).filter(Boolean) as Tool[];

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <div className="lg:col-span-4">
        <ul className="divide-y divide-rule border-y border-ink" role="listbox" aria-label={a11y.competencesScientifiques}>
          {capabilities.map((c) => {
            const on = c.id === active;
            return (
              <li key={c.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={on}
                  onClick={() => setActive(c.id)}
                  className={cn("group flex w-full items-baseline gap-4 py-4 text-left transition-colors", on ? "text-ink" : "text-ink/65 hover:text-ink")}
                >
                  <span className="flex-1">
                    <span className={cn("block font-serif text-[1.45rem] leading-tight", on && "italic")}>{c.title}</span>
                    <span className="mt-1 block text-xs text-muted">{STAGE_LABEL[c.stage]}</span>
                  </span>
                  <span className={cn("size-2 self-center rounded-full transition-colors", on ? "bg-vermilion" : "bg-transparent")} aria-hidden />
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={cap.id}
          initial={reduce ? false : { opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, x: -8 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="grid gap-8 lg:col-span-8 md:grid-cols-2"
          aria-live="polite"
        >
          <div className="space-y-6">
            <div>
              <p className="label mb-3 text-vermilion-deep">
                Étape : {STAGE_LABEL[cap.stage].toLowerCase()}
              </p>
              <h3 className="font-serif text-title">{cap.title}</h3>
              <p className="mt-4 leading-relaxed">{cap.description}</p>
            </div>
            <div className="border-l-2 border-vermilion pl-4">
              <p className="label mb-1 text-muted">Preuve</p>
              <p className="text-sm">{cap.evidenceLabel}</p>
            </div>
            <div>
              <p className="label mb-2 text-muted">Publication liée</p>
              <ul className="space-y-2">
                {pubs.map((p) => (
                  <li key={p.id}>
                    <Link href={`/publications/${p.slug}`} className="link-underline font-serif text-lg leading-snug">
                      {p.publicationType === "these" ? "Thèse de doctorat (2025)" : `${p.title} (${p.year})`}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="label mb-2 text-muted">Recherche associée</p>
              <ul className="flex flex-wrap gap-2">
                {themes.map((t) => (
                  <li key={t.slug}>
                    <Link href={`/recherche/${t.slug}`} className="inline-block bg-ink/[0.06] px-2.5 py-1 on-dark:bg-paper/10 text-xs hover:border-ink">
                      {t.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="space-y-6">
            <div className="rounded-[3px] border border-rule bg-stone/40 p-4 text-ink">{visuals[cap.visual]}</div>
            <div>
              <p className="label mb-2 text-muted">Outils vérifiés dans le code</p>
              <dl className="divide-y divide-rule border-y border-rule text-sm">
                {capTools.map((t) => (
                  <div key={t.id} className="grid grid-cols-[7.5rem_1fr] gap-3 py-2">
                    <dt className="tabular-nums text-[0.8rem]">{t.name}</dt>
                    <dd className="text-muted">
                      {t.role}
                      <span className="mono-meta mt-0.5 block text-[0.68rem]">{t.evidence[0]}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {cap.links.map((l) => (
                <li key={l.url}>
                  <a href={l.url} target="_blank" rel="noopener noreferrer" className="link-underline inline-flex items-center gap-1 text-sm">
                    {l.label}
                    <ArrowUpRight className="size-3.5" aria-hidden />
                    <span className="sr-only">(nouvel onglet)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
