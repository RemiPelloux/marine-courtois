"use client";

import { useMemo, useState } from "react";
import { LineChart, Legend } from "@/components/visualizations/LineChart";
import { SegmentedControl, Slider } from "@/components/interactions/Controls";
import { numberFormats } from "@/lib/utils/format";
import { copy } from "@/i18n/config";
import { useLang } from "@/i18n/client";
import { PanelLayout, C, type ExplorerContent } from "./PanelLayout";
import { simulateRemating, REMATING_INITIAL_HIGH, REMATING_INITIAL_LOW } from "@/lib/scientific/remating";

/* ---------------------------- Tab 2 -------------------------------- */

type Infestation = "forte" | "faible";

const REM_INIT = { sigma: 450000, infestation: "forte" as Infestation };

type Points = [number, number][];

function simulateScenarios({ sigma, infestation }: { sigma: number; infestation: Infestation }) {
  const high = infestation === "forte";
  const opts = high ? { tEnd: 5000, dt: 0.05, sampleEvery: 20 } : { tEnd: 300, dt: 0.05, sampleEvery: 2 };
  const y0 = high ? REMATING_INITIAL_HIGH : REMATING_INITIAL_LOW;
  const pts = (r: ReturnType<typeof simulateRemating>): Points => r.states.map((s, i) => [r.t[i], s[0]] as [number, number]);
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
}

function useRematingModel() {
  const [sigma, setSigma] = useState(REM_INIT.sigma);
  const [infestation, setInfestation] = useState<Infestation>(REM_INIT.infestation);
  const data = useMemo(() => simulateScenarios({ sigma, infestation }), [sigma, infestation]);
  const reset = () => {
    setSigma(REM_INIT.sigma);
    setInfestation(REM_INIT.infestation);
  };
  return { sigma, setSigma, infestation, setInfestation, data, reset };
}

type RematingModel = ReturnType<typeof useRematingModel>;

const COPY = copy({
  fr: {
    sigma: "Intensité des lâchers",
    perDay: "k/j",
    infestation: "Infestation initiale",
    high: "Forte (5 000 j)",
    low: "Faible (300 j)",
    noSit: "Sans lâchers",
    first: "« First » — premier mâle",
    last: "« Last » — dernier mâle",
    x: "temps (jours)",
    y: "densité larvaire L",
    level: { forte: "forte", faible: "faible" } as Record<Infestation, string>,
    summary: (d: number, sigma: number, level: string, first: string, last: string) =>
      `Densité larvaire sur ${d} jours pour σ = ${sigma} mâles stériles par jour, infestation ${level}. Fin de simulation : ${first} larves avec la règle First, ${last} avec la règle Last.`,
    verification:
      "Port TypeScript (RK4, pas 0,05 j) du système modele_SIT du notebook, paramètres du notebook (μL = 0,037 ; K = 36 000 ; η = 0,6…). Vérifié : reproduit les panneaux A et B de la figure First/Last pour σ = 300 000, 450 000 et 600 000.",
  },
  en: {
    sigma: "Release intensity",
    perDay: "k/day",
    infestation: "Initial infestation",
    high: "High (5,000 days)",
    low: "Low (300 days)",
    noSit: "No releases",
    first: "“First” — first male",
    last: "“Last” — last male",
    x: "time (days)",
    y: "larval density L",
    level: { forte: "high", faible: "low" },
    summary: (d: number, sigma: number, level: string, first: string, last: string) =>
      `Larval density over ${d} days for σ = ${sigma} sterile males per day, ${level} infestation. End of simulation: ${first} larvae under the First rule, ${last} under the Last rule.`,
    verification:
      "TypeScript port (RK4, step 0.05 day) of the notebook's modele_SIT system, with the notebook's parameters (μL = 0.037; K = 36,000; η = 0.6…). Checked: reproduces panels A and B of the First/Last figure for σ = 300,000, 450,000 and 600,000.",
  },
});

function useText() {
  const lang = useLang();
  return { lang, t: COPY[lang], nf: numberFormats(lang).nf };
}

function RematingIntro() {
  const { lang } = useText();
  if (lang === "en") {
    return (
      <>
        <p>
          In <em>Drosophila suzukii</em>, females can mate several times. The model separates females fertilised by a fertile male (
          <em>F<sub>F</sub></em>) or a sterile one (<em>F<sub>I</sub></em>); remating moves them from one state to the other.
        </p>
        <p className="text-paper/70">
          <strong className="font-medium text-paper">“First”</strong>: only the first mating counts (τ = 0).{" "}
          <strong className="font-medium text-paper">“Last”</strong>: the last mating determines the offspring (τ<sub>F</sub> = 0.12;
          τ<sub>I</sub> = 0.14 per day).
        </p>
      </>
    );
  }
  return (
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
  );
}

function RematingControls({ m }: { m: RematingModel }) {
  const { t, nf } = useText();
  return (
    <>
      <Slider dark label={t.sigma} symbol="σ" value={m.sigma} min={0} max={800000} step={25000} onChange={m.setSigma} format={(v) => `${nf.format(v / 1000)} ${t.perDay}`} />
      <div className="grid gap-2">
        <p className="text-sm">{t.infestation}</p>
        <SegmentedControl
          dark
          label={t.infestation}
          value={m.infestation}
          onChange={m.setInfestation}
          options={[
            { value: "forte", label: t.high },
            { value: "faible", label: t.low },
          ]}
        />
      </div>
    </>
  );
}

function RematingChart({ m }: { m: RematingModel }) {
  const { t, nf } = useText();
  const { data } = m;
  return (
    <LineChart
      dark
      series={[
        { id: "none", label: t.noSit, points: data.none, color: C.mist, dash: "2 4", width: 1.5 },
        { id: "first", label: "First", points: data.first, color: C.ink, width: 2.4 },
        { id: "last", label: "Last", points: data.last, color: C.ver, width: 2.6 },
      ]}
      xDomain={[0, data.tEnd]}
      yDomain={[0, 37000]}
      formatY={(v) => (v === 0 ? "0" : `${v / 1000}k`)}
      xLabel={t.x}
      yLabel={t.y}
      summary={t.summary(data.tEnd, m.sigma, t.level[m.infestation], nf.format(data.endFirst), nf.format(data.endLast))}
    />
  );
}

function RematingReading({ m }: { m: RematingModel }) {
  const { lang, nf } = useText();
  const first = <span className="tabular-nums text-paper">{nf.format(m.data.endFirst)}</span>;
  const last = <span className="tabular-nums text-accent-light">{nf.format(m.data.endLast)}</span>;
  if (lang === "en") {
    return (
      <>
        <p>
          At the end of the simulation: {first} larvae (“First”) and {last} (“Last”).
        </p>
        <p className="mt-2 text-paper/70">
          Compare the two horizons: depending on the release intensity, the rule that brings the population down fastest at first is not
          necessarily the one that eliminates it in the long term.
        </p>
      </>
    );
  }
  return (
    <>
      <p>
        En fin de simulation : {first} larves (« First ») et {last} (« Last »).
      </p>
      <p className="mt-2 text-paper/70">
        Comparez les deux horizons : selon l&apos;intensité des lâchers, la règle qui fait baisser la population le plus vite au
        début n&apos;est pas forcément celle qui l&apos;élimine à long terme.
      </p>
    </>
  );
}

export function RematingPanel({ content }: { content: ExplorerContent }) {
  const m = useRematingModel();
  const { t } = useText();
  const legend = [
    { label: t.noSit, color: C.mist, dash: "2 4" },
    { label: t.first, color: C.ink },
    { label: t.last, color: C.ver },
  ];
  return (
    <PanelLayout
      content={content}
      onReset={m.reset}
      intro={<RematingIntro />}
      controls={<RematingControls m={m} />}
      legend={<Legend dark items={legend} />}
      chart={<RematingChart m={m} />}
      reading={<RematingReading m={m} />}
      verification={`${t.verification} ${content.figure}`}
    />
  );
}
