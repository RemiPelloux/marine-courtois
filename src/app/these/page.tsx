import Link from "next/link";
import { ThesisChapter } from "@/components/editorial/Chapters";
import { SectionHeading } from "@/components/editorial/SectionHeading";
import { SourceNote } from "@/components/scientific/SourceNote";
import { ButtonLink } from "@/components/ui/Links";
import { THESIS } from "@/data/thesis";
import { getPublication } from "@/data/publications";
import { pageMetadata } from "@/lib/content/metadata";

export const metadata = pageMetadata({
  title: "Thèse",
  description:
    "Modélisation de la technique de l'insecte stérile dans un contexte agricole — thèse de doctorat soutenue le 27 novembre 2025 à l'Université Côte d'Azur.",
  path: "/these",
});

const NARRATIVE = [
  { k: "Contexte scientifique", v: "La technique de l'insecte stérile, une stratégie de lutte biologique visant à réduire les populations de ravageurs en perturbant leur reproduction." },
  { k: "Mécanismes biologiques", v: "Fertilité résiduelle des mâles relâchés, accouplements multiples des femelles et règles d'utilisation du sperme." },
  { k: "Contraintes techniques", v: "Lâchers discrets, budget limité, compromis entre fréquence et intensité, qualité des fruits." },
  { k: "Approche mathématique", v: "Équations différentielles ordinaires, analyse des équilibres et des bifurcations, modèles impulsionnels." },
  { k: "Approche computationnelle", v: "Modèle individu-centré en Python (Mesa), simulations répétées, analyse de sensibilité, notebooks reproductibles." },
];

export default function ThesisPage() {
  const related = ["pub-2025-residual-fertility", "pub-2026-polyandry"].map((id) => getPublication(id)!);
  return (
    <>
      <ThesisChapter headingLevel="h1" />
      <section aria-labelledby="question" className="site-gutter mx-auto max-w-site py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <SectionHeading kicker="La question" title={<span id="question">{THESIS.intro[0]}</span>} size="title" />
            <p className="mt-8 text-lg leading-relaxed text-ink/85">{THESIS.intro[1]}</p>
          </div>
          <dl className="divide-y divide-rule border-y border-ink lg:col-span-5 lg:col-start-8">
            {NARRATIVE.map((n) => (
              <div key={n.k} className="py-4">
                <dt className="font-serif text-xl">{n.k}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-muted">{n.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
      <section aria-labelledby="pubs-these" className="border-t border-ink bg-stone">
        <div className="site-gutter mx-auto grid max-w-site gap-10 py-20 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading kicker="Publications issues de la thèse" title={<span id="pubs-these">Deux chapitres, deux articles.</span>} size="title" />
          </div>
          <ul className="grid gap-px bg-ink/15 sm:grid-cols-2 lg:col-span-8">
            {related.map((p) => (
              <li key={p.id} className="bg-stone p-6">
                <p className="mono-meta text-muted">{p.journal} · {p.year}</p>
                <Link href={`/publications/${p.slug}`} className="mt-2 block font-serif text-2xl leading-snug hover:text-accent-deep">
                  {p.editorialTitle}
                </Link>
                <p className="mt-2 text-sm text-ink/70 italic" lang="en">{p.title}</p>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3 lg:col-span-8 lg:col-start-5">
            <ButtonLink href={THESIS.resources[0].url}>Lire le manuscrit</ButtonLink>
            <ButtonLink href="/laboratoire#code" variant="secondary">Explorer le code de la thèse</ButtonLink>
          </div>
        </div>
      </section>
      <div className="site-gutter mx-auto max-w-site py-10">
        <SourceNote ids={["thesesFr", "thesisDoi", "gitThesis", "inriaReport", "orcid"]} />
      </div>
    </>
  );
}
