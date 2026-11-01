"use client";

import { useMemo, useState } from "react";
import { LineChart, Legend } from "@/components/visualizations/LineChart";
import { Slider } from "@/components/interactions/Controls";
import { nf, nf1 } from "@/lib/utils/format";
import { PanelLayout, C, type ExplorerContent } from "./PanelLayout";
import { simulateRF, RF_INITIAL } from "@/lib/scientific/residual-fertility";

/* ---------------------------- Tab 1 -------------------------------- */

const RF_INIT = { sigma: 500, delta: 1, epsilon: 0 };

export function ResidualFertilityPanel({ content }: { content: ExplorerContent }) {
  const [sigma, setSigma] = useState(RF_INIT.sigma);
  const [delta, setDelta] = useState(RF_INIT.delta); // %
  const [epsilon, setEpsilon] = useState(RF_INIT.epsilon); // %

  const toPts = (states: number[][], t: number[]) => states.map((s, i) => [t[i], s[1]] as [number, number]);
  const data = useMemo(() => {
    const opts = { tEnd: 300, dt: 0.1, sampleEvery: 2 };
    const noSit = simulateRF({ sigma: 0 }, opts);
    const noRF = simulateRF({ sigma }, opts);
    const rf = simulateRF({ sigma, delta: delta / 100, epsilon: epsilon / 100 }, opts);
    return {
      noSit: toPts(noSit.states, noSit.t),
      noRF: toPts(noRF.states, noRF.t),
      rf: toPts(rf.states, rf.t),
      endNoRF: noRF.states.at(-1)![1],
      endRF: rf.states.at(-1)![1],
    };
  }, [sigma, delta, epsilon]);

  const reset = () => {
    setSigma(RF_INIT.sigma);
    setDelta(RF_INIT.delta);
    setEpsilon(RF_INIT.epsilon);
  };

  const hasRF = delta > 0 || epsilon > 0;

  return (
    <PanelLayout
      content={content}
      onReset={reset}
      intro={
        <>
          <p>
            La stérilisation n&apos;est pas toujours parfaite. Ce modèle suit trois populations — mâles stériles <em>S</em>, femelles
            sauvages <em>F</em> et mâles sauvages <em>M</em> — et distingue deux formes de fertilité résiduelle.
          </p>
          <p className="text-paper/70">
            <strong className="font-medium text-paper">δ</strong> : part des mâles relâchés restés pleinement fertiles.{" "}
            <strong className="font-medium text-paper">ε</strong> : part des accouplements avec un mâle stérile qui restent fertiles.
          </p>
        </>
      }
      controls={
        <>
          <Slider dark label="Intensité des lâchers" symbol="σ" value={sigma} min={0} max={5000} step={100} onChange={setSigma} format={(v) => `${nf.format(v)} /j`} />
          <Slider dark label="Mâles relâchés fertiles" symbol="δ" value={delta} min={0} max={5} step={0.5} onChange={setDelta} format={(v) => `${nf1.format(v)} %`} />
          <Slider dark label="Accouplements stériles fertiles" symbol="ε" value={epsilon} min={0} max={5} step={0.5} onChange={setEpsilon} format={(v) => `${nf1.format(v)} %`} />
        </>
      }
      legend={
        <Legend
          dark
          items={[
            { label: "Sans lâchers", color: C.mist, dash: "2 4" },
            { label: "Lâchers, stérilité parfaite", color: C.ink, dash: "6 4" },
            { label: "Lâchers avec fertilité résiduelle", color: C.ver },
          ]}
        />
      }
      chart={
        <LineChart
          dark
          series={[
            { id: "nosit", label: "Sans lâchers", points: data.noSit, color: C.mist, dash: "2 4", width: 1.5 },
            { id: "norf", label: "Stérilité parfaite", points: data.noRF, color: C.ink, dash: "6 4", width: 1.8 },
            { id: "rf", label: "Fertilité résiduelle", points: data.rf, color: C.ver, width: 2.6 },
          ]}
          xDomain={[0, 300]}
          yDomain={[0, 1050]}
          xLabel="temps (jours)"
          yLabel="femelles sauvages F"
          summary={`Densité de femelles sauvages sur 300 jours. Sans lâchers, elle reste à ${nf.format(RF_INITIAL[1])}. Avec σ = ${sigma} mâles stériles par jour et une stérilité parfaite, elle atteint ${nf1.format(data.endNoRF)} ; avec δ = ${delta} % et ε = ${epsilon} %, elle atteint ${nf1.format(data.endRF)}.`}
        />
      }
      reading={
        <>
          <p>
            À <span className="tabular-nums">t = 300 j</span>, le modèle donne{" "}
            <span className="tabular-nums text-paper">{nf1.format(data.endNoRF)}</span> femelles avec une stérilité parfaite
            {hasRF && (
              <>
                {" "}
                et <span className="tabular-nums text-accent-light">{nf1.format(data.endRF)}</span> avec fertilité résiduelle
              </>
            )}
            , contre <span className="tabular-nums">{nf.format(RF_INITIAL[1])}</span> sans lâchers.
          </p>
          <p className="mt-2 text-paper/70">
            Augmentez δ : même avec des lâchers intenses, la courbe bleue en trait plein peut se stabiliser au-dessus de zéro — une réduction plutôt
            qu&apos;une suppression.
          </p>
        </>
      }
      verification={`Port TypeScript (RK4, pas 0,1 j) de la fonction modele_SIT du notebook, avec ses paramètres fixes et la condition initiale F₀ = M₀ = 983. Vérifié : reproduit la figure « dynamiques temporelles » du notebook (σ = 500 et 5 000). ${content.figure}`}
    />
  );
}

