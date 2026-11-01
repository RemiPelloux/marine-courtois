"use client";

import { useMemo, useState } from "react";
import { LineChart, Legend } from "@/components/visualizations/LineChart";
import { SegmentedControl, Slider } from "@/components/interactions/Controls";
import { nf } from "@/lib/utils/format";
import { PanelLayout, C, type ExplorerContent } from "./PanelLayout";
import { simulateRemating, REMATING_INITIAL_HIGH, REMATING_INITIAL_LOW } from "@/lib/scientific/remating";

/* ---------------------------- Tab 2 -------------------------------- */

const REM_INIT = { sigma: 450000, infestation: "forte" as "forte" | "faible" };

export function RematingPanel({ content }: { content: ExplorerContent }) {
  const [sigma, setSigma] = useState(REM_INIT.sigma);
  const [infestation, setInfestation] = useState<"forte" | "faible">(REM_INIT.infestation);

  const data = useMemo(() => {
    const high = infestation === "forte";
    const opts = high ? { tEnd: 5000, dt: 0.05, sampleEvery: 20 } : { tEnd: 300, dt: 0.05, sampleEvery: 2 };
    const y0 = high ? REMATING_INITIAL_HIGH : REMATING_INITIAL_LOW;
    const pts = (r: ReturnType<typeof simulateRemating>) => r.states.map((s, i) => [r.t[i], s[0]] as [number, number]);
    const first = simulateRemating({ sigma, tauF: 0, tauI: 0 }, opts, y0);
    const last = simulateRemating({ sigma }, opts, y0);
    const none = simulateRemating({ sigma: 0 }, opts, y0);
    return {
      tEnd: opts.tEnd,
      first: pts(first),
      last: pts(last),
      none: pts(none),
      endFirst: first.states.at(-1)![0],
      endLast: last.states.at(-1)![0],
    };
  }, [sigma, infestation]);

  const reset = () => {
    setSigma(REM_INIT.sigma);
    setInfestation(REM_INIT.infestation);
  };

  return (
    <PanelLayout
      content={content}
      onReset={reset}
      intro={
        <>
          <p>
            Chez <em>Drosophila suzukii</em>, les femelles peuvent s&apos;accoupler plusieurs fois. Le modèle sépare les femelles
            fécondées par un mâle fertile (<em>F<sub>F</sub></em>) ou stérile (<em>F<sub>I</sub></em>) ; le ré-accouplement les fait
            passer d&apos;un état à l&apos;autre.
          </p>
          <p className="text-paper/70">
            <strong className="font-medium text-paper">« First »</strong> : seul le premier accouplement compte (τ = 0).{" "}
            <strong className="font-medium text-paper">« Last »</strong> : le dernier accouplement détermine la descendance (τ<sub>F</sub> =
            0,12 ; τ<sub>I</sub> = 0,14 par jour).
          </p>
        </>
      }
      controls={
        <>
          <Slider dark label="Intensité des lâchers" symbol="σ" value={sigma} min={0} max={800000} step={25000} onChange={setSigma} format={(v) => `${nf.format(v / 1000)} k/j`} />
          <div className="grid gap-2">
            <p className="text-sm">Infestation initiale</p>
            <SegmentedControl
              dark
              label="Infestation initiale"
              value={infestation}
              onChange={setInfestation}
              options={[
                { value: "forte", label: "Forte (5 000 j)" },
                { value: "faible", label: "Faible (300 j)" },
              ]}
            />
          </div>
        </>
      }
      legend={
        <Legend
          dark
          items={[
            { label: "Sans lâchers", color: C.mist, dash: "2 4" },
            { label: "« First » — premier mâle", color: C.ink },
            { label: "« Last » — dernier mâle", color: C.ver },
          ]}
        />
      }
      chart={
        <LineChart
          dark
          series={[
            { id: "none", label: "Sans lâchers", points: data.none, color: C.mist, dash: "2 4", width: 1.5 },
            { id: "first", label: "First", points: data.first, color: C.ink, width: 2.4 },
            { id: "last", label: "Last", points: data.last, color: C.ver, width: 2.6 },
          ]}
          xDomain={[0, data.tEnd]}
          yDomain={[0, 37000]}
          formatY={(v) => (v === 0 ? "0" : `${v / 1000}k`)}
          xLabel="temps (jours)"
          yLabel="densité larvaire L"
          summary={`Densité larvaire sur ${data.tEnd} jours pour σ = ${sigma} mâles stériles par jour, infestation ${infestation}. Fin de simulation : ${nf.format(data.endFirst)} larves avec la règle First, ${nf.format(data.endLast)} avec la règle Last.`}
        />
      }
      reading={
        <>
          <p>
            En fin de simulation : <span className="tabular-nums text-paper">{nf.format(data.endFirst)}</span> larves (« First ») et{" "}
            <span className="tabular-nums text-accent-light">{nf.format(data.endLast)}</span> (« Last »).
          </p>
          <p className="mt-2 text-paper/70">
            Comparez les deux horizons : selon l&apos;intensité des lâchers, la règle qui fait baisser la population le plus vite au
            début n&apos;est pas forcément celle qui l&apos;élimine à long terme.
          </p>
        </>
      }
      verification={`Port TypeScript (RK4, pas 0,05 j) du système modele_SIT du notebook, paramètres du notebook (μL = 0,037 ; K = 36 000 ; η = 0,6…). Vérifié : reproduit les panneaux A et B de la figure First/Last pour σ = 300 000, 450 000 et 600 000. ${content.figure}`}
    />
  );
}

