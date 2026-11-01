"use client";

import { animate, onScroll, stagger } from "animejs";
import { useRef } from "react";
import { useAnimeScope } from "@/hooks/useAnimeScope";

/** Unread words sit at this opacity until the scroll reaches them. */
const UNREAD = 0.16;

/** Words light up one after another, tied to the scroll position, then stay lit once read. */
function scrub(el: HTMLElement) {
  animate(el.querySelectorAll(".scrub-word"), {
    opacity: [UNREAD, 1],
    duration: 200,
    delay: stagger(45),
    ease: "linear",
    autoplay: onScroll({ target: el, enter: "88% top", leave: "40% bottom", sync: 0.5 }),
  });
}

/** A statement read word by word as it crosses the viewport. Plain text without JS or with reduced motion. */
export function ScrubText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  useAnimeScope(ref, scrub);
  return (
    <p ref={ref} className={className}>
      {text.split(" ").map((w, i) => (
        <span key={`${w}-${i}`} className="scrub-word">
          {w}
          {" "}
        </span>
      ))}
    </p>
  );
}
