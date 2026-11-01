import { a11y } from "@/i18n";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Links";
import { HeroTitle } from "@/components/editorial/HeroTitle";
import { ToolPuzzle } from "@/components/puzzle/ToolPuzzle";
import { buildBoard } from "@/components/puzzle/board";
import { ACTIVITY_AXES } from "@/data/axes";

function HeroIntro() {
  return (
    <div className="relative min-w-0">
      <p className="text-sm">
        <span className="font-semibold">Marine A. Courtois</span>
        <span className="mx-2 text-accent-deep">—</span>
        Docteure en biologie mathématique
      </p>
      <HeroTitle />
      <p className="mt-7 max-w-[34rem] text-[1.06rem] leading-relaxed text-ink/85 md:text-lg">
        Je cherche à comprendre les systèmes biologiques par la modélisation, l&apos;expérimentation numérique et l&apos;analyse des
        données : des insectes ravageurs aux poissons d&apos;eau douce, des équations différentielles au machine learning.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href="/recherche">Explorer mes recherches</ButtonLink>
        <ButtonLink href="/publications" variant="secondary" icon={false}>
          Publications
        </ButtonLink>
      </div>
      <p className="mt-8 max-w-[34rem] text-sm leading-relaxed text-muted">
        Questions : quand la lutte biologique échoue-t-elle ? Que révèle la consommation d&apos;un prédateur sur son caractère invasif ?
        Comment un comportement individuel change-t-il une population ?
      </p>
    </div>
  );
}

/** Rules between index cells: stacked on mobile, 2 × 2 on small screens, one row on large ones. */
function indexItemClass(i: number) {
  return (
    "border-ink/80 " +
    (i > 0 ? "border-t sm:border-t-0 " : "") +
    (i % 2 === 1 ? "sm:border-l " : "") +
    (i >= 2 ? "sm:border-t lg:border-t-0 " : "") +
    (i > 0 ? "lg:border-l" : "")
  );
}

function AxesIndex() {
  return (
    <nav id="axes" aria-label={a11y.axesDActivite} className="site-gutter mx-auto max-w-site scroll-mt-24">
      <ol className="grid border-y border-ink sm:grid-cols-2 lg:grid-cols-4">
        {ACTIVITY_AXES.map((axis, i) => (
          <li key={axis.id} className={indexItemClass(i)}>
            <Link href={axis.href} className="group flex h-full flex-col gap-2 px-1 py-6 sm:px-6 lg:py-7">
              <span className="flex items-center justify-between gap-4">
                <span className="font-serif text-[1.9rem] leading-tight">{axis.label}</span>
                <ArrowRight className="size-5 shrink-0 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
              </span>
              <span className="text-sm leading-snug text-muted">{axis.summary}</span>
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      <div className="site-gutter mx-auto max-w-site">
        <div className="grid items-center gap-12 pt-8 pb-14 md:pt-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14 lg:pt-14">
          <HeroIntro />
          <div className="mx-auto w-full max-w-[36rem] min-w-0 lg:max-w-none">
            <ToolPuzzle board={buildBoard()} />
          </div>
        </div>
      </div>
      <AxesIndex />
    </section>
  );
}
