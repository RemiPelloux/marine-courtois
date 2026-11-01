"use client";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { motion } from "motion/react";
import { copy } from "@/i18n/config";
import { useA11y, useLang } from "@/i18n/client";

const LINES = copy({
  fr: ["Modéliser le vivant,", "simuler, analyser :", "tout s'assemble"],
  en: ["Modelling life,", "simulating, analysing:", "it all fits together"],
});

/** Staggered line-by-line reveal of the hero title; the last line is the accent. Static when reduced motion is requested. */
export function HeroTitle() {
  const reduce = usePrefersReducedMotion();
  const a11y = useA11y();
  const lines = LINES[useLang()];
  return (
    <h1 id="hero-title" className="mt-5 font-serif text-display" aria-label={a11y.heroTitle}>
      {lines.map((text, i) => {
        const last = i === lines.length - 1;
        return (
          <span key={text} className="block overflow-hidden pb-[0.06em]" aria-hidden>
            <motion.span
              className={last ? "block text-accent italic" : "block"}
              initial={reduce ? false : { y: "105%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1.05, delay: 0.12 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
            >
              {text}
              {last && <span className="not-italic text-ink">.</span>}
            </motion.span>
          </span>
        );
      })}
    </h1>
  );
}
