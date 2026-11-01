import Link from "@/i18n/Link";
import { ArrowRight } from "lucide-react";
import { Equation } from "@/components/scientific/Equation";
import { ModelExplorerSection } from "@/components/scientific/ModelExplorerSection";
import { AgentSimulator } from "@/components/visualizations/AgentSimulator";
import { FishAquarium } from "@/components/fish/FishAquarium";
import { HollingExplorer } from "@/components/fish/HollingExplorer";
import { FunctionalResponseData } from "@/components/fish/FunctionalResponseData";
import { MediaFigure } from "@/components/ui/MediaFigure";
import { getMediaIn } from "@/data/media";
import type { Depth } from "@/data/publication-depth";
import { copy, type Lang } from "@/i18n/config";

const COPY = copy({
  fr: { abm: "Le projet\u00a0: modèle individu-centré et application", fish: "Le projet\u00a0: données, scripts R et visualisations" },
  en: { abm: "The project: individual-based model and app", fish: "The project: data, R scripts and visualisations" },
});

function Figures({ ids, lang }: { ids: string[]; lang: Lang }) {
  const media = ids.map((id) => getMediaIn(lang, id)).filter((m) => m !== undefined);
  return (
    <div className="grid gap-8 md:grid-cols-2">
      {media.map((m) => (
        <MediaFigure key={m.id} media={m} />
      ))}
    </div>
  );
}

function ProjectLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="link-underline mt-8 inline-flex items-center gap-2 py-1 font-serif text-xl">
      {label} <ArrowRight className="size-4" aria-hidden />
    </Link>
  );
}

/** The interactive pieces attached to each reading depth, by article. */
export function modulesFor(module: Depth["module"], lang: Lang) {
  const t = COPY[lang];
  if (module === "rf") {
    return {
      understand: <ModelExplorerSection initialTab="fertilite" />,
      deepen: <Figures ids={["fig-ch3-dynamics", "fig-ch3-sensitivity"]} lang={lang} />,
    };
  }
  if (module === "abm") {
    return {
      understand: <AgentSimulator />,
      deepen: (
        <>
          <ModelExplorerSection initialTab="accouplements" />
          <div className="mt-12">
            <Figures ids={["fig-ch4-abm", "fig-ch4-first-last"]} lang={lang} />
          </div>
          <ProjectLink href="/projets/modele-individu-centre" label={t.abm} />
        </>
      ),
    };
  }
  return {
    discover: <FishAquarium />,
    understand: <HollingExplorer equation={<Equation display tex={String.raw`f(N) = \frac{a\,N}{1 + a\,h\,N}`} />} />,
    deepen: (
      <div className="space-y-14">
        <FunctionalResponseData />
        <Figures ids={["jae-graphical-abstract"]} lang={lang} />
        <ProjectLink href="/projets/reponses-fonctionnelles" label={t.fish} />
      </div>
    ),
  };
}
