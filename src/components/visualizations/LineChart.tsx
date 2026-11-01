"use client";

import { scaleLinear, line, curveLinear, type ScaleLinear } from "d3";
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

interface AxisOptions {
  xLabel: string;
  yLabel: string;
  xTicks?: number;
  yTicks?: number;
  formatY?: (v: number) => string;
  formatX?: (v: number) => string;
}

interface LineChartProps extends AxisOptions {
  series: ChartSeries[];
  xDomain: [number, number];
  yDomain: [number, number];
  summary: string;
  className?: string;
  dark?: boolean;
  height?: number;
  markers?: { y: number; label: string }[];
}

/** Plot geometry shared by the chart layers. */
interface Frame {
  x: ScaleLinear<number, number>;
  y: ScaleLinear<number, number>;
  H: number;
  ink: string;
}

const W = 640;
const M = { top: 18, right: 16, bottom: 46, left: 62 };

/** Minimal SVG line chart — scientific plotting style, accessible summary required. */
export function LineChart({ series, xDomain, yDomain, summary, className, dark = false, height = 340, markers = [], ...axes }: LineChartProps) {
  const H = height;
  const x = scaleLinear().domain(xDomain).range([M.left, W - M.right]);
  const y = scaleLinear().domain(yDomain).range([H - M.bottom, M.top]).clamp(true);
  const ink = dark ? "#f5f2eb" : "#0f1d2e";
  const titleId = useId();
  const frame = { x, y, H, ink };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={cn("h-auto w-full overflow-visible", className)} role="img" aria-labelledby={titleId}>
      <title id={titleId}>{summary}</title>
      <Axes frame={frame} {...axes} />
      <Markers frame={frame} markers={markers} />
      <SeriesPaths frame={frame} series={series} />
    </svg>
  );
}

function Axes({ frame, xLabel, yLabel, xTicks = 6, yTicks = 5, formatY = (v) => String(v), formatX = (v) => String(v) }: AxisOptions & { frame: Frame }) {
  const { H, ink } = frame;
  return (
    <g className="tabular-nums text-[12px] max-sm:text-[17px]" fill={ink}>
      <YTicks frame={frame} count={yTicks} format={formatY} />
      <XTicks frame={frame} count={xTicks} format={formatX} />
      <path d={`M${M.left},${M.top}V${H - M.bottom}H${W - M.right}`} stroke={ink} fill="none" />
      <text x={W - M.right} y={H - 6} textAnchor="end" className="font-serif text-[16px] italic max-sm:text-[20px]">
        {xLabel}
      </text>
      <text textAnchor="middle" className="font-serif text-[16px] italic max-sm:text-[20px]" transform={`translate(14,${(M.top + H - M.bottom) / 2}) rotate(-90)`}>
        {yLabel}
      </text>
    </g>
  );
}

interface TickProps {
  frame: Frame;
  count: number;
  format: (v: number) => string;
}

function YTicks({ frame: { y, ink }, count, format }: TickProps) {
  return y.ticks(count).map((v) => (
    <g key={v} transform={`translate(0,${y(v)})`}>
      <path d={`M${M.left},0H${W - M.right}`} stroke={ink} strokeOpacity={0.08} />
      <text x={M.left - 10} dy="0.35em" textAnchor="end" fillOpacity={0.8}>
        {format(v)}
      </text>
    </g>
  ));
}

function XTicks({ frame: { x, H, ink }, count, format }: TickProps) {
  return x.ticks(count).map((v) => (
    <g key={v} transform={`translate(${x(v)},${H - M.bottom})`}>
      <path d="M0,0V5" stroke={ink} />
      <text y={20} textAnchor="middle" fillOpacity={0.8}>
        {format(v)}
      </text>
    </g>
  ));
}

function Markers({ frame: { y }, markers }: { frame: Frame; markers: { y: number; label: string }[] }) {
  return markers.map((m) => (
    <g key={m.label}>
      <path d={`M${M.left},${y(m.y)}H${W - M.right}`} style={{ stroke: "var(--viz-accent)" }} strokeDasharray="3 4" strokeOpacity={0.7} />
      <text x={W - M.right - 4} y={y(m.y) - 6} textAnchor="end" className="tabular-nums text-[11px]" style={{ fill: "var(--viz-accent)" }}>
        {m.label}
      </text>
    </g>
  ));
}

function SeriesPaths({ frame: { x, y }, series }: { frame: Frame; series: ChartSeries[] }) {
  const gen = line<[number, number]>()
    .x((d) => x(d[0]))
    .y((d) => y(d[1]))
    .curve(curveLinear);
  return series.map((s) => (
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
  ));
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
