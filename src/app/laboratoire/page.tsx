import { PageHeader } from "@/components/editorial/PageHeader";
import { SectionHeading } from "@/components/editorial/SectionHeading";
import { ModelExplorerSection } from "@/components/scientific/ModelExplorerSection";
import { CodeChapter } from "@/components/editorial/Chapters";
import { SITSequence } from "@/components/visualizations/SITSequence";
import { ImpulsiveReleases } from "@/components/visualizations/ImpulsiveReleases";
import { AgentSimulator } from "@/components/visualizations/AgentSimulator";
import { SourceNote } from "@/components/scientific/SourceNote";
import { TextLink } from "@/components/ui/Links";
import { fileUrl } from "@/data/code";
import { pageMetadata } from "@/lib/content/metadata";

export const metadata = pageMetadata({
  title: "Laboratoire",
  description:
    "Démonstrateurs interactifs : modèles de fertilité résiduelle et d'accouplements multiples transcrits des notebooks publics, principe de la TIS, lâchers impulsionnels, modèle individu-centré et explorateur de code.",
  path: "/laboratoire",
});

export default function LabPage() {
  return (
    <>
      <PageHeader
        dark
        chapter="Laboratoire"
        kicker="Démonstrateurs interactifs"
        title={
          <>
            Explorer les modèles. Comprendre les mécanismes.
          </>
        }
        intro="Chaque module indique clairement sa nature : modèle publié transcrit depuis le code public, démonstrateur simplifié ou schéma pédagogique. Aucun ne remplace les analyses publiées."
        aside={
          <ol className="label space-y-2 text-mist">
            <li><a href="#module-1" className="inline-block py-1 hover:text-paper">01 — Dynamique des populations</a></li>
            <li><a href="#module-2" className="inline-block py-1 hover:text-paper">02 — Lâchers d&apos;insectes stériles</a></li>
            <li><a href="#module-3" className="inline-block py-1 hover:text-paper">03 — Modélisation individu-centrée</a></li>
            <li><a href="#code" className="inline-block py-1 hover:text-paper">04 — Code & reproductibilité</a></li>
          </ol>
        }
      />

      <section id="module-1" aria-labelledby="m1" className="on-dark scroll-mt-20 bg-antibes text-paper">
        <div id="model-explorer" className="site-gutter mx-auto max-w-site scroll-mt-24 pb-24">
          <SectionHeading
            chapter="Module 01"
            kicker="Model Explorer"
            title={<span id="m1">Comparer des trajectoires sous différentes hypothèses.</span>}
            intro="Trois modèles, trois échelles de lecture. Les deux premiers sont les systèmes publiés, transcrits depuis les notebooks ; le troisième est le modèle discret pédagogique du chapitre 2."
            size="title"
            className="mb-12 pt-4"
          />
          <ModelExplorerSection />
        </div>
      </section>

      <section id="module-2" aria-labelledby="m2" className="site-gutter mx-auto max-w-site scroll-mt-20 py-24 md:py-28">
        <SectionHeading
          chapter="Module 02"
          kicker="Lâchers d'insectes stériles"
          title={<span id="m2">Du principe à la trajectoire, en cinq étapes.</span>}
          intro="Un lâcher de mâles stériles ne conduit pas automatiquement à la suppression d'une population : la compétition, la fertilité résiduelle et le ré-accouplement peuvent en modifier l'issue."
          size="title"
          className="mb-12"
        />
        <SITSequence />
        <div className="mt-24 border-t border-ink pt-12">
          <h3 className="mb-8 font-serif text-title">
            Lâcher souvent, ou lâcher beaucoup ? Lâchers impulsionnels.
          </h3>
          <ImpulsiveReleases />
        </div>
      </section>

      <section id="module-3" aria-labelledby="m3" className="scroll-mt-20 border-y border-ink bg-stone">
        <div className="site-gutter mx-auto max-w-site py-24 md:py-28">
          <SectionHeading
            chapter="Module 03"
            kicker="Modélisation individu-centrée"
            title={<span id="m3">Des individus à la population.</span>}
            intro={
              <>
                Un modèle de population décrit des effectifs agrégés par des équations. Un modèle individu-centré simule chaque insecte —
                sa durée de vie, ses accouplements, sa ponte — et la dynamique de la population émerge de ces règles.
              </>
            }
            size="title"
            className="mb-12"
          />
          <AgentSimulator />
          <div className="mt-12 grid gap-8 border-t border-ink pt-8 md:grid-cols-2">
            <div className="text-sm leading-relaxed">
              <p className="label mb-2 text-muted">Note méthodologique</p>
              <p>
                Adaptation simplifiée en JavaScript du modèle Mesa de{" "}
                <TextLink href={fileUrl("sit_remating_abm", "script_ABM_batchrun.py")}>script_ABM_batchrun.py</TextLink>. Sont conservés :
                durées de vie (mâles stériles 1–36 j, sauvages 31–129 j, femelles 21–144 j), mortalité larvaire par stade, émergence après
                6–11 j, sex-ratio 0,5, probabilité d&apos;accouplement avec un mâle sauvage W/(W + ηS) avec η = 0,59, périodes réfractaires,
                ponte de Poisson (6 œufs/j), capacité de charge larvaire et règles « first », « last », « mixed ».
              </p>
            </div>
            <div className="text-sm leading-relaxed">
              <p className="label mb-2 text-muted">Simplifications</p>
              <p>
                Effectifs réduits d&apos;un facteur 50, lâchers quotidiens, pas de récolte, règles « choice » et « preference » non incluses,
                une seule réplique affichée. Il s&apos;agit d&apos;un démonstrateur : ses sorties ne sont pas comparables aux résultats de
                l&apos;article, obtenus avec 100 répétitions par scénario.
              </p>
            </div>
          </div>
          <SourceNote className="mt-8" ids={["gitAbm", "pubPolyandry"]} />
        </div>
      </section>

      <CodeChapter />
    </>
  );
}
