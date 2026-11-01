"use client";

import { useMemo, useState } from "react";
import { LineChart, Legend } from "@/components/visualizations/LineChart";
import { Slider } from "@/components/interactions/Controls";
import { numberFormats } from "@/lib/utils/format";
import { copy } from "@/i18n/config";
import { useLang } from "@/i18n/client";
import { PanelLayout, C, type ExplorerContent } from "./PanelLayout";
import { simulateRF, RF_INITIAL } from "@/lib/scientific/residual-fertility";

/* ---------------------------- Tab 1 -------------------------------- */

const COPY = copy({
  fr: {
    sigma: "Intensité des lâchers",
    delta: "Mâles relâchés fertiles",
    epsilon: "Accouplements stériles fertiles",
    perDay: "/j",
    noSit: "Sans lâchers",
    perfect: "Stérilité parfaite",
    rf: "Fertilité résiduelle",
    perfectLegend: "Lâchers, stérilité parfaite",
    rfLegend: "Lâchers avec fertilité résiduelle",
    x: "temps (jours)",
    y: "femelles sauvages F",
  },
  en: {
    sigma: "Release intensity",
    delta: "Fertile released males",
    epsilon: "Fertile sterile matings",
    perDay: "/day",
    noSit: "No releases",
    perfect: "Perfect sterility",
    rf: "Residual fertility",
    perfectLegend: "Releases, perfect sterility",
    rfLegend: "Releases with residual fertility",
    x: "time (days)",
    y: "wild females F",
  },
});

function useText() {
  const lang = useLang();
  return { lang, t: COPY[lang], ...numberFormats(lang) };
}

const RF_INIT = { sigma: 500, delta: 1, epsilon: 0 };

const toPts = (states: number[][], t: number[]) => states.map((s, i) => [t[i], s[1]] as [number, number]);

function simulateScenarios({ sigma, delta, epsilon }: { sigma: number; delta: number; epsilon: number }) {
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
}

function useResidualFertilityModel() {
  const [sigma, setSigma] = useState(RF_INIT.sigma);
  const [delta, setDelta] = useState(RF_INIT.delta); // %
  const [epsilon, setEpsilon] = useState(RF_INIT.epsilon); // %
  const data = useMemo(() => simulateScenarios({ sigma, delta, epsilon }), [sigma, delta, epsilon]);
  const reset = () => {
    setSigma(RF_INIT.sigma);
    setDelta(RF_INIT.delta);
    setEpsilon(RF_INIT.epsilon);
  };
  return { sigma, setSigma, delta, setDelta, epsilon, setEpsilon, data, reset, hasRF: delta > 0 || epsilon > 0 };
}

type ResidualFertilityModel = ReturnType<typeof useResidualFertilityModel>;

function ResidualFertilityIntro() {
  const { lang } = useText();
  if (lang === "en") {
    return (
      <>
        <p>
          Sterilisation is not always perfect. This model follows three populations (sterile males <em>S</em>, wild females <em>F</em>{" "}
          and wild males <em>M</em>) and distinguishes two forms of residual fertility.
        </p>
        <p className="text-paper/70">
          <strong className="font-medium text-paper">δ</strong>: share of released males that remain fully fertile.{" "}
          <strong className="font-medium text-paper">ε</strong>: share of matings with a sterile male that remain fertile.
        </p>
      </>
    );
  }
  return (
    <>
      <p>
        La stérilisation n&apos;est pas toujours parfaite. Ce modèle suit trois populations (mâles stériles <em>S</em>, femelles
        sauvages <em>F</em> et mâles sauvages <em>M</em>) et distingue deux formes de fertilité résiduelle.
      </p>
      <p className="text-paper/70">
        <strong className="font-medium text-paper">δ</strong> : part des mâles relâchés restés pleinement fertiles.{" "}
        <strong className="font-medium text-paper">ε</strong> : part des accouplements avec un mâle stérile qui restent fertiles.
      </p>
    </>
  );
}

function ResidualFertilityControls({ m }: { m: ResidualFertilityModel }) {
  const { t, nf, nf1 } = useText();
  return (
    <>
      <Slider dark label={t.sigma} symbol="σ" value={m.sigma} min={0} max={5000} step={100} onChange={m.setSigma} format={(v) => `${nf.format(v)} ${t.perDay}`} />
      <Slider dark label={t.delta} symbol="δ" value={m.delta} min={0} max={5} step={0.5} onChange={m.setDelta} format={(v) => `${nf1.format(v)} %`} />
      <Slider dark label={t.epsilon} symbol="ε" value={m.epsilon} min={0} max={5} step={0.5} onChange={m.setEpsilon} format={(v) => `${nf1.format(v)} %`} />
    </>
  );
}

function chartSummary({ m, lang, nf, nf1 }: { m: ResidualFertilityModel } & ReturnType<typeof useText>) {
  const [start, perfect, rf] = [nf.format(RF_INITIAL[1]), nf1.format(m.data.endNoRF), nf1.format(m.data.endRF)];
  if (lang === "en") {
    return `Wild female density over 300 days. Without releases it stays at ${start}. With σ = ${m.sigma} sterile males per day and perfect sterility it reaches ${perfect}; with δ = ${m.delta} % and ε = ${m.epsilon} % it reaches ${rf}.`;
  }
  return `Densité de femelles sauvages sur 300 jours. Sans lâchers, elle reste à ${start}. Avec σ = ${m.sigma} mâles stériles par jour et une stérilité parfaite, elle atteint ${perfect} ; avec δ = ${m.delta} % et ε = ${m.epsilon} %, elle atteint ${rf}.`;
}

function ResidualFertilityChart({ m }: { m: ResidualFertilityModel }) {
  const text = useText();
  const { data } = m;
  return (
    <LineChart
      dark
      series={[
        { id: "nosit", label: text.t.noSit, points: data.noSit, color: C.mist, dash: "2 4", width: 1.5 },
        { id: "norf", label: text.t.perfect, points: data.noRF, color: C.ink, dash: "6 4", width: 1.8 },
        { id: "rf", label: text.t.rf, points: data.rf, color: C.ver, width: 2.6 },
      ]}
      xDomain={[0, 300]}
      yDomain={[0, 1050]}
      xLabel={text.t.x}
      yLabel={text.t.y}
      summary={chartSummary({ m, ...text })}
    />
  );
}

function ResidualFertilityReading({ m }: { m: ResidualFertilityModel }) {
  const { lang, nf, nf1 } = useText();
  const perfect = <span className="tabular-nums text-paper">{nf1.format(m.data.endNoRF)}</span>;
  const rf = <span className="tabular-nums text-accent-light">{nf1.format(m.data.endRF)}</span>;
  const start = <span className="tabular-nums">{nf.format(RF_INITIAL[1])}</span>;
  if (lang === "en") {
    return (
      <>
        <p>
          At <span className="tabular-nums">t = 300 days</span>, the model gives {perfect} females with perfect sterility
          {m.hasRF && <> and {rf} with residual fertility</>}, against {start} without releases.
        </p>
        <p className="mt-2 text-paper/70">
          Raise δ: even with intense releases, the solid blue curve can settle above zero, a reduction rather than a suppression.
        </p>
      </>
    );
  }
  return (
    <>
      <p>
        À <span className="tabular-nums">t = 300 j</span>, le modèle donne {perfect} femelles avec une stérilité parfaite
        {m.hasRF && <> et {rf} avec fertilité résiduelle</>}, contre {start} sans lâchers.
      </p>
      <p className="mt-2 text-paper/70">
        Augmentez δ : même avec des lâchers intenses, la courbe bleue en trait plein peut se stabiliser au-dessus de zéro, une réduction
        plutôt qu&apos;une suppression.
      </p>
    </>
  );
}

const VERIFICATION = copy({
  fr: "Port TypeScript (RK4, pas 0,1 j) de la fonction modele_SIT du notebook, avec ses paramètres fixes et la condition initiale F₀ = M₀ = 983. Vérifié : reproduit la figure « dynamiques temporelles » du notebook (σ = 500 et 5 000).",
  en: "TypeScript port (RK4, step 0.1 day) of the notebook's modele_SIT function, with its fixed parameters and the initial condition F₀ = M₀ = 983. Checked: reproduces the notebook's “time dynamics” figure (σ = 500 and 5,000).",
});

export function ResidualFertilityPanel({ content }: { content: ExplorerContent }) {
  const m = useResidualFertilityModel();
  const { lang, t } = useText();
  const legend = [
    { label: t.noSit, color: C.mist, dash: "2 4" },
    { label: t.perfectLegend, color: C.ink, dash: "6 4" },
    { label: t.rfLegend, color: C.ver },
  ];
  return (
    <PanelLayout
      content={content}
      onReset={m.reset}
      intro={<ResidualFertilityIntro />}
      controls={<ResidualFertilityControls m={m} />}
      legend={<Legend dark items={legend} />}
      chart={<ResidualFertilityChart m={m} />}
      reading={<ResidualFertilityReading m={m} />}
      verification={`${VERIFICATION[lang]} ${content.figure}`}
    />
  );
}
