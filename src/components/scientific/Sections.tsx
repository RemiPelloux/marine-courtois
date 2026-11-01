import Image from "next/image";
import { CapabilityExplorer } from "@/components/interactions/CapabilityExplorer";
import { ThesisExplorer } from "@/components/interactions/ThesisExplorer";
import { CodeExplorer } from "@/components/interactions/CodeExplorer";
import { AgentSimulator } from "@/components/visualizations/AgentSimulator";
import { BifurcationVisual, ScenarioComparisonVisual } from "@/components/visualizations/MethodVisuals";
import { Equation } from "@/components/scientific/Equation";
import { CAPABILITIES, TOOLS } from "@/data/skills";
import { PUBLICATIONS } from "@/data/publications";
import { RESEARCH_THEMES } from "@/data/research";
import { THESIS_CHAPTERS } from "@/data/thesis";
import { CODE_FILES, FIGURES, REPOSITORIES, THESIS_TREE, fileUrl, folderUrl, getFigure } from "@/data/code";

export const FILE_URLS: Record<string, string> = Object.fromEntries(CODE_FILES.map((f) => [f.id, fileUrl(f.repository, f.path)]));

export function CapabilitySection() {
  const sens = getFigure("fig-ch3-sensitivity")!;
  const visuals = {
    equations: (
      <div>
        <p className="label mb-2 text-muted">Système transcrit du notebook</p>
        <Equation display tex={String.raw`\dot S = (1-\delta)\sigma - \mu_S S`} />
        <Equation display tex={String.raw`\dot F = r(1-\rho)\tfrac{M+\varepsilon\eta S}{k+M+\eta S}\tfrac{F}{1+\beta F} - \mu_F F`} />
        <Equation display tex={String.raw`\dot M = r\rho\tfrac{M+\varepsilon\eta S}{k+M+\eta S}\tfrac{F}{1+\beta F} - \mu_M M + \delta\sigma`} />
      </div>
    ),
    phase: (
      <div>
        <p className="label mb-2 text-muted">Branches d&apos;équilibre — chapitre 2</p>
        <BifurcationVisual className="h-auto w-full" />
      </div>
    ),
    agents: (
      <div>
        <p className="label mb-2 text-muted">Démonstrateur individu-centré</p>
        <AgentSimulator compact />
      </div>
    ),
    sensitivity: (
      <figure>
        <p className="label mb-2 text-muted">Figure du notebook d&apos;analyse de sensibilité</p>
        <Image src={sens.src} alt={sens.alt} width={sens.width} height={sens.height} className="h-auto w-full" sizes="(min-width: 1024px) 30vw, 100vw" />
      </figure>
    ),
    distribution: (
      <div>
        <p className="label mb-2 text-muted">Expérience numérique : F(300) selon σ et δ</p>
        <ScenarioComparisonVisual className="h-auto w-full" />
      </div>
    ),
    repository: (
      <div>
        <p className="label mb-2 text-muted">gitlab.com/marinecourtois/thesisData</p>
        <ul className="tabular-nums text-xs leading-7">
          {THESIS_TREE.map((f) => (
            <li key={f}>
              <a href={folderUrl("thesisData", f)} target="_blank" rel="noopener noreferrer" className="hover:text-accent-deep">
                ├─ {f}/
              </a>
            </li>
          ))}
          <li>└─ README.md</li>
        </ul>
      </div>
    ),
  };
  return <CapabilityExplorer capabilities={CAPABILITIES} publications={PUBLICATIONS} research={RESEARCH_THEMES} tools={TOOLS} visuals={visuals} />;
}

export function ThesisSection({ headingLevel = "h3" }: { headingLevel?: "h2" | "h3" }) {
  const folderUrls: Record<number, string> = Object.fromEntries(
    THESIS_CHAPTERS.filter((c) => c.folder !== "—").map((c) => [c.number, folderUrl("thesisData", c.folder)]),
  );
  return (
    <ThesisExplorer
      headingLevel={headingLevel}
      chapters={THESIS_CHAPTERS}
      publications={PUBLICATIONS}
      codeFiles={CODE_FILES}
      figures={FIGURES}
      fileUrls={FILE_URLS}
      folderUrls={folderUrls}
    />
  );
}

export function CodeSection() {
  return <CodeExplorer files={CODE_FILES} figures={FIGURES} fileUrls={FILE_URLS} repositories={Object.values(REPOSITORIES)} />;
}
