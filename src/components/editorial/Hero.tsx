import Link from "@/i18n/Link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Links";
import { HeroTitle } from "@/components/editorial/HeroTitle";
import { ToolPuzzle } from "@/components/puzzle/ToolPuzzle";
import { buildBoard, type Board } from "@/components/puzzle/board";
import type { CSSProperties } from "react";
import { activityAxesIn } from "@/data/axes";
import { RESEARCHER } from "@/data/researcher";

const LINKEDIN = RESEARCHER.profiles.find((p) => p.label === "LinkedIn")!;
import { copy, type Lang } from "@/i18n/config";
import { getLang } from "@/i18n/server";
import { a11yFor } from "@/i18n/locales";

const COPY = copy({
  fr: {
    intro:
      "Je comprends les systèmes biologiques par la modélisation, l'expérimentation numérique et l'analyse des données : des insectes ravageurs aux poissons d'eau douce, des équations différentielles au machine learning.",
    research: "Explorer mes recherches",
    questions:
      "Questions : quand la lutte biologique échoue-t-elle ? Que révèle la consommation d'un prédateur sur son caractère invasif ? Comment un comportement individuel change-t-il une population ?",
  },
  en: {
    intro:
      "I study biological systems through modelling, numerical experiments and data analysis: from insect pests to freshwater fish, from differential equations to machine learning.",
    research: "Explore my research",
    questions:
      "Questions: when does biological control fail? What does a predator's consumption reveal about its invasiveness? How does individual behaviour change a population?",
  },
});

function HeroIntro({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  return (
    <div className="relative min-w-0">
      <p className="text-sm leading-relaxed">
        <span className="block font-semibold">Marine A. Courtois</span>
        {RESEARCHER.role[lang]}{" "}
        <span className="whitespace-nowrap">
          <span className="text-accent-deep">—</span> <span className="font-semibold text-accent-deep">{RESEARCHER.speciality[lang]}</span>
        </span>
      </p>
      <HeroTitle />
      <p className="mt-7 max-w-[34rem] text-[1.06rem] leading-relaxed text-ink/85 md:text-lg">{t.intro}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href="/recherche">{t.research}</ButtonLink>
        <ButtonLink href="/publications" variant="secondary" icon={false}>
          Publications
        </ButtonLink>
      </div>
      <p className="mt-8 max-w-[34rem] text-sm leading-relaxed text-muted">{t.questions}</p>
      <a href={LINKEDIN.url} target="_blank" rel="noopener noreferrer" className="link-underline mt-5 inline-flex items-center gap-1.5 py-1 text-sm">
        LinkedIn <ArrowUpRight className="size-3.5" aria-hidden />
      </a>
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

function AxesIndex({ lang }: { lang: Lang }) {
  return (
    <nav id="axes" aria-label={a11yFor(lang).axesDActivite} className="site-gutter mx-auto max-w-site scroll-mt-24">
      <ol className="grid border-y border-ink sm:grid-cols-2 lg:grid-cols-4">
        {activityAxesIn(lang).map((axis, i) => (
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

/**
 * The board never grows taller than the screen: on large screens its width is
 * capped so the whole board and its caption fit under the header.
 */
function PuzzleFrame({ board }: { board: Board }) {
  const ratio = (board.view.width / board.view.height).toFixed(4);
  return (
    <div
      style={{ "--pz-ratio": ratio } as CSSProperties}
      className="mx-auto w-full max-w-[34rem] min-w-0 lg:mr-0 lg:max-w-[min(100%,max(24rem,calc((100svh_-_11rem)*var(--pz-ratio))))]"
    >
      <ToolPuzzle board={board} />
    </div>
  );
}

export async function Hero() {
  const lang = await getLang();
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      <div className="site-gutter mx-auto max-w-site">
        <div className="grid items-center gap-12 pt-8 pb-14 md:pt-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14 lg:pt-14">
          <HeroIntro lang={lang} />
          <PuzzleFrame board={buildBoard(lang)} />
        </div>
      </div>
      <AxesIndex lang={lang} />
    </section>
  );
}
