"use client";

import { useId, useState } from "react";
import { scaleLog, median } from "d3";
import { a11y } from "@/i18n";
import { SegmentedControl } from "@/components/interactions/Controls";
import { FISH_INK, GROUP_LABEL } from "@/components/fish/palette";
import { GROUPS, type Group } from "@/lib/fish/sim";
import data from "@/data/generated/functional-responses.json";

type Row = { species: string; group: Group; temp: number; a: number; h: number };
type Variable = "a" | "h" | "ratio";

const ROWS = data.rows as Row[];
const VALUE: Record<Variable, (r: Row) => number> = { a: (r) => r.a, h: (r) => r.h, ratio: (r) => r.a / r.h };
const OPTIONS: { value: Variable; label: string }[] = [
  { value: "a", label: "Taux d'attaque a" },
  { value: "h", label: "Temps de manipulation h" },
  { value: "ratio", label: "Rapport a/h" },
];
const UNIT: Record<Variable, string> = { a: "m³ par prédateur et par jour", h: "jours", ratio: "a / h" };

const W = 680;
const M = { top: 10, right: 16, bottom: 44, left: 16 };
const ROW_H = 74;

/** Two decimals: identical SVG on the server and in the browser. */
const r2 = (n: number) => Math.round(n * 100) / 100;

/** Deterministic vertical jitter, so the plot is identical on every render. */
const jitter = (i: number) => (((i * 9301 + 49297) % 233280) / 233280 - 0.5) * 34;

/**
 * The 269 estimates analysed in the article, one dot each, by group, on a
 * log scale. Raw values: the article's conclusions come from phylogenetically
 * corrected models, which these dots do not replace.
 */
export function FunctionalResponseData() {
  const [variable, setVariable] = useState<Variable>("a");
  const titleId = useId();
  const values = ROWS.map(VALUE[variable]);
  const x = scaleLog()
    .domain([Math.min(...values), Math.max(...values)])
    .range([M.left, W - M.right])
    .nice();
  const H = M.top + ROW_H * GROUPS.length + M.bottom;
  const ticks = decades(x.domain() as [number, number]);

  return (
    <figure>
      <SegmentedControl label={a11y.variableAfficher} options={OPTIONS} value={variable} onChange={setVariable} />
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-6 h-auto w-full" role="img" aria-labelledby={titleId}>
        <title id={titleId}>{`${OPTIONS.find((o) => o.value === variable)!.label} des ${ROWS.length} estimations, par groupe, en échelle logarithmique.`}</title>
        {GROUPS.map((g, gi) => {
          const rows = ROWS.map((r, i) => ({ r, i })).filter(({ r }) => r.group === g);
          const mid = M.top + gi * ROW_H + ROW_H / 2;
          const med = median(rows, ({ r }) => VALUE[variable](r)) ?? 1;
          return (
            <g key={g}>
              <text x={M.left} y={mid - ROW_H / 2 + 12} className="fill-ink text-[12px]">
                {GROUP_LABEL[g]} · {rows.length} estimations
              </text>
              {rows.map(({ r, i }) => (
                <circle key={i} cx={r2(x(VALUE[variable](r)))} cy={r2(mid + 6 + jitter(i) * 0.5)} r={3} fill={FISH_INK[g]} fillOpacity={0.55} />
              ))}
              <line x1={r2(x(med))} x2={r2(x(med))} y1={mid - 14} y2={mid + 26} stroke="#0f1d2e" strokeWidth={2} />
            </g>
          );
        })}
        <line x1={M.left} x2={W - M.right} y1={H - M.bottom} y2={H - M.bottom} stroke="#0f1d2e" />
        {ticks.map((t) => (
          <text key={t} x={r2(x(t))} y={H - M.bottom + 18} textAnchor="middle" className="fill-ink text-[11px] tabular-nums">
            10{superscript(Math.log10(t))}
          </text>
        ))}
        <text x={W / 2} y={H - 6} textAnchor="middle" className="fill-muted text-[11px]">
          {UNIT[variable]} — échelle logarithmique ; trait noir : médiane du groupe
        </text>
      </svg>
      <figcaption className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">
        Données brutes du dépôt Zenodo (CC BY 4.0), même sélection que l&apos;article : {data.observations} estimations, {data.species} espèces.
        Les conclusions publiées reposent sur des modèles bayésiens corrigés de la phylogénie et de la température (MCMCglmm), que ce
        graphique ne remplace pas.
      </figcaption>
    </figure>
  );
}

/** Powers of ten across the domain, thinned to at most seven labels. */
function decades([lo, hi]: [number, number]) {
  const all: number[] = [];
  for (let e = Math.ceil(Math.log10(lo)); e <= Math.floor(Math.log10(hi)); e++) all.push(10 ** e);
  const stride = Math.ceil(all.length / 7);
  return all.filter((_, i) => i % stride === 0);
}

const SUP: Record<string, string> = { "-": "⁻", "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹" };
const superscript = (n: number) => [...String(Math.round(n))].map((c) => SUP[c] ?? c).join("");
