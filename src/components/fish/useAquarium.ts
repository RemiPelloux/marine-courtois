"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { makeTank, step, captureRates, setPrey, rng, type Group, type Tank } from "@/lib/fish/sim";
import { drawTank } from "@/components/fish/draw";
import { makeWater, type Water } from "@/components/fish/scene";

const ZERO: Record<Group, number> = { NIS: 0, ISNR: 0, ISIR: 0 };

/** A tank that has already swum for two seconds: schools have formed, even on a still frame. */
function warmTank(w: number, h: number, rand: () => number) {
  const tank = makeTank(w, h, 30, 5, rand);
  for (let i = 0; i < 60; i++) step(tank, 1 / 30, rand);
  for (const f of tank.fish) f.eaten = [];
  tank.captures = [];
  tank.t = 0;
  return tank;
}

/** The pointer position in tank coordinates, for the fish to keep their distance from. */
function trackPointer(canvas: HTMLCanvasElement, tankRef: { current: Tank | null }) {
  const move = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    if (tankRef.current) tankRef.current.pointer = { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  const leave = () => {
    if (tankRef.current) tankRef.current.pointer = null;
  };
  canvas.addEventListener("pointermove", move);
  canvas.addEventListener("pointerleave", leave);
  return () => {
    canvas.removeEventListener("pointermove", move);
    canvas.removeEventListener("pointerleave", leave);
  };
}

/**
 * Runs the aquarium on a canvas: one requestAnimationFrame loop, paused when
 * the tank leaves the screen or when the visitor pauses it. Reduced motion
 * starts paused on a still frame.
 */
export function useAquarium(preyCount: number) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tankRef = useRef<Tank | null>(null);
  const randRef = useRef(rng(11));
  const waterRef = useRef<Water | null>(null);
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
      else tankRef.current = warmTank(width, height, randRef.current);
      waterRef.current ??= makeWater();
      const ctx = canvas.getContext("2d");
      if (ctx) drawTank(ctx, tankRef.current!, dpr, waterRef.current);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(canvas);
    const stopPointer = trackPointer(canvas, tankRef);
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.1 });
    io.observe(canvas);
    return () => {
      ro.disconnect();
      io.disconnect();
      stopPointer();
    };
  }, []);

  useEffect(() => {
    if (tankRef.current) setPrey(tankRef.current, preyCount, randRef.current);
  }, [preyCount]);

  useEffect(() => {
    if (!running) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let raf = 0;
    let last = performance.now();
    let lastReport = 0;
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const tank = tankRef.current!;
      step(tank, dt, randRef.current);
      drawTank(ctx, tank, dpr, waterRef.current!);
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
