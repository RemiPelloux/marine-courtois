"use client";

import { animate, onScroll, stagger, utils } from "animejs";
import { useRef, useState } from "react";
import { useAnimeScope } from "@/hooks/useAnimeScope";
import { a11y } from "@/i18n";
import type { ToolkitEntry, ToolkitFamily } from "@/data/toolkit";
import { cn } from "@/lib/utils/cn";

type Focus = "tous" | "code" | "declares";

const FOCUS_OPTIONS: { id: Focus; label: string; match: (t: ToolkitEntry) => boolean }[] = [
  { id: "tous", label: "Tous", match: () => true },
  { id: "code", label: "Dans le code publié", match: (t) => t.inPublicCode },
  { id: "declares", label: "Également utilisés", match: (t) => !t.inPublicCode },
];

/** Names rise out of a mask, family by family, as each row scrolls in. */
function toolkitEntrance(root: HTMLElement) {
  utils.set(root.querySelectorAll(".tk-name"), { y: "105%" });
  root.querySelectorAll<HTMLElement>(".tk-family").forEach((row) => {
    animate(row.querySelectorAll(".tk-name"), {
      y: "0%",
      duration: 820,
      delay: stagger(55),
      ease: "out(4)",
      autoplay: onScroll({ target: row, enter: "88% top", repeat: false }),
    });
  });
}

export function Toolkit({ families }: { families: ToolkitFamily[] }) {
  const [focus, setFocus] = useState<Focus>("tous");
  const root = useRef<HTMLDivElement>(null);
  useAnimeScope(root, toolkitEntrance);
  const match = FOCUS_OPTIONS.find((o) => o.id === focus)!.match;
  const count = families.flatMap((f) => f.tools).filter(match).length;

  return (
    <div ref={root}>
      <FocusBar focus={focus} onChange={setFocus} count={count} />
      <div className="mt-8 border-t border-ink">
        {families.map((f) => (
          <div key={f.id} className="tk-family grid gap-4 border-b border-rule py-7 md:grid-cols-12 md:gap-8">
            <h3 className="label pt-2 text-muted md:col-span-3">{f.label}</h3>
            <ul className="grid gap-x-8 gap-y-6 sm:grid-cols-2 md:col-span-9 lg:grid-cols-3">
              {f.tools.map((t) => (
                <ToolItem key={t.id} tool={t} dim={!match(t)} />
              ))}
            </ul>
          </div>
        ))}
      </div>
      <Legend />
    </div>
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
              "border px-3.5 py-1.5 text-sm transition-colors duration-200",
              focus === o.id ? "border-ink bg-ink text-paper" : "border-ink/30 hover:border-ink",
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

function ToolItem({ tool, dim }: { tool: ToolkitEntry; dim: boolean }) {
  return (
    <li className="transition-opacity duration-300 ease-[var(--ease-editorial)] data-[dim=true]:opacity-40" data-dim={dim} data-testid={`tool-${tool.id}`}>
      <span className="flex items-baseline gap-2.5">
        <Marker inPublicCode={tool.inPublicCode} />
        <span className="block overflow-hidden pb-1">
          <span className="tk-name block font-serif text-[1.85rem] leading-none">{tool.name}</span>
        </span>
      </span>
      <span className="mt-1.5 block pl-[1.1rem] text-sm leading-snug text-muted">
        {tool.role}
        {!tool.inPublicCode && <span className="sr-only"> — hors code publié</span>}
      </span>
    </li>
  );
}

function Marker({ inPublicCode }: { inPublicCode: boolean }) {
  return (
    <span
      className={cn("inline-block size-[9px] shrink-0 -translate-y-1 rounded-full", inPublicCode ? "bg-vermilion" : "border-[1.5px] border-ink")}
      aria-hidden
    />
  );
}

function Legend() {
  return (
    <ul className="mono-meta mt-6 flex flex-wrap gap-x-8 gap-y-2 text-muted">
      <li className="flex items-center gap-2">
        <Marker inPublicCode /> Importé dans les dépôts publics (GitLab)
      </li>
      <li className="flex items-center gap-2">
        <Marker inPublicCode={false} /> Également utilisé, hors code publié
      </li>
    </ul>
  );
}
