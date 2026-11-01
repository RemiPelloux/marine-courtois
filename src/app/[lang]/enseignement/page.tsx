import { PageHeader } from "@/components/editorial/PageHeader";
import { SectionHeading } from "@/components/editorial/SectionHeading";
import { TeachingSection } from "@/components/home/ActivitySections";
import { TransmettreTabs } from "@/components/vulgarisation/TransmettreTabs";
import { TeachingActivities } from "@/components/teaching/TeachingActivities";
import { teachingIn } from "@/data/teaching";
import { copy } from "@/i18n/config";
import { getLang } from "@/i18n/server";
import { pageMetadata } from "@/lib/content/metadata";

export const generateMetadata = () =>
  pageMetadata({
    path: "/enseignement",
    fr: {
      title: "Enseignement",
      description:
        "Enseignements de Marine A. Courtois à Polytech Nice Sophia, à l'Institut Sophia Agrobiotech et à l'Université Côte d'Azur : mathématiques, statistiques, programmation R et analyse de données.",
    },
    en: {
      title: "Teaching",
      description:
        "Marine A. Courtois's teaching at Polytech Nice Sophia, Institut Sophia Agrobiotech and Université Côte d'Azur: mathematics, statistics, R programming and data analysis.",
    },
  });

const COPY = copy({
  fr: {
    chapter: "Transmettre",
    kicker: "Enseignement",
    title: "Apprendre à modéliser, à coder, à lire des données.",
    intro: "Des équations au notebook, du notebook à la figure : chaque support part d'une question concrète et montre le chemin complet.",
    courses: "Enseignements.",
  },
  en: {
    chapter: "Sharing knowledge",
    kicker: "Teaching",
    title: "Learning to model, to code, to read data.",
    intro: "From equations to notebook, from notebook to figure: each piece of material starts from a concrete question and shows the whole path.",
    courses: "Teaching.",
  },
});

export default async function EnseignementPage() {
  const lang = await getLang();
  const t = COPY[lang];
  return (
    <>
      <PageHeader chapter={t.chapter} kicker={t.kicker} title={t.title} intro={t.intro} />
      <TransmettreTabs current="/enseignement" />
      <section aria-labelledby="enseignements" className="site-gutter mx-auto max-w-site py-16 md:py-20">
        <SectionHeading title={<span id="enseignements">{t.courses}</span>} size="title" className="mb-10" />
        <TeachingActivities activities={teachingIn(lang)} lang={lang} />
      </section>
      <TeachingSection showCourses={false} />
    </>
  );
}
