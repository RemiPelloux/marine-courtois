import { ContactChapter } from "@/components/editorial/Chapters";
import { pageMetadata } from "@/lib/content/metadata";

export const metadata = pageMetadata({
  title: "Contact",
  description: "Contacter Marine Courtois : courriel professionnel, ORCID, GitLab et notice theses.fr.",
  path: "/contact",
});

export default function ContactPage() {
  return <ContactChapter headingLevel="h1" />;
}
