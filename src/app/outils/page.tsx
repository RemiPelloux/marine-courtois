import { PageHeader } from "@/components/editorial/PageHeader";
import { SequenceRail } from "@/components/editorial/Chapters";
import Link from "next/link";
import { SectionHeading } from "@/components/editorial/SectionHeading";
import { CapabilitySection } from "@/components/scientific/Sections";
import { SourceNote } from "@/components/scientific/SourceNote";
import { Toolkit } from "@/components/interactions/Toolkit";
import { TOOLS } from "@/data/skills";
import { groupToolkit } from "@/data/toolkit";
import { toolRealizations } from "@/data/relations";
import { pageMetadata } from "@/lib/content/metadata";

export const metadata = pageMetadata({
  title: "Outils",
  description:
    "Formalisation mathématique, systèmes dynamiques, programmation scientifique en Python, modélisation individu-centrée, analyse statistique et reproductibilité — chaque compétence reliée à une réalisation publiée.",
  path: "/outils",
});

export default function MethodsPage() {
  return (
    <>
      <PageHeader
        chapter="Outils"
        kicker="Langages, méthodes, réalisations"
        title={
          <>
            Ma boîte à outils scientifique. Du modèle conceptuel au résultat reproductible.
          </>
        }
        intro="Pas de jauges ni de pourcentages : chaque outil est relié à un projet, une publication ou un fichier de code où il est effectivement utilisé. Ceux qui n'apparaissent dans aucun code public sont signalés comme tels."
      />
      <section aria-labelledby="langages" className="site-gutter mx-auto max-w-site py-20 md:py-28">
        <SectionHeading
          kicker="Langages et outils"
          title={<span id="langages">De Python au machine learning.</span>}
          intro="Tuile pleine : utilisé dans le code publié (GitLab, Zenodo). Tuile pointillée : déclaré par Marine Courtois, sans preuve publique dans le code à ce jour."
          size="title"
          className="mb-12"
        />
        <Toolkit families={groupToolkit()} />
      </section>
      <section aria-labelledby="boite" className="site-gutter mx-auto max-w-site py-20 md:py-28">
        <SectionHeading
          kicker="Compétences par étape du travail scientifique"
          title={<span id="boite">Choisir une compétence, voir où elle est mobilisée.</span>}
          size="title"
          className="mb-12"
        />
        <CapabilitySection />
      </section>
      <section id="outils" aria-labelledby="outils-titre" className="site-gutter mx-auto max-w-site scroll-mt-20 py-20 md:py-28">
        <SectionHeading
          kicker="Environnement logiciel vérifié"
          title={<span id="outils-titre">Les outils présents dans le code publié.</span>}
          intro="Cette liste est établie à partir des imports effectivement présents dans les dépôts publics. Elle ne prétend pas être exhaustive."
          size="title"
        />
        <div className="mt-12 overflow-x-auto" role="region" aria-labelledby="outils" tabIndex={0}>
          <table className="w-full min-w-[52rem] border-y border-ink text-left text-sm">
            <caption className="sr-only">Outils logiciels et fichiers où ils sont utilisés</caption>
            <thead>
              <tr className="label border-b border-ink text-muted">
                <th scope="col" className="py-3 pr-4 font-medium">Outil</th>
                <th scope="col" className="py-3 pr-4 font-medium">Usage</th>
                <th scope="col" className="py-3 pr-4 font-medium">Preuve dans le code</th>
                <th scope="col" className="py-3 pr-4 font-medium">Version notée</th>
                <th scope="col" className="py-3 font-medium">Réalisations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule">
              {TOOLS.map((t) => (
                <tr key={t.id}>
                  <th scope="row" className="py-3 pr-4 font-serif text-lg font-normal">{t.name}</th>
                  <td className="py-3 pr-4 text-ink/85">{t.role}</td>
                  <td className="py-3 pr-4 tabular-nums text-xs text-muted">{t.evidence.join(" · ")}</td>
                  <td className="py-3 pr-4 tabular-nums text-xs text-muted">{t.versionNote ?? "—"}</td>
                  <td className="py-3 text-sm">
                    <Realizations toolId={t.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-16">
          <SequenceRail active={3} />
        </div>
        <SourceNote className="mt-10" ids={["gitThesis", "gitAbm", "pubRF", "pubPolyandry", "pubInvasion"]} />
      </section>
    </>
  );
}

/** Public projects that use a tool, linked; a dash when none is documented yet. */
function Realizations({ toolId }: { toolId: string }) {
  const { projects } = toolRealizations(toolId);
  if (projects.length === 0) return <span className="text-muted">—</span>;
  return (
    <ul className="space-y-1">
      {projects.map((p) => (
        <li key={p.id}>
          <Link href={`/projets/${p.slug}`} className="link-underline">
            {p.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}
