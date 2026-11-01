import Link from "@/i18n/Link";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import { RESEARCHER, RESEARCH_SEQUENCE } from "@/data/researcher";
import { Monogram } from "@/components/ui/Monogram";
import { ButtonLink } from "@/components/ui/Links";
import { CoastScene } from "@/components/layout/CoastScene";
import { ProtectedEmail } from "@/components/interactions/ProtectedEmail";
import { copy, type Lang } from "@/i18n/config";
import { getLang } from "@/i18n/server";
import { a11yFor } from "@/i18n/locales";

type Entry = { href: string; label: string };
type Group = { title: string; entries: Entry[] };

const COPY = copy({
  fr: {
    line1: "Modéliser le vivant,",
    line2: "simuler,",
    line3: "analyser.",
    pitch: "Un projet, une question scientifique, un financement : parlons-en.",
    contact: "Me contacter",
    profiles: "Profils vérifiés",
    top: "Haut de page",
    rights: "Contenus sourcés : voir chaque page et la documentation des sources.",
    teaching: "Visualisations pédagogiques signalées comme telles.",
    groups: [
      { title: "Recherche", entries: [{ href: "/recherche", label: "Axes de recherche" }, { href: "/publications", label: "Publications" }, { href: "/communications", label: "Communications" }, { href: "/these", label: "Thèse" }] },
      { title: "Transmettre", entries: [{ href: "/enseignement", label: "Enseignement" }, { href: "/vulgarisation", label: "Vulgarisation" }, { href: "/laboratoire", label: "Laboratoire interactif" }] },
      { title: "Construire", entries: [{ href: "/projets", label: "Projets" }, { href: "/outils", label: "Outils" }, { href: "/parcours", label: "Parcours" }] },
    ] as Group[],
  },
  en: {
    line1: "Modelling life,",
    line2: "simulating,",
    line3: "analysing.",
    pitch: "A project, a scientific question, a grant: let's talk.",
    contact: "Get in touch",
    profiles: "Verified profiles",
    top: "Back to top",
    rights: "Every claim is sourced: see each page and the sources documentation.",
    teaching: "Teaching visualisations are labelled as such.",
    groups: [
      { title: "Research", entries: [{ href: "/recherche", label: "Research areas" }, { href: "/publications", label: "Publications" }, { href: "/communications", label: "Talks" }, { href: "/these", label: "Thesis" }] },
      { title: "Sharing", entries: [{ href: "/enseignement", label: "Teaching" }, { href: "/vulgarisation", label: "Outreach" }, { href: "/laboratoire", label: "Interactive lab" }] },
      { title: "Building", entries: [{ href: "/projets", label: "Projects" }, { href: "/outils", label: "Tools" }, { href: "/parcours", label: "Career" }] },
    ] as Group[],
  },
});
type T = (typeof COPY)["fr"];

function ResearchSequence({ lang }: { lang: Lang }) {
  return (
    <ol className="label flex flex-wrap gap-x-3 gap-y-2 text-mist" aria-label={a11yFor(lang).demarcheDeRecherche}>
      {RESEARCH_SEQUENCE.map((s, i) => (
        <li key={s.fr} className="flex items-center gap-3">
          <span className={i === 2 ? "text-accent-light" : undefined}>{s[lang]}</span>
          {i < RESEARCH_SEQUENCE.length - 1 && <span aria-hidden>→</span>}
        </li>
      ))}
    </ol>
  );
}

/** Signature on the left, the invitation to write on the right. */
function FooterLead({ t }: { t: T }) {
  return (
    <div className="grid gap-10 border-b border-paper/15 pb-14 lg:grid-cols-12 lg:items-end">
      <div className="lg:col-span-7">
        <Monogram inverted className="h-11 w-auto" />
        <p className="mt-6 font-serif text-[2.6rem] leading-[1.05] md:text-[3.4rem]">
          {t.line1}
          <br />
          {t.line2} <em className="text-accent-light">{t.line3}</em>
        </p>
      </div>
      <div className="lg:col-span-5">
        <p className="max-w-sm text-lg leading-relaxed text-paper/85">{t.pitch}</p>
        <ButtonLink href="/contact" variant="primary-dark" className="mt-6">
          {t.contact}
        </ButtonLink>
        <ProtectedEmail tone="dark" size="compact" className="mt-5 max-w-sm" />
      </div>
    </div>
  );
}

function FooterGroup({ group }: { group: Group }) {
  return (
    <div>
      <p className="label mb-4 text-mist">{group.title}</p>
      <ul className="space-y-1.5">
        {group.entries.map((e) => (
          <li key={e.href}>
            <Link href={e.href} className="link-underline inline-block py-1 font-serif text-[1.2rem]">
              {e.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FooterProfiles({ t }: { t: T }) {
  return (
    <div>
      <p className="label mb-4 text-mist">{t.profiles}</p>
      <ul className="divide-y divide-paper/10 border-y border-paper/10">
        {RESEARCHER.profiles.map((p) => (
          <li key={p.label}>
            <a className="group flex min-h-11 items-center justify-between gap-4 py-2 text-sm hover:text-accent-light" href={p.url} target="_blank" rel="noopener noreferrer">
              <span>
                {p.label} <span className="tabular-nums text-xs text-mist">{p.handle}</span>
              </span>
              <ArrowUpRight className="size-4 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FooterBottom({ t }: { t: T }) {
  return (
    <div className="mono-meta mt-14 flex flex-col gap-4 border-t border-paper/15 pt-6 text-mist md:flex-row md:items-center md:justify-between">
      <p>
        © {RESEARCHER.name} — {t.rights} {t.teaching}
      </p>
      <a href="#contenu" className="inline-flex min-h-11 items-center gap-2 text-paper/85 hover:text-accent-light">
        {t.top} <ArrowUp className="size-3.5" aria-hidden />
      </a>
    </div>
  );
}

export async function SiteFooter() {
  const lang = await getLang();
  const t = COPY[lang];
  return (
    <footer className="on-dark bg-antibes text-paper">
      <CoastScene />
      <div className="site-gutter mx-auto max-w-site pt-12 pb-10 md:pt-16">
        <FooterLead t={t} />
        <div className="grid gap-10 pt-12 sm:grid-cols-2 lg:grid-cols-12">
          <nav aria-label={a11yFor(lang).piedDePage} className="grid grid-cols-2 gap-x-6 gap-y-10 sm:col-span-2 sm:grid-cols-3 lg:col-span-8">
            {t.groups.map((g) => (
              <FooterGroup key={g.title} group={g} />
            ))}
          </nav>
          <div className="sm:col-span-2 lg:col-span-4">
            <FooterProfiles t={t} />
          </div>
        </div>
        <div className="mt-14">
          <ResearchSequence lang={lang} />
        </div>
        <FooterBottom t={t} />
      </div>
    </footer>
  );
}
