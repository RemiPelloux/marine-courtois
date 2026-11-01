"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { RematingABM, ABM_DEFAULTS, ABM_SCALE, type ABMSnapshot, type SpermRule } from "@/lib/scientific/abm";
import { useInView } from "@/hooks/useInView";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { LineChart, Legend } from "@/components/visualizations/LineChart";
import { PlayPauseReset, SegmentedControl, Slider, IconButton } from "@/components/interactions/Controls";
import { nf } from "@/lib/utils/format";
import { Shuffle } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const DAYS = 100;
const STATE_COLORS = {
  fertile: "#171b18",
  mixed: "#8a8f88",
  sterile: "#f04a2d",
  unmated: "transparent",
};

/**
 * Individual-level demonstrator. `compact` renders only the population of
 * females (used in the methods panel); the full version adds controls and
 * the population-level time series.
 */
export function AgentSimulator({ compact = false, dark = false }: { compact?: boolean; dark?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const reduce = usePrefersReducedMotion();
  const [rule, setRule] = useState<SpermRule>("last");
  const [release, setRelease] = useState(ABM_DEFAULTS.releasePerDay);
  const [seed, setSeed] = useState(1);
  const [playing, setPlaying] = useState<boolean>(true);
  const [history, setHistory] = useState<ABMSnapshot[]>([]);
  const model = useRef<RematingABM | null>(null);

  const init = useCallback(() => {
    model.current = new RematingABM({ ...ABM_DEFAULTS, rule, releasePerDay: release, seed });
    setHistory([model.current.snapshot()]);
  }, [rule, release, seed]);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (!inView || !playing || !model.current) return;
    if (reduce) {
      // reduced motion: compute the whole run at once, without animation
      const t = window.setTimeout(() => {
        const m = model.current;
        if (!m) return;
        const out: ABMSnapshot[] = [];
        while (m.t < DAYS) {
          m.step();
          out.push(m.snapshot());
        }
        setHistory((h) => [...h, ...out]);
      }, 0);
      return () => window.clearTimeout(t);
    }
    const id = window.setInterval(() => {
      const m = model.current;
      if (!m) return;
      if (m.t >= DAYS) {
        if (compact) {
          init();
        } else {
          setPlaying(false);
        }
        return;
      }
      m.step();
      setHistory((h) => [...h, m.snapshot()]);
    }, compact ? 110 : 70);
    return () => window.clearInterval(id);
  }, [inView, playing, reduce, compact, init]);

  const last = history.at(-1);
  const females = last?.femaleStates;

  const dots = females
    ? ([
        ...Array(females.fertile).fill("fertile"),
        ...Array(females.mixed).fill("mixed"),
        ...Array(females.sterile).fill("sterile"),
        ...Array(females.unmated).fill("unmated"),
      ] as (keyof typeof STATE_COLORS)[])
    : [];
  const shown = dots.slice(0, compact ? 240 : 600);

  const swarm = (
    <div>
      <div className={cn("flex flex-wrap content-start", compact ? "h-40 gap-[4px]" : "h-56 gap-[3px] md:h-64")} aria-hidden>
        {shown.map((s, i) => (
          <span
            key={i}
            className={cn("rounded-full border", compact ? "size-[9px]" : "size-[7px]")}
            style={{
              background: s === "fertile" && dark ? "#f5f2eb" : STATE_COLORS[s],
              borderColor: s === "unmated" ? (dark ? "#a9b0a8" : "#747973") : s === "fertile" && dark ? "#f5f2eb" : STATE_COLORS[s],
            }}
          />
        ))}
      </div>
      <p className="sr-only" role="status">
        Jour {last?.t ?? 0} : {females ? `${females.fertile} femelles avec uniquement du sperme fertile, ${females.mixed} avec les deux, ${females.sterile} avec uniquement du sperme stérile, ${females.unmated} non accouplées` : ""}.
      </p>
      <ul className={cn("mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[0.72rem]", dark ? "text-paper/80" : "text-ink/75")}>
        <li className="flex items-center gap-1.5">
          <span className={cn("size-2 rounded-full", dark ? "bg-paper" : "bg-ink")} /> fertile
        </li>
        <li className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-[#8a8f88]" /> fertile + stérile
        </li>
        <li className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-vermilion" /> stérile
        </li>
        <li className="flex items-center gap-1.5">
          <span className="size-2 rounded-full border border-muted-soft" /> non accouplée
        </li>
      </ul>
    </div>
  );

  if (compact) {
    return (
      <div ref={ref}>
        <p className={cn("mono-meta mb-2", dark ? "text-mist" : "text-muted")}>
          jour {String(last?.t ?? 0).padStart(3, "0")} · {nf.format(last?.females ?? 0)} femelles · 1 point = 1 femelle
        </p>
        {swarm}
      </div>
    );
  }

  const series = (key: "larvae" | "females" | "wildMales") => history.map((h) => [h.t, h[key]] as [number, number]);

  return (
    <div ref={ref} className="grid gap-10 lg:grid-cols-12">
      <div className="space-y-6 lg:col-span-4">
        <div className="space-y-5 rounded-[3px] border border-rule p-4">
          <div className="grid gap-2">
            <p className="text-sm">Règle d&apos;utilisation du sperme</p>
            <SegmentedControl
              label="Règle d'utilisation du sperme"
              value={rule}
              onChange={(v) => {
                setRule(v);
                setPlaying(true);
              }}
              options={[
                { value: "first", label: "First" },
                { value: "last", label: "Last" },
                { value: "mixed", label: "Mixed" },
              ]}
            />
          </div>
          <Slider
            label="Mâles stériles lâchés / jour"
            symbol="×50"
            value={release}
            min={0}
            max={400}
            step={20}
            onChange={(v) => {
              setRelease(v);
              setPlaying(true);
            }}
            format={(v) => nf.format(v)}
            hint={`Équivaut à ${nf.format(v2(release))} individus par jour à l'échelle du modèle original.`}
          />
          <div className="flex flex-wrap gap-2">
            <PlayPauseReset
              playing={playing && (last?.t ?? 0) < DAYS}
              onToggle={() => setPlaying((p) => !p)}
              onReset={() => {
                init();
                setPlaying(true);
              }}
              resetLabel="Réinitialiser"
            />
            <IconButton
              onClick={() => {
                setSeed((s) => s + 1);
                setPlaying(true);
              }}
            >
              <Shuffle className="size-4" aria-hidden /> Autre réplique
            </IconButton>
          </div>
        </div>
        <div>
          <p className="label mb-3 text-muted">Échelle individuelle — femelles et contenu de leur spermathèque</p>
          {swarm}
        </div>
      </div>
      <div className="lg:col-span-8">
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-3">
          <p className="label text-muted">Échelle de la population</p>
          <p className="mono-meta text-muted">
            jour {last?.t ?? 0} / {DAYS} · réplique n° {seed}
          </p>
        </div>
        <div className="mb-3">
          <Legend
            items={[
              { label: "Larves", color: "#f04a2d" },
              { label: "Femelles", color: "#171b18" },
              { label: "Mâles sauvages", color: "#747973", dash: "5 4" },
            ]}
          />
        </div>
        <LineChart
          series={[
            { id: "l", label: "Larves", points: series("larvae"), color: "#f04a2d", width: 2.4 },
            { id: "f", label: "Femelles", points: series("females"), color: "#171b18", width: 1.8 },
            { id: "w", label: "Mâles sauvages", points: series("wildMales"), color: "#747973", dash: "5 4", width: 1.6 },
          ]}
          xDomain={[0, DAYS]}
          yDomain={[0, Math.max(800, ...history.map((h) => Math.max(h.larvae, h.females, h.wildMales))) * 1.05]}
          xLabel="temps (jours)"
          yLabel="individus (échelle 1/50)"
          summary={`Simulation individu-centrée, règle ${rule}, ${release} mâles stériles par jour. Jour ${last?.t ?? 0} : ${last?.larvae ?? 0} larves, ${last?.females ?? 0} femelles, ${last?.wildMales ?? 0} mâles sauvages, ${last?.sterileMales ?? 0} mâles stériles.`}
        />
      </div>
    </div>
  );
}

const v2 = (v: number) => Math.round(v / ABM_SCALE);
