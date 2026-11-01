"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Legend } from "@/components/visualizations/LineChart";
import { Slider } from "@/components/interactions/Controls";
import { numberFormats } from "@/lib/utils/format";
import { copy, type Lang } from "@/i18n/config";
import { useLang } from "@/i18n/client";
import { PanelLayout, C, type ExplorerContent } from "./PanelLayout";
import { scaleLinear, line, type ScaleLinear } from "d3";
import { cobweb, knipling, kniplingThreshold } from "@/lib/scientific/knipling";

/* ---------------------------- Tab 3 -------------------------------- */

const COB_INIT = { lambda: 3, S: 5, ratio: 0.8 };

const W = 640;
const H = 400;
const M = { top: 16, right: 16, bottom: 46, left: 58 };

type Scale = ScaleLinear<number, number>;
type Fate = "down" | "up" | "stay";

const COPY = copy({
  fr: {
    fate: { down: "décroît vers 0", up: "croît", stay: "reste au seuil" } as Record<Fate, string>,
    lambda: "Taux de croissance",
    S: "Mâles stériles par génération",
    ratio: "Population initiale / seuil",
    unstable: "instable",
    aria: (l: string, s: number, f: string, f0: string, fate: string) =>
      `Diagramme en toile d'araignée pour λ = ${l}, S = ${s}. Seuil F* = ${f}. Partant de F₀ = ${f0}, la population ${fate}.`,
    iterations: "Itérations depuis F₀",
    generation: (n: number) => `génération ${n} : `,
    verification: "Même fonction g et mêmes équilibres que la cellule « Cobweb diagram » du notebook (λ = 3, S = 5 par défaut).",
  },
  en: {
    fate: { down: "decreases to 0", up: "grows", stay: "stays at the threshold" },
    lambda: "Growth rate",
    S: "Sterile males per generation",
    ratio: "Initial population / threshold",
    unstable: "unstable",
    aria: (l: string, s: number, f: string, f0: string, fate: string) =>
      `Cobweb diagram for λ = ${l}, S = ${s}. Threshold F* = ${f}. Starting from F₀ = ${f0}, the population ${fate}.`,
    iterations: "Iterations from F₀",
    generation: (n: number) => `generation ${n}: `,
    verification: "Same function g and same equilibria as the notebook's “Cobweb diagram” cell (λ = 3, S = 5 by default).",
  },
});

function useText() {
  const lang = useLang();
  return { lang, t: COPY[lang], ...numberFormats(lang) };
}

function useCobwebModel() {
  const [lambda, setLambda] = useState(COB_INIT.lambda);
  const [S, setS] = useState(COB_INIT.S);
  const [ratio, setRatio] = useState(COB_INIT.ratio);
  const reset = () => {
    setLambda(COB_INIT.lambda);
    setS(COB_INIT.S);
    setRatio(COB_INIT.ratio);
  };

  const Fstar = kniplingThreshold(lambda, S) ?? 1;
  const F0 = ratio * Fstar;
  const max = Fstar * 2.2;
  const { points, series } = useMemo(() => cobweb(F0, lambda, S, 14, max * 1.2), [F0, lambda, S, max]);
  const fate: Fate = ratio < 1 ? "down" : ratio > 1 ? "up" : "stay";
  return { lambda, S, ratio, setLambda, setS, setRatio, reset, Fstar, F0, max, points, series, fate };
}

type CobwebModel = ReturnType<typeof useCobwebModel>;

function CobwebIntro() {
  const { lang } = useText();
  if (lang === "en") {
    return (
      <>
        <p>
          A classic discrete model of sterile releases, used in chapter 2 of the thesis: at each generation, the reproduction of females{" "}
          <em>F</em> is reduced by the proportion of matings with <em>S</em> sterile males.
        </p>
        <p className="text-paper/70">The “cobweb” diagram iterates the function <em>g</em>: each step is one generation.</p>
      </>
    );
  }
  return (
    <>
      <p>
        Un modèle discret classique de lâchers stériles, utilisé au chapitre 2 de la thèse : à chaque génération, la reproduction
        des femelles <em>F</em> est réduite par la proportion d&apos;accouplements avec <em>S</em> mâles stériles.
      </p>
      <p className="text-paper/70">
        Le diagramme en « toile d&apos;araignée » itère la fonction <em>g</em> : chaque marche est une génération.
      </p>
    </>
  );
}

function CobwebControls({ m }: { m: CobwebModel }) {
  const { t, nf, nf1 } = useText();
  return (
    <>
      <Slider dark label={t.lambda} symbol="λ" value={m.lambda} min={1.2} max={5} step={0.1} onChange={m.setLambda} format={(v) => nf1.format(v)} />
      <Slider dark label={t.S} symbol="S" value={m.S} min={1} max={20} step={1} onChange={m.setS} format={(v) => nf.format(v)} />
      <Slider dark label={t.ratio} symbol="F₀/F*" value={m.ratio} min={0.1} max={1.9} step={0.05} onChange={m.setRatio} format={(v) => nf1.format(v)} />
    </>
  );
}

function CobwebAxes({ x, y }: { x: Scale; y: Scale }) {
  const { nf1 } = useText();
  return (
    <g className="tabular-nums text-[12px] max-sm:text-[17px]" fill="#f5f2eb">
      {x.ticks(5).map((v) => (
        <g key={v} transform={`translate(${x(v)},${H - M.bottom})`}>
          <path d="M0,0V5" stroke="#f5f2eb" />
          <text y={20} textAnchor="middle" fillOpacity={0.8}>
            {nf1.format(v)}
          </text>
        </g>
      ))}
      {y.ticks(5).map((v) => (
        <g key={v} transform={`translate(${M.left},${y(v)})`}>
          <path d="M-5,0H0" stroke="#f5f2eb" />
          <text x={-10} dy="0.35em" textAnchor="end" fillOpacity={0.8}>
            {nf1.format(v)}
          </text>
        </g>
      ))}
      <AxisFrame />
    </g>
  );
}

function AxisFrame() {
  return (
    <>
      <path d={`M${M.left},${M.top}V${H - M.bottom}H${W - M.right}`} stroke="#f5f2eb" fill="none" />
      <text x={W - M.right} y={H - 6} textAnchor="end" className="font-serif text-[17px] italic">
        F(t)
      </text>
      <text x={M.left + 8} y={M.top + 10} className="font-serif text-[17px] italic">
        F(t+1)
      </text>
    </>
  );
}

function curvePaths({ m, x, y }: { m: CobwebModel; x: Scale; y: Scale }) {
  const gPts = Array.from({ length: 120 }, (_, i) => {
    const f = (i / 119) * m.max;
    return [f, knipling(f, m.lambda, m.S)] as [number, number];
  });
  const lg = line<[number, number]>()
    .x((d) => x(d[0]))
    .y((d) => y(d[1]));
  const web = line<{ x: number; y: number }>()
    .x((d) => x(d.x))
    .y((d) => y(d.y));
  return { g: lg(gPts) ?? "", web: web(m.points) ?? "" };
}

function CobwebChart({ m }: { m: CobwebModel }) {
  const { t, nf1 } = useText();
  const { Fstar, F0, max } = m;
  const x = scaleLinear().domain([0, max]).range([M.left, W - M.right]);
  const y = scaleLinear().domain([0, max]).range([H - M.bottom, M.top]).clamp(true);
  const paths = curvePaths({ m, x, y });
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full overflow-visible" role="img" aria-label={t.aria(nf1.format(m.lambda), m.S, nf1.format(Fstar), nf1.format(F0), t.fate[m.fate])}>
      <CobwebAxes x={x} y={y} />
      <path d={`M${x(0)},${y(0)}L${x(max)},${y(max)}`} stroke={C.mist} strokeDasharray="4 4" />
      <path d={paths.g} stroke={C.ink} strokeWidth={2} fill="none" />
      <path d={paths.web} stroke={C.ver} strokeWidth={1.8} fill="none" strokeLinejoin="round" />
      <circle cx={x(0)} cy={y(0)} r={5} fill={C.ink} />
      <circle cx={x(Fstar)} cy={y(Fstar)} r={6} fill="#0b2d4f" stroke={C.ver} strokeWidth={2} />
      <text x={x(Fstar) + 10} y={y(Fstar) + 18} className="tabular-nums text-[12px]" fill="#f5f2eb">
        F* = S/(λ−1) = {nf1.format(Fstar)} ({t.unstable})
      </text>
      <circle cx={x(F0)} cy={y(F0)} r={4} fill={C.ver} />
    </svg>
  );
}

function CobwebReading({ m }: { m: CobwebModel }) {
  const { lang, t, nf1 } = useText();
  const { Fstar, F0, series } = m;
  const threshold = <span className="tabular-nums text-paper">F* = {nf1.format(Fstar)}</span>;
  const start = <span className="tabular-nums text-accent-light">F₀ = {nf1.format(F0)}</span>;
  const gen = series.length > 1 && (
    <>
      {" "}
      ({t.generation(series.length - 1)}
      <span className="tabular-nums">{nf1.format(series.at(-1)!)}</span>)
    </>
  );
  return <CobwebReadingText lang={lang} parts={{ threshold, start, gen, fate: t.fate[m.fate] }} />;
}

type ReadingParts = { threshold: ReactNode; start: ReactNode; gen: ReactNode; fate: string };

function CobwebReadingText({ lang, parts: p }: { lang: Lang; parts: ReadingParts }) {
  if (lang === "en") {
    return (
      <>
        <p>
          Threshold {p.threshold}. Starting from {p.start}, the population {p.fate}
          {p.gen}.
        </p>
        <p className="mt-2 text-paper/70">
          Below the threshold, a fixed number of sterile males weighs more and more and the population dies out; above it, the population
          escapes. This is the bistability at the heart of many SIT models.
        </p>
      </>
    );
  }
  return (
    <>
      <p>
        Seuil {p.threshold}. Partant de {p.start}, la population {p.fate}
        {p.gen}.
      </p>
      <p className="mt-2 text-paper/70">
        Sous le seuil, un nombre fixe de mâles stériles pèse de plus en plus lourd et la population s&apos;éteint ; au-dessus, elle
        s&apos;échappe. C&apos;est la bistabilité au cœur de nombreux modèles de TIS.
      </p>
    </>
  );
}

export function CobwebPanel({ content }: { content: ExplorerContent }) {
  const m = useCobwebModel();
  const { t } = useText();
  const legend = [
    { label: "g(F) = λF²/(F+S)", color: C.ink },
    { label: "F(t+1) = F(t)", color: C.mist, dash: "4 4" },
    { label: t.iterations, color: C.ver },
  ];
  return (
    <PanelLayout
      content={content}
      onReset={m.reset}
      intro={<CobwebIntro />}
      controls={<CobwebControls m={m} />}
      legend={<Legend dark items={legend} />}
      chart={<CobwebChart m={m} />}
      reading={<CobwebReading m={m} />}
      verification={`${t.verification} ${content.figure}`}
    />
  );
}
