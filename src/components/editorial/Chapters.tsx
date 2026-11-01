import Link from "@/i18n/Link";
import { copy, type Lang } from "@/i18n/config";
import { getA11y, getLang } from "@/i18n/server";
import { SectionHeading } from "@/components/editorial/SectionHeading";
import { ButtonLink } from "@/components/ui/Links";
import { Kicker } from "@/components/ui/Kicker";
import { NewTabHint } from "@/components/ui/NewTab";
import { SpeciesText } from "@/components/ui/Species";
import { CodeSection } from "@/components/scientific/Sections";
import { ProtectedEmail } from "@/components/interactions/ProtectedEmail";
import { RESEARCHER, RESEARCH_SEQUENCE } from "@/data/researcher";
import { PublicationIndex } from "@/components/interactions/PublicationIndex";
import { HoverPreview } from "@/components/interactions/HoverPreview";
import { publicationPreviews } from "@/data/research-rail";
import { publicationsIn } from "@/data/publications";
import { communicationsIn } from "@/data/communications";
import { formatDate } from "@/lib/utils/format";

export { ThesisChapter } from "@/components/editorial/ThesisChapter";

const COPY = copy({
  fr: {
    pubKicker: "Contributions scientifiques",
    pubTitle: "Des questions. Des modèles. Des résultats.",
    pubIntro:
      "Mes travaux explorent différents aspects des interactions biologiques, de la dynamique des populations et de l'écologie, en mobilisant des approches mathématiques et computationnelles.",
    pubIndex: "Index complet des publications",
    commLabel: "Communications et posters",
    commCount: (from: string, to: string) => `présentations référencées sur HAL, ${from}–${to}`,
    codeKicker: "Code et reproductibilité",
    codeTitle: "La recherche ne s'arrête pas aux figures.",
    codeIntro:
      "Les scripts et notebooks associés à ma thèse permettent de retrouver les analyses numériques et les visualisations utilisées dans le manuscrit. Ils constituent une partie essentielle de la documentation et de la reproductibilité du travail.",
    contactKicker: "Échanger",
    contactTitle: "La recherche avance aussi par les échanges.",
    contactText:
      "Pour discuter d'une question scientifique, d'une collaboration, d'un projet ou simplement échanger autour des mathématiques du vivant, vous pouvez me contacter.",
    email: "Courriel professionnel",
    career: "En savoir plus sur mon parcours →",
  },
  en: {
    pubKicker: "Scientific contributions",
    pubTitle: "Questions. Models. Results.",
    pubIntro:
      "My work explores several aspects of biological interactions, population dynamics and ecology, using mathematical and computational approaches.",
    pubIndex: "Full index of publications",
    commLabel: "Talks and posters",
    commCount: (from: string, to: string) => `contributions recorded in HAL, ${from}–${to}`,
    codeKicker: "Code and reproducibility",
    codeTitle: "Research does not stop at the figures.",
    codeIntro:
      "The scripts and notebooks of my thesis make it possible to retrace the numerical analyses and visualisations used in the manuscript. They are an essential part of the documentation and reproducibility of the work.",
    contactKicker: "Get in touch",
    contactTitle: "Research also moves forward through conversation.",
    contactText:
      "To discuss a scientific question, a collaboration or a project, or simply to talk about the mathematics of living systems, you can contact me.",
    email: "Professional email",
    career: "More about my career →",
  },
});

type T = (typeof COPY)["fr"];

/* ---------------- Sequence motif: Observe → Understand ---------------- */

export async function SequenceRail({ active = 2, dark = false }: { active?: number; dark?: boolean }) {
  const lang = await getLang();
  const a11y = await getA11y();
  return (
    <ol className="grid grid-cols-3 gap-y-6 border-t border-current/20 pt-5 sm:grid-cols-6" aria-label={a11y.researchSequence}>
      {RESEARCH_SEQUENCE.map((s, i) => (
        <li key={s.fr} className="relative pr-3">
          <span className={`absolute -top-[23px] left-0 size-[7px] rounded-full ${i === active ? "bg-accent" : dark ? "bg-paper/40" : "bg-ink/40"}`} aria-hidden />
          <span className={`block font-serif text-xl ${i === active ? "italic text-accent-deep on-dark:text-accent-light" : ""}`}>{s[lang]}</span>
        </li>
      ))}
    </ol>
  );
}

/* ---------------- Publications ---------------- */

export async function PublicationsChapter() {
  const lang = await getLang();
  const t = COPY[lang];
  const publications = publicationsIn(lang);
  return (
    <section id="publications" aria-labelledby="publications-titre" className="site-gutter mx-auto max-w-site scroll-mt-20 py-24 md:py-32">
      <SectionHeading kicker={t.pubKicker} title={<span id="publications-titre">{t.pubTitle}</span>} intro={t.pubIntro} />
      <div className="mt-14">
        <HoverPreview previews={publicationPreviews(publications, lang)}>
          <PublicationIndex publications={publications} showFilters={false} />
        </HoverPreview>
      </div>
      <CommunicationsSummary lang={lang} t={t} />
      <div className="mt-10">
        <ButtonLink href="/publications" variant="secondary">
          {t.pubIndex}
        </ButtonLink>
      </div>
    </section>
  );
}

function CommunicationsSummary({ lang, t }: { lang: Lang; t: T }) {
  const list = communicationsIn(lang);
  const years = list.map((c) => c.date.slice(0, 4)).sort();
  return (
    <div className="mt-12 grid gap-8 md:grid-cols-12">
      <div className="md:col-span-4">
        <p className="label text-muted">{t.commLabel}</p>
        <p className="mt-3 font-serif text-5xl">{list.length}</p>
        <p className="mt-1 text-sm text-muted">{t.commCount(years[0], years.at(-1)!)}</p>
      </div>
      <ul className="divide-y divide-rule border-y border-rule md:col-span-8">
        {list.slice(0, 4).map((c) => (
          <li key={c.id} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:gap-6">
            <span className="mono-meta w-32 shrink-0 text-muted">{formatDate(c.date, lang)}</span>
            <a href={c.url} target="_blank" rel="noopener noreferrer" className="group flex-1">
              <span className="font-serif text-lg leading-snug group-hover:text-accent-deep" lang={/[éèàç]/.test(c.title) ? "fr" : "en"}>
                <SpeciesText text={c.title} />
              </span>
              <span className="block text-xs text-muted">
                {c.event} — {c.place}
              </span>
              <NewTabHint />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------------- Code & reproducibility ---------------- */

export async function CodeChapter() {
  const t = COPY[await getLang()];
  return (
    <section id="code" aria-labelledby="code-titre" className="site-gutter mx-auto max-w-site scroll-mt-20 py-24 md:py-32">
      <SectionHeading kicker={t.codeKicker} title={<span id="code-titre">{t.codeTitle}</span>} intro={t.codeIntro} />
      <div className="mt-14">
        <CodeSection />
      </div>
    </section>
  );
}

/* ---------------- Contact ---------------- */

export async function ContactChapter({ headingLevel = "h2" }: { headingLevel?: "h1" | "h2" }) {
  const H = headingLevel;
  const t = COPY[await getLang()];
  return (
    <section aria-labelledby="contact-titre" className="border-t border-ink bg-stone">
      <div className="site-gutter mx-auto max-w-site py-24 md:py-32">
        <Kicker>{t.contactKicker}</Kicker>
        <div className="mt-8 grid gap-12 lg:grid-cols-12">
          <H id="contact-titre" className="font-serif text-headline lg:col-span-7">
            {t.contactTitle}
          </H>
          <ContactDetails t={t} />
        </div>
      </div>
    </section>
  );
}

function ContactDetails({ t }: { t: T }) {
  return (
    <div className="space-y-8 lg:col-span-5">
      <p className="text-lg leading-relaxed text-ink/85">{t.contactText}</p>
      <div className="border-y border-ink py-5">
        <p className="label text-muted">{t.email}</p>
        <ProtectedEmail className="mt-2" />
      </div>
      <ul className="divide-y divide-rule">
        {RESEARCHER.profiles.map((p) => (
          <li key={p.label}>
            <a href={p.url} target="_blank" rel="noopener noreferrer" className="flex items-baseline justify-between gap-4 py-3 hover:text-accent-deep">
              <span className="font-serif text-xl">{p.label}</span>
              <span className="tabular-nums text-xs text-muted">{p.handle} ↗</span>
              <NewTabHint />
            </a>
          </li>
        ))}
      </ul>
      <p className="text-sm text-muted">
        <Link href="/parcours" className="link-underline inline-block py-1">
          {t.career}
        </Link>
      </p>
    </div>
  );
}
