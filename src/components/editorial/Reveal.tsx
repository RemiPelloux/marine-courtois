"use client";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { motion } from "motion/react";
import type { ReactNode } from "react";

/** Subtle section reveal. Content is visible without JS and with reduced motion. */
export function Reveal({
  children,
  delay = 0,
  className,
  y = 18,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
  as?: "div" | "section" | "li" | "article";
}) {
  const reduce = usePrefersReducedMotion();
  const Comp = motion[as];
  // one structure on server and client: reduced motion only shortens the transition (no hydration mismatch)
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={reduce ? { duration: 0 } : { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Comp>
  );
}
