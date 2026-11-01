"use client";

import Link from "@/i18n/Link";
import { ArrowRight } from "lucide-react";
import { copy } from "@/i18n/config";
import { useLang } from "@/i18n/client";
import { SpeciesText } from "@/components/ui/Species";
import { DOMAIN_FILL } from "@/components/parcours/CompetencePiece";
import type { CompetencePiece, DomainBlock } from "@/components/parcours/board";

const COPY = copy({
  fr: {
    selected: (title: string, n: number) => `${title} : ${n} compétences`,
    ongoing: "en cours",
    unpublished: "Travail en cours, pas encore publié.",
    hint: "Cliquez sur un domaine, ou passez de l'un à l'autre avec les flèches du clavier.",
  },
  en: {
    selected: (title: string, n: number) => `${title}: ${n} competences`,
    ongoing: "in progress",
    unpublished: "Work in progress, not yet published.",
    hint: "Click a domain, or move between domains with the arrow keys.",
  },
});

type T = (typeof COPY)["fr"];

/** The selected domain: each competence, what it covers, and where it is used. */
export function DomainPanel({ domain, className }: { domain: DomainBlock; className?: string }) {
  const t = COPY[useLang()];
  return (
    <div id="competences-panel" className={className}>
      <p className="sr-only" aria-live="polite">
        {t.selected(domain.title, domain.pieces.length)}
      </p>
      <h3 className="flex items-baseline gap-3 font-serif text-[2rem] leading-[1.08]">
        <span className="size-3.5 shrink-0 self-center border border-ink/25" style={{ background: DOMAIN_FILL[domain.id].fill }} aria-hidden />
        {domain.title}
      </h3>
      <p className="mt-1 text-[1.02rem] text-muted">{domain.subtitle}</p>
      <ul className="mt-6 divide-y divide-rule border-y border-ink">
        {domain.pieces.map((p) => (
          <CompetenceItem key={p.id} piece={p} t={t} />
        ))}
      </ul>
      <p className="mt-5 text-sm text-muted">{t.hint}</p>
    </div>
  );
}

function CompetenceItem({ piece: p, t }: { piece: CompetencePiece; t: T }) {
  return (
    <li className="py-4">
      <p className="font-serif text-xl leading-snug">
        {p.title}
        {p.ongoing && <span className="ml-2 inline-block border border-ink/30 px-1.5 align-middle font-sans text-xs text-muted">{t.ongoing}</span>}
      </p>
      <p className="mt-1 text-[0.95rem] leading-relaxed text-ink/80">
        <SpeciesText text={p.detail} />
      </p>
      {p.uses.length > 0 ? (
        <ul className="mt-1.5 flex flex-wrap gap-x-5 text-sm">
          {p.uses.map((u) => (
            <li key={u.label}>
              <Link href={u.href} className="link-underline inline-flex items-center gap-1.5 py-1 text-accent-deep">
                {u.label} <ArrowRight className="size-3.5" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-1.5 text-sm text-muted">{t.unpublished}</p>
      )}
    </li>
  );
}
