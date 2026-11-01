"use client";

import { useState } from "react";
import { a11y } from "@/i18n";
import { cn } from "@/lib/utils/cn";
import { usePlayOnce } from "@/hooks/usePlayOnce";
import { PAD, FAMILY_FILL } from "@/components/puzzle/constants";
import type { Board, PuzzleTool } from "@/components/puzzle/board";
import { PuzzlePiece } from "@/components/puzzle/PuzzlePiece";
import type { ActivityAxis } from "@/data/axes";

/**
 * Hero motion design: twenty tools fly in family by family and lock together,
 * the four activity axes close the cross, and the centre stays open for the
 * visitor's project. Hover a piece, or pick a family, to read what it is for.
 */
export function ToolPuzzle({ board }: { board: Board }) {
  const [hover, setHover] = useState<string | null>(null);
  const [family, setFamily] = useState<string | null>(null);
  const { slots, tools, families, axes, view } = board;
  const { ref, play } = usePlayOnce<HTMLElement>(0.3);

  return (
    <figure ref={ref} data-play={play || undefined} className="pz" aria-labelledby="pz-caption">
      <svg viewBox={`${-PAD} ${-PAD} ${view} ${view}`} className="pz-board block h-auto w-full overflow-visible">
        {slots.map((s) => (
          <PuzzlePiece
            key={`${s.r}-${s.c}`}
            slot={s}
            tools={tools.length}
            dim={family !== null && (s.kind !== "tool" || s.item.family !== family)}
            onHover={setHover}
          />
        ))}
      </svg>
      <figcaption id="pz-caption" className="mt-5 min-h-[3.25rem] text-[0.95rem] leading-snug" aria-live="polite">
        <Caption hover={hover} family={family} tools={tools} axes={axes} />
      </figcaption>
      <FamilyLegend families={families} active={family} onPick={setFamily} />
      <ul className="sr-only">
        {tools.map((t) => (
          <li key={t.id}>
            {t.name} : {t.role}
          </li>
        ))}
      </ul>
    </figure>
  );
}

type CaptionProps = { hover: string | null; family: string | null; tools: PuzzleTool[]; axes: ActivityAxis[] };

function Caption({ hover, family, tools, axes }: CaptionProps) {
  const tool = tools.find((t) => t.id === hover);
  if (tool) {
    return (
      <>
        <span className="font-semibold">{tool.name}</span> — {tool.role}
        <span className="block text-sm text-muted">
          {tool.familyLabel} · {tool.inPublicCode ? "utilisé dans le code publié (GitLab, Zenodo)" : "hors code publié"}
        </span>
      </>
    );
  }
  const axis = axes.find((a) => a.id === hover);
  if (axis) return <><span className="font-semibold">{axis.label}</span> — {axis.summary}</>;
  if (hover === "projet") return <><span className="font-semibold">La pièce manquante</span> — un projet, une question, un financement : parlons-en.</>;
  if (family) {
    const names = tools.filter((t) => t.family === family).map((t) => t.name);
    return <>{names.join(", ")}.</>;
  }
  return (
    <>
      {tools.length} outils, {axes.length} axes d&apos;activité.{" "}
      <span className="text-muted">Survolez une pièce pour savoir à quoi elle sert.</span>
    </>
  );
}

type Family = Board["families"][number];

function FamilyLegend({ families, active, onPick }: { families: Family[]; active: string | null; onPick: (id: string | null) => void }) {
  return (
    <div role="group" aria-label={a11y.puzzleFamilies} className="mt-3 flex flex-wrap gap-1.5">
      {families.map((f) => (
        <button
          key={f.id}
          type="button"
          aria-pressed={active === f.id}
          onClick={() => onPick(active === f.id ? null : f.id)}
          className={cn(
            "flex min-h-9 items-center gap-2 border px-2.5 py-1 text-[0.8rem] transition-colors duration-200",
            active === f.id ? "border-antibes bg-antibes text-paper" : "border-ink/20 hover:border-antibes",
          )}
        >
          <span className="size-2.5 shrink-0" style={{ background: FAMILY_FILL[f.id] }} aria-hidden />
          {f.label}
          <span className="tabular-nums text-current/70">{f.count}</span>
        </button>
      ))}
    </div>
  );
}
