"use client";

import { onScroll, utils } from "animejs";
import { useRef, type ReactNode } from "react";
import { useAnimeScope } from "@/hooks/useAnimeScope";

/** Share of the viewport over which a band opens (on entry) or closes (on exit). */
const OPEN_SPAN = 0.9;
/** Side inset of a band when fully closed, in vw. */
const MAX_INSET_VW = 7;
/** Corner radius of a band when fully closed, in px. */
const MAX_RADIUS = 36;

const isBand = (s: HTMLElement) => s.classList.contains("on-dark") || s.classList.contains("bg-stone");

/** 0 while the band's edge is outside the viewport, 1 once it is OPEN_SPAN inside. */
function openness(s: HTMLElement): number {
  const r = s.getBoundingClientRect();
  const span = window.innerHeight * OPEN_SPAN;
  const entering = (window.innerHeight - r.top) / span;
  const leaving = r.bottom / span;
  return utils.clamp(Math.min(entering, leaving), 0, 1);
}

/** Coloured bands widen from an inset frame to full bleed with the scroll, then narrow on the way out. */
function flowBand(s: HTMLElement) {
  const apply = () => {
    const t = openness(s);
    const closed = 1 - t * t * (3 - 2 * t);
    s.style.clipPath = `inset(0 ${closed * MAX_INSET_VW}vw round ${closed * MAX_RADIUS}px)`;
  };
  apply();
  onScroll({ target: s, enter: "bottom top", leave: "top bottom", onUpdate: apply, onEnter: apply, onLeave: apply });
}

/** The hero recedes as the reader scrolls into the first chapter. */
function flowHero(s: HTMLElement) {
  const inner = s.firstElementChild as HTMLElement | null;
  if (!inner) return;
  onScroll({
    target: s,
    enter: "top top",
    leave: "bottom top",
    onUpdate: (self) => {
      inner.style.opacity = String(1 - self.progress * 0.6);
      inner.style.transform = `translateY(${self.progress * -6}vh)`;
    },
  });
}

function clearFlow(sections: HTMLElement[]) {
  sections.forEach((s) => {
    s.style.removeProperty("clip-path");
    (s.firstElementChild as HTMLElement | null)?.style.removeProperty("opacity");
    (s.firstElementChild as HTMLElement | null)?.style.removeProperty("transform");
  });
}

function sectionFlow(root: HTMLElement) {
  const sections = [...root.querySelectorAll<HTMLElement>(":scope > section")];
  if (sections[0]) flowHero(sections[0]);
  sections.filter(isBand).forEach(flowBand);
  return () => clearFlow(sections);
}

/** Scroll-linked continuity between home chapters: no hard cut from paper to a coloured band. */
export function SectionFlow({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useAnimeScope(root, sectionFlow);
  return <div ref={root}>{children}</div>;
}
