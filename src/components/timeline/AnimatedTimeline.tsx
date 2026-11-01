"use client";

import { animate, onScroll, stagger, utils } from "animejs";
import { useRef } from "react";
import { useAnimeScope } from "@/hooks/useAnimeScope";
import { MILESTONE_KIND_LABEL, type Milestone } from "@/data/milestones";
import { formatDateFr } from "@/lib/utils/format";

const EASE = "out(4)";

/** Spine draws with the scroll; each year's milestones arrive as the reader reaches them. */
function timelineMotion(root: HTMLElement) {
  animate(root.querySelector(".tl-spine")!, { scaleY: [0, 1], ease: "linear", autoplay: onScroll({ target: root, enter: "75% top", leave: "60% bottom", sync: 0.35 }) });
  utils.set(root.querySelectorAll(".tl-dot"), { scale: 0 });
  utils.set(root.querySelectorAll(".tl-body"), { opacity: 0, x: -18 });
  utils.set(root.querySelectorAll(".tl-year"), { opacity: 0, y: 24 });
  root.querySelectorAll<HTMLElement>(".tl-group").forEach((group) => {
    const play = () => onScroll({ target: group, enter: "85% top", repeat: false });
    animate(group.querySelector(".tl-year")!, { opacity: 1, y: 0, duration: 700, ease: EASE, autoplay: play() });
    animate(group.querySelectorAll(".tl-dot"), { scale: 1, duration: 520, delay: stagger(90, { start: 120 }), ease: "out(3)", autoplay: play() });
    animate(group.querySelectorAll(".tl-body"), { opacity: 1, x: 0, duration: 650, delay: stagger(90, { start: 160 }), ease: EASE, autoplay: play() });
  });
}

const byYearDesc = (items: Milestone[]) =>
  [...new Set(items.map((m) => m.date.slice(0, 4)))]
    .sort((a, b) => b.localeCompare(a))
    .map((year) => ({ year, items: items.filter((m) => m.date.startsWith(year)).sort((a, b) => b.date.localeCompare(a.date)) }));

export function AnimatedTimeline({ milestones }: { milestones: Milestone[] }) {
  const root = useRef<HTMLDivElement>(null);
  useAnimeScope(root, timelineMotion);
  return (
    <div ref={root} className="relative mt-12">
      <span className="tl-spine absolute top-0 bottom-0 left-[4px] w-px origin-top bg-ink/40 md:left-[calc(10rem+4px)]" aria-hidden />
      {byYearDesc(milestones).map(({ year, items }) => (
        <div key={year} className="tl-group grid gap-x-8 pb-6 md:grid-cols-[8rem_1fr]">
          <h3 className="tl-year pl-8 font-serif text-[2.6rem] leading-none text-accent-deep italic tabular-nums md:sticky md:top-28 md:self-start md:pl-0">{year}</h3>
          <ol className="mt-4 md:mt-0">
            {items.map((t) => (
              <TimelineItem key={t.id} t={t} />
            ))}
          </ol>
        </div>
      ))}
    </div>
  );
}

function TimelineItem({ t }: { t: Milestone }) {
  const strong = t.kind === "article" || t.kind === "doctorat";
  return (
    <li className="relative pb-8 pl-8">
      <span
        className={`tl-dot absolute top-1.5 left-0 size-[9px] rounded-full ${strong ? "bg-accent" : t.kind === "poster" ? "border-[1.5px] border-ink bg-stone" : "bg-ink"}`}
        aria-hidden
      />
      <div className="tl-body">
        <p className="mono-meta text-muted">
          {formatDateFr(t.date)} · <span className="text-accent-deep">{MILESTONE_KIND_LABEL[t.kind]}</span>
        </p>
        <a href={t.url} target="_blank" rel="noopener noreferrer" className="mt-1 block max-w-[62ch] font-serif text-xl leading-snug transition-colors hover:text-accent-deep">
          {t.title}
        </a>
      </div>
    </li>
  );
}
