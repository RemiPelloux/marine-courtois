import { a11y } from "@/i18n";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/editorial/SectionHeading";
import { Reveal } from "@/components/editorial/Reveal";
import { ScrubText } from "@/components/editorial/ScrubText";
import { ButtonLink } from "@/components/ui/Links";
import { Kicker } from "@/components/ui/Kicker";
import { AgentSimulator } from "@/components/visualizations/AgentSimulator";
import { BifurcationVisual, ScenarioComparisonVisual } from "@/components/visualizations/MethodVisuals";
import { ModelExplorerSection } from "@/components/scientific/ModelExplorerSection";
import { ThesisSection, CodeSection } from "@/components/scientific/Sections";
import { ThesisCompact, FigureWall } from "@/components/editorial/HomeTeasers";
import { ProtectedEmail } from "@/components/interactions/ProtectedEmail";
import { PublicationIndex } from "@/components/interactions/PublicationIndex";
import { HoverPreview } from "@/components/interactions/HoverPreview";
import { publicationPreviews } from "@/data/research-rail";
import { METHOD_PANELS } from "@/data/skills";
import { PUBLICATIONS, COMMUNICATIONS } from "@/data/publications";
import { HIGHLIGHTS } from "@/data/home";
import { THESIS } from "@/data/thesis";
import { RESEARCHER, RESEARCH_SEQUENCE } from "@/data/researcher";
import { formatDateFr } from "@/lib/utils/format";

/* ---------------- Sequence motif: Observe → Understand ---------------- */

export function SequenceRail({ active = 2, dark = false }: { active?: number; dark?: boolean }) {
  return (
    <ol className="grid grid-cols-3 gap-y-6 border-t border-current/20 pt-5 sm:grid-cols-6" aria-label={a11y.researchSequence}>
      {RESEARCH_SEQUENCE.map((s, i) => (
        <li key={s.fr} className="relative pr-3">
          <span className={`absolute -top-[23px] left-0 size-[7px] rounded-full ${i === active ? "bg-accent" : dark ? "bg-paper/40" : "bg-ink/40"}`} aria-hidden />
                    <span className={`block font-serif text-xl ${i === active ? "italic text-accent-deep on-dark:text-accent-light" : ""}`}>{s.fr}</span>
        </li>
      ))}
    </ol>
  );
}

/* ---------------- Philosophy ---------------- */

export function PhilosophySection() {
  return (
    <section aria-labelledby="philosophie" className="site-gutter mx-auto max-w-site py-24 md:py-32">
      <div className="grid gap-12 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <Kicker accent="00">Introduction</Kicker>
          <h2 id="philosophie" className="mt-6 font-serif text-headline">
            À l&apos;interface des mathématiques et du vivant.
          </h2>
        </Reveal>
        <Reveal className="space-y-6 text-[1.08rem] leading-relaxed lg:col-span-6 lg:col-start-7" delay={0.1}>
          <ScrubText
            className="font-serif text-[1.6rem] leading-snug md:text-[1.85rem]"
            text="Je suis Marine Courtois, docteure en biologie mathématique. Mes recherches se situent à l'interface des mathématiques et de l'écologie, avec un intérêt particulier pour la dynamique des populations, les interactions biologiques et les stratégies de lutte contre les ravageurs agricoles."
          />
          <p className="text-ink/80">
            Les systèmes biologiques sont complexes : les individus interagissent, les comportements varient et de nombreux mécanismes
            agissent simultanément. La modélisation permet d&apos;isoler certains de ces mécanismes, d&apos;en explorer les conséquences et de
            mieux comprendre la dynamique globale des populations.
          </p>
        </Reveal>
      </div>
      <Reveal className="mt-20">
        <SequenceRail />
      </Reveal>
      <div className="mt-16 grid border-y border-ink sm:grid-cols-2 lg:grid-cols-4">
        {HIGHLIGHTS.map((h, i) => (
          <Reveal
            key={h.title}
            delay={i * 0.06}
            className={[
              "border-rule py-8 sm:px-6",
              i > 0 ? "border-t sm:border-t-0" : "",
              i % 2 === 1 ? "sm:border-l" : "",
              i >= 2 ? "sm:border-t lg:border-t-0" : "",
              i > 0 ? "lg:border-l" : "",
            ].join(" ")}
          >
            <h3 className="font-serif text-[2.2rem] leading-none">{h.title}</h3>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-ink/75">{h.text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Chapter 02 — methods ---------------- */

export function MethodsChapter({ withExplorer = true }: { withExplorer?: boolean }) {
  const visuals = [
    <BifurcationVisual key="a" className="h-auto w-full text-paper" />,
    <AgentSimulator key="b" compact dark />,
    <ScenarioComparisonVisual key="c" className="h-auto w-full text-paper" />,
  ];
  const captions = [
    "Branches d'équilibre d'un modèle avec compétition (chapitre 2 de la thèse) : au-delà de S_c, seul l'équilibre nul subsiste.",
    "Démonstrateur individu-centré adapté du modèle Mesa : chaque point est une femelle, colorée selon le contenu de sa spermathèque.",
    "Expérience numérique sur le modèle de fertilité résiduelle : densité de femelles après 300 jours selon σ, pour trois valeurs de δ.",
  ];
  return (
    <section id="methodes" aria-labelledby="methodes-titre" className="on-dark scroll-mt-20 bg-antibes text-paper">
      <div className="site-gutter mx-auto max-w-site py-24 md:py-32">
        <SectionHeading
          chapter="Chapitre 02"
          kicker="De la question au modèle"
          title={
            <span id="methodes-titre">
              Transformer une question biologique en système étudiable.
            </span>
          }
          intro="Une question de recherche devient un ensemble d'hypothèses, de variables et de mécanismes. Les mathématiques et la simulation permettent ensuite d'explorer les conséquences de ces choix."
        />
        <div className="mt-16 grid divide-y divide-paper/15 border-y border-paper/15 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
          {METHOD_PANELS.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08} as="article" className="flex flex-col py-8 lg:px-8">
              <h3 className="font-serif text-[2.1rem] leading-none">
                <span className="mr-2 tabular-nums text-sm align-middle text-accent-light">{p.index}.</span>
                {p.title}
              </h3>
              <p className="mt-4 text-[0.95rem] leading-relaxed text-paper/80">{p.description}</p>
              <figure className="mt-8 flex-1">
                <div className="min-h-48">{visuals[i]}</div>
                <figcaption className="mono-meta mt-3 text-xs leading-relaxed text-mist">{captions[i]}</figcaption>
              </figure>
              <ul className="mt-6 flex flex-wrap gap-2 border-t border-paper/15 pt-5">
                {p.capabilities.map((c) => (
                  <li key={c} className="bg-ink/[0.06] px-2.5 py-1 on-dark:bg-paper/10 text-xs text-paper/85">
                    {c}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

        {withExplorer && (
          <div id="model-explorer" className="mt-28 scroll-mt-24">
            <div className="mb-10 grid gap-6 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <Kicker accent="Model Explorer">A Research Playground</Kicker>
                <h3 className="mt-5 font-serif text-headline">
                  Expérimenter les mécanismes.
                </h3>
              </div>
              <p className="max-w-xl self-end text-paper/85 lg:col-span-5">
                Plutôt que de lire qu&apos;une méthode est maîtrisée, expérimentez-la. Chaque module part du modèle publié, transcrit
                depuis les notebooks de la thèse, et mène à la publication, au DOI et au code d&apos;origine.
              </p>
            </div>
            <ol className="mb-14 grid gap-px bg-paper/10 md:grid-cols-3" aria-label={a11y.parcoursDuModelExplorer}>
              {[
                { t: "Observer", s: "le mécanisme", d: "Les hypothèses et les équations du modèle, telles qu'écrites dans le code publié." },
                { t: "Explorer", s: "les paramètres", d: "Modifiez l'intensité des lâchers ou la biologie : les trajectoires sont recalculées en direct." },
                { t: "Comprendre", s: "les résultats", d: "Une lecture de la courbe, puis la publication, le DOI, le code et la méthodologie." },
              ].map((step) => (
                <li key={step.t} className="bg-antibes p-6">
                  <p className="font-serif text-3xl">
                    {step.t} <span className="font-sans text-sm text-paper/60">{step.s}</span>
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-paper/80">{step.d}</p>
                </li>
              ))}
            </ol>
            
            <ModelExplorerSection />
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------------- Chapter 03 — publications ---------------- */

export function PublicationsChapter() {
  return (
    <section id="publications" aria-labelledby="publications-titre" className="site-gutter mx-auto max-w-site scroll-mt-20 py-24 md:py-32">
      <SectionHeading
        chapter="Chapitre 03"
        kicker="Contributions scientifiques"
        title={
          <span id="publications-titre">
            Des questions. Des modèles. Des résultats.
          </span>
        }
        intro="Mes travaux explorent différents aspects des interactions biologiques, de la dynamique des populations et de l'écologie, en mobilisant des approches mathématiques et computationnelles."
      />
      <div className="mt-14">
        <HoverPreview previews={publicationPreviews(PUBLICATIONS)}>
          <PublicationIndex publications={PUBLICATIONS} showFilters={false} />
        </HoverPreview>
      </div>
      <div className="mt-12 grid gap-8 md:grid-cols-12">
        <div className="md:col-span-4">
          <p className="label text-muted">Communications & posters</p>
          <p className="mt-3 font-serif text-5xl">{COMMUNICATIONS.length}</p>
          <p className="mt-1 text-sm text-muted">présentations référencées sur HAL, 2022–2024</p>
        </div>
        <ul className="divide-y divide-rule border-y border-rule md:col-span-8">
          {COMMUNICATIONS.slice(0, 4).map((c) => (
            <li key={c.id} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:gap-6">
              <span className="mono-meta w-32 shrink-0 text-muted">{formatDateFr(c.date)}</span>
              <a href={c.url} target="_blank" rel="noopener noreferrer" className="group flex-1">
                <span className="font-serif text-lg leading-snug group-hover:text-accent-deep">{c.title}</span>
                <span className="block text-xs text-muted">
                  {c.event} — {c.place}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-10">
        <ButtonLink href="/publications" variant="secondary">
          Index complet des publications
        </ButtonLink>
      </div>
    </section>
  );
}

/* ---------------- Thesis transition ---------------- */

export function ThesisChapter({ headingLevel = "h2", compact = false }: { headingLevel?: "h1" | "h2"; compact?: boolean }) {
  if (compact) return <ThesisCompact />;
  const H = headingLevel;
  return (
    <section id="these" aria-labelledby="these-titre" className="on-dark scroll-mt-20 bg-antibes text-paper">
      <div className="site-gutter mx-auto max-w-site py-24 md:py-36">
        <Kicker accent="Chapitre 04">Doctorat</Kicker>
        <H id="these-titre" className="mt-8 max-w-5xl font-serif text-headline">
          Trois années pour comprendre les limites d&apos;une stratégie de lutte biologique.
        </H>
        <div className="mt-10 grid gap-10 lg:grid-cols-12">
          <p className="text-lg leading-relaxed text-paper/85 lg:col-span-6">
            Une recherche doctorale sur la technique de l&apos;insecte stérile et les facteurs biologiques et techniques qui influencent son
            efficacité.
          </p>
          <div className="lg:col-span-5 lg:col-start-8">
            <p className="label border-y border-paper/20 py-3 text-paper">
              Doctorat — {THESIS.institution} — Soutenance : {THESIS.defenseLabel}
            </p>
            <p className="mt-4 font-serif text-lg leading-snug text-paper/85 italic">{THESIS.title}</p>
            <p className="mono-meta mt-3 text-mist">Encadrement : {THESIS.supervisors.join(", ")}</p>
          </div>
        </div>
        <div className="mt-20">
          <ThesisSection headingLevel={headingLevel === "h1" ? "h2" : "h3"} />
        </div>
        <ul className="mt-14 grid gap-px bg-paper/15 sm:grid-cols-2 lg:grid-cols-5">
          {THESIS.resources.map((r) => (
            <li key={r.url} className="bg-antibes">
              <a href={r.url} target="_blank" rel="noopener noreferrer" className="group flex h-full flex-col gap-2 p-5 hover:bg-antibes-2">
                <span className="mono-meta text-mist">{r.kind}</span>
                <span className="flex items-start justify-between gap-3 font-serif text-lg leading-snug">
                  {r.label}
                  <ArrowUpRight className="mt-1 size-4 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------------- Code & reproducibility ---------------- */

export function CodeChapter({ compact = false }: { compact?: boolean }) {
  return (
    <section id="code" aria-labelledby="code-titre" className="site-gutter mx-auto max-w-site scroll-mt-20 py-24 md:py-32">
      <SectionHeading
        chapter="Chapitre 05"
        kicker="Code & reproductibilité"
        title={
          <span id="code-titre">
            La recherche ne s&apos;arrête pas aux figures.
          </span>
        }
        intro="Les scripts et notebooks associés à ma thèse permettent de retrouver les analyses numériques et les visualisations utilisées dans le manuscrit. Ils constituent une partie essentielle de la documentation et de la reproductibilité du travail."
      />
      <div className="mt-14">{compact ? <FigureWall /> : <CodeSection />}</div>
    </section>
  );
}

/* ---------------- Contact ---------------- */

export function ContactChapter({ headingLevel = "h2" }: { headingLevel?: "h1" | "h2" }) {
  const H = headingLevel;
  return (
    <section aria-labelledby="contact-titre" className="border-t border-ink bg-stone">
      <div className="site-gutter mx-auto max-w-site py-24 md:py-32">
        <Kicker accent="Chapitre 06">Échanger</Kicker>
        <div className="mt-8 grid gap-12 lg:grid-cols-12">
          <H id="contact-titre" className="font-serif text-headline lg:col-span-7">
            La recherche avance aussi par les échanges.
          </H>
          <div className="space-y-8 lg:col-span-5">
            <p className="text-lg leading-relaxed text-ink/85">
              Pour discuter d&apos;une question scientifique, d&apos;une collaboration, d&apos;un projet ou simplement échanger autour des
              mathématiques du vivant, vous pouvez me contacter.
            </p>
            <div className="border-y border-ink py-5">
              <p className="label text-muted">Courriel professionnel</p>
              <ProtectedEmail className="mt-2" />
            </div>
            <ul className="divide-y divide-rule">
              {RESEARCHER.profiles.map((p) => (
                <li key={p.label}>
                  <a href={p.url} target="_blank" rel="noopener noreferrer" className="flex items-baseline justify-between gap-4 py-3 hover:text-accent-deep">
                    <span className="font-serif text-xl">{p.label}</span>
                    <span className="tabular-nums text-xs text-muted">{p.handle} ↗</span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="text-sm text-muted">
              <Link href="/a-propos" className="link-underline inline-block py-1">
                En savoir plus sur mon parcours →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
