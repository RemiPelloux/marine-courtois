"use client";

import { useState } from "react";
import { copy } from "@/i18n/config";
import { useA11y, useLang } from "@/i18n/client";
import { cn } from "@/lib/utils/cn";
import { usePlayOnce } from "@/hooks/usePlayOnce";
import { PAD, FAMILY_FILL } from "@/components/puzzle/constants";
import type { Board, PuzzleTool } from "@/components/puzzle/board";
import { PuzzlePiece } from "@/components/puzzle/PuzzlePiece";
import type { Domain } from "@/data/domains";
import { COLS } from "@/lib/puzzle/layout";

const COPY = copy({
  fr: {
    inCode: "utilisé dans le code publié (GitLab, Zenodo)",
    declared: "hors code publié",
    missing: "La pièce manquante",
    missingText: "un projet, une question, un financement : parlons-en.",
    count: (tools: number, domains: number) => `${tools} outils, ${domains} thèmes.`,
    hint: "Survolez une pièce pour savoir à quoi elle sert.",
  },
  en: {
    inCode: "used in the published code (GitLab, Zenodo)",
    declared: "outside the published code",
    missing: "The missing piece",
    missingText: "a project, a question, a grant: let's talk.",
    count: (tools: number, domains: number) => `${tools} tools, ${domains} themes.`,
    hint: "Hover over a piece to see what it is for.",
  },
});

/**
 * Hero motion design: twenty tools fly in family by family and lock together,
 * four themes close the cross, five more lock in along the bottom row, and the
 * centre stays open for the visitor's project. Hover a piece, or pick a family, to read what it is for.
 */
export function ToolPuzzle({ board }: { board: Board }) {
  const [hover, setHover] = useState<string | null>(null);
  const [family, setFamily] = useState<string | null>(null);
  const { slots, tools, families, domains, view } = board;
  const { ref, play } = usePlayOnce<HTMLElement>(0.3);

  return (
    <figure ref={ref} data-play={play || undefined} className="pz" aria-labelledby="pz-caption">
      <div className="pz-board grid" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)`, padding: `${(PAD / view.width) * 100}%` }}>
        {slots.map((s) => (
          <PuzzlePiece
            key={`${s.r}-${s.c}`}
            slot={s}
            tools={tools.length}
            dim={family !== null && (s.kind !== "tool" || s.item.family !== family)}
            onHover={setHover}
          />
        ))}
      </div>
      <figcaption id="pz-caption" className="mt-5 min-h-[3.25rem] text-note leading-snug" aria-live="polite">
        <Caption hover={hover} family={family} tools={tools} domains={domains} />
      </figcaption>
      <FamilyLegend families={families} active={family} onPick={setFamily} />
      <ul className="sr-only">
        {tools.map((x) => (
          <li key={x.id}>
            {x.name} — {x.role}
          </li>
        ))}
      </ul>
    </figure>
  );
}

type CaptionProps = { hover: string | null; family: string | null; tools: PuzzleTool[]; domains: Domain[] };

function Caption({ hover, family, tools, domains }: CaptionProps) {
  const t = COPY[useLang()];
  const tool = tools.find((x) => x.id === hover);
  if (tool) {
    return (
      <>
        <span className="font-semibold">{tool.name}</span> — {tool.role}
        <span className="block text-sm text-muted">
          {tool.familyLabel} · {tool.inPublicCode ? t.inCode : t.declared}
        </span>
      </>
    );
  }
  const domain = domains.find((d) => d.id === hover);
  if (domain) return <><span className="font-semibold">{domain.label}</span> — {domain.summary}</>;
  if (hover === "projet") return <><span className="font-semibold">{t.missing}</span> — {t.missingText}</>;
  if (family) {
    const names = tools.filter((x) => x.family === family).map((x) => x.name);
    return <>{names.join(", ")}.</>;
  }
  return (
    <>
      {t.count(tools.length, domains.length)} <span className="text-muted">{t.hint}</span>
    </>
  );
}

type Family = Board["families"][number];

function FamilyLegend({ families, active, onPick }: { families: Family[]; active: string | null; onPick: (id: string | null) => void }) {
  const a11y = useA11y();
  return (
    <div role="group" aria-label={a11y.puzzleFamilies} className="mt-3 flex flex-wrap gap-1.5">
      {families.map((f) => (
        <button
          key={f.id}
          type="button"
          aria-pressed={active === f.id}
          onClick={() => onPick(active === f.id ? null : f.id)}
          className={cn(
            "flex min-h-9 items-center gap-2 border px-2.5 py-1 text-meta transition-colors duration-200",
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
