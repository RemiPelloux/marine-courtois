"use client";

import Link from "@/i18n/Link";
import { ArrowRight } from "lucide-react";
import { FishAquarium } from "@/components/fish/FishAquarium";
import { copy } from "@/i18n/config";
import { useLang } from "@/i18n/client";

const COPY = copy({
  fr: {
    title: "Pourquoi certains poissons envahissent-ils les rivières ?",
    intro:
      "Trois bancs chassent les mêmes proies. Augmentez la densité de proies : les captures montent, puis plafonnent. C'est une réponse fonctionnelle, le paramètre au cœur d'une étude sur 45 espèces de poissons d'eau douce.",
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

const ARTICLE = "/publications/reponse-fonctionnelle-invasivite";

/** The aquarium with its prey slider and capture rates, under the functional-response article. */
export function FishPanel() {
  const t = COPY[useLang()];
  return (
    <div className="space-y-6">
      <div>
        <p className="font-serif text-2xl leading-tight">{t.title}</p>
        <p className="mt-2 max-w-2xl text-note leading-relaxed">{t.intro}</p>
      </div>
      <FishAquarium />
      <div className="flex flex-wrap gap-x-10 gap-y-3">
        <Link href={`${ARTICLE}#comprendre`} className="link-underline inline-flex items-center gap-2 py-1 font-serif text-xl">
          {t.understand} <ArrowRight className="size-4" aria-hidden />
        </Link>
        <Link href={`${ARTICLE}#approfondir`} className="link-underline inline-flex items-center gap-2 py-1 font-serif text-xl">
          {t.data} <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
    </div>
  );
}
