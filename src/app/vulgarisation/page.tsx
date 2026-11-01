import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/editorial/PageHeader";
import { TransmettreTabs } from "@/components/vulgarisation/TransmettreTabs";
import { ModuleVisual } from "@/components/vulgarisation/ModuleVisual";
import { OUTREACH_MODULES } from "@/data/vulgarisation";
import { pageMetadata } from "@/lib/content/metadata";

export const metadata = pageMetadata({
  title: "Vulgarisation",
  description: "De la population au modèle : comprendre pas à pas la dynamique des populations, la simulation, les modèles compartimentaux et individu-centrés, avec des exemples tirés des travaux de Marine A. Courtois.",
  path: "/vulgarisation",
});

export default function VulgarisationPage() {
  return (
    <>
      <PageHeader
        chapter="Transmettre"
        kicker="De la biologie aux modèles"
        title="Comprendre une population, puis la modéliser."
        intro="Huit étapes, de la question la plus simple à la lecture d'un résultat de recherche. Chaque animation suit le mécanisme qu'elle illustre, et chaque étape renvoie à un travail réel."
      />
      <TransmettreTabs current="/vulgarisation" />
      <div className="site-gutter mx-auto grid max-w-site gap-12 py-16 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-16">
        <nav aria-labelledby="sommaire" className="lg:sticky lg:top-28 lg:self-start">
          <h2 id="sommaire" className="text-sm text-muted">
            Les étapes
          </h2>
          <ol className="mt-3 space-y-1">
            {OUTREACH_MODULES.map((m, i) => (
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
          {OUTREACH_MODULES.map((m, i) => (
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
                <ModuleVisual visual={m.visual} />
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
