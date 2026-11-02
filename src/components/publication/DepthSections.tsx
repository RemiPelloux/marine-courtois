import type { ReactNode } from "react";
import { copy } from "@/i18n/config";
import { getA11y, getLang } from "@/i18n/server";
import { SpeciesText } from "@/components/ui/Species";
import type { Depth } from "@/data/publication-depth";

const COPY = copy({
  fr: {
    discover: "Découvrir",
    understand: "Comprendre",
    deepen: "Approfondir",
    deepenQuestion: "Modèle, hypothèses, résultats et limites.",
    hypotheses: "Hypothèses",
    results: "Résultats publiés",
    limits: "Limites",
  },
  en: {
    discover: "Discover",
    understand: "Understand",
    deepen: "Go deeper",
    deepenQuestion: "Model, assumptions, results and limits.",
    hypotheses: "Assumptions",
    results: "Published results",
    limits: "Limits",
  },
});

type Modules = { discover?: ReactNode; understand?: ReactNode; deepen?: ReactNode };

/**
 * Three reading depths on one page. A sticky index lets a researcher jump
 * straight to the deepest level; nothing is hidden behind a modal.
 */
export async function DepthSections({ depth, modules }: { depth: Depth; modules: Modules }) {
  const t = COPY[await getLang()];
  return (
    <div className="border-t border-ink">
      <DepthIndex steps={[t.discover, t.understand, t.deepen]} label={(await getA11y()).niveauxDeLecture} />
      <DepthBlock id="decouvrir" step={t.discover} question={depth.discover.question}>
        <p className="max-w-3xl text-xl leading-relaxed">
          <SpeciesText text={depth.discover.text} />
        </p>
        {modules.discover && <div className="mt-10">{modules.discover}</div>}
      </DepthBlock>
      <DepthBlock id="comprendre" step={t.understand} question={depth.understand.question}>
        <div className="max-w-3xl space-y-4 text-lg leading-relaxed text-ink/85">
          {depth.understand.paragraphs.map((p) => (
            <p key={p.slice(0, 24)}>
              <SpeciesText text={p} />
            </p>
          ))}
        </div>
        {modules.understand && <div className="mt-10">{modules.understand}</div>}
      </DepthBlock>
      <DepthBlock id="approfondir" step={t.deepen} question={t.deepenQuestion}>
        <p className="max-w-3xl text-lg leading-relaxed text-ink/85">
          <SpeciesText text={depth.deepen.model} />
        </p>
        <div className="mt-10 grid gap-10 md:grid-cols-3">
          <List title={t.hypotheses} items={depth.deepen.hypotheses} />
          <List title={t.results} items={depth.deepen.results} />
          <List title={t.limits} items={depth.deepen.limits} />
        </div>
        {modules.deepen && <div className="mt-12">{modules.deepen}</div>}
      </DepthBlock>
    </div>
  );
}

const STEP_IDS = ["decouvrir", "comprendre", "approfondir"];

function DepthIndex({ steps, label }: { steps: string[]; label: string }) {
  return (
    <nav aria-label={label} className="sticky top-[4.5rem] z-20 -mx-[var(--gutter,0px)] border-b border-ink/15 bg-paper/95 backdrop-blur-sm md:top-20">
      <ol className="flex gap-6 overflow-x-auto py-3 text-sm">
        {steps.map((s, i) => (
          <li key={STEP_IDS[i]} className="shrink-0">
            <a href={`#${STEP_IDS[i]}`} className="inline-flex min-h-8 items-center gap-2 hover:text-accent-deep">
              <span className="font-serif text-lg text-accent-deep italic">{i + 1}</span> {s}
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
      <ul className="mt-4 space-y-3 text-note leading-relaxed text-ink/85">
        {items.map((it) => (
          <li key={it.slice(0, 30)}>
            <SpeciesText text={it} />
          </li>
        ))}
      </ul>
    </div>
  );
}
