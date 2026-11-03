import type { Metadata } from "next";
import { Hero } from "@/components/editorial/Hero";
import { PublicationsChapter, ContactChapter } from "@/components/editorial/Chapters";
import { ProfileSection } from "@/components/home/ProfileSection";
import { ResearchAxesSection } from "@/components/home/ResearchAxes";
import { TeachingSection } from "@/components/home/ActivitySections";
import { FeaturedSection } from "@/components/home/Featured";
import { ParcoursSection } from "@/components/home/ParcoursSection";
import { SectionFlow } from "@/components/editorial/SectionFlow";
import { RESEARCHER } from "@/data/researcher";
import { groupToolkit } from "@/data/toolkit";
import { domainsIn } from "@/data/domains";
import { copy } from "@/i18n/config";
import { getLang } from "@/i18n/server";
import { languageAlternates } from "@/lib/content/metadata";

const COPY = copy({
  fr: {
    description:
      "Marine A. Courtois, docteure en mathématiques appliquées à la biologie et analyste de données : modélisation, simulation, analyse de données et machine learning pour comprendre les systèmes biologiques — lutte biologique, comportements reproducteurs, invasions biologiques.",
    jobTitle: "Docteure en mathématiques appliquées à la biologie — Analyse de données",
  },
  en: {
    description:
      "Marine A. Courtois, PhD in applied mathematics for biology and data analyst: modelling, simulation, data analysis and machine learning to understand biological systems — biological control, reproductive behaviour, biological invasions.",
    jobTitle: "PhD in applied mathematics for biology — Data analysis",
  },
});

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  return {
    title: { absolute: `${RESEARCHER.displayName} — ${RESEARCHER.tagline[lang]}` },
    description: COPY[lang].description,
    alternates: languageAlternates(lang, "/"),
  };
}

async function PersonJsonLd() {
  const lang = await getLang();
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: RESEARCHER.name,
    jobTitle: COPY[lang].jobTitle,
    alumniOf: { "@type": "CollegeOrUniversity", name: "Université Côte d'Azur" },
    identifier: { "@type": "PropertyValue", propertyID: "ORCID", value: "0009-0002-3623-1460" },
    sameAs: RESEARCHER.profiles.map((p) => p.url),
    knowsAbout: [...domainsIn(lang).map((d) => d.label), ...RESEARCHER.interests[lang], ...groupToolkit(lang).flatMap((f) => f.tools.map((t) => t.name))],
    url: RESEARCHER.siteUrl,
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

/** Home: hero, profile, featured work, research axes, career, teaching, publications, contact. */
export default function Home() {
  return (
    <>
      <PersonJsonLd />
      <SectionFlow>
        <Hero />
        <ProfileSection />
        <FeaturedSection />
        <ResearchAxesSection />
        <ParcoursSection />
        <TeachingSection />
        <PublicationsChapter />
        <ContactChapter />
      </SectionFlow>
    </>
  );
}
