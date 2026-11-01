"use client";

import { a11y } from "@/i18n";
import { motion, useReducedMotion } from "motion/react";

const LINES = [
  { text: "Mathématiques,", italic: false },
  { text: "code et données :", italic: false },
  { text: "tout s'assemble", italic: true },
];

/** Staggered line-by-line reveal of the hero title. Static when reduced motion is requested. */
export function HeroTitle() {
  const reduce = useReducedMotion();
  return (
    <h1 id="hero-title" className="mt-5 font-serif text-display" aria-label={a11y.heroTitle}>
      {LINES.map((l, i) => (
        <span key={l.text} className="block overflow-hidden pb-[0.06em]" aria-hidden>
          <motion.span
            className={l.italic ? "block text-accent italic" : "block"}
            initial={reduce ? false : { y: "105%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1.05, delay: 0.12 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            {l.text}
            {l.italic && <span className="not-italic text-ink">.</span>}
          </motion.span>
        </span>
      ))}
    </h1>
  );
}
