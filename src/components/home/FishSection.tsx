import Link from "@/i18n/Link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/editorial/SectionHeading";
import { FishAquarium } from "@/components/fish/FishAquarium";
import { copy } from "@/i18n/config";
import { getLang } from "@/i18n/server";

const COPY = copy({
  fr: {
    title: "Pourquoi certains poissons envahissent-ils les rivières ?",
    intro:
      "Trois bancs chassent les mêmes proies. Augmentez la densité de proies : les captures montent, puis plafonnent. C'est une réponse fonctionnelle, le paramètre au cœur d'une étude sur 45 espèces de poissons d'eau douce.",
    understand: "Comprendre la réponse fonctionnelle",
    data: "Les 269 mesures de l'article",
  },
  en: {
    title: "Why do some fish invade rivers?",
    intro:
      "Three schools hunt the same prey. Raise the prey density: captures climb, then level off. That is a functional response, the parameter at the heart of a study of 45 freshwater fish species.",
    understand: "Understand the functional response",
    data: "The article's 269 estimates",
  },
});

/** The aquarium on the homepage, with the door to the article's three reading depths. */
export async function FishSection() {
  const t = COPY[await getLang()];
  return (
    <section id="poissons" aria-labelledby="poissons-titre" className="border-y border-ink bg-stone scroll-mt-20">
      <div className="site-gutter mx-auto max-w-site py-24 md:py-32">
        <SectionHeading title={<span id="poissons-titre">{t.title}</span>} intro={t.intro} className="mb-12" />
        <FishAquarium />
        <div className="mt-10 flex flex-wrap gap-x-10 gap-y-3">
          <Link href="/publications/reponse-fonctionnelle-invasivite#comprendre" className="link-underline inline-flex items-center gap-2 py-1 font-serif text-xl">
            {t.understand} <ArrowRight className="size-4" aria-hidden />
          </Link>
          <Link href="/publications/reponse-fonctionnelle-invasivite#approfondir" className="link-underline inline-flex items-center gap-2 py-1 font-serif text-xl">
            {t.data} <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
