import { SectionHeading } from "@/components/editorial/SectionHeading";
import { Toolkit } from "@/components/interactions/Toolkit";
import { CareerTimeline } from "@/components/timeline/CareerTimeline";
import { MILESTONES } from "@/data/milestones";
import { ButtonLink } from "@/components/ui/Links";
import { ResearchRail } from "@/components/interactions/ResearchRail";
import { researchRailItems } from "@/data/research-rail";
import { groupToolkit } from "@/data/toolkit";

/** Every language and tool, grouped by what it is used for. */
export function ToolkitSection() {
  return (
    <section aria-labelledby="langages" className="site-gutter mx-auto max-w-site scroll-mt-20 py-24 md:py-32">
      <SectionHeading
        kicker="Langages et outils"
        title={<span id="langages">De Python à Power BI.</span>}
        intro="Les outils marqués d'un point plein sont importés dans les notebooks et scripts publiés sur GitLab ; les autres font partie de mon environnement de travail hors de ces dépôts."
        className="mb-12"
      />
      <Toolkit families={groupToolkit()} />
      <div className="mt-10">
        <ButtonLink href="/methodes#outils" variant="secondary">
          Voir les preuves dans le code
        </ButtonLink>
      </div>
    </section>
  );
}

/** Motion-design timeline of verified milestones, with a route to the full list. */
export function ParcoursSection() {
  return (
    <section aria-labelledby="parcours" className="site-gutter mx-auto max-w-site scroll-mt-20 py-24 md:py-32">
      <SectionHeading
        kicker="Parcours"
        title={<span id="parcours">De la première conférence à la soutenance.</span>}
        intro="Communications, posters, articles et doctorat, placés sur un même axe du temps. Chaque jalon est vérifiable sur HAL, par son DOI ou sur theses.fr."
        className="mb-12"
      />
      <CareerTimeline milestones={MILESTONES} />
      <div className="mt-10">
        <ButtonLink href="/a-propos#jalons" variant="secondary">
          Tous les jalons, avec leurs sources
        </ButtonLink>
      </div>
    </section>
  );
}

/** The six research themes, read sideways while the viewport stays pinned. */
export function ResearchRailSection() {
  return (
    <section aria-labelledby="axes" className="scroll-mt-20 pb-24 md:pb-32">
      <div className="site-gutter mx-auto max-w-site">
        <SectionHeading
          kicker="Recherche"
          title={<span id="axes">Six axes de recherche.</span>}
          intro="Un fil conducteur : comprendre comment des mécanismes biologiques et des contraintes pratiques façonnent la dynamique des populations."
          className="mb-12"
        />
      </div>
      <ResearchRail items={researchRailItems()} />
    </section>
  );
}
