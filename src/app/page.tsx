import type { Metadata } from "next";
import { Hero } from "@/components/editorial/Hero";
import {
  PhilosophySection,
  MethodsChapter,
  PublicationsChapter,
  ThesisChapter,
  CodeChapter,
  ContactChapter,
} from "@/components/editorial/Chapters";
import { ParcoursSection, ResearchRailSection, ToolkitSection } from "@/components/editorial/PortfolioSections";
import { SectionFlow } from "@/components/editorial/SectionFlow";
import { RESEARCHER } from "@/data/researcher";

export const metadata: Metadata = {
  title: { absolute: `${RESEARCHER.displayName} — Comprendre le vivant. Par le modèle.` },
  alternates: { canonical: "/" },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: RESEARCHER.name,
  jobTitle: "Docteure en biologie mathématique",
  alumniOf: { "@type": "CollegeOrUniversity", name: "Université Côte d'Azur" },
  sameAs: RESEARCHER.profiles.map((p) => p.url),
  knowsAbout: RESEARCHER.interests,
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      <SectionFlow>
        <Hero />
        <PhilosophySection />
        <ResearchRailSection />
        <MethodsChapter />
        <ToolkitSection />
        <PublicationsChapter />
        <ThesisChapter compact />
        <CodeChapter compact />
        <ParcoursSection />
        <ContactChapter />
      </SectionFlow>
    </>
  );
}
