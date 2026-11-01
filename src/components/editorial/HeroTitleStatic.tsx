"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export function HeroTitleStatic({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.h1
      className="mt-7 font-serif text-headline"
      initial={reduce ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.h1>
  );
}
