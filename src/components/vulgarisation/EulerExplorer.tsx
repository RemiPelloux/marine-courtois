"use client";

import { useState } from "react";
import { LineChart, Legend } from "@/components/visualizations/LineChart";
import { Slider } from "@/components/interactions/Controls";
import { logisticEuler, logisticExact } from "@/lib/scientific/logistic";
import { nf2 } from "@/lib/utils/format";

const [R, K, N0, T] = [0.3, 800, 10, 40];

/** A simulation advances in steps. Big steps drift from the exact curve; small ones follow it. */
export function EulerExplorer() {
  const [dt, setDt] = useState(4);
  const steps = logisticEuler(R, K, N0, dt, T);
  const exact = Array.from({ length: 161 }, (_, i): [number, number] => [(i * T) / 160, logisticExact((i * T) / 160, R, K, N0)]);
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
      <div className="space-y-6">
        <Slider label="Pas de temps" symbol="Δt" value={dt} min={0.5} max={8} step={0.5} onChange={setDt} format={(v) => nf2.format(v)} hint="À chaque pas : N ← N + Δt × r N (1 − N/K)." />
        <p className="text-sm leading-relaxed text-ink/80">
          {steps.length - 1} pas de calcul. Les modèles du site utilisent un schéma plus précis (Runge-Kutta d&apos;ordre 4) avec des pas
          bien plus petits.
        </p>
      </div>
      <div>
        <Legend
          items={[
            { label: "Solution exacte", color: "#a8bfd6" },
            { label: "Simulation pas à pas", color: "#1d5a9e" },
          ]}
        />
        <LineChart
          xDomain={[0, T]}
          yDomain={[0, 1050]}
          xLabel="Temps"
          yLabel="Effectif N"
          summary={`Simulation par pas de ${nf2.format(dt)} comparée à la solution exacte de la croissance logistique.`}
          series={[
            { id: "exact", label: "Exacte", points: exact, color: "#a8bfd6", width: 4 },
            { id: "euler", label: "Pas à pas", points: steps, color: "#1d5a9e", width: 2 },
          ]}
        />
      </div>
    </div>
  );
}
