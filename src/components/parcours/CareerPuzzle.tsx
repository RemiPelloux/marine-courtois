"use client";

import { useReducer, type KeyboardEvent } from "react";
import { copy } from "@/i18n/config";
import { useLang } from "@/i18n/client";
import { cn } from "@/lib/utils/cn";
import { usePlayOnce } from "@/hooks/usePlayOnce";
import { BLOCK_COLS, CAREER_CELL as S, type CompetenceBoard, type DomainBlock } from "@/components/parcours/board";
import { CompetencePiece, DOMAIN_FILL } from "@/components/parcours/CompetencePiece";
import { DomainPanel } from "@/components/parcours/DomainPanel";
import { selectDomain } from "@/components/parcours/assembly";
import type { DomainId } from "@/data/competences";

const COPY = copy({
  fr: { group: "Compétences par domaine : choisissez un domaine, ou passez de l'un à l'autre avec les flèches" },
  en: { group: "Competences by domain: pick a domain, or move between them with the arrow keys" },
});

const STEP: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };

/**
 * The career as four interlocking domains: mathematics, statistics, biology,
 * ecology. Each block is made of its competence pieces, which fly in and lock
 * together. One domain is selected at a time; the panel lists its competences
 * and where each one is used, and a newly picked block reassembles piece by
 * piece. Arrows, Home and End move between domains.
 */
type CareerPuzzleProps = { board: CompetenceBoard; initial?: DomainId; compact?: boolean };

export function CareerPuzzle({ board, initial = "mathematiques", compact = false }: CareerPuzzleProps) {
  const [{ selected, drops }, select] = useReducer(selectDomain, { selected: initial, drops: {} });
  const { ref, play } = usePlayOnce<HTMLDivElement>(0.2);
  const t = COPY[useLang()];
  const { domains } = board;
  const current = domains.find((d) => d.id === selected) ?? domains[0];

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const at = domains.indexOf(current);
    const to = e.key === "Home" ? 0 : e.key === "End" ? domains.length - 1 : e.key in STEP ? at + STEP[e.key] : null;
    if (to === null) return;
    e.preventDefault();
    const next = domains[(to + domains.length) % domains.length];
    select(next.id);
    e.currentTarget.querySelector<HTMLButtonElement>(`[data-domain="${next.id}"]`)?.focus();
  };

  return (
    <div ref={ref} data-play={play || undefined} className="pz grid items-start gap-12 lg:grid-cols-12 lg:gap-14">
      <div role="group" aria-label={t.group} onKeyDown={onKey} className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:sticky lg:top-28 lg:col-span-7">
        {domains.map((d) => (
          <DomainButton key={d.id} domain={d} drop={drops[d.id] ?? 0} selected={d.id === current.id} onSelect={() => select(d.id)} />
        ))}
      </div>
      <DomainPanel domain={current} compact={compact} className="lg:col-span-5" />
    </div>
  );
}

type DomainButtonProps = { domain: DomainBlock; drop: number; selected: boolean; onSelect: () => void };

/** A domain block: its name above, its competence pieces below; the whole block is the button. `drop` > 0: reassemble on pick. */
function DomainButton({ domain: d, drop, selected, onSelect }: DomainButtonProps) {
  return (
    <button
      type="button"
      data-domain={d.id}
      aria-pressed={selected}
      aria-controls="competences-panel"
      tabIndex={selected ? 0 : -1}
      onClick={onSelect}
      onFocus={onSelect}
      className="group block w-full cursor-pointer text-left outline-offset-8"
    >
      <span className={cn("flex items-center gap-3 border-t-2 pt-3 pb-5 transition-colors duration-300", selected ? "border-antibes" : "border-ink/15 group-hover:border-ink/40")}>
        <span className="size-3 shrink-0 border border-ink/25" style={{ background: DOMAIN_FILL[d.id].fill }} aria-hidden />
        <span className="font-serif text-2xl leading-none">{d.title}</span>
        <span className="text-sm text-muted">{d.subtitle}</span>
      </span>
      <svg
        viewBox={`-4 -4 ${BLOCK_COLS * S + 8} ${d.rows * S + 8}`}
        className={cn("block h-auto w-full overflow-visible transition-[translate,filter] duration-300", selected && "-translate-y-1 drop-shadow-[0_10px_14px_rgb(11_45_79_/_0.25)]")}
        aria-hidden
      >
        {d.pieces.map((p, i) => (
          <CompetencePiece key={`${p.id}-${drop}`} piece={p} step={drop > 0 ? i : undefined} />
        ))}
      </svg>
    </button>
  );
}
