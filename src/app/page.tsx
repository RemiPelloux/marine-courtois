import type { Metadata } from "next";
import { Hero } from "@/components/editorial/Hero";
import { PublicationsChapter, ContactChapter } from "@/components/editorial/Chapters";
import { ProfileSection } from "@/components/home/ProfileSection";
import { FeaturedSection } from "@/components/home/Featured";
import { FishSection } from "@/components/home/FishSection";
import { ResearchAxesSection } from "@/components/home/ResearchAxes";
import { ParcoursSection } from "@/components/home/ParcoursSection";
import { TeachingSection } from "@/components/home/ActivitySections";
import { SectionFlow } from "@/components/editorial/SectionFlow";
import { RESEARCHER } from "@/data/researcher";
import { groupToolkit } from "@/data/toolkit";

export const metadata: Metadata = {
  title: { absolute: `${RESEARCHER.displayName} — ${RESEARCHER.tagline}` },
  description:
    "Marine A. Courtois, docteure en biologie mathématique : modélisation, simulation et analyse de données pour comprendre les systèmes biologiques — lutte biologique, comportements reproducteurs, invasions biologiques.",
  alternates: { canonical: "/" },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: RESEARCHER.name,
  jobTitle: "Docteure en biologie mathématique",
  alumniOf: { "@type": "CollegeOrUniversity", name: "Université Côte d'Azur" },
  identifier: { "@type": "PropertyValue", propertyID: "ORCID", value: "0009-0002-3623-1460" },
  sameAs: RESEARCHER.profiles.map((p) => p.url),
  knowsAbout: [...RESEARCHER.interests, ...groupToolkit().flatMap((f) => f.tools.map((t) => t.name))],
  url: RESEARCHER.siteUrl,
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      <SectionFlow>
        <Hero />
        <ProfileSection />
        <FeaturedSection />
        <FishSection />
        <ResearchAxesSection />
        <ParcoursSection />
        <TeachingSection />
        <PublicationsChapter />
        <ContactChapter />
      </SectionFlow>
    </>
  );
}
