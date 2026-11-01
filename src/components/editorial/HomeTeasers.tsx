import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { THESIS, THESIS_CHAPTERS } from "@/data/thesis";
import { getPublication } from "@/data/publications";
import { Kicker } from "@/components/ui/Kicker";
import { ButtonLink } from "@/components/ui/Links";
import { FIGURES, REPOSITORIES, fileUrl } from "@/data/code";
import type { Figure, ThesisChapter } from "@/types/content";

const pubFor = (ids: string[]) => ids.map((id) => getPublication(id)).find((p) => p?.publicationType === "article");

/** Homepage digest of the thesis: one screen, facts on the left, the table of contents on the right. */
export function ThesisCompact() {
  return (
    <section id="these" aria-labelledby="these-titre" className="on-dark scroll-mt-20 bg-antibes text-paper">
      <div className="site-gutter mx-auto grid max-w-site gap-12 py-20 md:py-24 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Kicker accent="Chapitre 04">Doctorat</Kicker>
          <h2 id="these-titre" className="mt-6 font-serif text-[clamp(2rem,3.4vw,2.9rem)] leading-[1.05]">
            Trois années pour comprendre les limites d&apos;une stratégie de lutte biologique.
          </h2>
          <p className="mt-5 max-w-md leading-relaxed text-paper/85">
            La technique de l&apos;insecte stérile, et les facteurs biologiques et techniques qui en limitent l&apos;efficacité.
          </p>
          <ThesisFacts />
          <ThesisActions />
          <ThesisResourceLinks />
        </div>

        <ThesisContents />
      </div>
    </section>
  );
}

function ThesisFacts() {
  return (
    <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-paper/20 pt-5 text-sm">
      <div>
        <dt className="text-xs text-mist">Université</dt>
        <dd className="mt-0.5">{THESIS.institution}</dd>
      </div>
      <div>
        <dt className="text-xs text-mist">Soutenance</dt>
        <dd className="mt-0.5 tabular-nums">{THESIS.defenseLabel}</dd>
      </div>
      <div className="col-span-2">
        <dt className="text-xs text-mist">Encadrement</dt>
        <dd className="mt-0.5 text-paper/85">{THESIS.supervisors.join(", ")}</dd>
      </div>
    </dl>
  );
}

function ThesisActions() {
  return (
    <div className="mt-8 flex flex-wrap gap-3">
      <ButtonLink href={THESIS.resources[0].url} variant="primary-dark">
        Lire le manuscrit
      </ButtonLink>
      <ButtonLink href="/these" variant="ghost-dark">
        Explorer la thèse
      </ButtonLink>
    </div>
  );
}

function ThesisResourceLinks() {
  return (
    <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-1 text-sm text-paper/80">
      {THESIS.resources.slice(1).map((r) => (
        <li key={r.url}>
          <a href={r.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 py-1.5 hover:text-paper">
            {r.label}
            <ArrowUpRight className="size-3.5" aria-hidden />
            <span className="sr-only">(nouvel onglet)</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

function ThesisContents() {
  return (
    <div className="lg:col-span-7">
      <p className="text-xs text-mist">Sommaire du manuscrit</p>
      <ol className="mt-3 border-t border-paper/20">
        {THESIS_CHAPTERS.map((c) => (
          <ThesisChapterRow key={c.number} chapter={c} />
        ))}
      </ol>
    </div>
  );
}

function ThesisChapterRow({ chapter: c }: { chapter: ThesisChapter }) {
  const pub = pubFor(c.publicationIds);
  return (
    <li className="border-b border-paper/15">
      <Link href="/these" className="group grid grid-cols-[2.75rem_1fr_auto] items-center gap-4 py-4 transition-colors duration-300 hover:bg-antibes-2 sm:px-3">
        <span className="font-serif text-[2.1rem] leading-none text-azur italic tabular-nums">{c.number}</span>
        <span className="min-w-0">
          <span className="block font-serif text-[1.3rem] leading-tight">{c.titleFr}</span>
          <span className="mt-0.5 block truncate text-xs text-paper/70">{c.question}</span>
        </span>
        <span className="flex items-center gap-3">
          {pub && <span className="hidden bg-paper/10 px-2 py-1 text-xs text-paper/90 sm:inline">{pub.journal?.replace("Computational Biology", "Comp. Biol.")} {pub.year}</span>}
          <ArrowRight className="size-4 text-paper/60 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-paper" aria-hidden />
        </span>
      </Link>
    </li>
  );
}

const WALL = ["fig-ch2-cobweb", "fig-ch3-dynamics", "fig-ch4-first-last", "fig-ch4-abm", "fig-ch5-impulsive", "fig-ch2-bifurcation"];

/** A wall of the real figures produced by the public notebooks, each linking to its source file. */
export function FigureWall() {
  const figures = WALL.map((id) => FIGURES.find((f) => f.id === id)).filter((f) => f !== undefined);
  return (
    <div>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {figures.map((f, i) => (
          <li key={f.id} className={i === 2 || i === 3 ? "lg:col-span-1" : undefined}>
            <FigureTile figure={f} />
          </li>
        ))}
      </ul>
      <RepositoryLinks />
      <Link href="/laboratoire#code" className="group mt-8 inline-flex items-center gap-2 font-serif text-xl hover:text-accent-deep">
        Ouvrir l&apos;explorateur de code
        <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
      </Link>
    </div>
  );
}

function FigureTile({ figure: f }: { figure: Figure }) {
  return (
    <a href={fileUrl(f.repository, f.notebook)} target="_blank" rel="noopener noreferrer" className="plate group block">
      <span className="block overflow-hidden bg-white p-3">
        <Image
          src={f.src}
          alt={f.alt}
          width={f.width}
          height={f.height}
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
          className="plate-img aspect-[4/3] h-auto w-full object-contain"
        />
      </span>
      <span className="mt-3 flex items-start justify-between gap-3">
        <span className="text-sm leading-snug text-ink/85">{f.caption}</span>
        <ArrowUpRight className="mt-0.5 size-4 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
      </span>
      <span className="mono-meta mt-1 block text-muted">{f.notebook.split("/").at(-1)}</span>
      <span className="sr-only">(nouvel onglet)</span>
    </a>
  );
}

function RepositoryLinks() {
  return (
    <div className="mt-12 grid gap-px bg-ink/15 sm:grid-cols-2">
      {Object.values(REPOSITORIES).map((r) => (
        <a key={r.name} href={r.url} target="_blank" rel="noopener noreferrer" className="group bg-paper p-5 transition-colors hover:bg-stone">
          <span className="flex items-center gap-2 font-serif text-2xl">
            {r.name}
            <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
          </span>
          <span className="mt-1 block text-sm text-muted">{r.description}</span>
        </a>
      ))}
    </div>
  );
}
