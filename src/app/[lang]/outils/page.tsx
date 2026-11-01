import { PageHeader } from "@/components/editorial/PageHeader";
import { SequenceRail } from "@/components/editorial/Chapters";
import Link from "@/i18n/Link";
import { SectionHeading } from "@/components/editorial/SectionHeading";
import { CapabilitySection } from "@/components/scientific/Sections";
import { SourceNote } from "@/components/scientific/SourceNote";
import { Toolkit } from "@/components/interactions/Toolkit";
import { SpeciesText } from "@/components/ui/Species";
import { toolsIn } from "@/data/skills";
import { groupToolkit } from "@/data/toolkit";
import { projectsIn } from "@/data/projects";
import { pageMetadata } from "@/lib/content/metadata";
import { copy, type Lang } from "@/i18n/config";
import { getLang } from "@/i18n/server";

export const generateMetadata = () =>
  pageMetadata({
    path: "/outils",
    fr: {
      title: "Outils",
      description:
        "Boîte à outils scientifique de Marine A. Courtois : langages, calcul, données, machine learning. Formalisation mathématique, systèmes dynamiques, Python, modélisation individu-centrée, statistique et reproductibilité, chaque compétence reliée à une réalisation publiée.",
    },
    en: {
      title: "Tools",
      description:
        "Marine A. Courtois's scientific toolbox: languages, computing, data, machine learning. Mathematical formalisation, dynamical systems, Python, individual-based modelling, statistics and reproducibility, each skill linked to published work.",
    },
  });

const COPY = copy({
  fr: {
    chapter: "Outils",
    kicker: "Langages, méthodes, réalisations",
    title: "Ma boîte à outils scientifique. Du modèle conceptuel au résultat reproductible.",
    intro:
      "Pas de jauges ni de pourcentages : chaque outil est relié à un projet, une publication ou un fichier de code où il est effectivement utilisé. Ceux qui n'apparaissent dans aucun code public sont signalés comme tels.",
    toolkitTitle: "Boîte à outils scientifique : langages, calcul, données, machine learning.",
    toolkitIntro:
      "Tuile pleine : utilisé dans le code publié (GitLab, Zenodo). Tuile pointillée : déclaré par Marine Courtois, sans preuve publique dans le code à ce jour.",
    skillsTitle: "Compétences construites : choisir une compétence, voir où elle est mobilisée.",
    skillsIntro: "Pour chaque compétence : l'étape du travail scientifique, la preuve publiée, les projets, la recherche et les outils qui la mettent en œuvre.",
    tableTitle: "Les outils présents dans le code publié.",
    tableIntro:
      "Cette liste est établie à partir des imports effectivement présents dans les dépôts publics. Elle ne prétend pas être exhaustive.",
    caption: "Outils logiciels et fichiers où ils sont utilisés",
    cols: ["Outil", "Usage", "Preuve dans le code", "Version notée", "Réalisations"],
  },
  en: {
    chapter: "Tools",
    kicker: "Languages, methods, work",
    title: "My scientific toolbox. From conceptual model to reproducible result.",
    intro:
      "No gauges or percentages: each tool is linked to a project, a publication or a code file where it is actually used. Those that appear in no public code are marked as such.",
    toolkitTitle: "Scientific toolbox: languages, computing, data, machine learning.",
    toolkitIntro:
      "Solid tile: used in the published code (GitLab, Zenodo). Dashed tile: stated by Marine Courtois, with no public evidence in code to date.",
    skillsTitle: "Skills built: choose a skill, see where it is put to work.",
    skillsIntro: "For each skill: the stage of scientific work, the published evidence, and the projects, research and tools that put it to use.",
    tableTitle: "The tools found in the published code.",
    tableIntro: "This list is drawn from the imports actually present in the public repositories. It does not claim to be exhaustive.",
    caption: "Software tools and the files where they are used",
    cols: ["Tool", "Use", "Evidence in the code", "Version noted", "Work"],
  },
});

export default async function MethodsPage() {
  const lang = await getLang();
  const t = COPY[lang];
  return (
    <>
      <PageHeader chapter={t.chapter} kicker={t.kicker} title={t.title} intro={t.intro} />
      <section aria-labelledby="langages" className="site-gutter mx-auto max-w-site py-20 md:py-28">
        <SectionHeading title={<span id="langages">{t.toolkitTitle}</span>} intro={t.toolkitIntro} size="title" className="mb-12" />
        <Toolkit families={groupToolkit(lang)} />
      </section>
      <section aria-labelledby="boite" className="site-gutter mx-auto max-w-site py-20 md:py-28">
        <SectionHeading title={<span id="boite">{t.skillsTitle}</span>} intro={t.skillsIntro} size="title" className="mb-12" />
        <CapabilitySection />
      </section>
      <section id="outils" aria-labelledby="outils-titre" className="site-gutter mx-auto max-w-site scroll-mt-20 py-20 md:py-28">
        <SectionHeading title={<span id="outils-titre">{t.tableTitle}</span>} intro={t.tableIntro} size="title" />
        <ToolTable lang={lang} />
        <div className="mt-16">
          <SequenceRail active={3} />
        </div>
        <SourceNote className="mt-10" ids={["gitThesis", "gitAbm", "pubRF", "pubPolyandry", "pubInvasion"]} />
      </section>
    </>
  );
}

function ToolTable({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  return (
    <div className="mt-12 overflow-x-auto" role="region" aria-labelledby="outils-titre" tabIndex={0}>
      <table className="w-full min-w-[52rem] border-y border-ink text-left text-sm">
        <caption className="sr-only">{t.caption}</caption>
        <thead>
          <tr className="label border-b border-ink text-muted">
            {t.cols.map((c, i) => (
              <th key={c} scope="col" className={i < t.cols.length - 1 ? "py-3 pr-4 font-medium" : "py-3 font-medium"}>
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-rule">
          {toolsIn(lang).map((tool) => (
            <tr key={tool.id}>
              <th scope="row" className="py-3 pr-4 font-serif text-lg font-normal">{tool.name}</th>
              <td className="py-3 pr-4 text-ink/85">{tool.role}</td>
              <td className="py-3 pr-4 tabular-nums text-xs text-muted">{tool.evidence.join(" · ")}</td>
              <td className="py-3 pr-4 tabular-nums text-xs text-muted">{tool.versionNote ?? "—"}</td>
              <td className="py-3 text-sm">
                <Realizations toolId={tool.id} lang={lang} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Public projects that use a tool, linked; a dash when none is documented yet. */
function Realizations({ toolId, lang }: { toolId: string; lang: Lang }) {
  const projects = projectsIn(lang).filter((p) => p.toolIds.includes(toolId));
  if (projects.length === 0) return <span className="text-muted">—</span>;
  return (
    <ul className="space-y-1">
      {projects.map((p) => (
        <li key={p.id}>
          <Link href={`/projets/${p.slug}`} className="link-underline">
            <SpeciesText text={p.title} />
          </Link>
        </li>
      ))}
    </ul>
  );
}
