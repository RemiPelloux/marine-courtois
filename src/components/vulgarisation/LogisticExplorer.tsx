"use client";

import { useState } from "react";
import { LineChart } from "@/components/visualizations/LineChart";
import { Slider } from "@/components/interactions/Controls";
import { logisticExact } from "@/lib/scientific/logistic";
import { nf, nf2 } from "@/lib/utils/format";

const T = 40;

/** Births minus deaths, slowed down by crowding: the logistic curve, exact. */
export function LogisticExplorer() {
  const [r, setR] = useState(0.3);
  const [K, setK] = useState(800);
  const points = Array.from({ length: 161 }, (_, i): [number, number] => [(i * T) / 160, logisticExact((i * T) / 160, r, K, 10)]);
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
      <div className="space-y-6">
        <Slider label="Taux de croissance" symbol="r" value={r} min={0.05} max={1} step={0.05} onChange={setR} format={(v) => nf2.format(v)} hint="Naissances moins décès, par individu et par unité de temps." />
        <Slider label="Capacité d'accueil" symbol="K" value={K} min={200} max={1000} step={50} onChange={setK} format={(v) => nf.format(v)} hint="L'effectif que le milieu peut soutenir." />
      </div>
      <LineChart
        xDomain={[0, T]}
        yDomain={[0, 1050]}
        xLabel="Temps"
        yLabel="Effectif N"
        summary={`Croissance logistique depuis 10 individus : la population croît d'abord vite puis se stabilise vers ${nf.format(K)}.`}
        markers={[{ y: K, label: "K" }]}
        series={[{ id: "n", label: "Effectif", points, color: "#1d5a9e", width: 3 }]}
      />
    </div>
  );
}
