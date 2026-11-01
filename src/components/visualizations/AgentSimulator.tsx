"use client";

import { useRef, type RefObject } from "react";
import { ABM_SCALE, type ABMSnapshot } from "@/lib/scientific/abm";
import { LineChart, Legend, type ChartSeries } from "@/components/visualizations/LineChart";
import { SegmentedControl, Slider, IconButton } from "@/components/interactions/Controls";
import { DAYS, useAgentSimulator, type AgentSimulatorState } from "@/components/visualizations/agent-simulator/useAgentSimulator";
import { numberFormats } from "@/lib/utils/format";
import { Pause, Play, RotateCcw, Shuffle } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { copy } from "@/i18n/config";
import { useLang } from "@/i18n/client";

type FemaleCounts = ABMSnapshot["femaleStates"];

const COPY = copy({
  fr: {
    individual: "Échelle individuelle — femelles et contenu de leur spermathèque",
    compact: (day: string, n: string) => `jour ${day} · ${n} femelles · 1 point = 1 femelle`,
    status: (day: number, f: FemaleCounts | undefined) =>
      `Jour ${day} : ${f ? `${f.fertile} femelles avec uniquement du sperme fertile, ${f.mixed} avec les deux, ${f.sterile} avec uniquement du sperme stérile, ${f.unmated} non accouplées` : ""}.`,
    swarm: { fertile: "fertile", mixed: "fertile + stérile", sterile: "stérile", unmated: "non accouplée" },
    rule: "Règle d'utilisation du sperme",
    release: "Mâles stériles lâchés / jour",
    hint: (n: string) => `Équivaut à ${n} individus par jour à l'échelle du modèle original.`,
    play: "Lecture",
    pause: "Pause",
    reset: "Réinitialiser",
    reshuffle: "Autre réplique",
    population: "Échelle de la population",
    progress: (day: number, seed: number) => `jour ${day} / ${DAYS} · réplique n° ${seed}`,
    larvae: "Larves",
    females: "Femelles",
    wild: "Mâles sauvages",
    x: "temps (jours)",
    y: "individus (échelle 1/50)",
    summary: (rule: string, release: number, s: ABMSnapshot | undefined) =>
      `Simulation individu-centrée, règle ${rule}, ${release} mâles stériles par jour. Jour ${s?.t ?? 0} : ${s?.larvae ?? 0} larves, ${s?.females ?? 0} femelles, ${s?.wildMales ?? 0} mâles sauvages, ${s?.sterileMales ?? 0} mâles stériles.`,
  },
  en: {
    individual: "Individual scale — females and the content of their spermatheca",
    compact: (day: string, n: string) => `day ${day} · ${n} females · 1 dot = 1 female`,
    status: (day: number, f: FemaleCounts | undefined) =>
      `Day ${day}: ${f ? `${f.fertile} females with fertile sperm only, ${f.mixed} with both, ${f.sterile} with sterile sperm only, ${f.unmated} unmated` : ""}.`,
    swarm: { fertile: "fertile", mixed: "fertile + sterile", sterile: "sterile", unmated: "unmated" },
    rule: "Sperm-use rule",
    release: "Sterile males released / day",
    hint: (n: string) => `Equivalent to ${n} individuals per day at the scale of the original model.`,
    play: "Play",
    pause: "Pause",
    reset: "Reset",
    reshuffle: "Another replicate",
    population: "Population scale",
    progress: (day: number, seed: number) => `day ${day} / ${DAYS} · replicate no. ${seed}`,
    larvae: "Larvae",
    females: "Females",
    wild: "Wild males",
    x: "time (days)",
    y: "individuals (1/50 scale)",
    summary: (rule: string, release: number, s: ABMSnapshot | undefined) =>
      `Individual-based simulation, ${rule} rule, ${release} sterile males per day. Day ${s?.t ?? 0}: ${s?.larvae ?? 0} larvae, ${s?.females ?? 0} females, ${s?.wildMales ?? 0} wild males, ${s?.sterileMales ?? 0} sterile males.`,
  },
});

const useText = () => {
  const lang = useLang();
  return { t: COPY[lang], nf: numberFormats(lang).nf };
};

const STATE_COLORS = {
  fertile: "#0f1d2e",
  mixed: "#7d8fa3",
  sterile: "var(--viz-accent)",
  unmated: "transparent",
};

type FemaleState = keyof typeof STATE_COLORS;

/**
 * Individual-level demonstrator. `compact` renders only the population of
 * females (used in the methods panel); the full version adds controls and
 * the population-level time series.
 */
export function AgentSimulator({ compact = false, dark = false }: { compact?: boolean; dark?: boolean }) {
  const { t } = useText();
  const ref = useRef<HTMLDivElement>(null);
  const sim = useAgentSimulator({ ref, compact });
  const last = sim.history.at(-1);

  if (compact) return <CompactView ref={ref} snapshot={last} dark={dark} />;

  return (
    <div ref={ref} className="grid gap-10 lg:grid-cols-12">
      <div className="space-y-6 lg:col-span-4">
        <SimulatorControls sim={sim} />
        <div>
          <p className="label mb-3 text-muted">{t.individual}</p>
          <FemaleSwarm snapshot={last} compact={false} dark={dark} />
        </div>
      </div>
      <PopulationPanel sim={sim} />
    </div>
  );
}

function CompactView({ ref, snapshot: last, dark }: { ref: RefObject<HTMLDivElement | null>; snapshot: ABMSnapshot | undefined; dark: boolean }) {
  const { t, nf } = useText();
  return (
    <div ref={ref}>
      <p className={cn("mono-meta mb-2", dark ? "text-mist" : "text-muted")}>
        {t.compact(String(last?.t ?? 0).padStart(3, "0"), nf.format(last?.females ?? 0))}
      </p>
      <FemaleSwarm snapshot={last} compact dark={dark} />
    </div>
  );
}

function femaleDots(females: ABMSnapshot["femaleStates"] | undefined): FemaleState[] {
  if (!females) return [];
  return [
    ...Array(females.fertile).fill("fertile"),
    ...Array(females.mixed).fill("mixed"),
    ...Array(females.sterile).fill("sterile"),
    ...Array(females.unmated).fill("unmated"),
  ];
}

function dotStyle(s: FemaleState, dark: boolean) {
  return {
    background: s === "fertile" && dark ? "#f5f2eb" : STATE_COLORS[s],
    borderColor: s === "unmated" ? (dark ? "#a8bfd6" : "#6b7785") : s === "fertile" && dark ? "#f5f2eb" : STATE_COLORS[s],
  };
}

function FemaleSwarm({ snapshot: last, compact, dark }: { snapshot: ABMSnapshot | undefined; compact: boolean; dark: boolean }) {
  const { t } = useText();
  const females = last?.femaleStates;
  const shown = femaleDots(females).slice(0, compact ? 240 : 600);
  return (
    <div>
      <div className={cn("flex flex-wrap content-start", compact ? "h-40 gap-[4px]" : "h-56 gap-[3px] md:h-64")} aria-hidden>
        {shown.map((s, i) => (
          <span key={i} className={cn("rounded-full border", compact ? "size-[9px]" : "size-[7px]")} style={dotStyle(s, dark)} />
        ))}
      </div>
      <p className="sr-only" role="status">
        {t.status(last?.t ?? 0, females)}
      </p>
      <SwarmLegend dark={dark} />
    </div>
  );
}

function SwarmLegend({ dark }: { dark: boolean }) {
  const { swarm } = useText().t;
  return (
    <ul className={cn("mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs", dark ? "text-paper/80" : "text-ink/75")}>
      <li className="flex items-center gap-1.5">
        <span className={cn("size-2 rounded-full", dark ? "bg-paper" : "bg-ink")} /> {swarm.fertile}
      </li>
      <li className="flex items-center gap-1.5">
        <span className="size-2 rounded-full bg-[#7d8fa3]" /> {swarm.mixed}
      </li>
      <li className="flex items-center gap-1.5">
        <span className="size-2 rounded-full bg-accent" /> {swarm.sterile}
      </li>
      <li className="flex items-center gap-1.5">
        <span className="size-2 rounded-full border border-muted-soft" /> {swarm.unmated}
      </li>
    </ul>
  );
}

function SimulatorControls({ sim }: { sim: AgentSimulatorState }) {
  const { t } = useText();
  return (
    <div className="space-y-5 rounded-[3px] border border-rule p-4">
      <div className="grid gap-2">
        <p className="text-sm">{t.rule}</p>
        <SegmentedControl
          label={t.rule}
          value={sim.rule}
          onChange={sim.chooseRule}
          options={[
            { value: "first", label: "First" },
            { value: "last", label: "Last" },
            { value: "mixed", label: "Mixed" },
          ]}
        />
      </div>
      <ReleaseSlider sim={sim} />
      <RunButtons sim={sim} />
    </div>
  );
}

function ReleaseSlider({ sim }: { sim: AgentSimulatorState }) {
  const { t, nf } = useText();
  return (
    <Slider
      label={t.release}
      symbol="×50"
      value={sim.release}
      min={0}
      max={400}
      step={20}
      onChange={sim.chooseRelease}
      format={(v) => nf.format(v)}
      hint={t.hint(nf.format(v2(sim.release)))}
    />
  );
}

function RunButtons({ sim }: { sim: AgentSimulatorState }) {
  const { t } = useText();
  const playing = sim.playing && (sim.history.at(-1)?.t ?? 0) < DAYS;
  return (
    <div className="flex flex-wrap gap-2">
      <IconButton onClick={sim.toggle} variant="solid">
        {playing ? <Pause className="size-4" aria-hidden /> : <Play className="size-4" aria-hidden />}
        {playing ? t.pause : t.play}
      </IconButton>
      <IconButton onClick={sim.reset}>
        <RotateCcw className="size-4" aria-hidden /> {t.reset}
      </IconButton>
      <IconButton onClick={sim.reshuffle}>
        <Shuffle className="size-4" aria-hidden /> {t.reshuffle}
      </IconButton>
    </div>
  );
}

type Text = (typeof COPY)["fr"];

const SERIES_STYLE = [
  { id: "l", key: "larvae", color: "#2468b3", width: 2.4 },
  { id: "f", key: "females", color: "#0f1d2e", width: 1.8 },
  { id: "w", key: "wildMales", color: "#6b7785", dash: "5 4", width: 1.6 },
] as const;

const seriesLabel = (t: Text, key: (typeof SERIES_STYLE)[number]["key"]) => ({ larvae: t.larvae, females: t.females, wildMales: t.wild })[key];

function populationSeries(history: ABMSnapshot[], t: Text): ChartSeries[] {
  return SERIES_STYLE.map(({ key, ...style }) => ({ ...style, label: seriesLabel(t, key), points: history.map((h) => [h.t, h[key]] as [number, number]) }));
}

function PopulationPanel({ sim: { history, rule, release, seed } }: { sim: AgentSimulatorState }) {
  const { t } = useText();
  const last = history.at(-1);
  const legend = SERIES_STYLE.map((s) => ({ label: seriesLabel(t, s.key), color: s.color, dash: "dash" in s ? s.dash : undefined }));
  return (
    <div className="lg:col-span-8">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-3">
        <p className="label text-muted">{t.population}</p>
        <p className="mono-meta text-muted">{t.progress(last?.t ?? 0, seed)}</p>
      </div>
      <div className="mb-3">
        <Legend items={legend} />
      </div>
      <LineChart
        series={populationSeries(history, t)}
        xDomain={[0, DAYS]}
        yDomain={[0, Math.max(800, ...history.map((h) => Math.max(h.larvae, h.females, h.wildMales))) * 1.05]}
        xLabel={t.x}
        yLabel={t.y}
        summary={t.summary(rule, release, last)}
      />
    </div>
  );
}

const v2 = (v: number) => Math.round(v / ABM_SCALE);
