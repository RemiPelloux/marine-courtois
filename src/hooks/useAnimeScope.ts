"use client";

import { createScope } from "animejs";
import { useEffect, type RefObject } from "react";

/**
 * Runs `setup` inside an anime.js scope bound to `root`, skipped entirely under
 * prefers-reduced-motion. Every animation and scroll observer is reverted on unmount.
 * Pass a module-level `setup` so the scope is built once.
 */
export function useAnimeScope<T extends HTMLElement>(root: RefObject<T | null>, setup: (el: T) => void | (() => void)) {
  useEffect(() => {
    const scope = createScope({ root, mediaQueries: { reduce: "(prefers-reduced-motion: reduce)" } }).add((self) => {
      if (!self || self.matches.reduce || !root.current) return;
      return setup(root.current);
    });
    return () => scope.revert();
  }, [root, setup]);
}
