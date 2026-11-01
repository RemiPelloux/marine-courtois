import { ArrowUpRight } from "lucide-react";
import { copy, type Lang } from "@/i18n/config";
import type { ReactNode } from "react";
import { getLang } from "@/i18n/server";
import { Kicker } from "@/components/ui/Kicker";
import { NewTabHint } from "@/components/ui/NewTab";
import { ThesisSection } from "@/components/scientific/Sections";
import { thesisIn } from "@/data/thesis";

const COPY = copy({
  fr: {
    kicker: "Doctorat",
    title: "Trois années pour comprendre les limites d'une stratégie de lutte biologique.",
    lede: "Une recherche doctorale sur la technique de l'insecte stérile et les facteurs biologiques et techniques qui influencent son efficacité.",
    facts: (institution: string, date: string) => `Doctorat — ${institution} — Soutenance\u00a0: ${date}`,
    official: "Titre officiel",
    supervision: "Encadrement\u00a0:",
  },
  en: {
    kicker: "PhD",
    title: "Three years to understand the limits of a biological control strategy.",
    lede: "Doctoral research on the sterile insect technique and the biological and technical factors that affect its effectiveness.",
    facts: (institution: string, date: string) => `PhD — ${institution} — Defended: ${date}`,
    official: "Official title (French)",
    supervision: "Supervision:",
  },
});

type Level = { headingLevel?: "h1" | "h2" };

/** The doctorate: headline, facts, the chapter explorer and the thesis resources. */
export async function ThesisChapter({ headingLevel = "h2" }: Level) {
  const H = headingLevel;
  const t = COPY[await getLang()];
  return (
    <section id="these" aria-labelledby="these-titre" className="on-dark scroll-mt-20 bg-antibes text-paper">
      <div className="site-gutter mx-auto max-w-site py-24 md:py-36">
        <Kicker>{t.kicker}</Kicker>
        <H id="these-titre" className="mt-8 max-w-5xl font-serif text-headline">
          {t.title}
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

type ThesisTitles = { title: string; titleEn: string };

/** French: the official title. English: the English title, then the official French one. */
const THESIS_TITLES: Record<Lang, (thesis: ThesisTitles, official: string) => ReactNode> = {
  fr: (thesis) => <p className="mt-4 font-serif text-lg leading-snug text-paper/85 italic">{thesis.title}</p>,
  en: (thesis, official) => (
    <>
      <p className="mt-4 font-serif text-lg leading-snug text-paper/85 italic">{thesis.titleEn}</p>
      <p className="mt-3 text-sm text-mist">{official}</p>
      <p className="mt-1 text-sm leading-snug text-paper/80" lang="fr">
        {thesis.title}
      </p>
    </>
  ),
};

/** In English the title is `titleEn`; the official French title follows, marked as French. */
async function ThesisFacts() {
  const lang = await getLang();
  const t = COPY[lang];
  const thesis = thesisIn(lang);
  return (
    <div className="mt-10 grid gap-10 lg:grid-cols-12">
      <p className="text-lg leading-relaxed text-paper/85 lg:col-span-6">{t.lede}</p>
      <div className="lg:col-span-5 lg:col-start-8">
        <p className="label border-y border-paper/20 py-3 text-paper">{t.facts(thesis.institution, thesis.defenseLabel)}</p>
        {THESIS_TITLES[lang](thesis, t.official)}
        <p className="mono-meta mt-3 text-mist">
          {t.supervision} {thesis.supervisors.join(", ")}
        </p>
      </div>
    </div>
  );
}

async function ThesisResources() {
  const { resources } = thesisIn(await getLang());
  return (
    <ul className="mt-14 grid gap-px bg-paper/15 sm:grid-cols-2 lg:grid-cols-5">
      {resources.map((r) => (
        <li key={r.url} className="bg-antibes">
          <a href={r.url} target="_blank" rel="noopener noreferrer" className="group flex h-full flex-col gap-2 p-5 hover:bg-antibes-2">
            <span className="mono-meta text-mist">{r.kind}</span>
            <span className="flex items-start justify-between gap-3 font-serif text-lg leading-snug">
              {r.label}
              <ArrowUpRight className="mt-1 size-4 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
            </span>
            <NewTabHint />
          </a>
        </li>
      ))}
    </ul>
  );
}
