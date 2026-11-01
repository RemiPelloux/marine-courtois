"use client";

import { useRef, type RefObject } from "react";
import { ABM_SCALE, type ABMSnapshot } from "@/lib/scientific/abm";
import { LineChart, Legend, type ChartSeries } from "@/components/visualizations/LineChart";
import { PlayPauseReset, SegmentedControl, Slider, IconButton } from "@/components/interactions/Controls";
import { DAYS, useAgentSimulator, type AgentSimulatorState } from "@/components/visualizations/agent-simulator/useAgentSimulator";
import { nf } from "@/lib/utils/format";
import { Shuffle } from "lucide-react";
import { cn } from "@/lib/utils/cn";

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
  const ref = useRef<HTMLDivElement>(null);
  const sim = useAgentSimulator({ ref, compact });
  const last = sim.history.at(-1);

  if (compact) return <CompactView ref={ref} snapshot={last} dark={dark} />;

  return (
    <div ref={ref} className="grid gap-10 lg:grid-cols-12">
      <div className="space-y-6 lg:col-span-4">
        <SimulatorControls sim={sim} />
        <div>
          <p className="label mb-3 text-muted">Échelle individuelle — femelles et contenu de leur spermathèque</p>
          <FemaleSwarm snapshot={last} compact={false} dark={dark} />
        </div>
      </div>
      <PopulationPanel sim={sim} />
    </div>
  );
}

function CompactView({ ref, snapshot: last, dark }: { ref: RefObject<HTMLDivElement | null>; snapshot: ABMSnapshot | undefined; dark: boolean }) {
  return (
    <div ref={ref}>
      <p className={cn("mono-meta mb-2", dark ? "text-mist" : "text-muted")}>
        jour {String(last?.t ?? 0).padStart(3, "0")} · {nf.format(last?.females ?? 0)} femelles · 1 point = 1 femelle
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
        Jour {last?.t ?? 0} : {females ? `${females.fertile} femelles avec uniquement du sperme fertile, ${females.mixed} avec les deux, ${females.sterile} avec uniquement du sperme stérile, ${females.unmated} non accouplées` : ""}.
      </p>
      <SwarmLegend dark={dark} />
    </div>
  );
}

function SwarmLegend({ dark }: { dark: boolean }) {
  return (
    <ul className={cn("mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs", dark ? "text-paper/80" : "text-ink/75")}>
      <li className="flex items-center gap-1.5">
        <span className={cn("size-2 rounded-full", dark ? "bg-paper" : "bg-ink")} /> fertile
      </li>
      <li className="flex items-center gap-1.5">
        <span className="size-2 rounded-full bg-[#7d8fa3]" /> fertile + stérile
      </li>
      <li className="flex items-center gap-1.5">
        <span className="size-2 rounded-full bg-accent" /> stérile
      </li>
      <li className="flex items-center gap-1.5">
        <span className="size-2 rounded-full border border-muted-soft" /> non accouplée
      </li>
    </ul>
  );
}

function SimulatorControls({ sim }: { sim: AgentSimulatorState }) {
  return (
    <div className="space-y-5 rounded-[3px] border border-rule p-4">
      <div className="grid gap-2">
        <p className="text-sm">Règle d&apos;utilisation du sperme</p>
        <SegmentedControl
          label="Règle d'utilisation du sperme"
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
  return (
    <Slider
      label="Mâles stériles lâchés / jour"
      symbol="×50"
      value={sim.release}
      min={0}
      max={400}
      step={20}
      onChange={sim.chooseRelease}
      format={(v) => nf.format(v)}
      hint={`Équivaut à ${nf.format(v2(sim.release))} individus par jour à l'échelle du modèle original.`}
    />
  );
}

function RunButtons({ sim }: { sim: AgentSimulatorState }) {
  return (
    <div className="flex flex-wrap gap-2">
      <PlayPauseReset playing={sim.playing && (sim.history.at(-1)?.t ?? 0) < DAYS} onToggle={sim.toggle} onReset={sim.reset} resetLabel="Réinitialiser" />
      <IconButton onClick={sim.reshuffle}>
        <Shuffle className="size-4" aria-hidden /> Autre réplique
      </IconButton>
    </div>
  );
}

function populationSeries(history: ABMSnapshot[]): ChartSeries[] {
  const series = (key: "larvae" | "females" | "wildMales") => history.map((h) => [h.t, h[key]] as [number, number]);
  return [
    { id: "l", label: "Larves", points: series("larvae"), color: "#2468b3", width: 2.4 },
    { id: "f", label: "Femelles", points: series("females"), color: "#0f1d2e", width: 1.8 },
    { id: "w", label: "Mâles sauvages", points: series("wildMales"), color: "#6b7785", dash: "5 4", width: 1.6 },
  ];
}

const POPULATION_LEGEND = [
  { label: "Larves", color: "#2468b3" },
  { label: "Femelles", color: "#0f1d2e" },
  { label: "Mâles sauvages", color: "#6b7785", dash: "5 4" },
];

function PopulationPanel({ sim: { history, rule, release, seed } }: { sim: AgentSimulatorState }) {
  const last = history.at(-1);
  return (
    <div className="lg:col-span-8">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-3">
        <p className="label text-muted">Échelle de la population</p>
        <p className="mono-meta text-muted">
          jour {last?.t ?? 0} / {DAYS} · réplique n° {seed}
        </p>
      </div>
      <div className="mb-3">
        <Legend items={POPULATION_LEGEND} />
      </div>
      <LineChart
        series={populationSeries(history)}
        xDomain={[0, DAYS]}
        yDomain={[0, Math.max(800, ...history.map((h) => Math.max(h.larvae, h.females, h.wildMales))) * 1.05]}
        xLabel="temps (jours)"
        yLabel="individus (échelle 1/50)"
        summary={`Simulation individu-centrée, règle ${rule}, ${release} mâles stériles par jour. Jour ${last?.t ?? 0} : ${last?.larvae ?? 0} larves, ${last?.females ?? 0} femelles, ${last?.wildMales ?? 0} mâles sauvages, ${last?.sterileMales ?? 0} mâles stériles.`}
      />
    </div>
  );
}

const v2 = (v: number) => Math.round(v / ABM_SCALE);
