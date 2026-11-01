"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { makeTank, step, captureRates, setPrey, rng, type Group, type Tank } from "@/lib/fish/sim";
import { drawTank } from "@/components/fish/draw";

const ZERO: Record<Group, number> = { NIS: 0, ISNR: 0, ISIR: 0 };

/**
 * Runs the aquarium on a canvas: one requestAnimationFrame loop, paused when
 * the tank leaves the screen or when the visitor pauses it. Reduced motion
 * starts paused on a still frame.
 */
export function useAquarium(preyCount: number) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tankRef = useRef<Tank | null>(null);
  const randRef = useRef(rng(11));
  const reduce = usePrefersReducedMotion();
  const [playing, setPlaying] = useState<boolean | null>(null);
  const [rates, setRates] = useState(ZERO);
  const [visible, setVisible] = useState(false);
  const running = (playing ?? !reduce) && visible;

  // build the tank at the canvas size, keep it sharp on resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const fit = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      const t = tankRef.current;
      if (t) [t.w, t.h] = [width, height];
      else tankRef.current = makeTank(width, height, 30, 5, randRef.current);
      drawTank(canvas.getContext("2d")!, tankRef.current!, dpr);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.1 });
    io.observe(canvas);
    return () => {
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  useEffect(() => {
    if (tankRef.current) setPrey(tankRef.current, preyCount, randRef.current);
  }, [preyCount]);

  useEffect(() => {
    if (!running) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let raf = 0;
    let last = performance.now();
    let lastReport = 0;
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const tank = tankRef.current!;
      step(tank, dt, randRef.current);
      drawTank(ctx, tank, dpr);
      if (now - lastReport > 600) {
        lastReport = now;
        setRates(captureRates(tank));
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [running]);

  return { canvasRef, rates, playing: playing ?? !reduce, toggle: () => setPlaying((p) => !(p ?? !reduce)) };
}
