"use client";

import { useMemo, useState } from "react";
import { LineChart, Legend } from "@/components/visualizations/LineChart";
import { Slider } from "@/components/interactions/Controls";
import { numberFormats } from "@/lib/utils/format";
import { copy } from "@/i18n/config";
import { useLang } from "@/i18n/client";

/**
 * Periodic sterile-male population under impulsive releases — the analytic
 * solution written in thesisData / Chapter 5 / Notebook_part_impulsive_releases.ipynb:
 *   M_S(t) = σθ · e^{−μS (t mod θ)} / (1 − e^{−μS θ}),  μS = 0.054 /day.
 * The weekly budget is held constant (σ = 200/7 per day) while the period θ varies.
 */
const MU_S = 0.054;
const SIGMA = 200 / 7;

type Releases = ReturnType<typeof impulsiveReleases>;

const COPY = copy({
  fr: {
    question: "À budget hebdomadaire constant (200 mâles stériles par semaine), faut-il relâcher souvent et peu, ou rarement et beaucoup ?",
    period: "Période entre deux lâchers",
    days: (v: number) => `${v} j`,
    reading:
      "Plus la période est longue, plus la population de mâles stériles oscille : elle passe une partie du temps à un niveau bas. C'est l'une des faces du compromis fréquence–amplitude étudié au chapitre 5 de la thèse.",
    release: "Lâcher",
    ind: "ind.",
    oscillation: "Oscillation",
    legend: [
      { label: "Simulation (impulsions)", color: "#0f1d2e" },
      { label: "Solution périodique analytique", color: "#2468b3", dash: "6 4" },
    ],
    series: ["Simulation", "Solution périodique"],
    x: "temps (jours)",
    y: "mâles stériles",
    summary: (pulse: string, theta: number, min: string, max: string) =>
      `Population de mâles stériles avec des lâchers de ${pulse} individus tous les ${theta} jours. Elle converge vers une solution périodique oscillant entre ${min} et ${max}.`,
    note: ["Formule transcrite de Notebook_part_impulsive_releases.ipynb (μ", " = 0,054 j⁻¹). Démonstrateur pédagogique."],
  },
  en: {
    question: "With a constant weekly budget (200 sterile males per week), is it better to release often and few, or rarely and many?",
    period: "Period between two releases",
    days: (v: number) => `${v} d`,
    reading:
      "The longer the period, the more the sterile male population oscillates: it spends part of the time at a low level. This is one side of the frequency–amplitude trade-off studied in chapter 5 of the thesis.",
    release: "Release",
    ind: "ind.",
    oscillation: "Oscillation",
    legend: [
      { label: "Simulation (pulses)", color: "#0f1d2e" },
      { label: "Analytical periodic solution", color: "#2468b3", dash: "6 4" },
    ],
    series: ["Simulation", "Periodic solution"],
    x: "time (days)",
    y: "sterile males",
    summary: (pulse: string, theta: number, min: string, max: string) =>
      `Sterile male population with releases of ${pulse} individuals every ${theta} days. It converges to a periodic solution oscillating between ${min} and ${max}.`,
    note: ["Formula transcribed from Notebook_part_impulsive_releases.ipynb (μ", " = 0.054 day⁻¹). Teaching demonstrator."],
  },
});
type Text = (typeof COPY)["fr"];

/** Numerical simulation from MS(0) = σθ with exponential decay and pulses. */
function simulatePulses(pulse: number, theta: number) {
  const pts: [number, number][] = [];
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
  return pts;
}

function impulsiveReleases(theta: number) {
  const pulse = SIGMA * theta;
  const pts = simulatePulses(pulse, theta);
  const periodic = pts.map(([t]) => [t, (pulse * Math.exp(-MU_S * (t % theta))) / (1 - Math.exp(-MU_S * theta))] as [number, number]);
  const max = pulse / (1 - Math.exp(-MU_S * theta));
  const min = max * Math.exp(-MU_S * theta);
  return { pts, periodic, max, min, pulse };
}

export function ImpulsiveReleases() {
  const lang = useLang();
  const t = COPY[lang];
  const [theta, setTheta] = useState(7);
  const data = useMemo(() => impulsiveReleases(theta), [theta]);

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <div className="space-y-5 lg:col-span-4">
        <p className="leading-relaxed">
          {t.question}
        </p>
        <Slider label={t.period} symbol="θ" value={theta} min={1} max={28} step={1} onChange={setTheta} format={t.days} />
        <ReleaseStats data={data} t={t} />
        <p className="text-sm leading-relaxed text-muted">
          {t.reading}
        </p>
      </div>
      <ReleasesChart data={data} theta={theta} t={t} />
    </div>
  );
}

function ReleaseStats({ data, t }: { data: Releases; t: Text }) {
  const { nf } = numberFormats(useLang());
  return (
    <dl className="grid grid-cols-2 gap-3 tabular-nums text-sm">
      <div className="border-t border-rule pt-2">
        <dt className="label text-muted">{t.release}</dt>
        <dd>
          {nf.format(data.pulse)} {t.ind}
        </dd>
      </div>
      <div className="border-t border-rule pt-2">
        <dt className="label text-muted">{t.oscillation}</dt>
        <dd>
          {nf.format(data.min)} – {nf.format(data.max)}
        </dd>
      </div>
    </dl>
  );
}

function ReleasesChart({ data, theta, t }: { data: Releases; theta: number; t: Text }) {
  const { nf } = numberFormats(useLang());
  return (
    <div className="lg:col-span-8">
      <Legend items={t.legend} />
      <LineChart
        height={300}
        series={[
          { id: "sim", label: t.series[0], points: data.pts, color: "#0f1d2e", width: 2 },
          { id: "per", label: t.series[1], points: data.periodic, color: "#2468b3", dash: "6 4", width: 2 },
        ]}
        xDomain={[0, 100]}
        yDomain={[0, Math.max(700, data.max * 1.1)]}
        xLabel={t.x}
        yLabel={t.y}
        summary={t.summary(nf.format(data.pulse), theta, nf.format(data.min), nf.format(data.max))}
      />
      <p className="mono-meta mt-3 text-muted">
        {t.note[0]}
        <sub>S</sub>
        {t.note[1]}
      </p>
    </div>
  );
}
