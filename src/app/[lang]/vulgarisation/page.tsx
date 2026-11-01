import Link from "@/i18n/Link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/editorial/PageHeader";
import { TransmettreTabs } from "@/components/vulgarisation/TransmettreTabs";
import { ModuleVisual } from "@/components/vulgarisation/ModuleVisual";
import { outreachModulesIn } from "@/data/vulgarisation";
import { copy } from "@/i18n/config";
import { getLang } from "@/i18n/server";
import { pageMetadata } from "@/lib/content/metadata";

export const generateMetadata = () =>
  pageMetadata({
    path: "/vulgarisation",
    fr: {
      title: "Vulgarisation",
      description:
        "De la population au modèle : comprendre pas à pas la dynamique des populations, la simulation, les modèles compartimentaux et individu-centrés, avec des exemples tirés des travaux de Marine A. Courtois.",
    },
    en: {
      title: "Outreach",
      description:
        "From population to model: a step-by-step introduction to population dynamics, simulation, compartmental and individual-based models, with examples from Marine A. Courtois's work.",
    },
  });

const COPY = copy({
  fr: {
    chapter: "Transmettre",
    kicker: "De la biologie aux modèles",
    title: "Comprendre une population, puis la modéliser.",
    intro:
      "Huit étapes, de la question la plus simple à la lecture d'un résultat de recherche. Chaque animation suit le mécanisme qu'elle illustre, et la plupart des étapes renvoient au travail de recherche dont elles sont tirées.",
    steps: "Les étapes",
  },
  en: {
    chapter: "Sharing knowledge",
    kicker: "From biology to models",
    title: "Understand a population, then model it.",
    intro:
      "Eight steps, from the simplest question to reading a research result. Each animation follows the mechanism it shows, and most steps lead to the research work they come from.",
    steps: "The steps",
  },
});

export default async function VulgarisationPage() {
  const lang = await getLang();
  const t = COPY[lang];
  const modules = outreachModulesIn(lang);
  return (
    <>
      <PageHeader chapter={t.chapter} kicker={t.kicker} title={t.title} intro={t.intro} />
      <TransmettreTabs current="/vulgarisation" />
      <div className="site-gutter mx-auto grid max-w-site gap-12 py-16 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-16">
        <nav aria-labelledby="sommaire" className="lg:sticky lg:top-28 lg:self-start">
          <h2 id="sommaire" className="text-sm text-muted">
            {t.steps}
          </h2>
          <ol className="mt-3 space-y-1">
            {modules.map((m, i) => (
              <li key={m.id}>
                <a href={`#${m.id}`} className="flex min-h-9 items-baseline gap-3 py-1 text-[0.95rem] hover:text-accent-deep">
                  <span className="font-serif text-accent-deep italic tabular-nums">{i + 1}</span>
                  {m.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div>
          {modules.map((m, i) => (
            <section key={m.id} id={m.id} aria-labelledby={`${m.id}-titre`} className="scroll-mt-24 border-t border-ink py-14 first:border-t-0 first:pt-0">
              <p className="font-serif text-2xl text-accent-deep italic">{i + 1}</p>
              <h2 id={`${m.id}-titre`} className="mt-1 font-serif text-title">
                {m.title}
              </h2>
              <p className="mt-4 max-w-3xl font-serif text-[1.45rem] leading-snug text-ink/90">{m.lede}</p>
              <div className="mt-5 max-w-3xl space-y-4 text-[1.05rem] leading-relaxed text-ink/85">
                {m.paragraphs.map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
              </div>
              <div className="mt-10">
                <ModuleVisual visual={m.visual} lang={lang} />
              </div>
              {m.next && (
                <Link href={m.next.href} className="link-underline mt-8 inline-flex items-center gap-2 py-1 font-serif text-xl">
                  {m.next.label} <ArrowRight className="size-4" aria-hidden />
                </Link>
              )}
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
