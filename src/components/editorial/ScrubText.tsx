"use client";

import { animate, onScroll, stagger } from "animejs";
import { useRef } from "react";
import { useAnimeScope } from "@/hooks/useAnimeScope";

/** Unread words sit at this opacity until the scroll reaches them. */
const UNREAD = 0.28;

/**
 * Words light up one after another, tied 1:1 to the scroll position.
 * Text already on screen when the page opens is left fully readable: a reader
 * should never have to scroll to read the first screen. The reveal completes
 * while the paragraph is still in the lower half of the viewport.
 */
function scrub(el: HTMLElement) {
  if (el.getBoundingClientRect().top < window.innerHeight * 0.8) return;
  animate(el.querySelectorAll(".scrub-word"), {
    opacity: [UNREAD, 1],
    duration: 200,
    delay: stagger(30),
    ease: "linear",
    autoplay: onScroll({ target: el, enter: "90% top", leave: "65% bottom", sync: true }),
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
