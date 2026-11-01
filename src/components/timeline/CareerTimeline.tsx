"use client";

import { type CSSProperties } from "react";
import { usePlayOnce } from "@/hooks/usePlayOnce";
import { MILESTONE_KIND_LABEL, type Milestone, type MilestoneKind } from "@/data/milestones";
import { axisPercent, placeMilestones, yearTicks, SPAN } from "@/lib/timeline/lanes";
import { formatDateFr } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

/** Seconds for the playhead to cross the axis; each milestone appears as it is passed. */
const SWEEP = 3.4;
const LEAD = 0.5;
const LANE_PX = 66;

const DOT: Record<MilestoneKind, string> = {
  communication: "bg-paper",
  poster: "border-2 border-paper bg-antibes",
  article: "bg-accent-light",
  doctorat: "bg-accent-light",
};

/**
 * Motion-design timeline of verified milestones (HAL, DOI, theses.fr).
 * Desktop: an axis draws itself, a playhead sweeps 2022 → 2026 and each
 * milestone rises from the axis as it is reached; the defence keeps a slow pulse.
 * Mobile: the same milestones as a vertical sequence. Every label links to its source.
 * Pure DOM + CSS (see .ctl-* in globals.css), reduced-motion shows the final state.
 */
export function CareerTimeline({ milestones }: { milestones: Milestone[] }) {
  const { ref, play } = usePlayOnce();
  const placed = placeMilestones(milestones);
  const at = (x: number) => LEAD + (x / 100) * SWEEP;

  return (
    <div ref={ref} data-play={play || undefined} className="ctl on-dark relative bg-antibes text-paper">
      <div className="flex flex-wrap items-end justify-between gap-6 px-6 pt-8 md:px-10 md:pt-10">
        <div>
          <p className="label text-accent-light">Jalons vérifiés</p>
          <p className="mt-2 font-serif text-[clamp(2.4rem,5vw,4rem)] leading-none tabular-nums">2022 — 2026</p>
        </div>
        <Legend />
      </div>

      {/* desktop: horizontal sweep */}
      <div className="relative mx-6 hidden h-[34rem] md:mx-10 md:block">
        <span className="ctl-axis absolute inset-x-0 top-1/2 h-px origin-left bg-paper/40" aria-hidden />
        {yearTicks().map((y) => {
          const x = axisPercent(`${y}-01-01`);
          return (
            <span key={y} className="ctl-tick absolute inset-y-0" style={{ left: `${x}%`, "--t": `${at(x)}s` } as CSSProperties} aria-hidden>
              <span className="absolute inset-y-0 w-px bg-paper/[0.07]" />
              <span className="absolute top-1/2 block h-3 w-px -translate-y-1/2 bg-paper/50" />
              <span className="absolute bottom-0 left-2 font-serif text-2xl text-paper/40 italic tabular-nums">{y}</span>
            </span>
          );
        })}
        <span className="ctl-head absolute top-1/2 left-0 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-light" style={{ "--sweep": `${SWEEP}s`, "--lead": `${LEAD}s` } as CSSProperties} aria-hidden />

        <ol className="ctl-list">
          {placed.map((m) => {
            const up = m.lane < 0;
            const h = Math.abs(m.lane) * LANE_PX;
            return (
              <li
                key={m.id}
                className={cn("ctl-item absolute top-1/2", m.kind === "doctorat" && "ctl-defense")}
                style={{ left: `${m.x}%`, "--t": `${at(m.x)}s`, "--h": `${h}px` } as CSSProperties}
              >
                <span className={cn("ctl-stem absolute left-0 w-px bg-paper/45", up ? "bottom-0 origin-bottom" : "top-0 origin-top")} style={{ height: h }} aria-hidden />
                <span className={cn("ctl-dot absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full", DOT[m.kind])} aria-hidden />
                <a
                  href={m.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "ctl-label absolute block w-[13rem] py-1 outline-offset-4",
                    m.alignEnd ? "right-0 text-right" : "left-0",
                    up ? "bottom-[var(--h)] pb-2" : "top-[var(--h)] pt-2",
                  )}
                >
                  <span className="block text-xs text-mist tabular-nums">
                    {formatDateFr(m.date)} · {MILESTONE_KIND_LABEL[m.kind]}
                  </span>
                  <span className="mt-0.5 block font-serif text-lg leading-tight">{m.short}</span>
                  <span className="sr-only">
                    {m.title} (nouvel onglet)
                  </span>
                </a>
              </li>
            );
          })}
        </ol>
      </div>

      {/* mobile: vertical sequence */}
      <ol className="relative mx-6 mt-8 border-l border-paper/30 pb-4 md:hidden">
        {placed.map((m, i) => (
          <li key={m.id} className="ctl-row relative pb-7 pl-6" style={{ "--t": `${0.15 + i * 0.09}s` } as CSSProperties}>
            <span className={cn("ctl-dot absolute top-1.5 -left-[6.5px] size-3 rounded-full", DOT[m.kind])} aria-hidden />
            <a href={m.url} target="_blank" rel="noopener noreferrer" className="block py-1">
              <span className="block text-xs text-mist tabular-nums">
                {formatDateFr(m.date)} · {MILESTONE_KIND_LABEL[m.kind]}
              </span>
              <span className="mt-0.5 block font-serif text-xl leading-snug">{m.short}</span>
              <span className="sr-only">
                {m.title} (nouvel onglet)
              </span>
            </a>
          </li>
        ))}
      </ol>

      <p className="px-6 pb-8 text-xs text-mist md:px-10 md:pb-10">
        Positions à la date exacte, de {Math.floor(SPAN[0])} à {Math.floor(SPAN[1])}. Chaque jalon ouvre sa source : HAL, DOI ou theses.fr.
      </p>
    </div>
  );
}

function Legend() {
  const items: { kind: MilestoneKind; label: string }[] = [
    { kind: "communication", label: "Communication" },
    { kind: "poster", label: "Poster" },
    { kind: "article", label: "Article ou doctorat" },
  ];
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-paper/80">
      {items.map((i) => (
        <li key={i.kind} className="flex items-center gap-2">
          <span className={cn("size-2.5 rounded-full", DOT[i.kind])} aria-hidden />
          {i.label}
        </li>
      ))}
    </ul>
  );
}
