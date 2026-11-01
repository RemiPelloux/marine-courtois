import { PageHeader } from "@/components/editorial/PageHeader";
import { SectionHeading } from "@/components/editorial/SectionHeading";
import { TeachingSection } from "@/components/home/ActivitySections";
import { TransmettreTabs } from "@/components/vulgarisation/TransmettreTabs";
import { TeachingActivities } from "@/components/teaching/TeachingActivities";
import { ButtonLink } from "@/components/ui/Links";
import { TEACHING_ACTIVITIES } from "@/data/teaching";
import { pageMetadata } from "@/lib/content/metadata";

export const metadata = pageMetadata({
  title: "Enseignement",
  description: "Transmettre la modélisation, la programmation scientifique et l'analyse de données : enseignements et supports en accès libre.",
  path: "/enseignement",
});

export default function EnseignementPage() {
  return (
    <>
      <PageHeader
        chapter="Transmettre"
        kicker="Enseignement"
        title="Apprendre à modéliser, à coder, à lire des données."
        intro="Des équations au notebook, du notebook à la figure : chaque support part d'une question concrète et montre le chemin complet."
      />
      <TransmettreTabs current="/enseignement" />
      <section aria-labelledby="enseignements" className="site-gutter mx-auto max-w-site py-16 md:py-20">
        <SectionHeading title={<span id="enseignements">Enseignements.</span>} size="title" className="mb-10" />
        <TeachingActivities activities={TEACHING_ACTIVITIES} />
        <div className="mt-10">
          <ButtonLink href="/vulgarisation" variant="secondary">
            Les modules de vulgarisation
          </ButtonLink>
        </div>
      </section>
      <TeachingSection />
    </>
  );
}
