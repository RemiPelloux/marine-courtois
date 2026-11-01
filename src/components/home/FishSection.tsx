import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/editorial/SectionHeading";
import { FishAquarium } from "@/components/fish/FishAquarium";

/** The aquarium on the homepage, with the door to the article's three reading depths. */
export function FishSection() {
  return (
    <section id="poissons" aria-labelledby="poissons-titre" className="border-y border-ink bg-stone scroll-mt-20">
      <div className="site-gutter mx-auto max-w-site py-24 md:py-32">
        <SectionHeading
          title={<span id="poissons-titre">Pourquoi certains poissons envahissent-ils les rivières ?</span>}
          intro="Trois bancs chassent les mêmes proies. Augmentez la densité de proies : les captures montent, puis plafonnent. C'est une réponse fonctionnelle, le paramètre au cœur d'une étude sur 45 espèces de poissons d'eau douce."
          className="mb-12"
        />
        <FishAquarium />
        <div className="mt-10 flex flex-wrap gap-x-10 gap-y-3">
          <Link href="/publications/reponse-fonctionnelle-invasivite#comprendre" className="link-underline inline-flex items-center gap-2 py-1 font-serif text-xl">
            Comprendre la réponse fonctionnelle <ArrowRight className="size-4" aria-hidden />
          </Link>
          <Link href="/publications/reponse-fonctionnelle-invasivite#approfondir" className="link-underline inline-flex items-center gap-2 py-1 font-serif text-xl">
            Les 269 mesures de l&apos;article <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
