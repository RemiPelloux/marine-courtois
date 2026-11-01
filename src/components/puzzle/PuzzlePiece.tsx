import Link from "next/link";
import { BookOpen, GraduationCap, Microscope, Presentation, type LucideIcon } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { a11y } from "@/i18n";
import { ToolIcon } from "@/components/interactions/tool-icons";
import { CELL, FAMILY_FILL, FLIGHT, delayFor } from "@/components/puzzle/constants";
import type { PuzzleSlot } from "@/components/puzzle/board";

type PieceProps = { slot: PuzzleSlot; tools: number; dim: boolean; onHover: (id: string | null) => void };

/** Short on-piece labels; the caption always gives the full name. */
const SHORT: Record<string, string> = { tensorflow: "TF / Keras", boosting: "XGB / LGBM" };
const AXIS_ICON: Record<string, LucideIcon> = { recherche: Microscope, communication: Presentation, enseignement: GraduationCap, publications: BookOpen };

/** Content sits between the tab zones: icon in the middle band, label in the 67–79 band. */
const ICON = { x: 34, y: 25, size: 32 };
const LABEL_Y = 77;

/** Positions a piece on the board and carries its fly-in (see puzzle.css). */
function Placed({ slot, tools, dim, children }: { slot: PuzzleSlot; tools: number; dim: boolean; children: ReactNode }) {
  const style = {
    "--dx": `${slot.scatter.dx}px`,
    "--dy": `${slot.scatter.dy}px`,
    "--rot": `${slot.scatter.rot}deg`,
    "--delay": `${delayFor(slot.order, tools)}s`,
    "--flight": `${FLIGHT}s`,
  } as CSSProperties;
  return (
    <g transform={`translate(${slot.c * CELL} ${slot.r * CELL})`}>
      <g className="pz-in" style={style}>
        <g className="pz-face" data-dim={dim || undefined} data-kind={slot.kind}>
          {children}
        </g>
      </g>
    </g>
  );
}

export function PuzzlePiece({ slot, tools, dim, onHover }: PieceProps) {
  if (slot.kind === "tool") {
    const t = slot.item;
    return (
      <Placed slot={slot} tools={tools} dim={dim}>
        <g aria-hidden onPointerEnter={() => onHover(t.id)} onPointerLeave={() => onHover(null)}>
          <path d={slot.path} fill={FAMILY_FILL[t.family]} className="pz-shape" />
          <svg x={ICON.x} y={ICON.y} width={ICON.size} height={ICON.size} viewBox="0 0 24 24" className="text-paper">
            <ToolIcon id={t.id} />
          </svg>
          <text x={50} y={LABEL_Y} textAnchor="middle" className="pz-label">
            {SHORT[t.id] ?? t.name}
          </text>
        </g>
      </Placed>
    );
  }
  if (slot.kind === "axis") return <AxisPiece slot={slot} tools={tools} dim={dim} onHover={onHover} />;
  return <ProjectPiece slot={slot} tools={tools} onHover={onHover} />;
}

function AxisPiece({ slot, tools, dim, onHover }: PieceProps) {
  if (slot.kind !== "axis") return null;
  const a = slot.item;
  const Icon = AXIS_ICON[a.id] ?? BookOpen;
  return (
    <Placed slot={slot} tools={tools} dim={dim}>
      <Link href={a.href} className="pz-link" onPointerEnter={() => onHover(a.id)} onPointerLeave={() => onHover(null)} onFocus={() => onHover(a.id)} onBlur={() => onHover(null)}>
        <path d={slot.path} className="pz-shape fill-stone" />
        <Icon x={ICON.x + 2} y={ICON.y + 1} width={28} height={28} strokeWidth={1.4} className="text-accent-deep" aria-hidden />
        <text x={50} y={LABEL_Y} textAnchor="middle" className="pz-axis">
          {a.label}
        </text>
      </Link>
    </Placed>
  );
}

/** The empty centre: the piece the visitor brings. */
function ProjectPiece({ slot, tools, onHover }: Omit<PieceProps, "dim">) {
  return (
    <Placed slot={slot} tools={tools} dim={false}>
      <Link href="/contact" aria-label={a11y.votreProjet} className="pz-link pz-project" onPointerEnter={() => onHover("projet")} onPointerLeave={() => onHover(null)} onFocus={() => onHover("projet")} onBlur={() => onHover(null)}>
        <path d={slot.path} className="pz-slot" />
        <text x={50} y={47} textAnchor="middle" className="pz-project-text">
          <tspan x={50}>Votre</tspan>
          <tspan x={50} dy={19}>
            projet
          </tspan>
        </text>
      </Link>
    </Placed>
  );
}
