import { ArrowUpRight, ArrowRight } from "lucide-react";
import Link from "@/i18n/Link";
import { SectionHeading } from "@/components/editorial/SectionHeading";
import { ButtonLink } from "@/components/ui/Links";
import { teachingIn, teachingResourcesIn, type TeachingResource } from "@/data/teaching";
import { copy, type Lang } from "@/i18n/config";
import { getLang } from "@/i18n/server";

const COPY = copy({
  fr: {
    title: "Transmettre ce que je modélise.",
    intro:
      "Expliquer un modèle, apprendre à coder une simulation, lire un jeu de données : la transmission fait partie du travail. Les supports ci-dessous sont en accès libre.",
    courses: "Enseignements",
    allCourses: "Tous les enseignements",
    outreach: "Les modules de vulgarisation",
    newTab: "(nouvel onglet)",
    source: "Source : informations fournies par Marine Courtois.",
  },
  en: {
    title: "Teaching what I model.",
    intro:
      "Explaining a model, learning to code a simulation, reading a dataset: passing it on is part of the work. The material below is openly available.",
    courses: "Teaching",
    allCourses: "All teaching",
    outreach: "The outreach modules",
    newTab: "(new tab)",
    source: "Source: information provided by Marine Courtois.",
  },
});

type SectionProps = { headingLevel?: "h1" | "h2"; showCourses?: boolean };

/** Teaching: the courses in brief (home) and the public material that already teaches. */
export async function TeachingSection({ headingLevel = "h2", showCourses = true }: SectionProps) {
  const lang = await getLang();
  const t = COPY[lang];
  return (
    <section id="enseignement" aria-labelledby="enseignement-titre" className="on-dark scroll-mt-20 bg-antibes text-paper">
      <div className="site-gutter mx-auto max-w-site py-24 md:py-32">
        <SectionHeading as={headingLevel} title={<span id="enseignement-titre">{t.title}</span>} intro={t.intro} className="mb-12" />
        {showCourses && <CourseList lang={lang} />}
        <ul className="grid border-y border-paper/25 lg:grid-cols-3">
          {teachingResourcesIn(lang).map((r, i) => (
            <li key={r.id} className={i > 0 ? "border-t border-paper/20 lg:border-t-0 lg:border-l" : undefined}>
              <ResourceLink r={r} newTab={t.newTab} />
            </li>
          ))}
        </ul>
        <div className="mt-10 flex flex-wrap gap-3">
          {showCourses && (
            <ButtonLink href="/enseignement" variant="ghost-dark">
              {t.allCourses}
            </ButtonLink>
          )}
          <ButtonLink href="/vulgarisation" variant="ghost-dark" icon={!showCourses}>
            {t.outreach}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

/** One line per programme: where, and what is taught. */
function CourseList({ lang }: { lang: Lang }) {
  return (
    <div className="mb-14">
      <h3 className="font-serif text-[1.65rem] leading-tight">{COPY[lang].courses}</h3>
      <ul className="mt-5 border-t border-paper/25">
        {teachingIn(lang).map((a) => (
          <li key={a.id} className="grid gap-1 border-b border-paper/15 py-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] md:gap-8">
            <span className={a.emphasis === "featured" ? "font-semibold" : undefined}>
              {a.institution ? `${a.institution} · ${a.programme}` : a.programme}
            </span>
            <span className="text-[0.95rem] leading-relaxed text-paper/80">{a.subjects}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-mist">{COPY[lang].source}</p>
    </div>
  );
}

function ResourceLink({ r, newTab }: { r: TeachingResource; newTab: string }) {
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
      <span className="sr-only">{newTab}</span>
    </a>
  );
}
