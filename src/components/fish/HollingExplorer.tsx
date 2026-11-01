"use client";

import { useState, type ReactNode } from "react";
import { LineChart, Legend } from "@/components/visualizations/LineChart";
import { Slider } from "@/components/interactions/Controls";
import { copy } from "@/i18n/config";
import { useLang } from "@/i18n/client";
import { numberFormats } from "@/lib/utils/format";

/** Holling type II: f(N) = aN / (1 + a h N). */
export const holling = (N: number, a: number, h: number) => (a * N) / (1 + a * h * N);

const N_MAX = 100;
const curve = (a: number, h: number) => Array.from({ length: 101 }, (_, i): [number, number] => [i, holling(i, a, h)]);

const COPY = copy({
  fr: {
    a: "Taux d'attaque",
    aHint: "Efficacité de recherche quand les proies sont rares : la pente à l'origine.",
    h: "Temps de manipulation",
    hHint: "Temps passé sur chaque proie : il fixe le plafond 1/h.",
    ceilingNow: "Plafond actuel :",
    ceilingUnit: "proies par unité de temps. Un « meilleur » prédateur a un a plus grand et un h plus court : sa courbe monte plus vite et plus haut.",
    response: "Réponse fonctionnelle",
    ceiling: "Plafond 1/h",
    reference: (h: string) => `Référence (a = 1, h = ${h})`,
    x: "Densité de proies N",
    y: "Proies consommées f(N)",
    summary: (a: string, h: string, c: string) => `Réponse fonctionnelle de type II avec a = ${a} et h = ${h} : la consommation croît puis plafonne vers ${c}.`,
    units: "Unités arbitraires : courbe pédagogique, pas un ajustement aux données.",
  },
  en: {
    a: "Attack rate",
    aHint: "Search efficiency when prey are scarce: the slope at the origin.",
    h: "Handling time",
    hHint: "Time spent on each prey: it sets the ceiling 1/h.",
    ceilingNow: "Current ceiling:",
    ceilingUnit: "prey per unit of time. A “better” predator has a larger a and a shorter h: its curve rises faster and higher.",
    response: "Functional response",
    ceiling: "Ceiling 1/h",
    reference: (h: string) => `Reference (a = 1, h = ${h})`,
    x: "Prey density N",
    y: "Prey consumed f(N)",
    summary: (a: string, h: string, c: string) => `Type II functional response with a = ${a} and h = ${h}: consumption rises, then levels off towards ${c}.`,
    units: "Arbitrary units: a teaching curve, not a fit to the data.",
  },
});

/**
 * The two parameters the article compares, made tangible: a sets the slope at
 * low prey density, h sets the ceiling 1/h. Values are in arbitrary units.
 * `equation` is rendered on the server, so KaTeX stays out of the client bundle.
 */
export function HollingExplorer({ equation }: { equation: ReactNode }) {
  const lang = useLang();
  const t = COPY[lang];
  const { nf2 } = numberFormats(lang);
  const [a, setA] = useState(1);
  const [h, setH] = useState(0.1);
  const ceiling = 1 / h;
  const yMax = 22;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
      <div className="space-y-6">
        {equation}
        <Slider label={t.a} symbol="a" value={a} min={0.1} max={3} step={0.1} onChange={setA} format={(v) => nf2.format(v)} hint={t.aHint} />
        <Slider label={t.h} symbol="h" value={h} min={0.05} max={0.5} step={0.01} onChange={setH} format={(v) => nf2.format(v)} hint={t.hHint} />
        <p className="text-sm leading-relaxed text-ink/80">
          {t.ceilingNow} <strong className="tabular-nums">{nf2.format(ceiling)}</strong> {t.ceilingUnit}
        </p>
      </div>
      <div>
        <Legend
          items={[
            { label: t.response, color: "#1d5a9e" },
            { label: t.ceiling, color: "#55626f", dash: "4 4" },
            { label: t.reference(nf2.format(0.1)), color: "#a8bfd6" },
          ]}
        />
        <LineChart
          xDomain={[0, N_MAX]}
          yDomain={[0, yMax]}
          xLabel={t.x}
          yLabel={t.y}
          summary={t.summary(nf2.format(a), nf2.format(h), nf2.format(ceiling))}
          series={[
            { id: "ref", label: t.reference(nf2.format(0.1)), points: curve(1, 0.1), color: "#a8bfd6", width: 2 },
            { id: "ceil", label: t.ceiling, points: [[0, ceiling], [N_MAX, ceiling]], color: "#55626f", dash: "4 4", width: 1.5 },
            { id: "fr", label: t.response, points: curve(a, h), color: "#1d5a9e", width: 3 },
          ]}
        />
        <p className="mt-2 text-xs text-muted">{t.units}</p>
      </div>
    </div>
  );
}
