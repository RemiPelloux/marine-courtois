"use client";

import { useState } from "react";
import { LineChart, Legend } from "@/components/visualizations/LineChart";
import { Slider } from "@/components/interactions/Controls";
import { logisticEuler, logisticExact } from "@/lib/scientific/logistic";
import { copy } from "@/i18n/config";
import { useLang } from "@/i18n/client";
import { numberFormats } from "@/lib/utils/format";

const [R, K, N0, T] = [0.3, 800, 10, 40];

const COPY = copy({
  fr: {
    step: "Pas de temps",
    hint: "À chaque pas : N ← N + Δt × r N (1 − N/K).",
    count: (n: number) => `${n} pas de calcul. Les modèles du site utilisent un schéma plus précis (Runge-Kutta d'ordre 4) avec des pas bien plus petits.`,
    exact: "Solution exacte",
    stepwise: "Simulation pas à pas",
    time: "Temps",
    size: "Effectif N",
    summary: (dt: string) => `Simulation par pas de ${dt} comparée à la solution exacte de la croissance logistique.`,
  },
  en: {
    step: "Time step",
    hint: "At each step: N ← N + Δt × r N (1 − N/K).",
    count: (n: number) => `${n} computation steps. The models on this site use a more accurate scheme (fourth-order Runge-Kutta) with much smaller steps.`,
    exact: "Exact solution",
    stepwise: "Step-by-step simulation",
    time: "Time",
    size: "Population size N",
    summary: (dt: string) => `Simulation with a step of ${dt} compared with the exact solution of logistic growth.`,
  },
});

/** A simulation advances in steps. Big steps drift from the exact curve; small ones follow it. */
export function EulerExplorer() {
  const lang = useLang();
  const t = COPY[lang];
  const { nf2 } = numberFormats(lang);
  const [dt, setDt] = useState(4);
  const steps = logisticEuler(R, K, N0, dt, T);
  const exact = Array.from({ length: 161 }, (_, i): [number, number] => [(i * T) / 160, logisticExact((i * T) / 160, R, K, N0)]);
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
      <div className="space-y-6">
        <Slider label={t.step} symbol="Δt" value={dt} min={0.5} max={8} step={0.5} onChange={setDt} format={(v) => nf2.format(v)} hint={t.hint} />
        <p className="text-sm leading-relaxed text-ink/80">{t.count(steps.length - 1)}</p>
      </div>
      <div>
        <Legend
          items={[
            { label: t.exact, color: "#a8bfd6" },
            { label: t.stepwise, color: "#1d5a9e" },
          ]}
        />
        <LineChart
          xDomain={[0, T]}
          yDomain={[0, 1050]}
          xLabel={t.time}
          yLabel={t.size}
          summary={t.summary(nf2.format(dt))}
          series={[
            { id: "exact", label: t.exact, points: exact, color: "#a8bfd6", width: 4 },
            { id: "euler", label: t.stepwise, points: steps, color: "#1d5a9e", width: 2 },
          ]}
        />
      </div>
    </div>
  );
}
