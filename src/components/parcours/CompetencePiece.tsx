import type { CSSProperties } from "react";
import {
  Activity, BrainCircuit, Bug, ChartColumn, ChartLine, Cherry, Code, Crosshair, Dna, Egg, Fish, Grid3x3, Leaf, Network,
  Repeat, Scale, Shapes, Sigma, SlidersHorizontal, Split, Sprout, Table, TrendingUp, Users, Waves, type LucideIcon,
} from "lucide-react";
import { CAREER_CELL, type CompetencePiece as Piece } from "@/components/parcours/board";
import type { DomainId } from "@/data/competences";

const ICON: Record<string, LucideIcon> = {
  edo: Sigma, stabilite: Crosshair, bifurcations: Split, impulsionnel: Activity, "individu-centre": Users, algebre: Grid3x3,
  bayes: ChartColumn, sensibilite: SlidersHorizontal, lineaire: TrendingUp, r: Code, excel: Table, "deep-learning": BrainCircuit,
  tis: Bug, fertilite: Egg, polyandrie: Repeat, ravageurs: Cherry, physiologie: Leaf, "multi-omique": Dna,
  populations: ChartLine, predation: Fish, invasions: Waves, trophique: Network, competition: Scale, "lutte-biologique": Sprout,
};

/** Bleu Antibes shades: two deep domains with light text, two light domains with ink text. */
export const DOMAIN_FILL: Record<DomainId, { fill: string; light: boolean }> = {
  mathematiques: { fill: "#0b2d4f", light: false },
  statistiques: { fill: "#2468b3", light: false },
  biologie: { fill: "#8fc1ea", light: true },
  ecologie: { fill: "#e4eaef", light: true },
};

/** One competence: a jigsaw piece with its icon and a one-line label in the lower clear band. */
export function CompetencePiece({ piece: p }: { piece: Piece }) {
  const Icon = ICON[p.id] ?? Shapes;
  const { fill, light } = DOMAIN_FILL[p.domain];
  const style = {
    "--dx": `${p.scatter.dx}px`,
    "--dy": `${p.scatter.dy}px`,
    "--rot": `${p.scatter.rot}deg`,
    "--delay": `${0.15 + p.order * 0.06}s`,
    "--flight": "0.8s",
  } as CSSProperties;
  return (
    <g transform={`translate(${p.c * CAREER_CELL} ${p.r * CAREER_CELL})`}>
      <g className="pz-in" style={style}>
        <g className={light ? "pz-face text-ink" : "pz-face text-paper"} data-piece={p.id}>
          <path d={p.path} fill={fill} className="pz-shape" style={light ? { stroke: "rgb(11 45 79 / 0.35)" } : undefined} />
          <Icon x={39} y={34} width={22} height={22} strokeWidth={1.5} aria-hidden />
          <text x={50} y={76} textAnchor="middle" className="fill-current font-sans text-[10.5px] font-medium">
            {p.label}
          </text>
        </g>
      </g>
    </g>
  );
}
