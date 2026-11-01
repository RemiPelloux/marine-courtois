import { a11y } from "@/i18n";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Links";
import { LivingSystem } from "@/components/visualizations/LivingSystem";
import { HeroTitle } from "@/components/editorial/HeroTitle";

const HERO_INDEX = [
  { n: "01", title: "Recherche", text: "Ravageurs agricoles, espèces invasives et contrôle des populations.", href: "/recherche" },
  { n: "02", title: "Méthodes", text: "Modélisation, simulation et analyse : de la question au modèle.", href: "/methodes" },
  { n: "03", title: "Publications", text: "Articles, thèse et communications scientifiques.", href: "/publications" },
  { n: "04", title: "Code & reproductibilité", text: "Notebooks, scripts et données de recherche.", href: "/laboratoire#code" },
];

function indexItemClass(i: number) {
  return (
    "border-ink/80 " +
    (i > 0 ? "border-t sm:border-t-0 " : "") +
    (i % 2 === 1 ? "sm:border-l " : "") +
    (i >= 2 ? "sm:border-t lg:border-t-0 " : "") +
    (i > 0 ? "lg:border-l" : "")
  );
}

function HeroIntro() {
  return (
    <div className="relative min-w-0 flex-1">
      <p className="label text-xs sm:text-xs">
        <span className="font-semibold">Marine A. Courtois</span>
        <span className="mx-2 text-accent-deep">—</span>
        Biologie mathématique
      </p>
      <HeroTitle />
      <p className="mt-7 max-w-[34rem] text-[1.06rem] leading-relaxed text-ink/85 md:text-lg">
        Je développe et analyse des modèles mathématiques pour explorer les dynamiques du vivant, comprendre
        les mécanismes écologiques et étudier les stratégies de contrôle des populations.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href="/recherche">Explorer mes recherches</ButtonLink>
        <ButtonLink href="/publications" variant="secondary" icon={false}>
          Découvrir mes publications
        </ButtonLink>
      </div>
      <p className="mono-meta mt-8 text-muted">
        Mathématiques appliquées <span className="text-accent-deep">/</span> Dynamique des populations{" "}
        <span className="text-accent-deep">/</span> Écologie
      </p>
    </div>
  );
}

function HeroIndex() {
  return (
    <nav aria-label={a11y.indexDeLAtlas} className="site-gutter mx-auto max-w-site">
      <ol className="grid border-y border-ink sm:grid-cols-2 lg:grid-cols-4">
        {HERO_INDEX.map((item, i) => (
          <li key={item.n} className={indexItemClass(i)}>
            <Link href={item.href} className="group flex h-full flex-col gap-2 px-1 py-6 sm:px-6 lg:py-7">
              <span className="font-serif text-3xl text-accent-deep italic">{item.n}</span>
              <span className="flex items-center justify-between gap-4">
                <span className="font-serif text-[1.7rem] leading-tight">{item.title}</span>
                <ArrowRight className="size-5 shrink-0 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
              </span>
              <span className="text-sm leading-snug text-muted">{item.text}</span>
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
        <div className="grid gap-10 pt-8 pb-10 md:pt-12 lg:grid-cols-[minmax(0,45fr)_minmax(0,55fr)] lg:gap-10 lg:pt-14 xl:gap-14">
          {/* left column */}
          <div className="relative flex gap-6 lg:gap-8">
            <HeroIntro />
          </div>

          {/* right column — living system */}
          <div className="min-w-0 lg:pt-2">
            <LivingSystem />
          </div>
        </div>
      </div>

      {/* four-part index */}
      <HeroIndex />
    </section>
  );
}
