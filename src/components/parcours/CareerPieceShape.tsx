import type { CSSProperties } from "react";
import { Building2, FileText, GraduationCap, Presentation, School, Shapes, Users, type LucideIcon } from "lucide-react";
import { CAREER_CELL, type CareerPiece } from "@/components/parcours/board";

const ICON: Record<CareerPiece["kind"], LucideIcon> = {
  formation: School,
  experience: Building2,
  doctorat: GraduationCap,
  collaboration: Users,
  publication: FileText,
  communication: Presentation,
  competence: Shapes,
};

/** Bleu Antibes by kind; skills are light pieces, like the axes of the hero puzzle. */
export const KIND_FILL: Record<CareerPiece["kind"], string> = {
  formation: "#10355d",
  experience: "#163f6b",
  doctorat: "#0b2d4f",
  collaboration: "#3a6a9b",
  publication: "#2468b3",
  communication: "#1d4e80",
  competence: "#e4eaef",
};

type Props = { piece: CareerPiece; selected: boolean; onSelect: () => void };

export function CareerPieceShape({ piece: p, selected, onSelect }: Props) {
  const Icon = ICON[p.kind];
  const light = p.kind === "competence";
  const style = {
    "--dx": `${p.scatter.dx}px`,
    "--dy": `${p.scatter.dy}px`,
    "--rot": `${p.scatter.rot}deg`,
    "--delay": `${0.2 + p.order * 0.085}s`,
    "--flight": "0.85s",
  } as CSSProperties;
  return (
    <g transform={`translate(${p.c * CAREER_CELL} ${p.r * CAREER_CELL})`}>
      <g className="pz-in" style={style}>
        <g
          className="pz-face cp-piece"
          data-piece={p.id}
          data-selected={selected || undefined}
          data-light={light || undefined}
          role="button"
          tabIndex={selected ? 0 : -1}
          aria-pressed={selected}
          aria-label={`${p.label}${p.when ? `, ${p.when}` : ""}`}
          onClick={onSelect}
          onPointerEnter={onSelect}
          onFocus={onSelect}
        >
          <path d={p.path} fill={KIND_FILL[p.kind]} className="pz-shape" />
          {p.year && (
            <text x={9} y={24} className="cp-year">
              {p.year}
            </text>
          )}
          <Icon x={38} y={36} width={24} height={24} strokeWidth={1.5} className={light ? "text-accent-deep" : "text-paper"} aria-hidden />
          <text x={50} y={76} textAnchor="middle" className="cp-label">
            {p.label}
          </text>
        </g>
      </g>
    </g>
  );
}
