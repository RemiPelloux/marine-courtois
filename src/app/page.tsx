import type { Metadata } from "next";
import { Hero } from "@/components/editorial/Hero";
import { PublicationsChapter, ContactChapter } from "@/components/editorial/Chapters";
import { MethodsChapter } from "@/components/editorial/MethodsChapter";
import { ProfileSection } from "@/components/home/ProfileSection";
import { ResearchAxesSection } from "@/components/home/ResearchAxes";
import { CommunicationSection, TeachingSection } from "@/components/home/ActivitySections";
import { SectionFlow } from "@/components/editorial/SectionFlow";
import { RESEARCHER } from "@/data/researcher";
import { groupToolkit } from "@/data/toolkit";

export const metadata: Metadata = {
  title: { absolute: `${RESEARCHER.displayName} — ${RESEARCHER.tagline}` },
  alternates: { canonical: "/" },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: RESEARCHER.name,
  jobTitle: "Docteure en biologie mathématique — modélisation et data science",
  alumniOf: { "@type": "CollegeOrUniversity", name: "Université Côte d'Azur" },
  sameAs: RESEARCHER.profiles.map((p) => p.url),
  knowsAbout: [...RESEARCHER.interests, "Machine learning", ...groupToolkit().flatMap((f) => f.tools.map((t) => t.name))],
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      <SectionFlow>
        <Hero />
        <ProfileSection />
        <ResearchAxesSection />
        <MethodsChapter />
        <CommunicationSection />
        <TeachingSection />
        <PublicationsChapter />
        <ContactChapter />
      </SectionFlow>
    </>
  );
}
