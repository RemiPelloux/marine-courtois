import Image from "next/image";
import Link from "@/i18n/Link";
import { ArrowUpRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Links";
import { SpeciesText } from "@/components/ui/Species";
import { getPublicationIn } from "@/data/publications";
import { codeFileIn, figureIn, fileUrl } from "@/data/code";
import { copy, type Lang } from "@/i18n/config";
import type { ResearchTheme } from "@/types/content";

const COPY = copy({
  fr: {
    figureFrom: "Figure de",
    publications: "Publications associées",
    thesis: "Thèse de doctorat",
    code: "Code et notebooks",
    explore: "Explorer le modèle interactif",
  },
  en: {
    figureFrom: "Figure from",
    publications: "Related publications",
    thesis: "PhD thesis",
    code: "Code and notebooks",
    explore: "Explore the interactive model",
  },
});

/** The evidence of a detail page: its thesis figure, publications, code and model. */
export function ThemeAside({ theme, lang }: { theme: ResearchTheme; lang: Lang }) {
  const t = COPY[lang];
  const pubs = theme.publicationIds.map((id) => getPublicationIn(lang, id)).filter((p) => p !== undefined);
  return (
    <aside className="space-y-10 lg:col-span-5 lg:col-start-8">
      <ThemeFigure id={theme.figureId} lang={lang} />
      <section aria-labelledby="pubs">
        <h2 id="pubs" className="label mb-3 text-muted">{t.publications}</h2>
        <ul className="divide-y divide-rule border-y border-rule">
          {pubs.map((p) => (
            <li key={p.id}>
              <Link href={`/publications/${p.slug}`} className="group block py-4">
                <span className="mono-meta text-muted">{p.journal} · {p.year}</span>
                <span className="mt-1 block font-serif text-xl leading-snug group-hover:text-accent-deep">
                  {p.publicationType === "these" ? t.thesis : <SpeciesText text={p.title} />}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <CodeFiles ids={theme.codeFileIds} lang={lang} />
      {theme.explorerTab && <ButtonLink href={`/laboratoire#modele-${theme.explorerTab}`}>{t.explore}</ButtonLink>}
    </aside>
  );
}

function ThemeFigure({ id, lang }: { id?: string; lang: Lang }) {
  const fig = figureIn(lang, id);
  if (!fig) return null;
  return (
    <figure className="border border-rule bg-white/40 p-3">
      <Image src={fig.src} alt={fig.alt} width={fig.width} height={fig.height} className="h-auto w-full" sizes="(min-width: 1024px) 36vw, 100vw" />
      <figcaption className="mono-meta mt-3 text-xs text-muted">
        {fig.caption} {COPY[lang].figureFrom}{" "}
        <a className="py-1.5 underline" href={fileUrl(fig.repository, fig.notebook)} target="_blank" rel="noopener noreferrer">
          {fig.notebook.split("/").at(-1)}
        </a>
        .
      </figcaption>
    </figure>
  );
}

function CodeFiles({ ids, lang }: { ids: string[]; lang: Lang }) {
  const files = ids.map((id) => codeFileIn(lang, id)).filter((f) => f !== undefined);
  if (files.length === 0) return null;
  return (
    <section aria-labelledby="code">
      <h2 id="code" className="label mb-3 text-muted">{COPY[lang].code}</h2>
      <ul className="space-y-2">
        {files.map((f) => (
          <li key={f.id}>
            <a href={fileUrl(f.repository, f.path)} target="_blank" rel="noopener noreferrer" className="group flex items-start gap-2 tabular-nums text-meta hover:text-accent-deep">
              <ArrowUpRight className="mt-0.5 size-3.5 shrink-0" aria-hidden />
              <span>
                {f.repository}/{f.path.split("/").at(-1)}
                <span className="block font-sans text-xs text-muted">{f.description}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
