"use client";

import { scaleLinear, line, curveLinear } from "d3";
import { useId } from "react";
import { cn } from "@/lib/utils/cn";

export interface ChartSeries {
  id: string;
  label: string;
  points: [number, number][];
  color: string;
  dash?: string;
  width?: number;
  opacity?: number;
}

/** Minimal SVG line chart — scientific plotting style, accessible summary required. */
export function LineChart({
  series,
  xDomain,
  yDomain,
  xLabel,
  yLabel,
  summary,
  xTicks = 6,
  yTicks = 5,
  formatY = (v) => String(v),
  formatX = (v) => String(v),
  className,
  dark = false,
  height = 340,
  markers = [],
}: {
  series: ChartSeries[];
  xDomain: [number, number];
  yDomain: [number, number];
  xLabel: string;
  yLabel: string;
  summary: string;
  xTicks?: number;
  yTicks?: number;
  formatY?: (v: number) => string;
  formatX?: (v: number) => string;
  className?: string;
  dark?: boolean;
  height?: number;
  markers?: { y: number; label: string }[];
}) {
  const W = 640;
  const H = height;
  const M = { top: 18, right: 16, bottom: 46, left: 62 };
  const x = scaleLinear().domain(xDomain).range([M.left, W - M.right]);
  const y = scaleLinear().domain(yDomain).range([H - M.bottom, M.top]).clamp(true);
  const gen = line<[number, number]>()
    .x((d) => x(d[0]))
    .y((d) => y(d[1]))
    .curve(curveLinear);
  const ink = dark ? "#f5f2eb" : "#171b18";
  const titleId = useId();

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={cn("h-auto w-full overflow-visible", className)} role="img" aria-labelledby={titleId}>
      <title id={titleId}>{summary}</title>
      <g className="tabular-nums text-[12px] max-sm:text-[17px]" fill={ink}>
        {y.ticks(yTicks).map((v) => (
          <g key={v} transform={`translate(0,${y(v)})`}>
            <path d={`M${M.left},0H${W - M.right}`} stroke={ink} strokeOpacity={0.08} />
            <text x={M.left - 10} dy="0.35em" textAnchor="end" fillOpacity={0.8}>
              {formatY(v)}
            </text>
          </g>
        ))}
        {x.ticks(xTicks).map((v) => (
          <g key={v} transform={`translate(${x(v)},${H - M.bottom})`}>
            <path d="M0,0V5" stroke={ink} />
            <text y={20} textAnchor="middle" fillOpacity={0.8}>
              {formatX(v)}
            </text>
          </g>
        ))}
        <path d={`M${M.left},${M.top}V${H - M.bottom}H${W - M.right}`} stroke={ink} fill="none" />
        <text x={W - M.right} y={H - 6} textAnchor="end" className="font-serif text-[16px] italic max-sm:text-[20px]">
          {xLabel}
        </text>
        <text textAnchor="middle" className="font-serif text-[16px] italic max-sm:text-[20px]" transform={`translate(14,${(M.top + H - M.bottom) / 2}) rotate(-90)`}>
          {yLabel}
        </text>
      </g>
      {markers.map((m) => (
        <g key={m.label}>
          <path d={`M${M.left},${y(m.y)}H${W - M.right}`} stroke="#f04a2d" strokeDasharray="3 4" strokeOpacity={0.7} />
          <text x={W - M.right - 4} y={y(m.y) - 6} textAnchor="end" className="tabular-nums text-[11px]" fill="#f04a2d">
            {m.label}
          </text>
        </g>
      ))}
      {series.map((s) => (
        <path
          key={s.id}
          d={gen(s.points) ?? ""}
          fill="none"
          stroke={s.color}
          strokeWidth={s.width ?? 2}
          strokeDasharray={s.dash}
          strokeOpacity={s.opacity ?? 1}
          strokeLinejoin="round"
          className="[transition:d_0.45s_cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
        />
      ))}
    </svg>
  );
}

export function Legend({ items, dark = false }: { items: { label: string; color: string; dash?: string }[]; dark?: boolean }) {
  return (
    <ul className={cn("flex flex-wrap gap-x-5 gap-y-2 text-xs", dark ? "text-paper/85" : "text-ink/80")}>
      {items.map((i) => (
        <li key={i.label} className="flex items-center gap-2">
          <svg width="22" height="8" aria-hidden>
            <path d="M1,4H21" stroke={i.color} strokeWidth="2" strokeDasharray={i.dash} />
          </svg>
          {i.label}
        </li>
      ))}
    </ul>
  );
}
