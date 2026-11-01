import { copy } from "@/i18n/config";
import { getA11y, getLang } from "@/i18n/server";
import { PageHeader } from "@/components/editorial/PageHeader";
import { ScrubText } from "@/components/editorial/ScrubText";
import { SectionHeading } from "@/components/editorial/SectionHeading";
import { SourceNote } from "@/components/scientific/SourceNote";
import { ButtonLink } from "@/components/ui/Links";
import { CareerPuzzle } from "@/components/parcours/CareerPuzzle";
import { Chronology } from "@/components/parcours/Chronology";
import { buildCompetenceBoard } from "@/components/parcours/board";
import { RESEARCHER } from "@/data/researcher";
import { THESIS } from "@/data/thesis";
import { pageMetadata } from "@/lib/content/metadata";

export const generateMetadata = () =>
  pageMetadata({
    path: "/parcours",
    fr: {
      title: "Parcours",
      description:
        "Le parcours de Marine A. Courtois, docteure de l'Université Côte d'Azur : compétences en mathématiques, statistiques, biologie et écologie, puis la chronologie des congrès, des articles et de la soutenance.",
    },
    en: {
      title: "Career",
      description:
        "The career of Marine A. Courtois, PhD from Université Côte d'Azur: competences in mathematics, statistics, biology and ecology, then the chronology of conferences, articles and the defence.",
    },
  });

const COPY = copy({
  fr: {
    chapter: "Parcours",
    title: "Quatre domaines, des compétences qui s'emboîtent.",
    intro:
      "Chaque bloc réunit les compétences d'un domaine, reliées à l'article, au projet ou au chapitre de thèse où elles servent. Plus bas, la chronologie rassemble les jalons datés : congrès, articles, soutenance.",
    puzzle: "Compétences par domaine",
    chronology: "Lecture chronologique.",
    chronologyIntro: "Congrès, articles, soutenance : les jalons datés, chacun avec sa source.",
    bio: [
      "Je suis Marine A. Courtois, docteure de l'Université Côte d'Azur. Mon parcours s'est construit autour d'une question : comment les mathématiques aident-elles à comprendre les systèmes biologiques ?",
      "Ma thèse, préparée à l'Institut Sophia Agrobiotech (INRAE, Université Côte d'Azur), porte sur la technique de l'insecte stérile, une stratégie de lutte biologique qui réduit les populations de ravageurs en perturbant leur reproduction. Elle m'a conduite à étudier la fertilité résiduelle, les accouplements multiples et les biais d'utilisation du sperme, avec des équations différentielles et des simulations individu-centrées.",
      "En parallèle, une étude menée avec des co-auteurs du LEHNA (Université Claude Bernard Lyon 1) m'a amenée vers l'écologie des invasions : une analyse comparative bayésienne des réponses fonctionnelles de 45 espèces de poissons d'eau douce.",
    ],
    doctorate: "Doctorat",
    defended: (date: string) => `Soutenance le ${date}`,
    setting: "Environnement de recherche",
    supervision: "Encadrement de thèse",
    contact: "Prendre contact",
  },
  en: {
    chapter: "Career",
    title: "Four domains, competences that fit together.",
    intro:
      "Each block gathers the competences of one domain, linked to the article, project or thesis chapter where they are used. Further down, the chronology lists the dated milestones: conferences, articles, defence.",
    puzzle: "Competences by domain",
    chronology: "Chronology.",
    chronologyIntro: "Conferences, articles, defence: the dated milestones, each with its source.",
    bio: [
      "I am Marine A. Courtois, PhD from Université Côte d'Azur. My path has been built around one question: how can mathematics help us understand biological systems?",
      "My thesis, prepared at the Institut Sophia Agrobiotech (INRAE, Université Côte d'Azur), deals with the sterile insect technique, a biological control strategy that reduces pest populations by disrupting their reproduction. It led me to study residual fertility, multiple mating and sperm-use biases, with differential equations and individual-based simulations.",
      "Alongside, a study carried out with co-authors from LEHNA (Université Claude Bernard Lyon 1) took me to invasion ecology: a Bayesian comparative analysis of the functional responses of 45 freshwater fish species.",
    ],
    doctorate: "PhD",
    defended: (date: string) => `Defended on ${date}`,
    setting: "Research setting",
    supervision: "Thesis supervision",
    contact: "Get in touch",
  },
});

export default async function ParcoursPage() {
  const lang = await getLang();
  const t = COPY[lang];
  return (
    <>
      <PageHeader chapter={t.chapter} kicker={RESEARCHER.title[lang]} title={t.title} intro={t.intro} />
      <section aria-labelledby="competences" className="site-gutter mx-auto max-w-site py-16 md:py-20">
        <h2 id="competences" className="sr-only">
          {t.puzzle}
        </h2>
        <CareerPuzzle board={buildCompetenceBoard(lang)} />
      </section>
      <section aria-labelledby="chronologie" className="border-t border-ink bg-stone">
        <div className="site-gutter mx-auto max-w-site py-20">
          <SectionHeading title={<span id="chronologie">{t.chronology}</span>} size="title" intro={t.chronologyIntro} className="mb-12" />
          <Chronology />
          <SourceNote className="mt-12" ids={["orcidEmployment", "thesesFr", "hal", "inriaReport", "pubRF", "pubPolyandry", "pubInvasion", "owner"]} />
        </div>
      </section>
      <Biography t={t} />
    </>
  );
}

async function Biography({ t }: { t: (typeof COPY)["fr"] }) {
  const lang = await getLang();
  const a11y = await getA11y();
  return (
    <section aria-label={a11y.biographie} className="site-gutter mx-auto max-w-site py-20">
      <div className="grid gap-14 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <ScrubText className="font-serif text-[1.9rem] leading-snug" text={t.bio[0]} />
          {t.bio.slice(1).map((p) => (
            <p key={p.slice(0, 24)} className="text-lg leading-relaxed text-ink/85">
              {p}
            </p>
          ))}
        </div>
        <aside className="space-y-8 lg:col-span-4 lg:col-start-9">
          <dl className="divide-y divide-rule border-y border-ink">
            <div className="py-4">
              <dt className="text-sm text-muted">{t.doctorate}</dt>
              <dd className="mt-1 font-serif text-xl">{RESEARCHER.doctorate.institution}</dd>
              <dd className="tabular-nums text-sm text-muted">{t.defended(RESEARCHER.doctorate.defenseLabel[lang])}</dd>
            </div>
            <div className="py-4">
              <dt className="text-sm text-muted">{t.setting}</dt>
              <dd className="mt-1">{RESEARCHER.doctorate.environment[lang]}</dd>
            </div>
            <div className="py-4">
              <dt className="text-sm text-muted">{t.supervision}</dt>
              <dd className="mt-1 text-sm">{THESIS.supervisors.join(", ")}</dd>
            </div>
          </dl>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/contact">{t.contact}</ButtonLink>
            <ButtonLink href={RESEARCHER.profiles[0].url} variant="secondary">
              ORCID
            </ButtonLink>
          </div>
        </aside>
      </div>
    </section>
  );
}
