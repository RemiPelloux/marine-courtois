import { PageHeader } from "@/components/editorial/PageHeader";
import { PublicationIndex } from "@/components/interactions/PublicationIndex";
import { ButtonLink } from "@/components/ui/Links";
import { SourceNote } from "@/components/scientific/SourceNote";
import { publicationsIn, COMMUNICATIONS } from "@/data/publications";
import { ExportBibtex } from "@/components/publication/ExportBibtex";
import { toBibtex } from "@/lib/content/citation";
import { pageMetadata } from "@/lib/content/metadata";
import { copy } from "@/i18n/config";
import { getA11y, getLang } from "@/i18n/server";

export const generateMetadata = () =>
  pageMetadata({
    path: "/publications",
    fr: {
      title: "Publications",
      description:
        "Articles dans Bulletin of Mathematical Biology, PLOS Computational Biology et Journal of Animal Ecology, thèse de doctorat et communications scientifiques.",
    },
    en: {
      title: "Publications",
      description: "Articles in Bulletin of Mathematical Biology, PLOS Computational Biology and Journal of Animal Ecology, a PhD thesis and conference talks.",
    },
  });

const COPY = copy({
  fr: {
    kicker: "Contributions scientifiques",
    title: "Des questions. Des modèles. Des résultats.",
    intro:
      "Mes travaux explorent différents aspects des interactions biologiques, de la dynamique des populations et de l'écologie, en mobilisant des approches mathématiques et computationnelles.",
    articles: "Articles",
    talks: "Communications",
    verified: "Métadonnées vérifiées",
    commsTitle: "Communications et posters",
    commsText: "Présentés en congrès et référencés dans HAL, ils ont leur propre page, distincte des publications évaluées.",
    commsLink: (n: number) => `Les ${n} communications`,
  },
  en: {
    kicker: "Scientific contributions",
    title: "Questions. Models. Results.",
    intro: "My work explores several aspects of biological interactions, population dynamics and ecology, using mathematical and computational approaches.",
    articles: "Articles",
    talks: "Talks and posters",
    verified: "Verified metadata",
    commsTitle: "Talks and posters",
    commsText: "Presented at conferences and recorded in HAL, they have their own page, separate from the peer-reviewed publications.",
    commsLink: (n: number) => `All ${n} talks and posters`,
  },
});

export default async function PublicationsPage() {
  const lang = await getLang();
  const t = COPY[lang];
  const a11y = await getA11y();
  const publications = publicationsIn(lang);
  return (
    <>
      <PageHeader
        chapter="03"
        kicker={t.kicker}
        title={t.title}
        intro={t.intro}
        aside={
          <dl className="grid grid-cols-2 gap-4 border-t border-ink pt-4">
            <div>
              <dt className="label text-muted">{t.articles}</dt>
              <dd className="font-serif text-4xl">{publications.filter((p) => p.publicationType === "article").length}</dd>
            </div>
            <div>
              <dt className="label text-muted">{t.talks}</dt>
              <dd className="font-serif text-4xl">{COMMUNICATIONS.length}</dd>
            </div>
          </dl>
        }
      />
      <section aria-label={a11y.indexDesPublications} className="site-gutter mx-auto max-w-site py-16 md:py-20">
        <PublicationIndex publications={publications} headingLevel="h2" />
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <SourceNote ids={["orcid", "pubRF", "pubPolyandry", "pubInvasion", "thesesFr"]} label={t.verified} />
          <ExportBibtex bibtex={publications.map(toBibtex).join("\n\n")} />
        </div>
      </section>
      <section aria-labelledby="comms" className="border-t border-ink bg-stone">
        <div className="site-gutter mx-auto flex max-w-site flex-wrap items-end justify-between gap-6 py-16">
          <div>
            <h2 id="comms" className="font-serif text-title">
              {t.commsTitle}
            </h2>
            <p className="mt-3 max-w-2xl text-ink/80">{t.commsText}</p>
          </div>
          <ButtonLink href="/communications" variant="secondary">
            {t.commsLink(COMMUNICATIONS.length)}
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
