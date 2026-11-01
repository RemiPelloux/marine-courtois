import type { ReactNode } from "react";
import { a11y } from "@/i18n";
import type { Depth } from "@/data/publication-depth";

/**
 * Three reading depths on one page. A sticky index lets a researcher jump
 * straight to "Approfondir"; nothing is hidden behind a modal.
 */
export function DepthSections({ depth, modules }: { depth: Depth; modules: { discover?: ReactNode; understand?: ReactNode; deepen?: ReactNode } }) {
  return (
    <div className="border-t border-ink">
      <DepthIndex />
      <DepthBlock id="decouvrir" step="Découvrir" question={depth.discover.question}>
        <p className="max-w-3xl text-xl leading-relaxed">{depth.discover.text}</p>
        {modules.discover && <div className="mt-10">{modules.discover}</div>}
      </DepthBlock>
      <DepthBlock id="comprendre" step="Comprendre" question={depth.understand.question}>
        <div className="max-w-3xl space-y-4 text-lg leading-relaxed text-ink/85">
          {depth.understand.paragraphs.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>
        {modules.understand && <div className="mt-10">{modules.understand}</div>}
      </DepthBlock>
      <DepthBlock id="approfondir" step="Approfondir" question="Modèle, hypothèses, résultats et limites.">
        <p className="max-w-3xl text-lg leading-relaxed text-ink/85">{depth.deepen.model}</p>
        <div className="mt-10 grid gap-10 md:grid-cols-3">
          <List title="Hypothèses" items={depth.deepen.hypotheses} />
          <List title="Résultats publiés" items={depth.deepen.results} />
          <List title="Limites" items={depth.deepen.limits} />
        </div>
        {modules.deepen && <div className="mt-12">{modules.deepen}</div>}
      </DepthBlock>
    </div>
  );
}

function DepthIndex() {
  const steps = [
    { id: "decouvrir", label: "Découvrir" },
    { id: "comprendre", label: "Comprendre" },
    { id: "approfondir", label: "Approfondir" },
  ];
  return (
    <nav aria-label={a11y.niveauxDeLecture} className="sticky top-[4.5rem] z-20 -mx-[var(--gutter,0px)] border-b border-ink/15 bg-paper/95 backdrop-blur-sm md:top-20">
      <ol className="flex gap-6 overflow-x-auto py-3 text-sm">
        {steps.map((s, i) => (
          <li key={s.id} className="shrink-0">
            <a href={`#${s.id}`} className="inline-flex min-h-8 items-center gap-2 hover:text-accent-deep">
              <span className="font-serif text-lg text-accent-deep italic">{i + 1}</span> {s.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function DepthBlock({ id, step, question, children }: { id: string; step: string; question: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-titre`} className="scroll-mt-36 border-b border-ink/15 py-16 md:py-20">
      <p className="text-sm text-accent-deep">{step}</p>
      <h2 id={`${id}-titre`} className="mt-3 max-w-4xl font-serif text-title leading-tight">
        {question}
      </h2>
      <div className="mt-8">{children}</div>
    </section>
  );
}

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="border-t-2 border-antibes pt-3 font-serif text-2xl">{title}</h3>
      <ul className="mt-4 space-y-3 text-[0.98rem] leading-relaxed text-ink/85">
        {items.map((it) => (
          <li key={it.slice(0, 30)}>{it}</li>
        ))}
      </ul>
    </div>
  );
}
