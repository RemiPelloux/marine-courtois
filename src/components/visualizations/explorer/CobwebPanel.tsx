"use client";

import { useMemo, useState } from "react";
import { Legend } from "@/components/visualizations/LineChart";
import { Slider } from "@/components/interactions/Controls";
import { nf, nf1 } from "@/lib/utils/format";
import { PanelLayout, C, type ExplorerContent } from "./PanelLayout";
import { scaleLinear, line } from "d3";
import { cobweb, knipling, kniplingThreshold } from "@/lib/scientific/knipling";

/* ---------------------------- Tab 3 -------------------------------- */

const COB_INIT = { lambda: 3, S: 5, ratio: 0.8 };

export function CobwebPanel({ content }: { content: ExplorerContent }) {
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

  const W = 640;
  const H = 400;
  const M = { top: 16, right: 16, bottom: 46, left: 58 };
  const x = scaleLinear().domain([0, max]).range([M.left, W - M.right]);
  const y = scaleLinear().domain([0, max]).range([H - M.bottom, M.top]).clamp(true);
  const gPts = Array.from({ length: 120 }, (_, i) => {
    const f = (i / 119) * max;
    return [f, knipling(f, lambda, S)] as [number, number];
  });
  const lg = line<[number, number]>()
    .x((d) => x(d[0]))
    .y((d) => y(d[1]));
  const web = line<{ x: number; y: number }>()
    .x((d) => x(d.x))
    .y((d) => y(d.y));
  const fate = ratio < 1 ? "décroît vers 0" : ratio > 1 ? "croît" : "reste au seuil";

  return (
    <PanelLayout
      content={content}
      onReset={reset}
      intro={
        <>
          <p>
            Un modèle discret classique de lâchers stériles, utilisé au chapitre 2 de la thèse : à chaque génération, la reproduction
            des femelles <em>F</em> est réduite par la proportion d&apos;accouplements avec <em>S</em> mâles stériles.
          </p>
          <p className="text-paper/70">
            Le diagramme en « toile d&apos;araignée » itère la fonction <em>g</em> : chaque marche est une génération.
          </p>
        </>
      }
      controls={
        <>
          <Slider dark label="Taux de croissance" symbol="λ" value={lambda} min={1.2} max={5} step={0.1} onChange={setLambda} format={(v) => nf1.format(v)} />
          <Slider dark label="Mâles stériles par génération" symbol="S" value={S} min={1} max={20} step={1} onChange={setS} format={(v) => nf.format(v)} />
          <Slider dark label="Population initiale / seuil" symbol="F₀/F*" value={ratio} min={0.1} max={1.9} step={0.05} onChange={setRatio} format={(v) => nf1.format(v)} />
        </>
      }
      legend={
        <Legend
          dark
          items={[
            { label: "g(F) = λF²/(F+S)", color: C.ink },
            { label: "F(t+1) = F(t)", color: C.mist, dash: "4 4" },
            { label: "Itérations depuis F₀", color: C.ver },
          ]}
        />
      }
      chart={
        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full overflow-visible" role="img" aria-label={`Diagramme en toile d'araignée pour λ = ${lambda}, S = ${S}. Seuil F* = ${nf1.format(Fstar)}. Partant de F₀ = ${nf1.format(F0)}, la population ${fate}.`}>
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
            <path d={`M${M.left},${M.top}V${H - M.bottom}H${W - M.right}`} stroke="#f5f2eb" fill="none" />
            <text x={W - M.right} y={H - 6} textAnchor="end" className="font-serif text-[17px] italic">
              F(t)
            </text>
            <text x={M.left + 8} y={M.top + 10} className="font-serif text-[17px] italic">
              F(t+1)
            </text>
          </g>
          <path d={`M${x(0)},${y(0)}L${x(max)},${y(max)}`} stroke={C.mist} strokeDasharray="4 4" />
          <path d={lg(gPts) ?? ""} stroke={C.ink} strokeWidth={2} fill="none" />
          <path d={web(points) ?? ""} stroke={C.ver} strokeWidth={1.8} fill="none" strokeLinejoin="round" />
          <circle cx={x(0)} cy={y(0)} r={5} fill={C.ink} />
          <circle cx={x(Fstar)} cy={y(Fstar)} r={6} fill="#0b2d4f" stroke={C.ver} strokeWidth={2} />
          <text x={x(Fstar) + 10} y={y(Fstar) + 18} className="tabular-nums text-[12px]" fill="#f5f2eb">
            F* = S/(λ−1) = {nf1.format(Fstar)} (instable)
          </text>
          <circle cx={x(F0)} cy={y(F0)} r={4} fill={C.ver} />
        </svg>
      }
      reading={
        <>
          <p>
            Seuil <span className="tabular-nums text-paper">F* = {nf1.format(Fstar)}</span>. Partant de{" "}
            <span className="tabular-nums text-accent-light">F₀ = {nf1.format(F0)}</span>, la population {fate}
            {series.length > 1 && (
              <>
                {" "}
                (génération {series.length - 1} : <span className="tabular-nums">{nf1.format(series.at(-1)!)}</span>)
              </>
            )}
            .
          </p>
          <p className="mt-2 text-paper/70">
            Sous le seuil, un nombre fixe de mâles stériles pèse de plus en plus lourd et la population s&apos;éteint ; au-dessus, elle
            s&apos;échappe. C&apos;est la bistabilité au cœur de nombreux modèles de TIS.
          </p>
        </>
      }
      verification={`Même fonction g et mêmes équilibres que la cellule « Cobweb diagram » du notebook (λ = 3, S = 5 par défaut). ${content.figure}`}
    />
  );
}
