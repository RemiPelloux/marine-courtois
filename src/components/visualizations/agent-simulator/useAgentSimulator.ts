"use client";

import { useCallback, useEffect, useRef, useState, type Dispatch, type RefObject, type SetStateAction } from "react";
import { RematingABM, ABM_DEFAULTS, type ABMSnapshot, type SpermRule } from "@/lib/scientific/abm";
import { useInView } from "@/hooks/useInView";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export const DAYS = 100;

type ModelRef = RefObject<RematingABM | null>;
type SetHistory = Dispatch<SetStateAction<ABMSnapshot[]>>;
type Settings = { rule: SpermRule; release: number; seed: number };

/** Reduced motion: computes the whole run at once, without animation. */
function scheduleFullRun(model: ModelRef, setHistory: SetHistory) {
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

/** Advances the model one day per tick; `onEnd` fires on each tick once DAYS is reached. */
function startTicker({ model, setHistory, onEnd, intervalMs }: { model: ModelRef; setHistory: SetHistory; onEnd: () => void; intervalMs: number }) {
  const id = window.setInterval(() => {
    const m = model.current;
    if (!m) return;
    if (m.t >= DAYS) {
      onEnd();
      return;
    }
    m.step();
    setHistory((h) => [...h, m.snapshot()]);
  }, intervalMs);
  return () => window.clearInterval(id);
}

/** Runs the ABM while the container is in view; compact mode loops, full mode stops at DAYS. */
function useAgentSimulation({ ref, settings, compact }: { ref: RefObject<Element | null>; settings: Settings; compact: boolean }) {
  const { rule, release, seed } = settings;
  const inView = useInView(ref);
  const reduce = usePrefersReducedMotion();
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
    if (reduce) return scheduleFullRun(model, setHistory);
    const onEnd = compact ? init : () => setPlaying(false);
    return startTicker({ model, setHistory, onEnd, intervalMs: compact ? 110 : 70 });
  }, [inView, playing, reduce, compact, init]);

  return { history, playing, setPlaying, init };
}

/** Simulation state plus the user settings; every settings change resumes playback. */
export function useAgentSimulator({ ref, compact }: { ref: RefObject<Element | null>; compact: boolean }) {
  const [rule, setRule] = useState<SpermRule>("last");
  const [release, setRelease] = useState(ABM_DEFAULTS.releasePerDay);
  const [seed, setSeed] = useState(1);
  const sim = useAgentSimulation({ ref, settings: { rule, release, seed }, compact });
  const restart = (change: () => void) => {
    change();
    sim.setPlaying(true);
  };
  return {
    ...sim,
    rule,
    release,
    seed,
    chooseRule: (v: SpermRule) => restart(() => setRule(v)),
    chooseRelease: (v: number) => restart(() => setRelease(v)),
    toggle: () => sim.setPlaying((p) => !p),
    reset: () => restart(sim.init),
    reshuffle: () => restart(() => setSeed((s) => s + 1)),
  };
}

export type AgentSimulatorState = ReturnType<typeof useAgentSimulator>;
