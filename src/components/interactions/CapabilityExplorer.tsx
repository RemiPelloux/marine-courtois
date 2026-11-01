"use client";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import Link from "@/i18n/Link";
import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { copy } from "@/i18n/config";
import { useA11y, useLang } from "@/i18n/client";
import { SpeciesText } from "@/components/ui/Species";
import type { Capability, Publication, ResearchTheme, Tool } from "@/types/content";
import { cn } from "@/lib/utils/cn";

const COPY = copy({
  fr: {
    stage: { formaliser: "Formaliser", simuler: "Simuler", interpreter: "Interpréter", partager: "Partager" } as Record<Capability["stage"], string>,
    stagePrefix: "Étape : ",
    evidence: "Preuve",
    publications: "Publications liées",
    thesis: "Thèse de doctorat (2025)",
    research: "Recherche associée",
    projects: "Projets où elle est mobilisée",
    tools: "Outils vérifiés dans le code",
    newTab: "(nouvel onglet)",
  },
  en: {
    stage: { formaliser: "Formalise", simuler: "Simulate", interpreter: "Interpret", partager: "Share" },
    stagePrefix: "Stage: ",
    evidence: "Evidence",
    publications: "Related publications",
    thesis: "Doctoral thesis (2025)",
    research: "Related research",
    projects: "Projects where it is put to work",
    tools: "Tools verified in the code",
    newTab: "(new tab)",
  },
});

type Text = (typeof COPY)["fr"];

/** A public project, already in the page language. */
export type CapabilityProject = { id: string; slug: string; title: string };

type CapabilitySources = {
  publications: Publication[];
  research: ResearchTheme[];
  tools: Tool[];
  projects: CapabilityProject[];
  visuals: Record<Capability["visual"], ReactNode>;
};

const pickAll = <T,>(ids: string[], items: T[], key: (item: T) => string) =>
  ids.map((id) => items.find((it) => key(it) === id)).filter((x): x is T => x !== undefined);

export function CapabilityExplorer({ capabilities, ...sources }: CapabilitySources & { capabilities: Capability[] }) {
  const [active, setActive] = useState(capabilities[0].id);
  const cap = capabilities.find((c) => c.id === active)!;

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <div className="lg:col-span-4">
        <CapabilityList capabilities={capabilities} active={active} onSelect={setActive} />
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <CapabilityPanel key={cap.id} capability={cap} {...sources} />
      </AnimatePresence>
    </div>
  );
}

function CapabilityList({ capabilities, active, onSelect }: { capabilities: Capability[]; active: string; onSelect: (id: string) => void }) {
  const a11y = useA11y();
  const t = COPY[useLang()];
  return (
    <ul className="divide-y divide-rule border-y border-ink" aria-label={a11y.competencesScientifiques}>
      {capabilities.map((c) => {
        const on = c.id === active;
        return (
          <li key={c.id}>
            <button
              type="button"
              aria-pressed={on}
              aria-controls="capability-detail"
              onClick={() => onSelect(c.id)}
              className={cn("group flex w-full items-baseline gap-4 py-4 text-left transition-colors", on ? "text-ink" : "text-ink/65 hover:text-ink")}
            >
              <span className="flex-1">
                <span className={cn("block font-serif text-[1.45rem] leading-tight", on && "italic")}>{c.title}</span>
                <span className="mt-1 block text-xs text-muted">{t.stage[c.stage]}</span>
              </span>
              <span className={cn("size-2 self-center rounded-full transition-colors", on ? "bg-accent" : "bg-transparent")} aria-hidden />
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function CapabilityPanel({ capability: cap, publications, research, tools, projects, visuals }: CapabilitySources & { capability: Capability }) {
  const reduce = usePrefersReducedMotion();
  const t = COPY[useLang()];
  const linked = {
    publications: pickAll(cap.publicationIds, publications, (p) => p.id),
    themes: pickAll(cap.researchSlugs, research, (r) => r.slug),
    projects: pickAll(cap.projectIds, projects, (p) => p.id),
  };
  const capTools = pickAll(cap.toolIds, tools, (tool) => tool.id);
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, x: -8 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="grid gap-8 lg:col-span-8 md:grid-cols-2"
      id="capability-detail"
      aria-live="polite"
    >
      <CapabilityOverview capability={cap} linked={linked} t={t} />
      <div className="space-y-6">
        <div className="rounded-[3px] border border-rule bg-stone/40 p-4 text-ink">{visuals[cap.visual]}</div>
        <CapabilityTools tools={capTools} t={t} />
        <CapabilityLinks links={cap.links} t={t} />
      </div>
    </motion.div>
  );
}

type Linked = { publications: Publication[]; themes: ResearchTheme[]; projects: CapabilityProject[] };

function CapabilityOverview({ capability: cap, linked, t }: { capability: Capability; linked: Linked; t: Text }) {
  return (
    <div className="space-y-6">
      <div>
        <p className="label mb-3 text-accent-deep">
          {t.stagePrefix}
          {t.stage[cap.stage].toLowerCase()}
        </p>
        <h3 className="font-serif text-title">{cap.title}</h3>
        <p className="mt-4 leading-relaxed">{cap.description}</p>
      </div>
      <div className="border-l-2 border-accent pl-4">
        <p className="label mb-1 text-muted">{t.evidence}</p>
        <p className="text-sm">{cap.evidenceLabel}</p>
      </div>
      <LinkedProjects projects={linked.projects} t={t} />
      <LinkedPublications publications={linked.publications} t={t} />
      <LinkedThemes themes={linked.themes} t={t} />
    </div>
  );
}

function LinkedProjects({ projects, t }: { projects: CapabilityProject[]; t: Text }) {
  if (projects.length === 0) return null;
  return (
    <div>
      <p className="label mb-2 text-muted">{t.projects}</p>
      <ul className="space-y-1.5">
        {projects.map((p) => (
          <li key={p.id}>
            <Link href={`/projets/${p.slug}`} className="link-underline inline-flex items-center gap-1.5 py-0.5 text-[0.95rem]">
              <SpeciesText text={p.title} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function LinkedPublications({ publications, t }: { publications: Publication[]; t: Text }) {
  return (
    <div>
      <p className="label mb-2 text-muted">{t.publications}</p>
      <ul className="space-y-2">
        {publications.map((p) => (
          <li key={p.id}>
            <Link href={`/publications/${p.slug}`} className="link-underline font-serif text-lg leading-snug">
              {p.publicationType === "these" ? t.thesis : `${p.title} (${p.year})`}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function LinkedThemes({ themes, t }: { themes: ResearchTheme[]; t: Text }) {
  return (
    <div>
      <p className="label mb-2 text-muted">{t.research}</p>
      <ul className="flex flex-wrap gap-2">
        {themes.map((theme) => (
          <li key={theme.slug}>
            <Link href={`/recherche/${theme.slug}`} className="inline-block bg-ink/[0.06] px-2.5 py-1 on-dark:bg-paper/10 text-xs hover:border-ink">
              {theme.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CapabilityTools({ tools, t }: { tools: Tool[]; t: Text }) {
  return (
    <div>
      <p className="label mb-2 text-muted">{t.tools}</p>
      <dl className="divide-y divide-rule border-y border-rule text-sm">
        {tools.map((tool) => (
          <div key={tool.id} className="grid grid-cols-[7.5rem_1fr] gap-3 py-2">
            <dt className="tabular-nums text-[0.8rem]">{tool.name}</dt>
            <dd className="text-muted">
              {tool.role}
              <span className="mono-meta mt-0.5 block text-xs">{tool.evidence[0]}</span>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function CapabilityLinks({ links, t }: { links: Capability["links"]; t: Text }) {
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-2">
      {links.map((l) => (
        <li key={l.url}>
          <a href={l.url} target="_blank" rel="noopener noreferrer" className="link-underline inline-flex items-center gap-1 py-1 text-sm">
            {l.label}
            <ArrowUpRight className="size-3.5" aria-hidden />
            <span className="sr-only">{t.newTab}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
