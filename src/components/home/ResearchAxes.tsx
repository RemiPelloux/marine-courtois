import Link from "@/i18n/Link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/editorial/SectionHeading";
import { Reveal } from "@/components/editorial/Reveal";
import { ButtonLink } from "@/components/ui/Links";
import { SpeciesText } from "@/components/ui/Species";
import { MaturityBadge } from "@/components/projects/MaturityBadge";
import { researchAxesIn } from "@/data/research-axes";
import { getPublication, PUBLICATION_TYPE_LABEL } from "@/data/publications";
import { copy, type Lang } from "@/i18n/config";
import { getLang } from "@/i18n/server";
import type { ResearchAxis } from "@/types/portfolio";

const COPY = copy({
  fr: {
    title: (n: number) => `${n === 3 ? "Trois" : n} axes de recherche.`,
    intro:
      "La biologie comme terrain : lutte biologique, invasions biologiques et réponses des plantes aux stress, abordées par la modélisation, la simulation et l'analyse de données.",
    more: "Lire l'axe",
    detail: "Le détail des recherches",
  },
  en: {
    title: (n: number) => `${n === 3 ? "Three" : n} research areas.`,
    intro:
      "Biology as the field: biological control, biological invasions and plant responses to stress, addressed through modelling, simulation and data analysis.",
    more: "Read about this area",
    detail: "The research in detail",
  },
});

/** "Thèse 2025", "Journal of Animal Ecology 2026": what each axis rests on. */
function sourceLabel(id: string, lang: Lang) {
  const p = getPublication(id);
  if (!p) return undefined;
  return p.publicationType === "these" ? `${PUBLICATION_TYPE_LABEL.these[lang]} ${p.year}` : `${p.journal} ${p.year}`;
}

/** The research axes as they are defined in research-axes.ts, one column each. */
export async function ResearchAxesSection() {
  const lang = await getLang();
  const t = COPY[lang];
  const axes = researchAxesIn(lang);
  return (
    <section id="recherche" aria-labelledby="recherche-titre" className="border-t border-ink bg-stone scroll-mt-20">
      <div className="site-gutter mx-auto max-w-site py-24 md:py-32">
        <SectionHeading title={<span id="recherche-titre">{t.title(axes.length)}</span>} intro={t.intro} className="mb-14" />
        <ol className="grid border-y border-ink lg:grid-cols-3">
          {axes.map((axis, i) => (
            <Reveal as="li" key={axis.id} delay={i * 0.08} className={i > 0 ? "border-t border-ink/25 py-9 lg:border-t-0 lg:border-l lg:pl-8" : "py-9 lg:pr-8"}>
              <ResearchAxisCard axis={axis} lang={lang} />
            </Reveal>
          ))}
        </ol>
        <div className="mt-10">
          <ButtonLink href="/recherche" variant="secondary">
            {t.detail}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

function ResearchAxisCard({ axis, lang }: { axis: ResearchAxis; lang: Lang }) {
  const sources = axis.publicationIds.map((id) => sourceLabel(id, lang)).filter(Boolean);
  return (
    <div className="flex h-full flex-col lg:pr-2">
      <p className="flex items-center justify-between gap-3">
        <span className="font-serif text-3xl text-accent-deep italic">{axis.letter}</span>
        <MaturityBadge status={axis.status} />
      </p>
      <h3 className="mt-2 font-serif text-[2rem] leading-[1.05]">{axis.title}</h3>
      <p className="mt-5 text-[1rem] leading-relaxed text-ink/85">
        <SpeciesText text={axis.lede} />
      </p>
      {axis.methods.length > 0 && <p className="mt-5 text-sm text-accent-deep">{axis.methods.join(" · ")}</p>}
      <div className="mt-auto pt-6">
        {sources.length > 0 && <p className="text-sm text-muted">{sources.join(" · ")}</p>}
        <Link href={`/recherche#${axis.slug}`} className="group mt-3 inline-flex min-h-10 items-center gap-2 hover:text-accent-deep">
          {COPY[lang].more} <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
        </Link>
      </div>
    </div>
  );
}
