import { a11y } from "@/i18n";
import { PageHeader } from "@/components/editorial/PageHeader";
import { SectionHeading } from "@/components/editorial/SectionHeading";
import { SourceNote } from "@/components/scientific/SourceNote";
import { ButtonLink } from "@/components/ui/Links";
import { RESEARCHER } from "@/data/researcher";
import { COMMUNICATIONS, ARTICLES } from "@/data/publications";
import { THESIS } from "@/data/thesis";
import { formatDateFr } from "@/lib/utils/format";
import { pageMetadata } from "@/lib/content/metadata";

export const metadata = pageMetadata({
  title: "À propos",
  description: "Marine A. Courtois, docteure de l'Université Côte d'Azur en biologie mathématique : parcours scientifique, intérêts de recherche et jalons vérifiés.",
  path: "/a-propos",
});

const BIO = [
  "Je suis Marine A. Courtois, docteure de l'Université Côte d'Azur. Mon parcours scientifique s'est construit autour d'une question centrale : comment utiliser les mathématiques pour mieux comprendre les systèmes biologiques ?",
  "Au cours de ma thèse, réalisée dans l'environnement scientifique de l'Institut Sophia Agrobiotech, j'ai étudié la technique de l'insecte stérile, une stratégie de lutte biologique visant à réduire les populations de ravageurs en perturbant leur reproduction.",
  "Ce travail m'a amenée à examiner des mécanismes biologiques tels que la fertilité résiduelle, les accouplements multiples et les comportements reproducteurs, en mobilisant des modèles mathématiques et des simulations numériques.",
  "Mes contributions comprennent également des travaux en écologie des invasions, notamment sur les réponses fonctionnelles et leur capacité à renseigner l'invasivité et l'impact trophique.",
  "À travers ce site, je rassemble mes publications, mes projets, mes méthodes et les ressources computationnelles associées, afin de partager mes travaux avec la communauté scientifique et avec toute personne intéressée par les mathématiques du vivant.",
];

export default function AboutPage() {
  const timeline = [
    ...COMMUNICATIONS.map((c) => ({ date: c.date, label: c.type === "poster" ? "Poster" : "Communication", title: c.event, url: c.url })),
    ...ARTICLES.map((a) => ({ date: a.date ?? String(a.year), label: "Article", title: `${a.journal} — ${a.title}`, url: `https://doi.org/${a.doi}` })),
    { date: THESIS.defenseDate, label: "Doctorat", title: `Soutenance de thèse — ${THESIS.institution}`, url: "https://theses.fr/s352892" },
  ].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <PageHeader
        chapter="À propos"
        kicker={RESEARCHER.title}
        title={
          <>
            Des mathématiques pour explorer les mécanismes du vivant.
          </>
        }
      />
      <section aria-label={a11y.biographie} className="site-gutter mx-auto max-w-site py-20">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-7">
            <p className="font-serif text-[1.9rem] leading-snug">{BIO[0]}</p>
            {BIO.slice(1).map((p) => (
              <p key={p.slice(0, 20)} className="text-lg leading-relaxed text-ink/85">
                {p}
              </p>
            ))}
          </div>
          <aside className="space-y-10 lg:col-span-4 lg:col-start-9">
            <dl className="divide-y divide-rule border-y border-ink">
              <div className="py-4">
                <dt className="label text-muted">Doctorat</dt>
                <dd className="mt-1 font-serif text-xl">{RESEARCHER.doctorate.institution}</dd>
                <dd className="tabular-nums text-xs text-muted">Soutenance : {RESEARCHER.doctorate.defenseLabel}</dd>
              </div>
              <div className="py-4">
                <dt className="label text-muted">Environnement de recherche</dt>
                <dd className="mt-1">{RESEARCHER.doctorate.environment}</dd>
                <dd className="text-sm text-muted">{RESEARCHER.doctorate.collaborations}</dd>
              </div>
              <div className="py-4">
                <dt className="label text-muted">Encadrement de thèse</dt>
                <dd className="mt-1 text-sm">{THESIS.supervisors.join(", ")}</dd>
              </div>
            </dl>
            <div>
              <p className="label mb-3 text-muted">Intérêts de recherche</p>
              <ul className="flex flex-wrap gap-2">
                {RESEARCHER.interests.map((i) => (
                  <li key={i} className="bg-ink/[0.06] px-2.5 py-1 on-dark:bg-paper/10 text-sm">
                    {i}
                  </li>
                ))}
              </ul>
            </div>
            <ButtonLink href="/contact">Prendre contact</ButtonLink>
          </aside>
        </div>
      </section>
      <section aria-labelledby="jalons" className="border-t border-ink bg-stone">
        <div className="site-gutter mx-auto max-w-site py-20">
          <SectionHeading kicker="Jalons vérifiés" title={<span id="jalons">Parcours scientifique.</span>} size="title" intro="Publications, communications et soutenance, telles que référencées dans ORCID, HAL et theses.fr." />
          <ol className="relative mt-12 border-l border-ink/40 pl-8">
            {timeline.map((t) => (
              <li key={t.url + t.date} className="relative pb-8">
                <span className={`absolute top-1.5 -left-[37px] size-[9px] rounded-full ${t.label === "Doctorat" || t.label === "Article" ? "bg-vermilion" : "bg-ink"}`} aria-hidden />
                <p className="mono-meta text-muted">
                  {formatDateFr(t.date)} · <span className="text-vermilion-deep">{t.label}</span>
                </p>
                <a href={t.url} target="_blank" rel="noopener noreferrer" className="mt-1 block font-serif text-xl leading-snug hover:text-vermilion-deep">
                  {t.title}
                </a>
              </li>
            ))}
          </ol>
          <SourceNote ids={["inriaReport", "thesesFr", "orcid", "hal"]} />
        </div>
      </section>
    </>
  );
}
