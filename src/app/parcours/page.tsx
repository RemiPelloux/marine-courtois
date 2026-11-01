import { a11y } from "@/i18n";
import { PageHeader } from "@/components/editorial/PageHeader";
import { ScrubText } from "@/components/editorial/ScrubText";
import { SectionHeading } from "@/components/editorial/SectionHeading";
import { SourceNote } from "@/components/scientific/SourceNote";
import { ButtonLink } from "@/components/ui/Links";
import { CareerPuzzle } from "@/components/parcours/CareerPuzzle";
import { Chronology } from "@/components/parcours/Chronology";
import { buildCareerBoard } from "@/components/parcours/board";
import { EXPERIENCES } from "@/data/experiences";
import { RESEARCHER } from "@/data/researcher";
import { THESIS } from "@/data/thesis";
import { pageMetadata } from "@/lib/content/metadata";

export const metadata = pageMetadata({
  title: "Parcours",
  description:
    "Le parcours de Marine A. Courtois, docteure de l'Université Côte d'Azur : doctorat INRAE, collaborations, publications, communications et compétences, pièce par pièce.",
  path: "/parcours",
});

const BIO = [
  "Je suis Marine A. Courtois, docteure de l'Université Côte d'Azur. Mon parcours s'est construit autour d'une question : comment les mathématiques aident-elles à comprendre les systèmes biologiques ?",
  "Ma thèse, menée dans l'environnement de l'Institut Sophia Agrobiotech, porte sur la technique de l'insecte stérile, une stratégie de lutte biologique qui réduit les populations de ravageurs en perturbant leur reproduction. Elle m'a conduite à étudier la fertilité résiduelle, les accouplements multiples et les biais d'utilisation du sperme, avec des équations différentielles et des simulations individu-centrées.",
  "En parallèle, une collaboration avec une équipe lyonnaise m'a amenée vers l'écologie des invasions : une analyse comparative bayésienne des réponses fonctionnelles de 45 espèces de poissons d'eau douce.",
];

export default function ParcoursPage() {
  return (
    <>
      <PageHeader
        chapter="Parcours"
        kicker={RESEARCHER.title}
        title="Une démarche qui s'assemble pièce à pièce."
        intro="Chaque pièce est un jalon vérifiable : le doctorat, les collaborations, les articles, les congrès et les compétences qu'ils ont construites. La feuille pousse de la tige, en 2022, jusqu'à sa pointe."
      />
      <section aria-labelledby="feuille" className="site-gutter mx-auto max-w-site py-16 md:py-20">
        <h2 id="feuille" className="sr-only">
          Le parcours en puzzle
        </h2>
        <CareerPuzzle board={buildCareerBoard()} />
      </section>
      <section aria-labelledby="chronologie" className="border-t border-ink bg-stone">
        <div className="site-gutter mx-auto max-w-site py-20">
          <SectionHeading title={<span id="chronologie">Lecture chronologique.</span>} size="title" intro="Les mêmes pièces, dans l'ordre, avec leur source." className="mb-12" />
          <Chronology list={EXPERIENCES} />
          <SourceNote className="mt-12" ids={["orcidEmployment", "thesesFr", "hal", "inriaReport", "pubRF", "pubPolyandry", "pubInvasion"]} />
        </div>
      </section>
      <section aria-label={a11y.biographie} className="site-gutter mx-auto max-w-site py-20">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-7">
            <ScrubText className="font-serif text-[1.9rem] leading-snug" text={BIO[0]} />
            {BIO.slice(1).map((p) => (
              <p key={p.slice(0, 24)} className="text-lg leading-relaxed text-ink/85">
                {p}
              </p>
            ))}
          </div>
          <aside className="space-y-8 lg:col-span-4 lg:col-start-9">
            <dl className="divide-y divide-rule border-y border-ink">
              <div className="py-4">
                <dt className="text-sm text-muted">Doctorat</dt>
                <dd className="mt-1 font-serif text-xl">{RESEARCHER.doctorate.institution}</dd>
                <dd className="tabular-nums text-sm text-muted">Soutenance le {RESEARCHER.doctorate.defenseLabel}</dd>
              </div>
              <div className="py-4">
                <dt className="text-sm text-muted">Environnement de recherche</dt>
                <dd className="mt-1">{RESEARCHER.doctorate.environment}</dd>
              </div>
              <div className="py-4">
                <dt className="text-sm text-muted">Encadrement de thèse</dt>
                <dd className="mt-1 text-sm">{THESIS.supervisors.join(", ")}</dd>
              </div>
            </dl>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href="/contact">Prendre contact</ButtonLink>
              <ButtonLink href={RESEARCHER.profiles[0].url} variant="secondary">
                ORCID
              </ButtonLink>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
