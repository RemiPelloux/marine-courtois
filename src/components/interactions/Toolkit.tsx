"use client";

import { useState, type CSSProperties } from "react";
import { a11y } from "@/i18n";
import type { ToolkitEntry, ToolkitFamily } from "@/data/toolkit";
import { usePlayOnce } from "@/hooks/usePlayOnce";
import { ToolIcon, brandHex } from "@/components/interactions/tool-icons";
import { cn } from "@/lib/utils/cn";

type Focus = "tous" | "code" | "declares";

const FOCUS_OPTIONS: { id: Focus; label: string; match: (t: ToolkitEntry) => boolean }[] = [
  { id: "tous", label: "Tous", match: () => true },
  { id: "code", label: "Dans le code publié", match: (t) => t.inPublicCode },
  { id: "declares", label: "Également utilisés", match: (t) => !t.inPublicCode },
];

/** Layer shades, from the foundation (deepest bleu Antibes) to the top of the stack. */
const SHADES = ["#0b2d4f", "#113861", "#174373", "#1d4e84", "#235994"];

/**
 * The toolkit as a stack: one slab per family, the languages at the base.
 * On first view the stack builds from the foundation up, then each tool's
 * mark pops onto its slab. Solid tiles are imported in the public repositories;
 * dashed tiles are declared tools used outside them.
 */
export function Toolkit({ families }: { families: ToolkitFamily[] }) {
  const [focus, setFocus] = useState<Focus>("tous");
  const { ref, play } = usePlayOnce(0.25);
  const match = FOCUS_OPTIONS.find((o) => o.id === focus)!.match;
  const count = families.flatMap((f) => f.tools).filter(match).length;
  // families arrive foundation-first; the stack is drawn top-down
  const layers = families.map((f, i) => ({ f, level: i })).reverse();

  return (
    <div>
      <FocusBar focus={focus} onChange={setFocus} count={count} />
      <div ref={ref} data-play={play || undefined} className="tk-stack mt-10 flex flex-col gap-2">
        {layers.map(({ f, level }) => (
          <ToolkitSlab key={f.id} family={f} level={level} depth={families.length} match={match} />
        ))}
        <p className="mt-1 text-xs text-muted">Du socle (langages) au partage : chaque couche s&apos;appuie sur celle du dessous.</p>
      </div>
      <Legend />
    </div>
  );
}

type SlabProps = { family: ToolkitFamily; level: number; depth: number; match: (t: ToolkitEntry) => boolean };

function ToolkitSlab({ family: f, level, depth, match }: SlabProps) {
  const inset = (depth - 1 - level) * 2.2; // upper slabs step in: a stack, not a list
  return (
    <section
      aria-label={f.label}
      className="tk-slab on-dark relative grid items-center gap-x-8 gap-y-4 px-5 py-5 text-paper md:grid-cols-[13rem_1fr] md:px-7"
      style={{ background: SHADES[level] ?? SHADES[SHADES.length - 1], marginInline: `${inset}%`, "--i": level } as CSSProperties}
    >
      <div className="flex items-baseline justify-between gap-3 md:block">
        <h3 className="font-serif text-2xl leading-tight">{f.label}</h3>
        <p className="text-xs text-paper/90 tabular-nums md:mt-1">
          {f.tools.length} outil{f.tools.length > 1 ? "s" : ""}
        </p>
      </div>
      <ul className="flex flex-wrap gap-3">
        {f.tools.map((t, j) => (
          <ToolTile key={t.id} tool={t} dim={!match(t)} order={level * 6 + j} />
        ))}
      </ul>
    </section>
  );
}

function ToolTile({ tool, dim, order }: { tool: ToolkitEntry; dim: boolean; order: number }) {
  const hex = brandHex(tool.id) ?? "#0b2d4f";
  return (
    <li
      data-testid={`tool-${tool.id}`}
      data-dim={dim}
      className="tk-tile group relative transition-opacity duration-300 data-[dim=true]:opacity-25"
      style={{ "--o": order, "--brand": hex } as CSSProperties}
    >
      <ToolTileFace tool={tool} />
      <ToolTooltip tool={tool} />
      <span className="sr-only">
        : {tool.role}
        {tool.inPublicCode ? "" : " (hors code publié)"}
      </span>
    </li>
  );
}

function ToolTileFace({ tool }: { tool: ToolkitEntry }) {
  return (
    <div
      className={cn(
        "flex w-[5.75rem] flex-col items-center gap-2 px-2 pt-3.5 pb-2.5 transition-colors duration-300",
        tool.inPublicCode ? "bg-paper/[0.09] group-hover:bg-paper" : "border border-dashed border-paper/50 group-hover:border-paper group-hover:bg-paper",
      )}
    >
      <ToolIcon id={tool.id} className="size-8 text-paper transition-colors duration-300 group-hover:text-[var(--brand)]" />
      <span className="text-center text-xs leading-tight font-medium text-paper transition-colors duration-300 group-hover:text-ink">{tool.name}</span>
    </div>
  );
}

function ToolTooltip({ tool }: { tool: ToolkitEntry }) {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-1/2 z-20 w-56 -translate-x-1/2 bg-paper px-3 py-2 text-xs leading-snug text-ink opacity-0 shadow-[0_6px_24px_rgba(11,45,79,0.25)] transition-opacity duration-200 group-hover:opacity-100"
    >
      {tool.role}
      <span className="mt-1 block text-muted">{tool.inPublicCode ? "Importé dans les dépôts publics" : "Hors code publié"}</span>
    </span>
  );
}

function FocusBar({ focus, onChange, count }: { focus: Focus; onChange: (f: Focus) => void; count: number }) {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
      <div role="group" aria-label={a11y.mettreEnEvidenceLesOutils} className="flex flex-wrap gap-2">
        {FOCUS_OPTIONS.map((o) => (
          <button
            key={o.id}
            type="button"
            aria-pressed={focus === o.id}
            onClick={() => onChange(o.id)}
            className={cn(
              "min-h-10 border px-3.5 py-1.5 text-sm transition-colors duration-200",
              focus === o.id ? "border-antibes bg-antibes text-paper" : "border-ink/30 hover:border-antibes",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
      <p role="status" className="mono-meta text-muted">
        {count} outils
      </p>
    </div>
  );
}

function Legend() {
  return (
    <ul className="mono-meta mt-6 flex flex-wrap gap-x-8 gap-y-2 text-muted">
      <li className="flex items-center gap-2">
        <span className="inline-block size-3.5 bg-antibes" aria-hidden /> Importé dans les dépôts publics (GitLab)
      </li>
      <li className="flex items-center gap-2">
        <span className="inline-block size-3.5 border border-dashed border-antibes" aria-hidden /> Également utilisé, hors code publié
      </li>
    </ul>
  );
}
