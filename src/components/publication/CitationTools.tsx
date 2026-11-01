"use client";

import { useState } from "react";
import { Check, Copy, Download } from "lucide-react";

type Props = { reference: string; bibtex: string; fileName: string };

/** Copy the reference or the BibTeX entry, or download it as a .bib file. */
export function CitationTools({ reference, bibtex, fileName }: Props) {
  const [copied, setCopied] = useState<"ref" | "bib" | null>(null);
  const copy = async (what: "ref" | "bib") => {
    try {
      await navigator.clipboard.writeText(what === "ref" ? reference : bibtex);
      setCopied(what);
      setTimeout(() => setCopied(null), 1800);
    } catch {
      setCopied(null);
    }
  };
  const download = () => {
    const url = URL.createObjectURL(new Blob([bibtex], { type: "application/x-bibtex" }));
    const a = Object.assign(document.createElement("a"), { href: url, download: fileName });
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-3">
      <p className="text-sm leading-relaxed text-ink/85">{reference}</p>
      <div className="flex flex-wrap gap-2">
        <ToolButton onClick={() => copy("ref")} done={copied === "ref"} label="Copier la référence" />
        <ToolButton onClick={() => copy("bib")} done={copied === "bib"} label="Copier le BibTeX" />
        <button type="button" onClick={download} className="inline-flex min-h-10 items-center gap-2 rounded-[3px] border border-ink/30 px-3 text-sm hover:border-ink">
          <Download className="size-4" aria-hidden /> .bib
        </button>
      </div>
      <p role="status" className="sr-only">
        {copied ? "Copié dans le presse-papiers" : ""}
      </p>
      <details className="text-xs">
        <summary className="cursor-pointer py-1 text-muted hover:text-ink">Voir l&apos;entrée BibTeX</summary>
        <pre className="mt-2 overflow-x-auto bg-stone p-3 font-mono text-[0.72rem] leading-relaxed">{bibtex}</pre>
      </details>
    </div>
  );
}

function ToolButton({ onClick, done, label }: { onClick: () => void; done: boolean; label: string }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex min-h-10 items-center gap-2 rounded-[3px] border border-ink/30 px-3 text-sm hover:border-ink">
      {done ? <Check className="size-4 text-accent-deep" aria-hidden /> : <Copy className="size-4" aria-hidden />}
      {done ? "Copié" : label}
    </button>
  );
}
