import { SectionHeading } from "@/components/editorial/SectionHeading";
import { CareerPuzzle } from "@/components/parcours/CareerPuzzle";
import { buildCompetenceBoard } from "@/components/parcours/board";
import { ButtonLink } from "@/components/ui/Links";
import { copy } from "@/i18n/config";
import { getLang } from "@/i18n/server";

const COPY = copy({
  fr: {
    title: "Des compétences qui s'emboîtent.",
    intro:
      "Mathématiques, statistiques, biologie, écologie : chaque bloc rassemble les compétences d'un domaine, reliées à l'article, au projet ou au chapitre de thèse où elles servent.",
    more: "Le parcours et sa chronologie",
  },
  en: {
    title: "Competences that fit together.",
    intro:
      "Mathematics, statistics, biology, ecology: each block gathers the competences of one domain, linked to the article, project or thesis chapter where they are used.",
    more: "The career and its chronology",
  },
});

/** The competence puzzle, as an overview: the dated chronology lives on /parcours. */
export async function ParcoursSection() {
  const lang = await getLang();
  const t = COPY[lang];
  return (
    <section aria-labelledby="parcours-titre" className="site-gutter mx-auto max-w-site scroll-mt-20 py-24 md:py-32">
      <SectionHeading title={<span id="parcours-titre">{t.title}</span>} intro={t.intro} className="mb-12" />
      <CareerPuzzle board={buildCompetenceBoard(lang)} />
      <div className="mt-12">
        <ButtonLink href="/parcours" variant="secondary">
          {t.more}
        </ButtonLink>
      </div>
    </section>
  );
}
