"use client";

import Image from "next/image";
import { animate, createAnimatable, utils, type AnimatableObject } from "animejs";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { RailFigure } from "@/data/research-rail";

const QUERY = "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";
const OFFSET = { x: 28, y: -60 };
const MAX_TILT = 6;

/** Publication id of the row under the pointer, from its `aria-labelledby="pub-<id>"`. */
const rowId = (target: EventTarget | null) =>
  (target as HTMLElement | null)?.closest<HTMLElement>("article[aria-labelledby^='pub-']")?.getAttribute("aria-labelledby")?.slice(4);

function show(card: HTMLElement, visible: boolean) {
  animate(card, {
    opacity: visible ? 1 : 0,
    scale: visible ? 1 : 0.92,
    clipPath: visible ? "inset(0% 0% 0% 0%)" : "inset(12% 12% 12% 12%)",
    duration: visible ? 420 : 220,
    ease: "out(3)",
  });
}

/** Moves the card toward the pointer with lag, tilting it with horizontal speed. */
function follow(follower: AnimatableObject, e: PointerEvent, lastX: { v: number }) {
  follower.x(e.clientX + OFFSET.x);
  follower.y(e.clientY + OFFSET.y);
  follower.rotate(utils.clamp((e.clientX - lastX.v) * 0.4, -MAX_TILT, MAX_TILT));
  lastX.v = e.clientX;
}

type Refs = { root: React.RefObject<HTMLDivElement | null>; card: React.RefObject<HTMLDivElement | null> };

/** Tracks which previewable row is under the pointer and drives the card after it. */
function useCursorCard({ root, card }: Refs, previews: Record<string, RailFigure>) {
  const [shown, setShown] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = root.current;
    const c = card.current;
    if (!el || !c || !window.matchMedia(QUERY).matches) return;
    const follower = createAnimatable(c, { x: 500, y: 500, rotate: 700, ease: "out(3)" });
    const lastX = { v: 0 };
    const move = (e: PointerEvent) => {
      const id = rowId(e.target);
      if (id && previews[id]) setShown(id);
      setVisible(Boolean(id && previews[id]));
      follow(follower, e, lastX);
    };
    const leave = () => setVisible(false);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      follower.revert();
    };
  }, [root, card, previews]);
  return { shown, visible };
}

/** A thesis figure that trails the cursor over publication rows. Fine pointers only, never with reduced motion. */
export function HoverPreview({ previews, children }: { previews: Record<string, RailFigure>; children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const { shown, visible } = useCursorCard({ root, card }, previews);

  useEffect(() => {
    if (card.current) show(card.current, visible);
  }, [visible]);

  /** the last figure stays rendered while the card fades out */
  const fig = shown ? previews[shown] : undefined;
  return (
    <div ref={root}>
      {children}
      <div ref={card} aria-hidden className="pointer-events-none fixed top-0 left-0 z-40 w-[22rem] bg-paper p-3 opacity-0 shadow-[0_18px_40px_-12px_rgba(15,29,46,0.35)]">
        {fig && (
          <>
            <Image src={fig.src} alt="" width={fig.width} height={fig.height} sizes="22rem" loading="eager" className="h-auto w-full mix-blend-multiply" />
            <p className="mono-meta mt-2 text-muted">Figure de la thèse — {fig.notebook.split("/").pop()}</p>
          </>
        )}
      </div>
    </div>
  );
}
