"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { useInView } from "@/hooks/useInView";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { CYCLE_MS, SIGMA_MAX, T_END, makeDots, series, x, type Mode, type Series, type TooltipKind } from "./model";
import { paintDots, prepareCanvas } from "./canvas";

function useModelSeries(share: number) {
  const sigma = (share / 100) * SIGMA_MAX;
  const main = useMemo(() => series(sigma), [sigma]);
  const withRF = useMemo(() => series(sigma, { delta: 0.01 }), [sigma]);
  const fan = useMemo(
    () => [0.1, 0.2, 0.3, 0.5, 0.7, 1].map((s) => series(s * SIGMA_MAX).wild),
    [],
  );
  return { sigma, main, withRF, fan };
}

interface DotCanvasOptions {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  cursorRef: RefObject<SVGGElement | null>;
  progressRef: RefObject<number>;
  main: Series;
}

function useDotCanvas({ canvasRef, cursorRef, progressRef, main }: DotCanvasOptions) {
  // dots live only on the canvas, so reading the viewport here cannot cause a hydration mismatch
  const [dotCount] = useState(() => (typeof window !== "undefined" && window.matchMedia("(max-width: 640px)").matches ? 1800 : 3600));
  const dots = useMemo(() => makeDots(dotCount), [dotCount]);

  // keep latest data in refs for the RAF loop (avoids re-subscribing every frame)
  const dataRef = useRef({ main });
  useEffect(() => {
    dataRef.current = { main };
  }, [main]);

  return useCallback(() => {
    const ctx = prepareCanvas(canvasRef.current);
    if (!ctx) return;
    const tMax = progressRef.current * T_END;
    paintDots(ctx, { dots, data: dataRef.current.main, tMax });
    cursorRef.current?.setAttribute("transform", `translate(${x(tMax)},0)`);
  }, [dots, canvasRef, cursorRef, progressRef]);
}

interface LoopOptions {
  progressRef: RefObject<number>;
  draw: () => void;
  onDone: () => void;
}

/** Advances progress from its current value to 1 over CYCLE_MS; returns the cancel function. */
function startLoop({ progressRef, draw, onDone }: LoopOptions) {
  let raf = 0;
  let last = performance.now();
  const tick = (now: number) => {
    const dt = now - last;
    last = now;
    progressRef.current = Math.min(1, progressRef.current + dt / CYCLE_MS);
    draw();
    if (progressRef.current < 1) raf = requestAnimationFrame(tick);
    else onDone();
  };
  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}

interface AnimationOptions {
  inView: boolean;
  playing: boolean;
  reduce: boolean;
  draw: () => void;
  progressRef: RefObject<number>;
  setSettled: (settled: boolean) => void;
}

// animation loop — only while visible and playing
function useAnimationLoop({ inView, playing, reduce, draw, progressRef, setSettled }: AnimationOptions) {
  useEffect(() => {
    if (reduce) {
      progressRef.current = 1;
      draw();
      return;
    }
    if (!inView || !playing) {
      draw();
      return;
    }
    return startLoop({ progressRef, draw, onDone: () => setSettled(true) });
  }, [inView, playing, reduce, draw, progressRef, setSettled]);
}

type PlaybackOptions = Omit<AnimationOptions, "playing" | "setSettled">;

function usePlayback(options: PlaybackOptions) {
  const { reduce, draw, progressRef } = options;
  const [playing, setPlaying] = useState(true);
  const [settledState, setSettled] = useState(false);
  const settled = settledState || reduce;
  useAnimationLoop({ ...options, playing, setSettled });

  const replay = () => {
    progressRef.current = reduce ? 1 : 0;
    setSettled(reduce);
    setPlaying(true);
    draw();
  };
  const toggle = () => (settled ? replay() : setPlaying((p) => !p));
  return { playing: playing && !settled, settled, replay, toggle };
}

interface RedrawOptions {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  draw: () => void;
  main: Series;
  mode: Mode;
}

// redraw on parameter change and resize
function useRedraw({ canvasRef, draw, main, mode }: RedrawOptions) {
  useEffect(() => {
    draw();
  }, [main, mode, draw]);
  useEffect(() => {
    const ro = new ResizeObserver(() => draw());
    if (canvasRef.current) ro.observe(canvasRef.current);
    return () => ro.disconnect();
  }, [draw, canvasRef]);
}

export function useLivingSystem() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<SVGGElement>(null);
  const progressRef = useRef(0); // 0..1 time cursor
  const inView = useInView(wrapRef);
  const reduce = usePrefersReducedMotion();

  const [share, setShare] = useState(40); // % of σ_max
  const [mode, setMode] = useState<Mode>("observer");
  const [tooltip, setTooltip] = useState<TooltipKind | null>(null);
  const model = useModelSeries(share);

  const draw = useDotCanvas({ canvasRef, cursorRef, progressRef, main: model.main });
  const playback = usePlayback({ inView, reduce, draw, progressRef });
  useRedraw({ canvasRef, draw, main: model.main, mode });

  return { wrapRef, canvasRef, cursorRef, reduce, share, setShare, mode, setMode, tooltip, setTooltip, model, playback };
}

export type LivingSystemState = ReturnType<typeof useLivingSystem>;
