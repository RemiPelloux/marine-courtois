"use client";

import { useState } from "react";
import { Check, Copy, Download } from "lucide-react";
import { copy } from "@/i18n/config";
import { useLang } from "@/i18n/client";

const COPY = copy({
  fr: {
    copyRef: "Copier la référence",
    copyBib: "Copier le BibTeX",
    copied: "Copié",
    status: "Copié dans le presse-papiers",
    show: "Voir l'entrée BibTeX",
  },
  en: {
    copyRef: "Copy the reference",
    copyBib: "Copy the BibTeX",
    copied: "Copied",
    status: "Copied to the clipboard",
    show: "Show the BibTeX entry",
  },
});

/** `workLang` is the language of the cited work: the reference and BibTeX keep its original title. */
type Props = { reference: string; bibtex: string; fileName: string; workLang: "fr" | "en" };

/** Copy the reference or the BibTeX entry, or download it as a .bib file. */
export function CitationTools({ reference, bibtex, fileName, workLang }: Props) {
  const [copied, setCopied] = useState<"ref" | "bib" | null>(null);
  const t = COPY[useLang()];
  const copyText = async (what: "ref" | "bib") => {
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
      <p className="text-sm leading-relaxed text-ink/85" lang={workLang}>
        {reference}
      </p>
      <div className="flex flex-wrap gap-2">
        <ToolButton onClick={() => copyText("ref")} done={copied === "ref"} label={t.copyRef} doneLabel={t.copied} />
        <ToolButton onClick={() => copyText("bib")} done={copied === "bib"} label={t.copyBib} doneLabel={t.copied} />
        <button type="button" onClick={download} className="inline-flex min-h-10 items-center gap-2 rounded-[3px] border border-ink/30 px-3 text-sm hover:border-ink">
          <Download className="size-4" aria-hidden /> .bib
        </button>
      </div>
      <p role="status" className="sr-only">
        {copied ? t.status : ""}
      </p>
      <details className="text-xs">
        <summary className="cursor-pointer py-1 text-muted hover:text-ink">{t.show}</summary>
        <pre lang={workLang} className="mt-2 overflow-x-auto bg-stone p-3 font-mono text-[0.72rem] leading-relaxed">{bibtex}</pre>
      </details>
    </div>
  );
}

type ToolButtonProps = { onClick: () => void; done: boolean; label: string; doneLabel: string };

function ToolButton({ onClick, done, label, doneLabel }: ToolButtonProps) {
  return (
    <button type="button" onClick={onClick} className="inline-flex min-h-10 items-center gap-2 rounded-[3px] border border-ink/30 px-3 text-sm hover:border-ink">
      {done ? <Check className="size-4 text-accent-deep" aria-hidden /> : <Copy className="size-4" aria-hidden />}
      {done ? doneLabel : label}
    </button>
  );
}
