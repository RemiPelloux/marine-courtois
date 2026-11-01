import { a11y } from "@/i18n";
import { scaleLinear, line } from "d3";
import { simulateRF } from "@/lib/scientific/residual-fertility";

/**
 * Server-rendered method figures (no client JS). Data are computed at build
 * time from the ported models; paths draw in with CSS (disabled with reduced motion).
 */

const W = 420;
const H = 280;
const M = { top: 16, right: 14, bottom: 38, left: 44 };

function Axes({ x, y, xLabel, yLabel, xt, yt }: { x: (v: number) => number; y: (v: number) => number; xLabel: string; yLabel: string; xt: number[]; yt: number[] }) {
  return (
    <g className="tabular-nums text-[11px]" fill="currentColor">
      <path d={`M${M.left},${M.top}V${H - M.bottom}H${W - M.right}`} stroke="currentColor" fill="none" strokeOpacity={0.8} />
      {xt.map((v) => (
        <text key={v} x={x(v)} y={H - M.bottom + 16} textAnchor="middle" fillOpacity={0.7}>
          {v}
        </text>
      ))}
      {yt.map((v) => (
        <text key={v} x={M.left - 8} y={y(v)} dy="0.35em" textAnchor="end" fillOpacity={0.7}>
          {v}
        </text>
      ))}
      <text x={W - M.right} y={H - 4} textAnchor="end" className="font-serif text-[14px] italic">
        {xLabel}
      </text>
      <text x={M.left + 6} y={M.top + 6} className="font-serif text-[14px] italic">
        {yLabel}
      </text>
    </g>
  );
}

const drawStyle = (len: number, delay = 0) =>
  ({
    strokeDasharray: len,
    ["--len" as string]: len,
    animation: `draw-in 2.4s ${delay}s cubic-bezier(0.22,1,0.36,1) both`,
  }) as React.CSSProperties;

/** Positive-equilibrium branches S(F), split at the saddle-node point S_c. */
function bifurcationBranches() {
  const r = 6,
    p = 0.5,
    muF = 0.5,
    muM = 0.5,
    beta = 0.01;
  const S_of_F = (F: number) => -(muF * beta * F * F + (muF - r * (1 - p)) * F) / (((1 - p) * muM) / p * (beta * F + 1));
  const pts: [number, number][] = [];
  for (let i = 1; i <= 400; i++) {
    const F = (i / 400) * 500;
    const S = S_of_F(F);
    if (S > 0) pts.push([S, F]);
  }
  const iMax = pts.reduce((best, d, i) => (d[0] > pts[best][0] ? i : best), 0);
  return { unstable: pts.slice(0, iMax + 1), stable: pts.slice(iMax), fold: pts[iMax] };
}

function plotScales(xMax: number, yMax: number) {
  const x = scaleLinear().domain([0, xMax]).range([M.left, W - M.right]);
  const y = scaleLinear().domain([0, yMax]).range([H - M.bottom, M.top]);
  const l = line<[number, number]>()
    .x((d) => x(d[0]))
    .y((d) => y(d[1]));
  return { x, y, l };
}

/**
 * Formaliser — equilibrium branches of the "model with competition and SIT"
 * (thesisData, Chapter 2, fig_chapter2_thesis.ipynb): S(F) with r = 6, p = 0.5,
 * μF = μM = 0.5, β = 0.01.
 */
export function BifurcationVisual({ className }: { className?: string }) {
  const { unstable, stable, fold } = bifurcationBranches();
  const Sc = fold[0];
  const { x, y, l } = plotScales(230, 520);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={className} role="img" aria-label={`Diagramme de bifurcation : la branche stable d'équilibres positifs et la branche instable se rejoignent en un point nœud-col pour une densité de mâles stériles S_c ≈ ${Math.round(Sc)} ; au-delà, seul l'équilibre nul subsiste.`}>
      <Axes x={x} y={y} xLabel="S" yLabel="F*" xt={[0, 50, 100, 150, 200]} yt={[0, 250, 500]} />
      <path d={`M${x(0)},${y(0)}H${x(230)}`} stroke="currentColor" strokeWidth={2.4} />
      <path d={l(stable) ?? ""} fill="none" stroke="currentColor" strokeWidth={2} style={drawStyle(700)} className="motion-reduce:[animation:none]" />
      <path d={l(unstable) ?? ""} fill="none" stroke="currentColor" strokeWidth={1.6} strokeDasharray="6 5" strokeOpacity={0.8} />
      <path d={`M${x(Sc)},${M.top}V${H - M.bottom}`} style={{ stroke: "var(--viz-accent)" }} strokeDasharray="2 3" />
      <circle cx={x(fold[0])} cy={y(fold[1])} r={5} style={{ fill: "var(--viz-accent)" }} />
      <text x={x(Sc) - 6} y={M.top + 12} textAnchor="end" className="tabular-nums text-[11px]" style={{ fill: "var(--viz-accent)" }}>
        S_c
      </text>
      <g className="tabular-nums text-[10px]" fill="currentColor" fillOpacity={0.75}>
        <text x={x(20)} y={y(470)}>stable</text>
        <text x={x(110)} y={y(60)}>instable</text>
      </g>
    </svg>
  );
}

const SCENARIO_STYLES = [
  { dash: undefined, color: "currentColor", label: "δ = 0" },
  { dash: "5 4", color: "var(--viz-accent)", label: "δ = 0,5 %" },
  { dash: undefined, color: "var(--viz-accent)", label: "δ = 1 %" },
];

/** Female density after 300 days against σ, one curve per residual-fertility level δ. */
function scenarioCurves() {
  const sigmas = Array.from({ length: 26 }, (_, i) => i * 200);
  const deltas = [0, 0.005, 0.01];
  return deltas.map((delta) =>
    sigmas.map((sigma) => {
      const r = simulateRF({ sigma, delta }, { tEnd: 300, dt: 0.2, sampleEvery: 300 });
      return [sigma, r.states.at(-1)![1]] as [number, number];
    }),
  );
}

/**
 * Interpréter — scenario comparison computed from the residual-fertility model:
 * female density after 300 days as a function of release intensity σ, for
 * three levels of cost-free residual fertility δ.
 */
export function ScenarioComparisonVisual({ className }: { className?: string }) {
  const curves = scenarioCurves();
  const { x, y, l } = plotScales(5000, 1000);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={className} role="img" aria-label={a11y.scenarioComparisonChart}>
      <Axes x={x} y={y} xLabel="σ (ind./j)" yLabel="F(300)" xt={[0, 2500, 5000]} yt={[0, 500, 1000]} />
      {curves.map((c, i) => (
        <path
          key={i}
          d={l(c) ?? ""}
          fill="none"
          style={{ stroke: SCENARIO_STYLES[i].color, ...(SCENARIO_STYLES[i].dash ? {} : drawStyle(900, i * 0.3)) }}
          strokeWidth={i === 0 ? 1.8 : 2}
          strokeDasharray={SCENARIO_STYLES[i].dash}
          className="motion-reduce:[animation:none]"
        />
      ))}
      <ScenarioLegend />
    </svg>
  );
}

function ScenarioLegend() {
  return (
    <g className="tabular-nums text-[10px]">
      {SCENARIO_STYLES.map((s, i) => (
        <g key={s.label} transform={`translate(${W - M.right - 92},${M.top + 10 + i * 16})`}>
          <path d="M0,0H18" style={{ stroke: s.color }} strokeWidth={2} strokeDasharray={s.dash} />
          <text x={24} dy="0.35em" fill="currentColor">
            {s.label}
          </text>
        </g>
      ))}
    </g>
  );
}
