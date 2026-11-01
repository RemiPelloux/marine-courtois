"use client";

import { useState, type ReactNode } from "react";
import { LineChart, Legend } from "@/components/visualizations/LineChart";
import { Slider } from "@/components/interactions/Controls";
import { nf2 } from "@/lib/utils/format";

/** Holling type II: f(N) = aN / (1 + a h N). */
export const holling = (N: number, a: number, h: number) => (a * N) / (1 + a * h * N);

const N_MAX = 100;
const curve = (a: number, h: number) => Array.from({ length: 101 }, (_, i): [number, number] => [i, holling(i, a, h)]);

/**
 * The two parameters the article compares, made tangible: a sets the slope at
 * low prey density, h sets the ceiling 1/h. Values are in arbitrary units.
 * `equation` is rendered on the server, so KaTeX stays out of the client bundle.
 */
export function HollingExplorer({ equation }: { equation: ReactNode }) {
  const [a, setA] = useState(1);
  const [h, setH] = useState(0.1);
  const ceiling = 1 / h;
  const yMax = 22;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
      <div className="space-y-6">
        {equation}
        <Slider label="Taux d'attaque" symbol="a" value={a} min={0.1} max={3} step={0.1} onChange={setA} format={(v) => nf2.format(v)} hint="Efficacité de recherche quand les proies sont rares : la pente à l'origine." />
        <Slider label="Temps de manipulation" symbol="h" value={h} min={0.05} max={0.5} step={0.01} onChange={setH} format={(v) => nf2.format(v)} hint="Temps passé sur chaque proie : il fixe le plafond 1/h." />
        <p className="text-sm leading-relaxed text-ink/80">
          Plafond actuel : <strong className="tabular-nums">{nf2.format(ceiling)}</strong> proies par unité de temps. Un « meilleur »
          prédateur a un a plus grand et un h plus court : sa courbe monte plus vite et plus haut.
        </p>
      </div>
      <div>
        <Legend
          items={[
            { label: "Réponse fonctionnelle", color: "#1d5a9e" },
            { label: "Plafond 1/h", color: "#55626f", dash: "4 4" },
            { label: "Référence (a = 1, h = 0,1)", color: "#a8bfd6" },
          ]}
        />
        <LineChart
          xDomain={[0, N_MAX]}
          yDomain={[0, yMax]}
          xLabel="Densité de proies N"
          yLabel="Proies consommées f(N)"
          summary={`Réponse fonctionnelle de type II avec a = ${nf2.format(a)} et h = ${nf2.format(h)} : la consommation croît puis plafonne vers ${nf2.format(ceiling)}.`}
          series={[
            { id: "ref", label: "Référence", points: curve(1, 0.1), color: "#a8bfd6", width: 2 },
            { id: "ceil", label: "Plafond", points: [[0, ceiling], [N_MAX, ceiling]], color: "#55626f", dash: "4 4", width: 1.5 },
            { id: "fr", label: "Réponse fonctionnelle", points: curve(a, h), color: "#1d5a9e", width: 3 },
          ]}
        />
        <p className="mt-2 text-xs text-muted">Unités arbitraires : courbe pédagogique, pas un ajustement aux données.</p>
      </div>
    </div>
  );
}
