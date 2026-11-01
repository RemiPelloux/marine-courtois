import { PageHeader } from "@/components/editorial/PageHeader";
import { TeachingSection } from "@/components/home/ActivitySections";
import { ContactChapter } from "@/components/editorial/Chapters";
import { pageMetadata } from "@/lib/content/metadata";

export const metadata = pageMetadata({
  title: "Enseignement",
  description: "Transmettre la modélisation, la programmation scientifique et l'analyse de données : enseignements et supports en accès libre.",
  path: "/enseignement",
});

export default function EnseignementPage() {
  return (
    <>
      <PageHeader
        chapter="Enseignement"
        kicker="Transmettre"
        title="Apprendre à modéliser, à coder, à lire des données."
        intro="Des équations au notebook, du notebook à la figure : chaque support part d'une question concrète et montre le chemin complet."
      />
      <TeachingSection />
      <ContactChapter />
    </>
  );
}
