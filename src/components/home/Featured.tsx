import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/editorial/SectionHeading";
import { MaturityBadge } from "@/components/projects/MaturityBadge";
import { getPublication } from "@/data/publications";
import { getProject } from "@/data/projects";
import { getMedia } from "@/data/media";

/** Three doors into the work: one article, one model, one technical experiment. */
export function FeaturedSection() {
  const pub = getPublication("pub-2026-polyandry")!;
  const abm = getProject("modele-individu-centre")!;
  const explorer = getProject("explorateur-de-modeles")!;
  const figure = getMedia("fig-ch4-abm")!;
  return (
    <section aria-labelledby="une" className="site-gutter mx-auto max-w-site scroll-mt-20 py-24 md:py-32">
      <SectionHeading title={<span id="une">À la une.</span>} intro="Un article, le modèle qui l'accompagne, et une expérimentation technique que l'on peut manipuler." className="mb-12" />
      <div className="grid gap-12 lg:grid-cols-12">
        <article className="group relative lg:col-span-5">
          <p className="text-sm text-accent-deep">
            Publication sélectionnée · {pub.journal} {pub.year}
          </p>
          <h3 className="mt-3 font-serif text-[2.3rem] leading-[1.05]">
            <Link href={`/publications/${pub.slug}`} className="after:absolute after:inset-0 hover:text-accent-deep">
              {pub.editorialTitle}
            </Link>
          </h3>
          <p className="mt-4 text-[1.02rem] leading-relaxed text-ink/80">{pub.questionFr}</p>
          <p className="mt-6 inline-flex items-center gap-2 font-serif text-lg">
            Découvrir, comprendre, approfondir <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
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
          <p className="mt-3 text-[0.98rem] leading-relaxed text-ink/80">{explorer.tagline}</p>
        </article>
      </div>
    </section>
  );
}
