"use client";

import { useEffect, useLayoutEffect, useRef, useState, type Dispatch, type RefObject, type SetStateAction } from "react";
import { RESEARCHER } from "@/data/researcher";
import { decodeEmail } from "@/lib/utils/email";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { aimParticles, glyphTargets, seedParticles, type FieldSpec, type Particle, type Phase } from "./field";
import { fitCanvas, paintField, sweepReveal } from "./paint";

interface Stage {
  rootRef: RefObject<HTMLDivElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  textRef: RefObject<HTMLSpanElement | null>;
  linkRef: RefObject<HTMLAnchorElement | null>;
  copyRef: RefObject<HTMLButtonElement | null>;
  particlesRef: RefObject<Particle[]>;
  phaseRef: RefObject<Phase>;
  t0Ref: RefObject<number>;
}

type Motion = FieldSpec & { reduce: boolean };

/**
 * The address hides in a drifting particle field; `reveal` decodes it, lays the
 * real link out invisibly, flies the particles onto its glyphs and lets the text
 * crystallise underneath. Reduced motion shows the address at once.
 */
export function useEmailReveal(spec: FieldSpec) {
  const stage = useStage();
  const reduce = usePrefersReducedMotion();
  const [email, setEmail] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const motion = { ...spec, reduce };
  useFieldLoop({ stage, motion, done, setDone });
  useAimAtLink({ stage, motion, email });
  useSettle(stage, done);
  const { copied, copy } = useCopy(email);
  const { phaseRef } = stage;

  const reveal = () => {
    setEmail(decodeEmail(RESEARCHER.emailCodes));
    // reduced motion: the address appears at once, without the particle flight
    if (reduce) {
      phaseRef.current = "done";
      setDone(true);
    }
  };

  return { ...stage, email, done, copied, reveal, copy };
}

function useStage(): Stage {
  return {
    rootRef: useRef<HTMLDivElement>(null),
    canvasRef: useRef<HTMLCanvasElement>(null),
    textRef: useRef<HTMLSpanElement>(null),
    linkRef: useRef<HTMLAnchorElement>(null),
    copyRef: useRef<HTMLButtonElement>(null),
    particlesRef: useRef<Particle[]>([]),
    phaseRef: useRef<Phase>("drift"),
    t0Ref: useRef(0),
  };
}

interface LoopOptions {
  stage: Stage;
  motion: Motion;
  done: boolean;
  setDone: Dispatch<SetStateAction<boolean>>;
}

/** Render loop: drift until revealed, then assemble + crystallise. */
function useFieldLoop({ stage, motion, done, setDone }: LoopOptions) {
  const { rootRef, canvasRef, textRef, copyRef, particlesRef, phaseRef, t0Ref } = stage;
  const { tone, large, reduce } = motion;
  useEffect(() => {
    const canvas = canvasRef.current;
    const root = rootRef.current;
    if (!canvas || !root || done) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (phaseRef.current === "drift") particlesRef.current = seedParticles({ tone, large, box: root.getBoundingClientRect() });
    const refs = { textRef, copyRef, particlesRef, phaseRef, t0Ref };
    return runLoop({ ctx, root, refs, reduce, large, setDone });
  }, [done, reduce, large, tone, setDone, rootRef, canvasRef, textRef, copyRef, particlesRef, phaseRef, t0Ref]);
}

interface LoopRun {
  ctx: CanvasRenderingContext2D;
  root: HTMLDivElement;
  refs: Pick<Stage, "textRef" | "copyRef" | "particlesRef" | "phaseRef" | "t0Ref">;
  reduce: boolean;
  large: boolean;
  setDone: Dispatch<SetStateAction<boolean>>;
}

/** Starts the frame loop (paused while off-screen and drifting); returns its cleanup. */
function runLoop({ ctx, root, refs, reduce, large, setDone }: LoopRun) {
  let raf = 0;
  let visible = true;
  const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
  io.observe(root);
  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    if (!visible && refs.phaseRef.current === "drift") return;
    const rect = root.getBoundingClientRect();
    fitCanvas(ctx, rect);
    const elapsed = now - refs.t0Ref.current;
    const assembling = refs.phaseRef.current === "assemble";
    paintField(ctx, { particles: refs.particlesRef.current, rect, elapsed, assembling, reduce, large });
    if (!assembling || !sweepReveal({ text: refs.textRef.current, copy: refs.copyRef.current, elapsed })) return;
    cancelAnimationFrame(raf);
    ctx.clearRect(0, 0, rect.width, rect.height);
    refs.phaseRef.current = "done";
    setDone(true);
  };
  raf = requestAnimationFrame(frame);
  return () => {
    cancelAnimationFrame(raf);
    io.disconnect();
  };
}

/** Once the real link is laid out (invisible), aim the particles at its glyphs. */
function useAimAtLink({ stage, motion, email }: { stage: Stage; motion: Motion; email: string | null }) {
  const { rootRef, textRef, particlesRef, phaseRef, t0Ref } = stage;
  const { tone, large, reduce } = motion;
  useLayoutEffect(() => {
    if (!email || phaseRef.current !== "drift" || reduce) return;
    const root = rootRef.current;
    const text = textRef.current;
    if (!root || !text) return;
    const rr = root.getBoundingClientRect();
    const tr = text.getBoundingClientRect();
    const targets = glyphTargets({ rr, tr, text, email, large });
    particlesRef.current = aimParticles({ field: particlesRef.current, targets, rr, tr, tone, large });
    text.style.opacity = "1";
    text.style.clipPath = "inset(-20% 100% -20% 0)";
    t0Ref.current = performance.now();
    phaseRef.current = "assemble";
  }, [email, reduce, large, tone, rootRef, textRef, particlesRef, phaseRef, t0Ref]);
}

/** Hands the finished link back to CSS and moves focus onto it. */
function useSettle(stage: Stage, done: boolean) {
  const { textRef, copyRef, linkRef } = stage;
  useEffect(() => {
    if (!done) return;
    if (textRef.current) {
      textRef.current.style.clipPath = "";
      textRef.current.style.opacity = "";
    }
    if (copyRef.current) copyRef.current.style.opacity = "";
    linkRef.current?.focus({ preventScroll: true });
  }, [done, textRef, copyRef, linkRef]);
}

function useCopy(email: string | null) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    if (!email) return;
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable: the address stays selectable */
    }
  };
  return { copied, copy };
}
