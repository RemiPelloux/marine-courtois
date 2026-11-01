import Link from "@/i18n/Link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { AgentSimulator } from "@/components/visualizations/AgentSimulator";
import { FishAquarium } from "@/components/fish/FishAquarium";
import { FunctionalResponseData } from "@/components/fish/FunctionalResponseData";
import { ModelExplorerSection } from "@/components/scientific/ModelExplorerSection";
import type { Project } from "@/types/portfolio";
import { copy } from "@/i18n/config";
import { getLang } from "@/i18n/server";

const COPY = copy({
  fr: { open: "Ouvrir la démonstration", newTab: "(nouvel onglet)", pending: "Démonstration en préparation.", lab: "Tout le laboratoire interactif" },
  en: { open: "Open the demo", newTab: "(new tab)", pending: "Demo in preparation.", lab: "The whole interactive lab" },
});

/** The demonstration slot: built-in demo, external application, or an honest "in development" note. */
export async function ProjectDemo({ project }: { project: Project }) {
  const t = COPY[await getLang()];
  return (
    <div className="space-y-12">
      {project.internalDemo === "abm" && <AgentSimulator />}
      {project.internalDemo === "explorer" && <ModelExplorerSection />}
      {project.internalDemo === "fish" && (
        <>
          <FishAquarium />
          <FunctionalResponseData />
        </>
      )}
      {project.demoUrl ? (
        <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between gap-4 border border-antibes p-5 hover:bg-antibes hover:text-paper">
          <span className="font-serif text-2xl">{t.open}</span>
          <ArrowUpRight className="size-5" aria-hidden />
          <span className="sr-only">{t.newTab}</span>
        </a>
      ) : (
        project.status !== "publie" &&
        project.status !== "demo" && <p className="border border-dashed border-antibes p-5 text-sm text-ink/80">{t.pending}</p>
      )}
      {project.internalDemo === "explorer" && (
        <Link href="/laboratoire" className="link-underline inline-flex items-center gap-2 py-1 font-serif text-xl">
          {t.lab} <ArrowRight className="size-4" aria-hidden />
        </Link>
      )}
    </div>
  );
}
