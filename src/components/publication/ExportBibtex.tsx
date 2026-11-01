"use client";

import { Download } from "lucide-react";
import { copy } from "@/i18n/config";
import { useLang } from "@/i18n/client";

const COPY = copy({
  fr: { label: "Exporter toutes les références (BibTeX)" },
  en: { label: "Export all references (BibTeX)" },
});

/** Downloads every publication as one .bib file. */
export function ExportBibtex({ bibtex, fileName = "courtois-publications.bib" }: { bibtex: string; fileName?: string }) {
  const t = COPY[useLang()];
  const download = () => {
    const url = URL.createObjectURL(new Blob([bibtex], { type: "application/x-bibtex" }));
    const a = Object.assign(document.createElement("a"), { href: url, download: fileName });
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <button type="button" onClick={download} className="inline-flex min-h-11 items-center gap-2 rounded-[3px] border border-ink/60 px-4 text-sm hover:bg-ink hover:text-paper">
      <Download className="size-4" aria-hidden /> {t.label}
    </button>
  );
}
