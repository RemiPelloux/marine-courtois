"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { scaleLinear, line, curveMonotoneX } from "d3";
import { simulateRF, RF_DEFAULTS, RF_INITIAL } from "@/lib/scientific/residual-fertility";
import { mulberry32, gaussian } from "@/lib/utils/random";
import { useInView } from "@/hooks/useInView";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { PlayPauseReset, SegmentedControl, Slider } from "@/components/interactions/Controls";
import { cn } from "@/lib/utils/cn";

/**
 * THE LIVING SYSTEM — hero visualization.
 *
 * Curves: residual-fertility SIT model (Courtois et al. 2025), ported from the
 * public notebook, with the notebook's fixed parameters. The release rate σ is
 * the editable parameter (slider = share of σ_max).
 * Points: an illustrative scatter drawn around the model trajectories. They do
 * not represent data. This is stated on screen.
 */

const W = 880;
const H = 560;
const M = { top: 34, right: 26, bottom: 54, left: 58 };
const T_END = 300;
const SIGMA_MAX = 1000; // individuals / day at 100 %
const S_REF = SIGMA_MAX / RF_DEFAULTS.muS; // sterile male density at 100 % release, at equilibrium
const F0 = RF_INITIAL[1];
const CYCLE_MS = 9000;

type Mode = "observer" | "comparer";

const x = scaleLinear().domain([0, T_END]).range([M.left, W - M.right]);
const y = scaleLinear().domain([0, 1.05]).range([H - M.bottom, M.top]);

function series(sigma: number, extra: Partial<typeof RF_DEFAULTS> = {}) {
  const r = simulateRF({ sigma, ...extra }, { tEnd: T_END, dt: 0.1, sampleEvery: 1 });
  return {
    wild: r.states.map((s) => s[1] / F0),
    sterile: r.states.map((s) => s[0] / S_REF),
  };
}

const path = line<number>()
  .x((_, i) => x(i))
  .y((d) => y(Math.min(d, 1.05)))
  .curve(curveMonotoneX);

interface Dot {
  t: number;
  dy: number;
  kind: 0 | 1;
}

function makeDots(count: number): Dot[] {
  const rand = mulberry32(20251127);
  const dots: Dot[] = [];
  for (let i = 0; i < count; i++) {
    const kind = (i % 2) as 0 | 1;
    dots.push({ t: rand() * T_END, dy: gaussian(rand), kind });
  }
  return dots;
}

export function LivingSystem() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<SVGGElement>(null);
  const inView = useInView(wrapRef);
  const reduce = usePrefersReducedMotion();

  const [share, setShare] = useState(40); // % of σ_max
  const [mode, setMode] = useState<Mode>("observer");
  const [playing, setPlaying] = useState(true);
  const [tooltip, setTooltip] = useState<null | "wild" | "sterile" | "fan">(null);
  const progress = useRef(0); // 0..1 time cursor
  const [settledState, setSettled] = useState(false);
  const settled = settledState || reduce;

  const sigma = (share / 100) * SIGMA_MAX;
  const main = useMemo(() => series(sigma), [sigma]);
  const withRF = useMemo(() => series(sigma, { delta: 0.01 }), [sigma]);
  const fan = useMemo(
    () => [0.1, 0.2, 0.3, 0.5, 0.7, 1].map((s) => series(s * SIGMA_MAX).wild),
    [],
  );

  // dots live only on the canvas, so reading the viewport here cannot cause a hydration mismatch
  const [dotCount] = useState(() => (typeof window !== "undefined" && window.matchMedia("(max-width: 640px)").matches ? 1800 : 3600));
  const dots = useMemo(() => makeDots(dotCount), [dotCount]);

  // keep latest data in refs for the RAF loop (avoids re-subscribing every frame)
  const dataRef = useRef({ main });
  useEffect(() => {
    dataRef.current = { main };
  }, [main]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cw = Math.round(rect.width * dpr);
    const ch = Math.round(rect.height * dpr);
    if (canvas.width !== cw || canvas.height !== ch) {
      canvas.width = cw;
      canvas.height = ch;
    }
    const k = (rect.width / W) * dpr;
    ctx.setTransform(k, 0, 0, k, 0, 0);
    ctx.clearRect(0, 0, W, H);

    const { main: m } = dataRef.current;
    const tMax = progress.current * T_END;
    const r = 1.55;
    for (const kind of [0, 1] as const) {
      ctx.beginPath();
      const arr = kind === 0 ? m.wild : m.sterile;
      for (const d of dots) {
        if (d.kind !== kind || d.t > tMax) continue;
        const i = Math.min(Math.floor(d.t), T_END);
        const v = arr[i];
        // spread grows with the value so the cloud stays close to zero when the population vanishes
        const spread = kind === 0 ? 0.018 + 0.075 * v : 0.012 + 0.07 * v;
        const yy = Math.max(0, v + d.dy * spread);
        const px = x(d.t);
        const py = y(yy);
        ctx.moveTo(px + r, py);
        ctx.arc(px, py, r, 0, Math.PI * 2);
      }
      ctx.fillStyle = kind === 0 ? "rgba(23,27,24,0.78)" : "rgba(240,74,45,0.82)";
      ctx.fill();
    }
    if (cursorRef.current) {
      cursorRef.current.setAttribute("transform", `translate(${x(tMax)},0)`);
    }
  }, [dots]);

  // animation loop — only while visible and playing
  useEffect(() => {
    if (reduce) {
      progress.current = 1;
      draw();
      return;
    }
    if (!inView || !playing) {
      draw();
      return;
    }
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      progress.current = Math.min(1, progress.current + dt / CYCLE_MS);
      draw();
      if (progress.current < 1) raf = requestAnimationFrame(tick);
      else setSettled(true);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, playing, reduce, draw]);

  // redraw on parameter change and resize
  useEffect(() => {
    draw();
  }, [main, mode, draw]);
  useEffect(() => {
    const ro = new ResizeObserver(() => draw());
    if (canvasRef.current) ro.observe(canvasRef.current);
    return () => ro.disconnect();
  }, [draw]);

  const replay = () => {
    progress.current = reduce ? 1 : 0;
    setSettled(reduce);
    setPlaying(true);
    draw();
  };

  const wildEnd = main.wild[T_END];
  const sterileEnd = main.sterile[T_END];
  const rfEnd = withRF.wild[T_END];
  const annWildT = 45;
  const annSterileT = 230;

  const summary = `Simulation du modèle de fertilité résiduelle avec des lâchers à ${share} % de l'intensité maximale (σ = ${Math.round(sigma)} mâles stériles par jour). Après ${T_END} jours, la densité de femelles sauvages vaut ${(wildEnd * 100).toFixed(0)} % de sa valeur initiale et celle des mâles stériles ${(sterileEnd * 100).toFixed(0)} % de la densité de référence.${mode === "comparer" ? ` Avec 1 % de mâles relâchés restés fertiles, les femelles sauvages atteignent ${(rfEnd * 100).toFixed(0)} %.` : ""}`;

  return (
    <figure ref={wrapRef} className="relative" aria-labelledby="living-system-title">
      <h2 id="living-system-title" className="sr-only">
        Living System — visualisation interactive de deux populations en interaction
      </h2>

      {/* Legend */}
      <div className="pointer-events-none mb-3 sm:absolute sm:top-0 sm:right-1 sm:z-10 sm:mb-0 sm:rounded-[3px] sm:border sm:border-rule sm:bg-paper/90 sm:px-4 sm:py-3">
        <ul className="label flex flex-wrap gap-x-5 gap-y-2 text-[0.6rem] sm:block sm:space-y-2 sm:text-[0.66rem]">
          <li className="flex items-center gap-3">
            <span className="size-2.5 rounded-full bg-ink" aria-hidden /> Femelles sauvages
          </li>
          <li className="flex items-center gap-3">
            <span className="size-2.5 rounded-full bg-vermilion" aria-hidden /> Mâles stériles
          </li>
          {mode === "comparer" && (
            <li className="flex items-center gap-3">
              <span className="w-4 border-t-2 border-dashed border-ink" aria-hidden /> Avec 1 % de mâles fertiles
            </li>
          )}
        </ul>
      </div>

      <div className="relative w-full" style={{ aspectRatio: `${W} / ${H}` }}>
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />
        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full overflow-visible" role="img" aria-label={summary}>

          {/* fan of model trajectories for other release intensities */}
          <g
            fill="none"
            stroke="#171b18"
            strokeOpacity={0.16}
            strokeWidth={0.8}
            onMouseEnter={() => setTooltip("fan")}
            onMouseLeave={() => setTooltip(null)}
          >
            {fan.map((f, i) => (
              <path key={i} d={path(f) ?? ""} />
            ))}
          </g>

          {/* model curves */}
          <path d={path(main.wild) ?? ""} fill="none" stroke="#171b18" strokeWidth={1.4} strokeOpacity={settled ? 0.9 : 0.35} className="transition-[stroke-opacity] duration-700" />
          <path d={path(main.sterile) ?? ""} fill="none" stroke="#f04a2d" strokeWidth={1.4} strokeOpacity={settled ? 0.95 : 0.35} className="transition-[stroke-opacity] duration-700" />
          {mode === "comparer" && (
            <>
              <path d={path(withRF.wild) ?? ""} fill="none" stroke="#171b18" strokeWidth={1.6} strokeDasharray="6 5" />
              <path d={`M${x(0)},${y(1)}H${x(T_END)}`} stroke="#171b18" strokeOpacity={0.45} strokeDasharray="2 4" />
              <text x={x(T_END) - 4} y={y(1) - 8} textAnchor="end" className="fill-ink/70 tabular-nums text-[13px]">
                sans lâchers
              </text>
            </>
          )}

          {/* axes */}
          <g className="tabular-nums text-[14px] max-sm:text-[26px]" fill="#171b18">
            <path d={`M${M.left},${M.top - 10}V${H - M.bottom}H${W - M.right + 8}`} stroke="#171b18" strokeWidth={1} fill="none" />
            {[0, 0.2, 0.4, 0.6, 0.8, 1].map((v) => (
              <g key={v} transform={`translate(${M.left},${y(v)})`}>
                <path d="M-6,0H0" stroke="#171b18" />
                <text x={-12} dy="0.35em" textAnchor="end">
                  {v.toFixed(1)}
                </text>
              </g>
            ))}
            {[0, 50, 100, 150, 200, 250, 300].map((t) => (
              <g key={t} transform={`translate(${x(t)},${H - M.bottom})`}>
                <path d="M0,0V6" stroke="#171b18" />
                <text y={22} textAnchor="middle">
                  {t}
                </text>
              </g>
            ))}
            <text x={M.left - 10} y={M.top - 12} textAnchor="end" className="font-serif text-[24px] italic max-sm:text-[34px]">
              N(t)
            </text>
            <text x={W - M.right} y={H - 8} textAnchor="end" className="font-serif text-[20px] italic max-sm:text-[30px]">
              t (jours)
            </text>
          </g>

          {/* time cursor */}
          <g ref={cursorRef} transform={`translate(${x(reduce ? T_END : 0)},0)`} aria-hidden>
            <path d={`M0,${M.top}V${H - M.bottom}`} stroke="#f04a2d" strokeOpacity={0.55} strokeDasharray="2 3" />
            <rect x={-3} y={H - M.bottom - 3} width={6} height={6} fill="#f04a2d" />
          </g>

          {/* annotations */}
          <Annotation
            px={x(annWildT)}
            py={y(main.wild[annWildT])}
            tx={x(108)}
            ty={y(0.9)}
            label={["Diminution de la", "population sauvage"]}
            onFocus={() => setTooltip("wild")}
            onBlur={() => setTooltip(null)}
            align="start"
          />
          <Annotation
            px={x(annSterileT)}
            py={y(main.sterile[annSterileT])}
            tx={x(205)}
            ty={y(Math.min(main.sterile[annSterileT] + 0.3, 0.98))}
            label={["Contrôle par lâchers", "répétés de mâles stériles"]}
            onFocus={() => setTooltip("sterile")}
            onBlur={() => setTooltip(null)}
            align="start"
          />
        </svg>

        {tooltip && (
          <div role="status" className="absolute bottom-[14%] left-[9%] z-20 max-w-xs rounded-[3px] border border-ink bg-paper p-3 text-xs leading-relaxed shadow-[4px_4px_0_0_rgba(23,27,24,0.12)]">
            {tooltip === "wild" &&
              "Densité de femelles sauvages F, rapportée à sa valeur initiale. Elle diminue car une part croissante des accouplements implique des mâles stériles."}
            {tooltip === "sterile" &&
              "Densité de mâles stériles S, rapportée à la densité atteinte avec l'intensité de lâchers maximale de cette visualisation. Elle se stabilise lorsque lâchers et mortalité s'équilibrent."}
            {tooltip === "fan" &&
              "Faisceau gris : trajectoires des femelles sauvages pour d'autres intensités de lâchers (10 % à 100 %)."}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="mt-4 flex flex-col gap-4 rounded-[4px] border border-rule bg-paper/80 p-3 sm:flex-row sm:items-center sm:gap-5 sm:p-3.5">
        <PlayPauseReset playing={playing && !settled} onToggle={() => (settled ? replay() : setPlaying((p) => !p))} onReset={replay} />
        <span className="hidden h-8 w-px bg-rule sm:block" aria-hidden />
        <Slider
          className="flex-1"
          label="Lâchers stériles"
          symbol="σ"
          value={share}
          min={0}
          max={100}
          step={5}
          onChange={setShare}
          format={(v) => `${v} %`}
        />
        <SegmentedControl
          label="Mode d'affichage"
          value={mode}
          onChange={setMode}
          options={[
            { value: "observer", label: "Observer" },
            { value: "comparer", label: "Comparer" },
          ]}
        />
      </div>

      <figcaption className="mt-4 grid gap-1 border-t border-rule pt-3">
        <p className="label text-center text-ink/80">
          Visualisation pédagogique — données illustratives
        </p>
        <p className="mono-meta text-center text-[0.68rem] text-muted">
          Courbes : modèle de fertilité résiduelle (Courtois et al., 2025), paramètres du notebook public · σ<sub>max</sub> ={" "}
          {SIGMA_MAX} ind./jour · le nuage de points est un rendu illustratif, pas des observations.
        </p>
      </figcaption>
    </figure>
  );
}

function Annotation({
  px,
  py,
  tx,
  ty,
  label,
  onFocus,
  onBlur,
  align,
}: {
  px: number;
  py: number;
  tx: number;
  ty: number;
  label: string[];
  onFocus: () => void;
  onBlur: () => void;
  align: "start" | "end";
}) {
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
      <path d={`M${px},${py}L${tx},${ty}`} stroke="#171b18" strokeWidth={0.9} className="max-sm:hidden" />
      <circle cx={px} cy={py} r={5.5} fill="#f5f2eb" stroke="#171b18" strokeWidth={1.2} className="transition-[r] group-hover:[r:7] group-focus-visible:[r:7]" />
      <circle cx={px} cy={py} r={12} fill="none" stroke="#f04a2d" strokeWidth={1.5} className="opacity-0 group-focus-visible:opacity-100" />
      <text x={tx + (align === "start" ? 6 : -6)} y={ty + 4} textAnchor={align} className="hidden fill-ink font-serif text-[19px] italic sm:block">
        {label.map((l, i) => (
          <tspan key={i} x={tx + (align === "start" ? 6 : -6)} dy={i === 0 ? 0 : 21}>
            {l}
          </tspan>
        ))}
      </text>
    </g>
  );
}
