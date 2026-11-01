import { LogisticExplorer } from "@/components/vulgarisation/LogisticExplorer";
import { EulerExplorer } from "@/components/vulgarisation/EulerExplorer";
import { CompartmentDiagram } from "@/components/vulgarisation/CompartmentDiagram";
import { BifurcationFigure } from "@/components/vulgarisation/BifurcationFigure";
import { AgentSimulator } from "@/components/visualizations/AgentSimulator";
import { MediaFigure } from "@/components/ui/MediaFigure";
import { getMediaIn } from "@/data/media";
import type { OutreachModule } from "@/data/vulgarisation";
import { copy, type Lang } from "@/i18n/config";

const COPY = copy({
  fr: { females: "Femelles", males: "Mâles", juveniles: "Juvéniles", note: "Illustration" },
  en: { females: "Females", males: "Males", juveniles: "Juveniles", note: "Illustration" },
});

/** A small population: adult females and males, and juveniles. Illustrative counts. */
function PopulationField({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  const dots = Array.from({ length: 72 }, (_, i) => ({ x: 20 + (i % 12) * 50 + ((i * 7) % 3) * 6, y: 24 + Math.floor(i / 12) * 42 + ((i * 5) % 4) * 4, kind: i % 3 === 0 ? "m" : i % 7 === 0 ? "j" : "f" }));
  return (
    <figure>
      <svg viewBox="0 0 620 280" className="h-auto w-full" aria-hidden>
        {dots.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={d.kind === "j" ? 5 : 8} fill={d.kind === "m" ? "#2468b3" : d.kind === "j" ? "#a8bfd6" : "#0b2d4f"} />
        ))}
      </svg>
      <figcaption className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted">
        <span><span className="mr-2 inline-block size-3 rounded-full bg-antibes" aria-hidden />{t.females}</span>
        <span><span className="mr-2 inline-block size-3 rounded-full bg-accent" aria-hidden />{t.males}</span>
        <span><span className="mr-2 inline-block size-2 rounded-full bg-mist" aria-hidden />{t.juveniles}</span>
        <span>{t.note}</span>
      </figcaption>
    </figure>
  );
}

function FirstLastFigure({ lang }: { lang: Lang }) {
  const m = getMediaIn(lang, "fig-ch4-first-last");
  return m ? <MediaFigure media={m} className="max-w-3xl" /> : null;
}

export function ModuleVisual({ visual, lang }: { visual: OutreachModule["visual"]; lang: Lang }) {
  switch (visual) {
    case "population":
      return <PopulationField lang={lang} />;
    case "logistic":
      return <LogisticExplorer />;
    case "euler":
      return <EulerExplorer />;
    case "compartments":
      return <CompartmentDiagram lang={lang} />;
    case "agents":
      return <AgentSimulator />;
    case "collective":
      return <FirstLastFigure lang={lang} />;
    case "interpret":
      return <BifurcationFigure lang={lang} />;
    default:
      return null;
  }
}
