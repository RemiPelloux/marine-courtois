import { a11y } from "@/i18n";
import Link from "next/link";
import { NAV_ITEMS, RESEARCHER, RESEARCH_SEQUENCE, SECONDARY_NAV } from "@/data/researcher";
import { Monogram } from "@/components/ui/Monogram";
import { SeaRibbon } from "@/components/layout/SeaRibbon";
import { ProtectedEmail } from "@/components/interactions/ProtectedEmail";

function ResearchSequence() {
  return (
    <ol className="label mb-14 flex flex-wrap gap-x-3 gap-y-2 text-mist" aria-label={a11y.demarcheDeRecherche}>
      {RESEARCH_SEQUENCE.map((s, i) => (
        <li key={s.fr} className="flex items-center gap-3">
          <span className={i === 2 ? "text-accent-light" : undefined}>{s.fr}</span>
          {i < RESEARCH_SEQUENCE.length - 1 && <span aria-hidden>→</span>}
        </li>
      ))}
    </ol>
  );
}

function FooterSignature() {
  return (
    <div className="md:col-span-5">
      <Monogram inverted className="h-12 w-auto" />
      <p className="mt-6 font-serif text-4xl leading-tight md:text-5xl">
        Mathématiques, code et données :
        <br />
        <em className="text-accent-light">tout s&apos;assemble.</em>
      </p>
    </div>
  );
}

function FooterNav() {
  return (
    <nav aria-label={a11y.piedDePage} className="md:col-span-3 md:col-start-7">
      <p className="label mb-4 text-mist">Atlas</p>
      <ul className="space-y-2 font-serif text-xl">
        {[...NAV_ITEMS, ...SECONDARY_NAV].map((n) => (
          <li key={n.href}>
            <Link href={n.href} className="link-underline inline-block py-1">
              {n.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function FooterProfiles() {
  return (
    <div className="md:col-span-3">
      <p className="label mb-4 text-mist">Profils vérifiés</p>
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

export function SiteFooter() {
  return (
    <footer className="on-dark bg-antibes text-paper">
      <SeaRibbon />
      <div className="site-gutter mx-auto max-w-site py-16 md:py-20">
        <ResearchSequence />
        <div className="grid gap-12 md:grid-cols-12">
          <FooterSignature />
          <FooterNav />
          <FooterProfiles />
        </div>
        <div className="mono-meta mt-16 flex flex-col gap-3 border-t border-paper/15 pt-6 text-mist md:flex-row md:justify-between">
          <p>© {RESEARCHER.name} — Contenus sourcés : voir chaque page et la documentation des sources.</p>
          <p>Visualisations pédagogiques signalées comme telles.</p>
        </div>
      </div>
    </footer>
  );
}
