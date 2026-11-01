"use client";

import { a11y } from "@/i18n";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import type { CodeFile, Figure, Publication, ThesisChapter } from "@/types/content";
import { cn } from "@/lib/utils/cn";

export function ThesisExplorer({
  chapters,
  publications,
  codeFiles,
  figures,
  fileUrls,
  folderUrls,
  headingLevel = "h3",
}: {
  chapters: ThesisChapter[];
  publications: Publication[];
  codeFiles: CodeFile[];
  figures: Figure[];
  fileUrls: Record<string, string>;
  folderUrls: Record<number, string>;
  headingLevel?: "h2" | "h3";
}) {
  const [n, setN] = useState(3);
  const reduce = useReducedMotion();
  const ch = chapters.find((c) => c.number === n)!;
  const fig = figures.find((f) => f.id === ch.figureId);
  const pubs = ch.publicationIds.map((id) => publications.find((p) => p.id === id)).filter(Boolean) as Publication[];
  const files = ch.codeFileIds.map((id) => codeFiles.find((c) => c.id === id)).filter(Boolean) as CodeFile[];

  return (
    <div className="on-dark text-paper">
      <div role="tablist" aria-label={a11y.chapitresDeLaThese} className="flex gap-1 overflow-x-auto border-b border-paper/20 pb-px">
        {chapters.map((c) => {
          const on = c.number === n;
          return (
            <button
              key={c.number}
              role="tab"
              aria-selected={on}
              aria-controls="thesis-panel"
              id={`thesis-tab-${c.number}`}
              onClick={() => setN(c.number)}
              className={cn(
                "relative shrink-0 px-4 py-3 text-left transition-colors",
                on ? "text-paper" : "text-paper/55 hover:text-paper",
              )}
            >
              <span className="block tabular-nums text-xs text-mist">CH. {c.number}</span>
              <span className="block max-w-[12rem] truncate font-serif text-lg">{c.titleFr}</span>
              {on && <span className="absolute inset-x-0 -bottom-px h-[2px] bg-azur" />}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={n}
          id="thesis-panel"
          role="tabpanel"
          aria-labelledby={`thesis-tab-${n}`}
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="grid gap-10 pt-10 lg:grid-cols-12"
        >
          <div className="space-y-7 lg:col-span-5">
            <div>
              <p className="label mb-3 text-accent-light">
                Chapitre {ch.number} · <span lang="en">{ch.title}</span>
              </p>
              {headingLevel === "h2" ? <h2 className="font-serif text-title">{ch.question}</h2> : <h3 className="font-serif text-title">{ch.question}</h3>}
            </div>
            <dl className="space-y-5 text-[0.95rem] leading-relaxed">
              <div>
                <dt className="label mb-1 text-mist">Approche méthodologique</dt>
                <dd className="text-paper/85">{ch.approach}</dd>
              </div>
              <div>
                <dt className="label mb-1 text-mist">Concept clé</dt>
                <dd className="text-paper/85">{ch.keyConcept}</dd>
              </div>
              <div className="border-l-2 border-accent-light pl-4">
                <dt className="label mb-1 text-mist">En termes simples</dt>
                <dd className="font-serif text-xl leading-snug">{ch.accessible}</dd>
              </div>
            </dl>
          </div>

          <div className="space-y-7 lg:col-span-6 lg:col-start-7">
            {fig && (
              <figure className="rounded-[3px] bg-paper p-3">
                <Image src={fig.src} alt={fig.alt} width={fig.width} height={fig.height} className="h-auto w-full" sizes="(min-width: 1024px) 40vw, 100vw" />
                <figcaption className="mono-meta mt-2 text-xs text-muted">
                  Figure issue de <span className="text-ink">{fig.notebook.split("/").at(-1)}</span> — {fig.caption}
                </figcaption>
              </figure>
            )}
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <p className="label mb-2 text-mist">Publication associée</p>
                {pubs.length ? (
                  <ul className="space-y-2">
                    {pubs.map((p) => (
                      <li key={p.id}>
                        <Link href={`/publications/${p.slug}`} className="link-underline font-serif text-lg leading-snug">
                          {p.journal} ({p.year})
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-paper/60">Chapitre du manuscrit — voir la thèse.</p>
                )}
              </div>
              <div>
                <p className="label mb-2 text-mist">Scripts associés</p>
                <ul className="space-y-1.5">
                  {files.map((f) => (
                    <li key={f.id}>
                      <a href={fileUrls[f.id]} target="_blank" rel="noopener noreferrer" className="inline-flex items-start gap-1 py-1 tabular-nums text-xs break-all text-paper/85 hover:text-accent-light">
                        {f.path.split("/").at(-1)}
                        <ArrowUpRight className="mt-0.5 size-3 shrink-0" aria-hidden />
                      </a>
                    </li>
                  ))}
                </ul>
                {folderUrls[ch.number] && (
                  <a href={folderUrls[ch.number]} target="_blank" rel="noopener noreferrer" className="mono-meta mt-3 inline-block py-1 text-mist underline underline-offset-4 hover:text-paper">
                    Dossier « {ch.folder} » ↗
                  </a>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
