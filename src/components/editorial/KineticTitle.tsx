"use client";

import { animate, onScroll, splitText, stagger, utils, type TextSplitter } from "animejs";
import { useRef, type ReactNode } from "react";
import { useAnimeScope } from "@/hooks/useAnimeScope";
import { cn } from "@/lib/utils/cn";

const LINE_STAGGER = 110;

/** Lifts each line of an already split heading out of its clip mask. */
function lineEffect(el: HTMLElement, onEnter: boolean) {
  return (s: TextSplitter) => {
    utils.set(s.lines, { y: "105%" });
    // the visual copy must not repeat ids that aria-labelledby points to
    el.querySelectorAll("[aria-hidden] [id]").forEach((n) => n.removeAttribute("id"));
    el.dataset.ready = "true";
    return animate(s.lines, {
      y: "0%",
      duration: 1050,
      delay: stagger(LINE_STAGGER),
      ease: "out(4)",
      autoplay: onEnter ? onScroll({ target: el, enter: "90% top", repeat: false }) : true,
    });
  };
}

/**
 * Splits the heading into its rendered lines once fonts are ready (line breaks depend on them).
 * The cancelled flag stops a split that would land after unmount, or twice under StrictMode.
 * Lines are re-split on resize; anime's keepTime holds the reveal where it was.
 */
function riseLines(el: HTMLElement, onEnter: boolean) {
  let cancelled = false;
  let split: TextSplitter | undefined;
  document.fonts.ready.then(() => {
    if (cancelled) return;
    split = splitText(el, { lines: { wrap: "clip" }, accessible: true }).addEffect(lineEffect(el, onEnter));
  });
  return () => {
    cancelled = true;
    split?.revert();
  };
}

const riseNow = (el: HTMLElement) => riseLines(el, false);
const riseOnEnter = (el: HTMLElement) => riseLines(el, true);

type KineticTitleProps = { as?: "h1" | "h2"; className?: string; children: ReactNode; trigger?: "load" | "scroll" };

/** A heading whose lines rise into place, on load (page titles) or when scrolled to (section titles). */
export function KineticTitle({ as: H = "h2", className, children, trigger = "scroll" }: KineticTitleProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  useAnimeScope(ref, trigger === "load" ? riseNow : riseOnEnter);
  return (
    <H ref={ref} className={cn("kinetic", className)}>
      {children}
    </H>
  );
}
