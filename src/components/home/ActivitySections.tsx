import { ArrowUpRight, ArrowRight } from "lucide-react";
import Link from "next/link";
import { SectionHeading } from "@/components/editorial/SectionHeading";
import { CareerTimeline } from "@/components/timeline/CareerTimeline";
import { ButtonLink } from "@/components/ui/Links";
import { MILESTONES } from "@/data/milestones";
import { COMMUNICATIONS } from "@/data/publications";
import { COURSES, TEACHING_RESOURCES, type TeachingResource } from "@/data/teaching";

const talks = COMMUNICATIONS.filter((c) => c.type === "communication").length;
const posters = COMMUNICATIONS.length - talks;

/** Talks and posters on the animated timeline, with a route to the full list. */
export function CommunicationSection() {
  return (
    <section id="communication" aria-labelledby="communication-titre" className="site-gutter mx-auto max-w-site scroll-mt-20 py-24 md:py-32">
      <SectionHeading
        title={<span id="communication-titre">Communiquer la science.</span>}
        intro={`${talks} communications orales et ${posters} posters en congrès, en français et en anglais : des mathématiques appliquées aux systèmes multi-agents et à l'écologie. Chaque jalon ouvre sa source.`}
        className="mb-12"
      />
      <CareerTimeline milestones={MILESTONES} />
      <div className="mt-10">
        <ButtonLink href="/communication" variant="secondary">
          Toutes les communications
        </ButtonLink>
      </div>
    </section>
  );
}

/** Teaching: courses once supplied, and the public material that already teaches. */
export function TeachingSection({ headingLevel = "h2" }: { headingLevel?: "h1" | "h2" }) {
  return (
    <section id="enseignement" aria-labelledby="enseignement-titre" className="on-dark scroll-mt-20 bg-antibes text-paper">
      <div className="site-gutter mx-auto max-w-site py-24 md:py-32">
        <SectionHeading
          as={headingLevel}
          title={<span id="enseignement-titre">Transmettre ce que je modélise.</span>}
          intro="Expliquer un modèle, apprendre à coder une simulation, lire un jeu de données : la transmission fait partie du travail. Les supports ci-dessous sont en accès libre."
          className="mb-12"
        />
        <ul className="grid border-y border-paper/25 lg:grid-cols-3">
          {TEACHING_RESOURCES.map((r, i) => (
            <li key={r.title} className={i > 0 ? "border-t border-paper/20 lg:border-t-0 lg:border-l" : undefined}>
              <ResourceLink r={r} />
            </li>
          ))}
        </ul>
        <p className="mt-8 max-w-2xl text-sm text-mist">
          {COURSES.length === 0
            ? "Le détail des enseignements (intitulés, niveaux, établissements, volumes horaires) sera publié ici."
            : `${COURSES.length} enseignements, détaillés sur la page Enseignement.`}
        </p>
      </div>
    </section>
  );
}

function ResourceLink({ r }: { r: TeachingResource }) {
  const body = (
    <>
      <span className="flex items-start justify-between gap-4">
        <span className="font-serif text-[1.65rem] leading-tight">{r.title}</span>
        {r.external ? <ArrowUpRight className="mt-1 size-5 shrink-0" aria-hidden /> : <ArrowRight className="mt-1 size-5 shrink-0 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />}
      </span>
      <span className="mt-4 block text-[0.95rem] leading-relaxed text-paper/80">{r.text}</span>
    </>
  );
  const cls = "group block h-full py-8 transition-colors duration-300 hover:bg-paper/[0.05] lg:px-7";
  if (!r.external) {
    return (
      <Link href={r.href} className={cls}>
        {body}
      </Link>
    );
  }
  return (
    <a href={r.href} target="_blank" rel="noopener noreferrer" className={cls}>
      {body}
      <span className="sr-only">(nouvel onglet)</span>
    </a>
  );
}
