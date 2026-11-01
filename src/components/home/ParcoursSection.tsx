import { SectionHeading } from "@/components/editorial/SectionHeading";
import { CareerPuzzle } from "@/components/parcours/CareerPuzzle";
import { buildCareerBoard } from "@/components/parcours/board";
import { ButtonLink } from "@/components/ui/Links";

/** The career leaf, as an overview: the full chronology lives on /parcours. */
export function ParcoursSection() {
  return (
    <section aria-labelledby="parcours-titre" className="site-gutter mx-auto max-w-site scroll-mt-20 py-24 md:py-32">
      <SectionHeading
        title={<span id="parcours-titre">Un parcours qui pousse pièce à pièce.</span>}
        intro="Du premier poster en 2022 aux articles de 2026 : chaque pièce de la feuille est un jalon vérifiable."
        className="mb-12"
      />
      <CareerPuzzle board={buildCareerBoard()} initial="soutenance" />
      <div className="mt-12">
        <ButtonLink href="/parcours" variant="secondary">
          Tout le parcours, en lecture chronologique
        </ButtonLink>
      </div>
    </section>
  );
}
