import Link from "@/i18n/Link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/editorial/SectionHeading";
import { MaturityBadge } from "@/components/projects/MaturityBadge";
import { SpeciesText } from "@/components/ui/Species";
import { getPublicationIn } from "@/data/publications";
import { getProjectIn } from "@/data/projects";
import { getMediaIn } from "@/data/media";
import { copy } from "@/i18n/config";
import { getLang } from "@/i18n/server";

const COPY = copy({
  fr: {
    title: "À la une.",
    intro: "Un article, le modèle qui l'accompagne, et une expérimentation technique que l'on peut manipuler.",
    selected: "Publication sélectionnée",
    depths: "Découvrir, comprendre, approfondir",
  },
  en: {
    title: "Featured.",
    intro: "An article, the model that goes with it, and a technical experiment you can handle.",
    selected: "Selected publication",
    depths: "Discover, understand, go deeper",
  },
});

/** Three doors into the work: one article, one model, one technical experiment. */
export async function FeaturedSection() {
  const lang = await getLang();
  const t = COPY[lang];
  const pub = getPublicationIn(lang, "pub-2026-polyandry")!;
  const abm = getProjectIn(lang, "modele-individu-centre")!;
  const explorer = getProjectIn(lang, "explorateur-de-modeles")!;
  const figure = getMediaIn(lang, "fig-ch4-abm")!;
  return (
    <section aria-labelledby="une" className="site-gutter mx-auto max-w-site scroll-mt-20 py-24 md:py-32">
      <SectionHeading title={<span id="une">{t.title}</span>} intro={t.intro} className="mb-12" />
      <div className="grid gap-12 lg:grid-cols-12">
        <article className="group relative lg:col-span-5">
          <p className="text-sm text-accent-deep">
            {t.selected} · {pub.journal} {pub.year}
          </p>
          <h3 className="mt-3 font-serif text-[2.3rem] leading-[1.05]">
            <Link href={`/publications/${pub.slug}`} className="after:absolute after:inset-0 hover:text-accent-deep">
              <SpeciesText text={pub.editorialTitle ?? pub.title} />
            </Link>
          </h3>
          <p className="mt-4 text-[1.02rem] leading-relaxed text-ink/80">
            <SpeciesText text={pub.question} />
          </p>
          <p className="mt-6 inline-flex items-center gap-2 font-serif text-lg">
            {t.depths} <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
          </p>
        </article>
        <article className="group relative lg:col-span-4">
          <div className="overflow-hidden border border-ink/10 bg-white">
            <Image src={figure.src} alt="" width={figure.width} height={figure.height} sizes="(min-width: 1024px) 33vw, 100vw" className="block h-auto w-full transition-transform duration-700 group-hover:scale-[1.02]" />
          </div>
          <div className="mt-4">
            <MaturityBadge status={abm.status} />
          </div>
          <h3 className="mt-3 font-serif text-[1.7rem] leading-tight">
            <Link href={`/projets/${abm.slug}`} className="after:absolute after:inset-0 hover:text-accent-deep">
              {abm.title}
            </Link>
          </h3>
        </article>
        <article className="group relative border-t-2 border-antibes pt-5 lg:col-span-3">
          <MaturityBadge status={explorer.status} />
          <h3 className="mt-3 font-serif text-[1.7rem] leading-tight">
            <Link href="/laboratoire#model-explorer" className="after:absolute after:inset-0 hover:text-accent-deep">
              {explorer.title}
            </Link>
          </h3>
          <p className="mt-3 text-[0.98rem] leading-relaxed text-ink/80">
            <SpeciesText text={explorer.tagline} />
          </p>
        </article>
      </div>
    </section>
  );
}
