import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/editorial/SectionHeading";
import { Reveal } from "@/components/editorial/Reveal";
import { ButtonLink } from "@/components/ui/Links";
import { RESEARCH_AXES } from "@/data/research-axes";
import { getResearchTheme } from "@/data/research";
import { getPublication } from "@/data/publications";

const sourceLabel = (id: string) => {
  const p = getPublication(id);
  if (!p) return undefined;
  return p.publicationType === "these" ? `Thèse ${p.year}` : `${p.journal} ${p.year}`;
};

/** The six verified themes, read as three research axes. */
export function ResearchAxesSection() {
  return (
    <section id="recherche" aria-labelledby="recherche-titre" className="border-t border-ink bg-stone scroll-mt-20">
      <div className="site-gutter mx-auto max-w-site py-24 md:py-32">
        <SectionHeading
          title={<span id="recherche-titre">Trois axes de recherche.</span>}
          intro="La biologie des populations comme terrain : des questions de lutte biologique et d'invasions, traitées par la modélisation, la simulation et l'analyse de données."
          className="mb-14"
        />
        <ol className="grid border-y border-ink lg:grid-cols-3">
          {RESEARCH_AXES.map((axis, i) => (
            <Reveal as="li" key={axis.id} delay={i * 0.08} className={i > 0 ? "border-t border-ink/25 py-9 lg:border-t-0 lg:border-l lg:pl-8" : "py-9 lg:pr-8"}>
              <ResearchAxisCard axis={axis} />
            </Reveal>
          ))}
        </ol>
        <div className="mt-10">
          <ButtonLink href="/recherche" variant="secondary">
            Le détail des recherches
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

function ResearchAxisCard({ axis }: { axis: (typeof RESEARCH_AXES)[number] }) {
  const themes = axis.themeSlugs.map(getResearchTheme).filter((t) => t !== undefined);
  return (
    <div className="flex h-full flex-col lg:pr-2">
      <h3 className="font-serif text-[2rem] leading-[1.05]">{axis.title}</h3>
      <p className="mt-5 text-[1rem] leading-relaxed text-ink/85">{axis.question}</p>
      <ul className="mt-6 space-y-1">
        {themes.map((t) => (
          <li key={t.slug}>
            <Link href={`/recherche/${t.slug}`} className="group flex min-h-10 items-center justify-between gap-3 border-b border-ink/15 py-2 hover:text-accent-deep">
              <span>{t.title}</span>
              <ArrowRight className="size-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-auto pt-6 text-sm text-muted">{axis.publicationIds.map(sourceLabel).filter(Boolean).join(" · ")}</p>
    </div>
  );
}
