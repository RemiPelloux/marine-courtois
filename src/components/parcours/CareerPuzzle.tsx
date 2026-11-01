"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { a11y } from "@/i18n";
import { usePlayOnce } from "@/hooks/usePlayOnce";
import { CAREER_CELL, type CareerBoard, type CareerPiece } from "@/components/parcours/board";
import { CareerPieceShape, KIND_FILL } from "@/components/parcours/CareerPieceShape";

const S = CAREER_CELL;

/**
 * The career as a leaf that grows piece by piece, from the stalk (first
 * poster, 2022, at the bottom) to the tip (the skills built along the way). One piece is
 * selected at a time; arrows, Home and End move the selection.
 */
export function CareerPuzzle({ board, initial = "doctorat" }: { board: CareerBoard; initial?: string }) {
  const { pieces, rows, cols } = board;
  const [selected, setSelected] = useState(initial);
  const { ref, play } = usePlayOnce<HTMLDivElement>(0.2);
  const svgRef = useRef<SVGSVGElement>(null);
  const current = pieces.find((p) => p.id === selected) ?? pieces[0];
  const mid = (cols * S) / 2;

  const move = (to: number) => {
    const next = pieces[(to + pieces.length) % pieces.length];
    setSelected(next.id);
    svgRef.current?.querySelector<SVGGElement>(`[data-piece="${next.id}"]`)?.focus();
  };
  const onKey = (e: KeyboardEvent) => {
    const keys: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    if (e.key in keys) move(current.order + keys[e.key]);
    else if (e.key === "Home") move(0);
    else if (e.key === "End") move(pieces.length - 1);
    else return;
    e.preventDefault();
  };

  return (
    <div ref={ref} data-play={play || undefined} className="pz grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
      <svg
        ref={svgRef}
        viewBox={`-6 -6 ${cols * S + 12} ${rows * S + S * 0.9}`}
        className="mx-auto block h-auto w-full max-w-[34rem] overflow-visible"
        role="group"
        aria-label={a11y.puzzleParcours}
        onKeyDown={onKey}
      >
        <path d={`M${mid} ${rows * S - 4} C ${mid} ${rows * S + 30}, ${mid - 12} ${rows * S + 55}, ${mid - 34} ${rows * S + S * 0.82}`} className="cp-stem" />
        {pieces.map((p) => (
          <CareerPieceShape key={p.id} piece={p} selected={p.id === current.id} onSelect={() => setSelected(p.id)} />
        ))}
        <path d={`M${mid} ${rows * S - S * 0.2} L ${mid} ${S * 0.25}`} className="cp-midrib" aria-hidden />
      </svg>
      <KindLegend kinds={[...new Set(pieces.map((p) => p.kind))].map((k) => ({ kind: k, label: pieces.find((p) => p.kind === k)!.kindLabel }))} />
      <PieceDetail piece={current} total={pieces.length} />
    </div>
  );
}

function PieceDetail({ piece, total }: { piece: CareerPiece; total: number }) {
  const external = piece.href?.startsWith("http");
  return (
    <div aria-live="polite" className="border-t-2 border-antibes pt-6 lg:sticky lg:top-28 lg:col-start-2 lg:row-span-2 lg:row-start-1">
      <p className="text-sm text-accent-deep">
        {piece.kindLabel}
        {piece.when && <> · {piece.when}</>}
        {piece.place && <> · {piece.place}</>}
      </p>
      <h3 className="mt-3 font-serif text-[2rem] leading-[1.08]">{piece.title}</h3>
      <p className="mt-4 text-[1.02rem] leading-relaxed text-ink/85">{piece.detail}</p>
      {piece.href && <DetailLink href={piece.href} external={external} />}
      <p className="mt-8 text-sm text-muted">Flèches du clavier ou survol : parcourez les {total} pièces, de la tige à la pointe.</p>
    </div>
  );
}

function KindLegend({ kinds }: { kinds: { kind: CareerPiece["kind"]; label: string }[] }) {
  return (
    <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-ink/80 lg:col-start-1 lg:row-start-2">
      {kinds.map((k) => (
        <li key={k.kind} className="flex items-center gap-2">
          <span className="size-3 border border-ink/20" style={{ background: KIND_FILL[k.kind] }} aria-hidden />
          {k.label}
        </li>
      ))}
    </ul>
  );
}

function DetailLink({ href, external }: { href: string; external?: boolean }) {
  const cls = "link-underline mt-5 inline-flex items-center gap-2 py-1 font-serif text-lg";
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        Consulter la source <ArrowUpRight className="size-4" aria-hidden />
        <span className="sr-only">(nouvel onglet)</span>
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      En savoir plus <ArrowRight className="size-4" aria-hidden />
    </Link>
  );
}
