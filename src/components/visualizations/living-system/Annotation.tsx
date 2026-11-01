import { cn } from "@/lib/utils/cn";
import { x, y, type Series, type TooltipKind } from "./model";

const ANN_WILD_T = 45;
const ANN_STERILE_T = 230;

interface AnnotationProps {
  px: number;
  py: number;
  tx: number;
  ty: number;
  label: string[];
  onFocus: () => void;
  onBlur: () => void;
  align: "start" | "end";
}

function AnnotationLabel({ tx, ty, label, align }: Pick<AnnotationProps, "tx" | "ty" | "label" | "align">) {
  const lx = tx + (align === "start" ? 6 : -6);
  return (
    <text x={lx} y={ty + 4} textAnchor={align} className="hidden fill-ink font-serif text-[19px] italic sm:block">
      {label.map((l, i) => (
        <tspan key={i} x={lx} dy={i === 0 ? 0 : 21}>
          {l}
        </tspan>
      ))}
    </text>
  );
}

function Annotation({ px, py, tx, ty, label, onFocus, onBlur, align }: AnnotationProps) {
  return (
    <g
      tabIndex={0}
      role="button"
      aria-label={`Annotation : ${label.join(" ")}. Afficher l'explication.`}
      onMouseEnter={onFocus}
      onMouseLeave={onBlur}
      onFocus={onFocus}
      onBlur={onBlur}
      onClick={onFocus}
      className={cn("group cursor-help outline-none")}
    >
      <path d={`M${px},${py}L${tx},${ty}`} stroke="#0f1d2e" strokeWidth={0.9} className="max-sm:hidden" />
      <circle cx={px} cy={py} r={5.5} fill="#f5f2eb" stroke="#0f1d2e" strokeWidth={1.2} className="transition-[r] group-hover:[r:7] group-focus-visible:[r:7]" />
      <circle cx={px} cy={py} r={12} fill="none" stroke="#2468b3" strokeWidth={1.5} className="opacity-0 group-focus-visible:opacity-100" />
      <AnnotationLabel tx={tx} ty={ty} label={label} align={align} />
    </g>
  );
}

export function Annotations({ main, onTooltip }: { main: Series; onTooltip: (kind: TooltipKind | null) => void }) {
  return (
    <>
      <Annotation
        px={x(ANN_WILD_T)}
        py={y(main.wild[ANN_WILD_T])}
        tx={x(108)}
        ty={y(0.9)}
        label={["Diminution de la", "population sauvage"]}
        onFocus={() => onTooltip("wild")}
        onBlur={() => onTooltip(null)}
        align="start"
      />
      <Annotation
        px={x(ANN_STERILE_T)}
        py={y(main.sterile[ANN_STERILE_T])}
        tx={x(205)}
        ty={y(Math.min(main.sterile[ANN_STERILE_T] + 0.3, 0.98))}
        label={["Contrôle par lâchers", "répétés de mâles stériles"]}
        onFocus={() => onTooltip("sterile")}
        onBlur={() => onTooltip(null)}
        align="start"
      />
    </>
  );
}
