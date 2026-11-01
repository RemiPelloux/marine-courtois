import { PageHeader } from "@/components/editorial/PageHeader";
import { SectionHeading } from "@/components/editorial/SectionHeading";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ModelComparison } from "@/components/projects/ModelComparison";
import { ButtonLink } from "@/components/ui/Links";
import { projectsIn } from "@/data/projects";
import { MATURITY_LABEL } from "@/types/portfolio";
import { pageMetadata } from "@/lib/content/metadata";
import { copy } from "@/i18n/config";
import { getLang } from "@/i18n/server";

export const generateMetadata = () =>
  pageMetadata({
    path: "/projets",
    fr: {
      title: "Projets & applications",
      description:
        "Modèles en équations différentielles et modèle individu-centré de la technique de l'insecte stérile, réanalyse des réponses fonctionnelles, figures reproductibles de la thèse, explorateur de modèles : les projets de Marine A. Courtois et leur degré d'avancement.",
    },
    en: {
      title: "Projects & applications",
      description:
        "Differential-equation models and an individual-based model of the sterile insect technique, a reanalysis of functional responses, reproducible thesis figures and a model explorer: Marine A. Courtois's projects and how far along each one is.",
    },
  });

const COPY = copy({
  fr: {
    chapter: "Projets",
    kicker: "Le laboratoire vivant",
    title: "Ce qui se construit, au-delà des articles.",
    intro:
      "Modèles, analyses, outils et applications. Chaque fiche dit ce que le projet cherche à faire, ce qu'il a réellement montré, ses limites et son degré d'avancement.",
    modelsTitle: "Modéliser la technique de l'insecte stérile : deux approches.",
    modelsIntro:
      "La même question, posée à deux échelles. Les équations suivent des effectifs moyens et donnent des seuils ; le modèle individu-centré suit chaque insecte et mesure le rôle du hasard. Les deux sont publiés, avec leur code.",
    othersTitle: "Analyse de données, outils et visualisations.",
    lab: "Le laboratoire interactif",
    tools: "Les outils, reliés aux projets",
  },
  en: {
    chapter: "Projects",
    kicker: "The living lab",
    title: "What gets built, beyond the articles.",
    intro:
      "Models, analyses, tools and applications. Each page states what the project sets out to do, what it has actually shown, its limitations and how far along it is.",
    modelsTitle: "Modelling the sterile insect technique: two approaches.",
    modelsIntro:
      "The same question, asked at two scales. The equations follow average numbers and yield thresholds; the individual-based model follows each insect and measures the role of chance. Both are published, with their code.",
    othersTitle: "Data analysis, tools and visualisations.",
    lab: "The interactive lab",
    tools: "The tools, linked to the projects",
  },
});

const MODEL_IDS = ["modele-equations-differentielles", "modele-individu-centre"];

export default async function ProjetsPage() {
  const lang = await getLang();
  const t = COPY[lang];
  const projects = projectsIn(lang);
  const models = MODEL_IDS.map((id) => projects.find((p) => p.id === id)).filter((p) => p !== undefined);
  const others = projects.filter((p) => !MODEL_IDS.includes(p.id));
  return (
    <>
      <PageHeader
        chapter={t.chapter}
        kicker={t.kicker}
        title={t.title}
        intro={t.intro}
        aside={
          <ul className="flex flex-wrap gap-2 border-t border-ink pt-4 text-xs text-muted">
            {Object.values(MATURITY_LABEL).map((l) => (
              <li key={l.fr} className="rounded-full border border-ink/25 px-2.5 py-0.5">
                {l[lang]}
              </li>
            ))}
          </ul>
        }
      />
      <section aria-labelledby="modeles" className="site-gutter mx-auto max-w-site py-16 md:py-20">
        <SectionHeading title={<span id="modeles">{t.modelsTitle}</span>} intro={t.modelsIntro} size="title" className="mb-12" />
        <ul className="grid gap-14 lg:grid-cols-2">
          {models.map((p) => (
            <li key={p.id}>
              <ProjectCard project={p} large />
            </li>
          ))}
        </ul>
        <div className="mt-16">
          <ModelComparison />
        </div>
      </section>
      <section aria-labelledby="autres" className="border-t border-ink bg-stone">
        <div className="site-gutter mx-auto max-w-site py-20">
          <SectionHeading title={<span id="autres">{t.othersTitle}</span>} size="title" className="mb-12" />
          <ul className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
            {others.map((p) => (
              <li key={p.id}>
                <ProjectCard project={p} />
              </li>
            ))}
          </ul>
          <div className="mt-14 flex flex-wrap gap-3">
            <ButtonLink href="/laboratoire" variant="secondary">
              {t.lab}
            </ButtonLink>
            <ButtonLink href="/outils" variant="secondary" icon={false}>
              {t.tools}
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
