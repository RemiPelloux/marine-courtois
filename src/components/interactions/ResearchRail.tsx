"use client";

import Image from "next/image";
import Link from "@/i18n/Link";
import { ArrowRight } from "lucide-react";
import { onScroll } from "animejs";
import { useRef, ViewTransition, type CSSProperties } from "react";
import { copy } from "@/i18n/config";
import { useLang } from "@/i18n/client";
import { SpeciesText } from "@/components/ui/Species";
import type { RailFigure, RailItem } from "@/data/research-rail";
import { useAnimeScope } from "@/hooks/useAnimeScope";

/** Must match --rail-panel and .rail-track padding in globals.css (vw). */
const PANEL_VW = 56;
const PAD_VW = 5;
const DESKTOP = "(min-width: 1024px)";

/** Share of the track that slides out of view, as a percentage of its own width. */
export function railShift(count: number): number {
  const track = count * PANEL_VW + PAD_VW * 2;
  return Math.max(0, ((track - 100) / track) * 100);
}

const pad2 = (n: number) => String(n).padStart(2, "0");

const COPY = copy({
  fr: {
    label: "Les travaux en figures",
    axis: (letter: string) => `Axe ${letter}`,
    read: "Lire le détail",
    colon: "\u00a0:",
    figure: "Figure de la thèse",
  },
  en: {
    label: "The work in figures",
    axis: (letter: string) => `Area ${letter}`,
    read: "Read the detail",
    colon: ":",
    figure: "Thesis figure",
  },
});

/**
 * Vertical scroll drives the track sideways while the viewport stays pinned.
 * One observer, synced 1:1 with the scroll (no smoothing lag), writing
 * compositor-only transforms. The scroll distance is set in CSS (--rail-ratio).
 */
function pinRail(root: HTMLElement) {
  if (!window.matchMedia(DESKTOP).matches) return;
  const parts = railParts(root);
  const { track, bar, figures } = parts;
  if (!track) return;
  const render = railRenderer({ ...parts, track }, Number(root.dataset.count));
  render(0);
  onScroll({
    target: root,
    enter: { container: "5rem", target: "top" },
    leave: "bottom bottom",
    sync: true,
    onUpdate: (self) => render(self.progress),
    onEnter: (self) => render(self.progress),
    onLeave: (self) => render(self.progress),
  });
  return () => {
    [track, bar, ...figures].forEach((el) => el?.style.removeProperty("transform"));
  };
}

type RailParts = { track: HTMLElement; bar: HTMLElement | null; counter: HTMLElement | null; figures: HTMLElement[] };

function railParts(root: HTMLElement): Omit<RailParts, "track"> & { track: HTMLElement | null } {
  return {
    track: root.querySelector<HTMLElement>(".rail-track"),
    bar: root.querySelector<HTMLElement>(".rail-progress"),
    counter: root.querySelector<HTMLElement>(".rail-counter"),
    figures: [...root.querySelectorAll<HTMLElement>(".rail-figure")],
  };
}

/** Writes the transforms and counter for a scroll progress `p` in [0, 1]; skips sub-pixel repeats. */
function railRenderer({ track, bar, counter, figures }: RailParts, count: number) {
  const shift = railShift(count);
  let last = -1;
  return (p: number) => {
    if (Math.abs(p - last) < 0.0005) return;
    last = p;
    track.style.transform = `translate3d(${(-shift * p).toFixed(3)}%,0,0)`;
    if (bar) bar.style.transform = `scaleX(${p.toFixed(4)})`;
    const x = (5 - 10 * p).toFixed(2);
    figures.forEach((f) => (f.style.transform = `translate3d(${x}%,0,0)`));
    if (counter) counter.textContent = pad2(Math.min(count, Math.floor(p * count) + 1));
  };
}

export function ResearchRail({ items, headingLevel = "h3" }: { items: RailItem[]; headingLevel?: "h2" | "h3" }) {
  const root = useRef<HTMLElement>(null);
  const t = COPY[useLang()];
  useAnimeScope(root, pinRail);
  return (
    <section ref={root} aria-label={t.label} data-count={items.length} className="rail" style={{ "--rail-n": items.length } as CSSProperties}>
      <div className="rail-viewport">
        <ol className="rail-track">
          {items.map((item) => (
            <RailPanel key={item.slug} t={item} H={headingLevel} />
          ))}
        </ol>
        <div className="rail-meter site-gutter" aria-hidden>
          <span className="mono-meta tabular-nums">
            <span className="rail-counter">01</span> / {pad2(items.length)}
          </span>
          <span className="relative h-px flex-1 bg-ink/20">
            <span className="rail-progress absolute inset-0 origin-left bg-antibes" />
          </span>
        </div>
      </div>
    </section>
  );
}

function RailPanel({ t, H }: { t: RailItem; H: "h2" | "h3" }) {
  const c = COPY[useLang()];
  return (
    <li className="rail-panel">
      <div className="flex min-w-0 flex-col">
        <p className="flex items-baseline gap-4">
          <span className="font-serif text-5xl leading-none text-accent-deep italic" aria-hidden>
            {t.axis}
          </span>
          <span className="sr-only">{c.axis(t.axis)}</span>
          <span className="mono-meta text-muted">{t.sources}</span>
        </p>
        <H className="mt-6 font-serif text-title">
          <ViewTransition name={`research-${t.slug}`} share="morph" default="none">
            <span className="inline-block">{t.title}</span>
          </ViewTransition>
        </H>
        <p className="mt-2 text-muted">{t.short}</p>
        <p className="mt-6 max-w-[46ch] leading-relaxed text-ink/85">
          <SpeciesText text={t.lede} />
        </p>
        <Link href={`/recherche/${t.slug}`} className="group mt-8 inline-flex items-center gap-2 self-start font-serif text-xl hover:text-accent-deep">
          {c.read}
          <span className="sr-only">
            {c.colon} {t.title}
          </span>
          <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
        </Link>
      </div>
      {t.figure && <RailFigureView figure={t.figure} caption={c.figure} />}
    </li>
  );
}

function RailFigureView({ figure, caption }: { figure: RailFigure; caption: string }) {
  return (
    <figure className="plate min-w-0">
      <div className="overflow-hidden bg-white p-4">
        <Image
          src={figure.src}
          width={figure.width}
          height={figure.height}
          alt={figure.alt}
          sizes="(min-width: 1024px) 30vw, 100vw"
          className="rail-figure plate-img h-auto max-h-[48vh] w-full object-contain"
        />
      </div>
      <figcaption className="mono-meta mt-2 text-muted">
        {caption} — {figure.notebook.split("/").pop()}
      </figcaption>
    </figure>
  );
}
