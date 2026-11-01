import { a11y } from "@/i18n";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/editorial/SectionHeading";
import { ButtonLink } from "@/components/ui/Links";
import { Kicker } from "@/components/ui/Kicker";
import { ThesisSection, CodeSection } from "@/components/scientific/Sections";
import { ProtectedEmail } from "@/components/interactions/ProtectedEmail";
import { PublicationIndex } from "@/components/interactions/PublicationIndex";
import { HoverPreview } from "@/components/interactions/HoverPreview";
import { publicationPreviews } from "@/data/research-rail";
import { PUBLICATIONS, COMMUNICATIONS } from "@/data/publications";
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


/* ---------------- Chapter 03 — publications ---------------- */

export function PublicationsChapter() {
  return (
    <section id="publications" aria-labelledby="publications-titre" className="site-gutter mx-auto max-w-site scroll-mt-20 py-24 md:py-32">
      <SectionHeading
        kicker="Contributions scientifiques"
        title={
          <span id="publications-titre">
            Des questions. Des modèles. Des résultats.
          </span>
        }
        intro="Mes travaux explorent différents aspects des interactions biologiques, de la dynamique des populations et de l'écologie, en mobilisant des approches mathématiques et computationnelles."
      />
      <PublicationsPreview />
      <CommunicationsSummary />
      <div className="mt-10">
        <ButtonLink href="/publications" variant="secondary">
          Index complet des publications
        </ButtonLink>
      </div>
    </section>
  );
}

function PublicationsPreview() {
  return (
    <div className="mt-14">
      <HoverPreview previews={publicationPreviews(PUBLICATIONS)}>
        <PublicationIndex publications={PUBLICATIONS} showFilters={false} />
      </HoverPreview>
    </div>
  );
}

function CommunicationsSummary() {
  return (
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
  );
}

/* ---------------- Thesis transition ---------------- */

export function ThesisChapter({ headingLevel = "h2" }: { headingLevel?: "h1" | "h2" }) {
  const H = headingLevel;
  return (
    <section id="these" aria-labelledby="these-titre" className="on-dark scroll-mt-20 bg-antibes text-paper">
      <div className="site-gutter mx-auto max-w-site py-24 md:py-36">
        <Kicker>Doctorat</Kicker>
        <H id="these-titre" className="mt-8 max-w-5xl font-serif text-headline">
          Trois années pour comprendre les limites d&apos;une stratégie de lutte biologique.
        </H>
        <ThesisFacts />
        <div className="mt-20">
          <ThesisSection headingLevel={headingLevel === "h1" ? "h2" : "h3"} />
        </div>
        <ThesisResources />
      </div>
    </section>
  );
}

function ThesisFacts() {
  return (
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
  );
}

function ThesisResources() {
  return (
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
  );
}

/* ---------------- Code & reproducibility ---------------- */

export function CodeChapter() {
  return (
    <section id="code" aria-labelledby="code-titre" className="site-gutter mx-auto max-w-site scroll-mt-20 py-24 md:py-32">
      <SectionHeading
        kicker="Code & reproductibilité"
        title={
          <span id="code-titre">
            La recherche ne s&apos;arrête pas aux figures.
          </span>
        }
        intro="Les scripts et notebooks associés à ma thèse permettent de retrouver les analyses numériques et les visualisations utilisées dans le manuscrit. Ils constituent une partie essentielle de la documentation et de la reproductibilité du travail."
      />
      <div className="mt-14"><CodeSection /></div>
    </section>
  );
}

/* ---------------- Contact ---------------- */

export function ContactChapter({ headingLevel = "h2" }: { headingLevel?: "h1" | "h2" }) {
  const H = headingLevel;
  return (
    <section aria-labelledby="contact-titre" className="border-t border-ink bg-stone">
      <div className="site-gutter mx-auto max-w-site py-24 md:py-32">
        <Kicker>Échanger</Kicker>
        <div className="mt-8 grid gap-12 lg:grid-cols-12">
          <H id="contact-titre" className="font-serif text-headline lg:col-span-7">
            La recherche avance aussi par les échanges.
          </H>
          <ContactDetails />
        </div>
      </div>
    </section>
  );
}

function ContactDetails() {
  return (
    <div className="space-y-8 lg:col-span-5">
      <p className="text-lg leading-relaxed text-ink/85">
        Pour discuter d&apos;une question scientifique, d&apos;une collaboration, d&apos;un projet ou simplement échanger autour des
        mathématiques du vivant, vous pouvez me contacter.
      </p>
      <div className="border-y border-ink py-5">
        <p className="label text-muted">Courriel professionnel</p>
        <ProtectedEmail className="mt-2" />
      </div>
      <ProfileLinks />
      <p className="text-sm text-muted">
        <Link href="/a-propos" className="link-underline inline-block py-1">
          En savoir plus sur mon parcours →
        </Link>
      </p>
    </div>
  );
}

function ProfileLinks() {
  return (
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
  );
}
