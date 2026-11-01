"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { animate, onScroll } from "animejs";
import { useRef, ViewTransition, type CSSProperties } from "react";
import { a11y } from "@/i18n";
import type { RailFigure, RailItem } from "@/data/research-rail";
import { useAnimeScope } from "@/hooks/useAnimeScope";

/** Must match .rail-panel width and .rail-track padding in globals.css (vw). */
const PANEL_VW = 62;
const PAD_VW = 5;
const DESKTOP = "(min-width: 1024px)";

/** Share of the track that slides out of view, as a percentage of its own width. */
export function railShift(count: number): number {
  const track = count * PANEL_VW + PAD_VW * 2;
  return Math.max(0, ((track - 100) / track) * 100);
}

const pad2 = (n: number) => String(n).padStart(2, "0");

/** Vertical scroll drives the track sideways while the viewport stays pinned. */
function pinRail(root: HTMLElement) {
  if (!window.matchMedia(DESKTOP).matches) return;
  const count = Number(root.dataset.count);
  const counter = root.querySelector<HTMLElement>(".rail-counter");
  const span = () => onScroll({ target: root, enter: { container: "5rem", target: "top" }, leave: "bottom bottom", sync: 0.2 });
  animate(root.querySelector(".rail-track")!, { x: ["0%", `-${railShift(count)}%`], ease: "linear", autoplay: span() });
  animate(root.querySelector(".rail-progress")!, { scaleX: [0, 1], ease: "linear", autoplay: span() });
  animate(root.querySelectorAll(".rail-figure"), { x: ["7%", "-7%"], ease: "linear", autoplay: span() });
  onScroll({
    target: root,
    enter: { container: "5rem", target: "top" },
    leave: "bottom bottom",
    onUpdate: (self) => {
      if (counter) counter.textContent = pad2(Math.min(count, Math.floor(self.progress * count) + 1));
    },
  });
}

export function ResearchRail({ items }: { items: RailItem[] }) {
  const root = useRef<HTMLElement>(null);
  useAnimeScope(root, pinRail);
  return (
    <section ref={root} aria-label={a11y.axesDeRecherche} data-count={items.length} className="rail" style={{ "--rail-n": items.length } as CSSProperties}>
      <div className="rail-viewport">
        <ol className="rail-track">
          {items.map((t) => (
            <RailPanel key={t.slug} t={t} />
          ))}
        </ol>
        <div className="rail-meter site-gutter" aria-hidden>
          <span className="mono-meta tabular-nums">
            <span className="rail-counter">01</span> / {pad2(items.length)}
          </span>
          <span className="relative h-px flex-1 bg-ink/20">
            <span className="rail-progress absolute inset-0 origin-left bg-vermilion" />
          </span>
        </div>
      </div>
    </section>
  );
}

function RailPanel({ t }: { t: RailItem }) {
  return (
    <li className="rail-panel">
      <div className="flex min-w-0 flex-col">
        <span className="font-serif text-[3.4rem] leading-none text-vermilion-deep italic tabular-nums" aria-hidden>
          {t.index}
        </span>
        <h3 className="mt-6 font-serif text-title">
          <ViewTransition name={`research-${t.slug}`} share="morph" default="none">
            <span className="inline-block">{t.title}</span>
          </ViewTransition>
        </h3>
        <p className="mt-2 text-muted">{t.short}</p>
        <p className="mt-6 max-w-[46ch] leading-relaxed text-ink/85">{t.lede}</p>
        <p className="mono-meta mt-5 text-muted">{t.sources}</p>
        <Link href={`/recherche/${t.slug}`} className="group mt-8 inline-flex items-center gap-2 self-start font-serif text-xl hover:text-vermilion-deep">
          Lire l&apos;axe <span className="sr-only">: {t.title}</span>
          <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
        </Link>
      </div>
      {t.figure && <RailFigureView figure={t.figure} />}
    </li>
  );
}

function RailFigureView({ figure }: { figure: RailFigure }) {
  return (
    <figure className="min-w-0 overflow-hidden">
      <Image
        src={figure.src}
        width={figure.width}
        height={figure.height}
        alt={figure.alt}
        sizes="(min-width: 1024px) 30vw, 100vw"
        className="rail-figure h-auto max-h-[52vh] w-full object-contain mix-blend-multiply"
      />
      <figcaption className="mono-meta mt-2 text-muted">Figure de la thèse — {figure.notebook.split("/").pop()}</figcaption>
    </figure>
  );
}
