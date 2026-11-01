"use client";

import { a11y } from "@/i18n";
import Image from "next/image";
import { useMemo, useState, type ReactNode } from "react";
import { ArrowUpRight, FileCode2, FileText, FolderClosed, Database, Archive } from "lucide-react";
import type { CodeFile, Figure } from "@/types/content";
import { cn } from "@/lib/utils/cn";

const KIND_ICON = { notebook: FileCode2, script: FileCode2, data: Database, document: FileText, archive: Archive };

/** Very small Python highlighter (comments, strings, keywords, numbers). */
function highlight(code: string): ReactNode[] {
  const re = /(#.*$)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|\b(def|return|if|elif|else|for|in|import|from|as|class|and|or|not|None|True|False|while|self)\b|\b(\d+(?:\.\d+)?(?:e-?\d+)?)\b/gm;
  const out: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(code))) {
    if (m.index > last) out.push(code.slice(last, m.index));
    const [tok] = m;
    const cls = m[1] ? "text-mist italic" : m[2] ? "text-[#e9b872]" : m[3] ? "text-accent-light" : "text-paper font-medium";
    out.push(
      <span key={k++} className={cls}>
        {tok}
      </span>,
    );
    last = m.index + tok.length;
  }
  out.push(code.slice(last));
  return out;
}

type Repository = { name: string; url: string; description: string };

/** Groups files by repository folder; non-excerpt files are listed once per path. */
function buildTree(files: CodeFile[]): [string, CodeFile[]][] {
  const groups = new Map<string, CodeFile[]>();
  for (const f of files) {
    const parts = f.path.split("/");
    const folder = `${f.repository}${parts.length > 1 ? " / " + parts.slice(0, -1).join("/") : ""}`;
    if (!groups.has(folder)) groups.set(folder, []);
    if (f.excerpt || !groups.get(folder)!.some((g) => g.path === f.path)) groups.get(folder)!.push(f);
  }
  return Array.from(groups.entries());
}

type CodeExplorerProps = {
  files: CodeFile[];
  figures: Figure[];
  fileUrls: Record<string, string>;
  repositories: Repository[];
};

export function CodeExplorer({ files, figures, fileUrls, repositories }: CodeExplorerProps) {
  const withExcerpt = files.filter((f) => f.excerpt);
  const [active, setActive] = useState(withExcerpt.find((f) => f.id === "ch3-rf")?.id ?? withExcerpt[0].id);
  const file = files.find((f) => f.id === active)!;
  const fig = figures.find((f) => f.id === file.figureIds[0]);
  const tree = useMemo(() => buildTree(files), [files]);

  return (
    <div className="on-dark overflow-hidden rounded-[4px] border border-ink bg-antibes text-paper">
      <ExplorerBar file={file} url={fileUrls[file.id]} />
      <div className="grid lg:grid-cols-[17rem_minmax(0,1fr)_19rem]">
        <FileNavigator tree={tree} nav={{ active, onSelect: setActive, fileUrls }} />
        <CodeViewer file={file} />
        <aside className="space-y-5 p-4 lg:border-l lg:border-paper/15" aria-label={a11y.metadonneesDuFichier}>
          <FileFacts file={file} />
          <FileFigure fig={fig} />
        </aside>
      </div>
      <RepositoryLinks repositories={repositories} />
    </div>
  );
}

function ExplorerBar({ file, url }: { file: CodeFile; url: string | undefined }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-paper/15 px-4 py-2.5">
      <span className="label text-mist">Explorateur de code</span>
      <span className="mono-meta truncate text-xs text-paper/70">
        {file.repository} / {file.path}
      </span>
      <a href={url} target="_blank" rel="noopener noreferrer" className="mono-meta ml-auto inline-flex items-center gap-1 py-1 text-xs text-paper underline underline-offset-4 hover:text-accent-light">
        Ouvrir sur GitLab <ArrowUpRight className="size-3" aria-hidden />
        <span className="sr-only">(nouvel onglet)</span>
      </a>
    </div>
  );
}

type NavState = { active: string; onSelect: (id: string) => void; fileUrls: Record<string, string> };

function FileNavigator({ tree, nav }: { tree: [string, CodeFile[]][]; nav: NavState }) {
  return (
    <nav aria-label={a11y.fichiersDesDepots} className="max-h-[34rem] overflow-y-auto border-b border-paper/15 p-3 lg:border-r lg:border-b-0">
      {tree.map(([folder, fs]) => (
        <NavFolder key={folder} folder={folder} files={fs} nav={nav} />
      ))}
    </nav>
  );
}

function NavFolder({ folder, files, nav }: { folder: string; files: CodeFile[]; nav: NavState }) {
  return (
    <div className="mb-3">
      <p className="flex items-center gap-1.5 px-2 py-1 font-mono text-xs text-mist">
        <FolderClosed className="size-3.5 shrink-0" aria-hidden />
        <span className="truncate">{folder}</span>
      </p>
      <ul>
        {files.map((f) => (
          <li key={f.id}>
            {f.excerpt ? <NavFileButton file={f} on={f.id === nav.active} onSelect={nav.onSelect} /> : <NavFileLink file={f} url={nav.fileUrls[f.id]} />}
          </li>
        ))}
      </ul>
    </div>
  );
}

function NavFileButton({ file: f, on, onSelect }: { file: CodeFile; on: boolean; onSelect: (id: string) => void }) {
  const Icon = KIND_ICON[f.kind];
  return (
    <button
      type="button"
      onClick={() => onSelect(f.id)}
      aria-current={on ? "true" : undefined}
      className={cn(
        "flex w-full items-center gap-2 rounded-[2px] py-1.5 pr-2 pl-6 text-left font-mono text-xs transition-colors",
        on ? "bg-paper/10 text-paper" : "text-paper/75 hover:bg-paper/5 hover:text-paper",
      )}
    >
      <Icon className={cn("size-3.5 shrink-0", on ? "text-accent-light" : "text-mist")} aria-hidden />
      <span className="min-w-0">
        <span className="block truncate">{f.path.split("/").at(-1)}</span>
        <span className="block truncate font-sans text-xs text-mist">{f.excerpt?.label}</span>
      </span>
    </button>
  );
}

function NavFileLink({ file: f, url }: { file: CodeFile; url: string | undefined }) {
  const Icon = KIND_ICON[f.kind];
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 py-1.5 pr-2 pl-6 font-mono text-xs text-paper/70 hover:text-paper">
      <Icon className="size-3.5 shrink-0" aria-hidden />
      <span className="truncate">{f.path.split("/").at(-1)}</span>
      <ArrowUpRight className="ml-auto size-3 shrink-0" aria-hidden />
    </a>
  );
}

function CodeViewer({ file }: { file: CodeFile }) {
  const lines = file.excerpt?.code.split("\n") ?? [];
  return (
    <div className="min-w-0 border-b border-paper/15 lg:border-b-0">
      <div className="flex items-baseline justify-between gap-3 border-b border-paper/10 px-4 py-2">
        <p className="font-serif text-lg">{file.excerpt?.label}</p>
        <p className="mono-meta text-xs text-mist">extrait verbatim</p>
      </div>
      <div className="max-h-[30rem] overflow-auto">
        <pre className="code-block p-4" tabIndex={0} aria-label={`Extrait de ${file.path}`}>
          <code>
            {lines.map((l, i) => (
              <span key={i} className="grid grid-cols-[2.2rem_1fr]">
                <span className="text-right pr-4 text-paper/60 select-none" aria-hidden>
                  {i + 1}
                </span>
                <span className="whitespace-pre text-paper/90">{highlight(l)}</span>
              </span>
            ))}
          </code>
        </pre>
      </div>
      {file.excerpt?.note && <p className="mono-meta border-t border-paper/10 px-4 py-2 text-xs text-mist">{file.excerpt.note}</p>}
    </div>
  );
}

function FileFacts({ file }: { file: CodeFile }) {
  return (
    <dl className="space-y-3 text-sm">
      <div>
        <dt className="label text-mist">Description</dt>
        <dd className="mt-1 text-paper/85">{file.description}</dd>
      </div>
      {file.chapter && (
        <div>
          <dt className="label text-mist">Thèse</dt>
          <dd className="mt-1">Chapitre {file.chapter}</dd>
        </div>
      )}
      {file.pythonVersion && (
        <div>
          <dt className="label text-mist">Noyau</dt>
          <dd className="mt-1 font-mono text-xs">Python {file.pythonVersion}</dd>
        </div>
      )}
      {file.imports.length > 0 && <ImportList imports={file.imports} />}
    </dl>
  );
}

function ImportList({ imports }: { imports: string[] }) {
  return (
    <div>
      <dt className="label text-mist">Bibliothèques importées</dt>
      <dd className="mt-1.5 flex flex-wrap gap-1.5">
        {imports.map((i) => (
          <span key={i} className="rounded-[2px] border border-paper/20 px-1.5 py-0.5 font-mono text-xs">
            {i}
          </span>
        ))}
      </dd>
    </div>
  );
}

function FileFigure({ fig }: { fig: Figure | undefined }) {
  if (!fig) return <p className="text-xs text-paper/60">Aucune figure exportée par cet extrait — ouvrez le fichier complet sur GitLab.</p>;
  return (
    <figure>
      <p className="label mb-2 text-mist">Figure produite</p>
      <div className="rounded-[2px] bg-paper p-1.5">
        <Image src={fig.src} alt={fig.alt} width={fig.width} height={fig.height} className="h-auto w-full" sizes="19rem" />
      </div>
      <figcaption className="mt-2 text-xs leading-snug text-paper/70">{fig.caption}</figcaption>
    </figure>
  );
}

function RepositoryLinks({ repositories }: { repositories: Repository[] }) {
  return (
    <div className="grid gap-px border-t border-paper/15 bg-paper/15 sm:grid-cols-2">
      {repositories.map((r) => (
        <a key={r.name} href={r.url} target="_blank" rel="noopener noreferrer" className="group bg-antibes p-4 transition-colors hover:bg-antibes-2">
          <p className="flex items-center gap-2 font-mono text-sm">
            gitlab.com/marinecourtois/<span className="text-accent-light">{r.name}</span>
            <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </p>
          <p className="mt-1 text-xs text-paper/70">{r.description}</p>
        </a>
      ))}
    </div>
  );
}
