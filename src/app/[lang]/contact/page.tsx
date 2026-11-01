import { ContactChapter } from "@/components/editorial/Chapters";
import { pageMetadata } from "@/lib/content/metadata";

export const generateMetadata = () =>
  pageMetadata({
    path: "/contact",
    fr: { title: "Contact", description: "Contacter Marine Courtois : courriel professionnel, ORCID, GitLab et notice theses.fr." },
    en: { title: "Contact", description: "Contact Marine Courtois: professional email, ORCID, GitLab and theses.fr record." },
  });

export default function ContactPage() {
  return <ContactChapter headingLevel="h1" />;
}
