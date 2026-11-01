"use client";

import { useMemo, useState } from "react";
import { LineChart, Legend } from "@/components/visualizations/LineChart";
import { Slider } from "@/components/interactions/Controls";
import { nf } from "@/lib/utils/format";

/**
 * Periodic sterile-male population under impulsive releases — the analytic
 * solution written in thesisData / Chapter 5 / Notebook_part_impulsive_releases.ipynb:
 *   M_S(t) = σθ · e^{−μS (t mod θ)} / (1 − e^{−μS θ}),  μS = 0.054 /day.
 * The weekly budget is held constant (σ = 200/7 per day) while the period θ varies.
 */
const MU_S = 0.054;
const SIGMA = 200 / 7;

export function ImpulsiveReleases() {
  const [theta, setTheta] = useState(7);
  const data = useMemo(() => {
    const pulse = SIGMA * theta;
    const pts: [number, number][] = [];
    // numerical simulation from MS(0) = σθ with exponential decay and pulses
    let ms = pulse;
    const dt = 0.1;
    for (let i = 0; i <= 1000; i++) {
      const t = i * dt;
      if (i > 0) {
        ms *= Math.exp(-MU_S * dt);
        if (Math.floor(t / theta + 1e-9) !== Math.floor((t - dt) / theta + 1e-9)) ms += pulse;
      }
      pts.push([t, ms]);
    }
    const periodic = pts.map(([t]) => [t, (pulse * Math.exp(-MU_S * (t % theta))) / (1 - Math.exp(-MU_S * theta))] as [number, number]);
    const max = pulse / (1 - Math.exp(-MU_S * theta));
    const min = max * Math.exp(-MU_S * theta);
    return { pts, periodic, max, min, pulse };
  }, [theta]);

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <div className="space-y-5 lg:col-span-4">
        <p className="leading-relaxed">
          À budget hebdomadaire constant (200 mâles stériles par semaine), faut-il relâcher souvent et peu, ou rarement et beaucoup ?
        </p>
        <Slider label="Période entre deux lâchers" symbol="θ" value={theta} min={1} max={28} step={1} onChange={setTheta} format={(v) => `${v} j`} />
        <dl className="grid grid-cols-2 gap-3 tabular-nums text-sm">
          <div className="border-t border-rule pt-2">
            <dt className="label text-muted">Lâcher</dt>
            <dd>{nf.format(data.pulse)} ind.</dd>
          </div>
          <div className="border-t border-rule pt-2">
            <dt className="label text-muted">Oscillation</dt>
            <dd>
              {nf.format(data.min)} – {nf.format(data.max)}
            </dd>
          </div>
        </dl>
        <p className="text-sm leading-relaxed text-muted">
          Plus la période est longue, plus la population de mâles stériles oscille : elle passe une partie du temps à un niveau bas. C&apos;est
          l&apos;une des faces du compromis fréquence–amplitude étudié au chapitre 5 de la thèse.
        </p>
      </div>
      <div className="lg:col-span-8">
        <Legend
          items={[
            { label: "Simulation (impulsions)", color: "#0f1d2e" },
            { label: "Solution périodique analytique", color: "#2468b3", dash: "6 4" },
          ]}
        />
        <LineChart
          height={300}
          series={[
            { id: "sim", label: "Simulation", points: data.pts, color: "#0f1d2e", width: 2 },
            { id: "per", label: "Solution périodique", points: data.periodic, color: "#2468b3", dash: "6 4", width: 2 },
          ]}
          xDomain={[0, 100]}
          yDomain={[0, Math.max(700, data.max * 1.1)]}
          xLabel="temps (jours)"
          yLabel="mâles stériles"
          summary={`Population de mâles stériles avec des lâchers de ${Math.round(data.pulse)} individus tous les ${theta} jours. Elle converge vers une solution périodique oscillant entre ${Math.round(data.min)} et ${Math.round(data.max)}.`}
        />
        <p className="mono-meta mt-3 text-muted">
          Formule transcrite de Notebook_part_impulsive_releases.ipynb (μ<sub>S</sub> = 0,054 j⁻¹). Démonstrateur pédagogique.
        </p>
      </div>
    </div>
  );
}
