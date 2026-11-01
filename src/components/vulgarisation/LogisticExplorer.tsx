"use client";

import { useState } from "react";
import { LineChart } from "@/components/visualizations/LineChart";
import { Slider } from "@/components/interactions/Controls";
import { logisticExact } from "@/lib/scientific/logistic";
import { copy } from "@/i18n/config";
import { useLang } from "@/i18n/client";
import { numberFormats } from "@/lib/utils/format";

const T = 40;

const COPY = copy({
  fr: {
    r: "Taux de croissance",
    rHint: "Naissances moins décès, par individu et par unité de temps.",
    K: "Capacité d'accueil",
    KHint: "L'effectif que le milieu peut soutenir.",
    time: "Temps",
    size: "Effectif N",
    series: "Effectif",
    summary: (k: string) => `Croissance logistique depuis 10 individus : la population croît d'abord vite puis se stabilise vers ${k}.`,
  },
  en: {
    r: "Growth rate",
    rHint: "Births minus deaths, per individual and per unit of time.",
    K: "Carrying capacity",
    KHint: "The number of individuals the environment can support.",
    time: "Time",
    size: "Population size N",
    series: "Population size",
    summary: (k: string) => `Logistic growth from 10 individuals: the population first grows fast, then levels off towards ${k}.`,
  },
});

/** Births minus deaths, slowed down by crowding: the logistic curve, exact. */
export function LogisticExplorer() {
  const lang = useLang();
  const t = COPY[lang];
  const { nf, nf2 } = numberFormats(lang);
  const [r, setR] = useState(0.3);
  const [K, setK] = useState(800);
  const points = Array.from({ length: 161 }, (_, i): [number, number] => [(i * T) / 160, logisticExact((i * T) / 160, r, K, 10)]);
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
      <div className="space-y-6">
        <Slider label={t.r} symbol="r" value={r} min={0.05} max={1} step={0.05} onChange={setR} format={(v) => nf2.format(v)} hint={t.rHint} />
        <Slider label={t.K} symbol="K" value={K} min={200} max={1000} step={50} onChange={setK} format={(v) => nf.format(v)} hint={t.KHint} />
      </div>
      <LineChart
        xDomain={[0, T]}
        yDomain={[0, 1050]}
        xLabel={t.time}
        yLabel={t.size}
        summary={t.summary(nf.format(K))}
        markers={[{ y: K, label: "K" }]}
        series={[{ id: "n", label: t.series, points, color: "#1d5a9e", width: 3 }]}
      />
    </div>
  );
}
