import Link from "@/i18n/Link";
import { NAV_ITEMS, RESEARCHER, RESEARCH_SEQUENCE, SECONDARY_NAV } from "@/data/researcher";
import { Monogram } from "@/components/ui/Monogram";
import { SeaRibbon } from "@/components/layout/SeaRibbon";
import { ProtectedEmail } from "@/components/interactions/ProtectedEmail";
import { copy, type Lang } from "@/i18n/config";
import { getLang } from "@/i18n/server";
import { a11yFor } from "@/i18n/locales";

const COPY = copy({
  fr: {
    line1: "Modéliser le vivant,",
    line2: "simuler,",
    line3: "analyser.",
    profiles: "Profils vérifiés",
    rights: "Contenus sourcés : voir chaque page et la documentation des sources.",
    teaching: "Visualisations pédagogiques signalées comme telles.",
  },
  en: {
    line1: "Modelling life,",
    line2: "simulating,",
    line3: "analysing.",
    profiles: "Verified profiles",
    rights: "Every claim is sourced: see each page and the sources documentation.",
    teaching: "Teaching visualisations are labelled as such.",
  },
});

function ResearchSequence({ lang }: { lang: Lang }) {
  return (
    <ol className="label mb-14 flex flex-wrap gap-x-3 gap-y-2 text-mist" aria-label={a11yFor(lang).demarcheDeRecherche}>
      {RESEARCH_SEQUENCE.map((s, i) => (
        <li key={s.fr} className="flex items-center gap-3">
          <span className={i === 2 ? "text-accent-light" : undefined}>{s[lang]}</span>
          {i < RESEARCH_SEQUENCE.length - 1 && <span aria-hidden>→</span>}
        </li>
      ))}
    </ol>
  );
}

function FooterSignature({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  return (
    <div className="md:col-span-5">
      <Monogram inverted className="h-12 w-auto" />
      <p className="mt-6 font-serif text-4xl leading-tight md:text-5xl">
        {t.line1}
        <br />
        {t.line2} <em className="text-accent-light">{t.line3}</em>
      </p>
    </div>
  );
}

function FooterNav({ lang }: { lang: Lang }) {
  return (
    <nav aria-label={a11yFor(lang).piedDePage} className="md:col-span-3 md:col-start-7">
      <p className="label mb-4 text-mist">Atlas</p>
      <ul className="space-y-2 font-serif text-xl">
        {[...NAV_ITEMS, ...SECONDARY_NAV].map((n) => (
          <li key={n.label.fr}>
            <Link href={n.href} className="link-underline inline-block py-1">
              {n.label[lang]}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function FooterProfiles({ lang }: { lang: Lang }) {
  return (
    <div className="md:col-span-3">
      <p className="label mb-4 text-mist">{COPY[lang].profiles}</p>
      <ul className="space-y-2 text-sm">
        <li>
          <ProtectedEmail tone="dark" size="compact" />
        </li>
        {RESEARCHER.profiles.map((p) => (
          <li key={p.label}>
            <a className="link-underline inline-block py-1" href={p.url} target="_blank" rel="noopener noreferrer">
              {p.label} <span className="tabular-nums text-xs text-mist">{p.handle}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function SiteFooter() {
  const lang = await getLang();
  const t = COPY[lang];
  return (
    <footer className="on-dark bg-antibes text-paper">
      <SeaRibbon />
      <div className="site-gutter mx-auto max-w-site py-16 md:py-20">
        <ResearchSequence lang={lang} />
        <div className="grid gap-12 md:grid-cols-12">
          <FooterSignature lang={lang} />
          <FooterNav lang={lang} />
          <FooterProfiles lang={lang} />
        </div>
        <div className="mono-meta mt-16 flex flex-col gap-3 border-t border-paper/15 pt-6 text-mist md:flex-row md:justify-between">
          <p>© {RESEARCHER.name} — {t.rights}</p>
          <p>{t.teaching}</p>
        </div>
      </div>
    </footer>
  );
}
