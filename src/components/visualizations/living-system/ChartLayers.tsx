import type { RefObject } from "react";
import { H, M, T_END, W, path, x, y, type Series, type TooltipKind } from "./model";

/** Fan of model trajectories for other release intensities. */
export function TrajectoryFan({ fan, onTooltip }: { fan: number[][]; onTooltip: (kind: TooltipKind | null) => void }) {
  return (
    <g
      fill="none"
      stroke="#0f1d2e"
      strokeOpacity={0.16}
      strokeWidth={0.8}
      onMouseEnter={() => onTooltip("fan")}
      onMouseLeave={() => onTooltip(null)}
    >
      {fan.map((f, i) => (
        <path key={i} d={path(f) ?? ""} />
      ))}
    </g>
  );
}

export function ModelCurves({ main, settled }: { main: Series; settled: boolean }) {
  return (
    <>
      <path d={path(main.wild) ?? ""} fill="none" stroke="#0f1d2e" strokeWidth={1.4} strokeOpacity={settled ? 0.9 : 0.35} className="transition-[stroke-opacity] duration-700" />
      <path d={path(main.sterile) ?? ""} fill="none" stroke="#2468b3" strokeWidth={1.4} strokeOpacity={settled ? 0.95 : 0.35} className="transition-[stroke-opacity] duration-700" />
    </>
  );
}

/** "Comparer" mode: trajectory with 1 % fertile males and the no-release baseline. */
export function Comparison({ withRF }: { withRF: Series }) {
  return (
    <>
      <path d={path(withRF.wild) ?? ""} fill="none" stroke="#0f1d2e" strokeWidth={1.6} strokeDasharray="6 5" />
      <path d={`M${x(0)},${y(1)}H${x(T_END)}`} stroke="#0f1d2e" strokeOpacity={0.45} strokeDasharray="2 4" />
      <text x={x(T_END) - 4} y={y(1) - 8} textAnchor="end" className="fill-ink/70 tabular-nums text-[13px]">
        sans lâchers
      </text>
    </>
  );
}

function YTicks() {
  return (
    <>
      {[0, 0.2, 0.4, 0.6, 0.8, 1].map((v) => (
        <g key={v} transform={`translate(${M.left},${y(v)})`}>
          <path d="M-6,0H0" stroke="#0f1d2e" />
          <text x={-12} dy="0.35em" textAnchor="end">
            {v.toFixed(1)}
          </text>
        </g>
      ))}
    </>
  );
}

function XTicks() {
  return (
    <>
      {[0, 50, 100, 150, 200, 250, 300].map((t) => (
        <g key={t} transform={`translate(${x(t)},${H - M.bottom})`}>
          <path d="M0,0V6" stroke="#0f1d2e" />
          <text y={22} textAnchor="middle">
            {t}
          </text>
        </g>
      ))}
    </>
  );
}

export function Axes() {
  return (
    <g className="tabular-nums text-[14px] max-sm:text-[26px]" fill="#0f1d2e">
      <path d={`M${M.left},${M.top - 10}V${H - M.bottom}H${W - M.right + 8}`} stroke="#0f1d2e" strokeWidth={1} fill="none" />
      <YTicks />
      <XTicks />
      <text x={M.left - 10} y={M.top - 12} textAnchor="end" className="font-serif text-[24px] italic max-sm:text-[34px]">
        N(t)
      </text>
      <text x={W - M.right} y={H - 8} textAnchor="end" className="font-serif text-[20px] italic max-sm:text-[30px]">
        t (jours)
      </text>
    </g>
  );
}

/** Time cursor; its transform is driven imperatively by the canvas loop. */
export function TimeCursor({ cursorRef, reduce }: { cursorRef: RefObject<SVGGElement | null>; reduce: boolean }) {
  return (
    <g ref={cursorRef} transform={`translate(${x(reduce ? T_END : 0)},0)`} aria-hidden>
      <path d={`M0,${M.top}V${H - M.bottom}`} stroke="#2468b3" strokeOpacity={0.55} strokeDasharray="2 3" />
      <rect x={-3} y={H - M.bottom - 3} width={6} height={6} fill="#2468b3" />
    </g>
  );
}
