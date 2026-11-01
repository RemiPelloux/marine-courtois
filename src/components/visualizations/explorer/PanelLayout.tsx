"use client";

import type { ReactNode } from "react";
import { RotateCcw } from "lucide-react";
import { IconButton } from "@/components/interactions/Controls";

export interface ExplorerContent {
  equations: ReactNode;
  citation: { text: string; doi?: string; url: string };
  code: { label: string; url: string };
  publication: { label: string; href: string };
  methodology: { label: string; href: string };
  figure: string;
}

export const C = { ink: "#f5f2eb", ver: "#6fb3f2", mist: "#a8bfd6", azur: "#8fc1ea", amber: "#e9b872" };

/* ------------------------------------------------------------------ */

function Stage({ title, sub, children, className }: { title: string; sub: string; children: ReactNode; className?: string }) {
  return (
    <section className={className} aria-label={`${title} ${sub}`}>
      <h3 className="mb-6 flex items-baseline gap-3 font-serif text-[2rem] leading-none">
        {title}
        <span className="font-sans text-sm text-paper/60">{sub}</span>
      </h3>
      {children}
    </section>
  );
}

export function PanelLayout({
  intro,
  content,
  controls,
  chart,
  legend,
  reading,
  onReset,
  verification,
}: {
  intro: ReactNode;
  content: ExplorerContent;
  controls: ReactNode;
  chart: ReactNode;
  legend: ReactNode;
  reading: ReactNode;
  onReset: () => void;
  verification: string;
}) {
  const links = [
    { label: "Publication", detail: content.publication.label, href: content.publication.href, external: false },
    ...(content.citation.doi ? [{ label: "DOI", detail: content.citation.doi, href: content.citation.url, external: true }] : []),
    { label: "Code", detail: content.code.label, href: content.code.url, external: true },
    { label: "Méthodologie", detail: content.methodology.label, href: content.methodology.href, external: false },
  ];
  return (
    <div className="grid gap-x-12 gap-y-16 lg:grid-cols-12">
      <Stage title="Observer" sub="le mécanisme" className="lg:col-span-4">
        <div className="space-y-3 text-[0.98rem] leading-relaxed text-paper/90">{intro}</div>
        <div className="mt-6 overflow-x-auto bg-paper/[0.05] px-4 py-3 text-[0.92rem]">{content.equations}</div>
      </Stage>

      <Stage title="Explorer" sub="les paramètres" className="lg:col-span-8">
        <div className="grid gap-x-8 gap-y-5 bg-paper/[0.05] p-5 sm:grid-cols-2 xl:grid-cols-3">
          {controls}
          <div className="flex items-end sm:col-span-2 xl:col-span-3">
            <IconButton onClick={onReset} variant="outline-dark" className="min-h-9 px-3 text-xs">
              <RotateCcw className="size-3.5" aria-hidden /> Réinitialiser les paramètres
            </IconButton>
          </div>
        </div>
        <div className="mt-6 mb-3">{legend}</div>
        {chart}
      </Stage>

      <Stage title="Comprendre" sub="les résultats" className="lg:col-span-12">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="text-[0.98rem] leading-relaxed text-paper/90 lg:col-span-5">{reading}</div>
          <div className="space-y-4 lg:col-span-7">
            <p className="text-sm leading-relaxed text-paper/75">{content.citation.text}</p>
            <ul className="grid gap-px bg-paper/10 sm:grid-cols-2 xl:grid-cols-4">
              {links.map((l) => (
                <li key={l.label} className="bg-antibes">
                  <a
                    href={l.href}
                    {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group flex h-full flex-col gap-1 p-4 transition-colors hover:bg-antibes-2"
                  >
                    <span className="flex items-center justify-between font-serif text-xl">
                      {l.label}
                      <span aria-hidden className="text-accent-light transition-transform group-hover:translate-x-0.5">
                        {l.external ? "↗" : "→"}
                      </span>
                    </span>
                    <span className="text-xs text-paper/65 [overflow-wrap:anywhere]">{l.detail}</span>
                    {l.external && <span className="sr-only">(nouvel onglet)</span>}
                  </a>
                </li>
              ))}
            </ul>
            <p className="max-w-[78ch] text-xs leading-relaxed text-paper/70">{verification}</p>
          </div>
        </div>
      </Stage>
    </div>
  );
}

