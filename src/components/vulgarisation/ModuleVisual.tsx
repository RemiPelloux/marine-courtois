import { LogisticExplorer } from "@/components/vulgarisation/LogisticExplorer";
import { EulerExplorer } from "@/components/vulgarisation/EulerExplorer";
import { CompartmentDiagram } from "@/components/vulgarisation/CompartmentDiagram";
import { AgentSimulator } from "@/components/visualizations/AgentSimulator";
import { MediaFigure } from "@/components/ui/MediaFigure";
import { getMedia } from "@/data/media";
import type { OutreachModule } from "@/data/vulgarisation";

/** A small population: females and males, adults and young. Illustrative counts. */
function PopulationField() {
  const dots = Array.from({ length: 72 }, (_, i) => ({ x: 20 + (i % 12) * 50 + ((i * 7) % 3) * 6, y: 24 + Math.floor(i / 12) * 42 + ((i * 5) % 4) * 4, kind: i % 3 === 0 ? "m" : i % 7 === 0 ? "j" : "f" }));
  return (
    <figure>
      <svg viewBox="0 0 620 280" className="h-auto w-full" aria-hidden>
        {dots.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={d.kind === "j" ? 5 : 8} fill={d.kind === "m" ? "#2468b3" : d.kind === "j" ? "#a8bfd6" : "#0b2d4f"} />
        ))}
      </svg>
      <figcaption className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted">
        <span><span className="mr-2 inline-block size-3 rounded-full bg-antibes" aria-hidden />Femelles</span>
        <span><span className="mr-2 inline-block size-3 rounded-full bg-accent" aria-hidden />Mâles</span>
        <span><span className="mr-2 inline-block size-2 rounded-full bg-mist" aria-hidden />Jeunes</span>
        <span>Illustration</span>
      </figcaption>
    </figure>
  );
}

function Figure({ id }: { id: string }) {
  const m = getMedia(id);
  return m ? <MediaFigure media={m} className="max-w-3xl" /> : null;
}

export function ModuleVisual({ visual }: { visual: OutreachModule["visual"] }) {
  switch (visual) {
    case "population":
      return <PopulationField />;
    case "logistic":
      return <LogisticExplorer />;
    case "euler":
      return <EulerExplorer />;
    case "compartments":
      return <CompartmentDiagram />;
    case "agents":
      return <AgentSimulator />;
    case "collective":
      return <Figure id="fig-ch4-first-last" />;
    case "interpret":
      return <Figure id="fig-ch2-bifurcation" />;
    default:
      return null;
  }
}
