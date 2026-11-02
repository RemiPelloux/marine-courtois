"use client";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import Image from "next/image";
import Link from "@/i18n/Link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import type { CodeFile, Figure, Publication, ThesisChapter } from "@/types/content";
import { cn } from "@/lib/utils/cn";
import { copy } from "@/i18n/config";
import { useA11y, useLang } from "@/i18n/client";
import type { Lang } from "@/i18n/config";
import { localizeChapters } from "@/data/thesis";
import { SpeciesText } from "@/components/ui/Species";

/** Short chapter title shown on the tabs: the French repository title, or the English one. */
const CHAPTER_TITLE: Record<Lang, (c: ThesisChapter) => string> = { fr: (c) => c.titleFr, en: (c) => c.title };

const COPY = copy({
  fr: {
    ch: "CH.",
    chapter: "Chapitre",
    approach: "Approche méthodologique",
    concept: "Concept clé",
    simple: "En termes simples",
    figureFrom: "Figure issue de",
    publication: "Publication associée",
    noPublication: "Chapitre du manuscrit — voir la thèse.",
    scripts: "Scripts associés",
    folder: (name: string) => `Dossier « ${name} » ↗`,
  },
  en: {
    ch: "CH.",
    chapter: "Chapter",
    approach: "Method",
    concept: "Key concept",
    simple: "In simple terms",
    figureFrom: "Figure from",
    publication: "Related publication",
    noPublication: "Chapter of the thesis — see the manuscript.",
    scripts: "Related scripts",
    folder: (name: string) => `Folder “${name}” ↗`,
  },
});

type HeadingLevel = "h2" | "h3";

type ThesisSources = {
  publications: Publication[];
  codeFiles: CodeFile[];
  figures: Figure[];
  fileUrls: Record<string, string>;
  folderUrls: Record<number, string>;
};

type ThesisExplorerProps = ThesisSources & { chapters: ThesisChapter[]; headingLevel?: HeadingLevel };

export function ThesisExplorer({ chapters: raw, headingLevel = "h3", ...sources }: ThesisExplorerProps) {
  const [n, setN] = useState(3);
  const chapters = localizeChapters(raw, useLang());
  const ch = chapters.find((c) => c.number === n)!;

  return (
    <div className="on-dark text-paper">
      <ChapterTabs chapters={chapters} active={n} onSelect={setN} />
      <AnimatePresence mode="wait" initial={false}>
        <ChapterPanel key={n} chapter={ch} headingLevel={headingLevel} {...sources} />
      </AnimatePresence>
    </div>
  );
}

function ChapterTabs({ chapters, active, onSelect }: { chapters: ThesisChapter[]; active: number; onSelect: (n: number) => void }) {
  const a11y = useA11y();
  const lang = useLang();
  return (
    <div role="tablist" aria-label={a11y.chapitresDeLaThese} className="flex gap-1 overflow-x-auto border-b border-paper/20 pb-px">
      {chapters.map((c) => {
        const on = c.number === active;
        return (
          <button
            key={c.number}
            role="tab"
            aria-selected={on}
            aria-controls="thesis-panel"
            id={`thesis-tab-${c.number}`}
            onClick={() => onSelect(c.number)}
            className={cn("relative shrink-0 px-4 py-3 text-left transition-colors", on ? "text-paper" : "text-paper/55 hover:text-paper")}
          >
            <span className="block tabular-nums text-xs text-mist">
              {COPY[lang].ch} {c.number}
            </span>
            <span className="block max-w-[12rem] truncate font-serif text-lg">{CHAPTER_TITLE[lang](c)}</span>
            {on && <span className="absolute inset-x-0 -bottom-px h-[2px] bg-azur" />}
          </button>
        );
      })}
    </div>
  );
}

type ChapterPanelProps = ThesisSources & { chapter: ThesisChapter; headingLevel: HeadingLevel };

function ChapterPanel({ chapter, headingLevel, ...sources }: ChapterPanelProps) {
  const reduce = usePrefersReducedMotion();
  return (
    <motion.div
      id="thesis-panel"
      role="tabpanel"
      aria-labelledby={`thesis-tab-${chapter.number}`}
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="grid gap-10 pt-10 lg:grid-cols-12"
    >
      <ChapterSummary chapter={chapter} headingLevel={headingLevel} />
      <ChapterResources chapter={chapter} {...sources} />
    </motion.div>
  );
}

function ChapterSummary({ chapter: ch, headingLevel }: { chapter: ThesisChapter; headingLevel: HeadingLevel }) {
  const lang = useLang();
  const t = COPY[lang];
  return (
    <div className="space-y-7 lg:col-span-5">
      <div>
        <p className="label mb-3 text-accent-light">
          {t.chapter} {ch.number}
          {lang === "fr" && (
            <>
              {" · "}
              <span lang="en">{ch.title}</span>
            </>
          )}
        </p>
        {headingLevel === "h2" ? <h2 className="font-serif text-title">{ch.question}</h2> : <h3 className="font-serif text-title">{ch.question}</h3>}
      </div>
      <dl className="space-y-5 text-note leading-relaxed">
        <div>
          <dt className="label mb-1 text-mist">{t.approach}</dt>
          <dd className="text-paper/85">
            <SpeciesText text={ch.approach} />
          </dd>
        </div>
        <div>
          <dt className="label mb-1 text-mist">{t.concept}</dt>
          <dd className="text-paper/85">{ch.keyConcept}</dd>
        </div>
        <div className="border-l-2 border-accent-light pl-4">
          <dt className="label mb-1 text-mist">{t.simple}</dt>
          <dd className="font-serif text-xl leading-snug">{ch.accessible}</dd>
        </div>
      </dl>
    </div>
  );
}

function ChapterResources({ chapter: ch, publications, codeFiles, figures, fileUrls, folderUrls }: ThesisSources & { chapter: ThesisChapter }) {
  const fig = figures.find((f) => f.id === ch.figureId);
  const pubs = ch.publicationIds.map((id) => publications.find((p) => p.id === id)).filter(Boolean) as Publication[];
  const files = ch.codeFileIds.map((id) => codeFiles.find((c) => c.id === id)).filter(Boolean) as CodeFile[];
  return (
    <div className="space-y-7 lg:col-span-6 lg:col-start-7">
      {fig && <ChapterFigure figure={fig} />}
      <div className="grid gap-6 sm:grid-cols-2">
        <ChapterPublications publications={pubs} />
        <ChapterScripts files={files} fileUrls={fileUrls} folder={ch.folder} folderUrl={folderUrls[ch.number]} />
      </div>
    </div>
  );
}

function ChapterFigure({ figure: fig }: { figure: Figure }) {
  const t = COPY[useLang()];
  return (
    <figure className="rounded-[3px] bg-paper p-3">
      <Image src={fig.src} alt={fig.alt} width={fig.width} height={fig.height} className="h-auto w-full" sizes="(min-width: 1024px) 40vw, 100vw" />
      <figcaption className="mono-meta mt-2 text-xs text-muted">
        {t.figureFrom} <span className="text-ink">{fig.notebook.split("/").at(-1)}</span> — {fig.caption}
      </figcaption>
    </figure>
  );
}

function ChapterPublications({ publications }: { publications: Publication[] }) {
  const t = COPY[useLang()];
  return (
    <div>
      <p className="label mb-2 text-mist">{t.publication}</p>
      {publications.length ? (
        <ul className="space-y-2">
          {publications.map((p) => (
            <li key={p.id}>
              <Link href={`/publications/${p.slug}`} className="link-underline font-serif text-lg leading-snug">
                {p.journal} ({p.year})
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-paper/60">{t.noPublication}</p>
      )}
    </div>
  );
}

type ChapterScriptsProps = { files: CodeFile[]; fileUrls: Record<string, string>; folder: string; folderUrl?: string };

function ChapterScripts({ files, fileUrls, folder, folderUrl }: ChapterScriptsProps) {
  const t = COPY[useLang()];
  return (
    <div>
      <p className="label mb-2 text-mist">{t.scripts}</p>
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
      {folderUrl && (
        <a href={folderUrl} target="_blank" rel="noopener noreferrer" className="mono-meta mt-3 inline-block py-1 text-mist underline underline-offset-4 hover:text-paper">
          {t.folder(folder)}
        </a>
      )}
    </div>
  );
}
