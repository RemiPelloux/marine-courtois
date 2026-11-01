"use client";

import { useEffect, useRef, useState } from "react";

/** True from the first time the element is `threshold` visible; never resets. */
export function usePlayOnce<T extends HTMLElement = HTMLDivElement>(threshold = 0.35) {
  const ref = useRef<T>(null);
  const [play, setPlay] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setPlay(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, play };
}
