import Image from "next/image";
import type { ReactNode } from "react";
import { CapabilityExplorer } from "@/components/interactions/CapabilityExplorer";
import { ThesisExplorer } from "@/components/interactions/ThesisExplorer";
import { CodeExplorer } from "@/components/interactions/CodeExplorer";
import { AgentSimulator } from "@/components/visualizations/AgentSimulator";
import { BifurcationVisual, ScenarioComparisonVisual } from "@/components/visualizations/MethodVisuals";
import { Equation } from "@/components/scientific/Equation";
import { capabilitiesIn, toolsIn } from "@/data/skills";
import { publicationsIn } from "@/data/publications";
import { researchThemesIn } from "@/data/research";
import { projectsIn } from "@/data/projects";
import { THESIS_CHAPTERS } from "@/data/thesis";
import { CODE_FILES, THESIS_TREE, codeFilesIn, figureIn, figuresIn, fileUrl, folderUrl, repositoriesIn } from "@/data/code";
import { copy, type Lang } from "@/i18n/config";
import { getLang } from "@/i18n/server";

export const FILE_URLS: Record<string, string> = Object.fromEntries(CODE_FILES.map((f) => [f.id, fileUrl(f.repository, f.path)]));

const COPY = copy({
  fr: {
    equations: "Système transcrit du notebook",
    sensitivity: "Figure du notebook d'analyse de sensibilité",
    phase: "Branches d'équilibre — chapitre 2",
    agents: "Démonstrateur individu-centré",
    distribution: "Expérience numérique : F(300) selon σ et δ",
  },
  en: {
    equations: "System transcribed from the notebook",
    sensitivity: "Figure from the sensitivity-analysis notebook",
    phase: "Equilibrium branches — chapter 2",
    agents: "Individual-based demonstrator",
    distribution: "Numerical experiment: F(300) against σ and δ",
  },
});

function VisualFrame({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="label mb-2 text-muted">{label}</p>
      {children}
    </div>
  );
}

function EquationsVisual({ label }: { label: string }) {
  return (
    <VisualFrame label={label}>
      <Equation display tex={String.raw`\dot S = (1-\delta)\sigma - \mu_S S`} />
      <Equation display tex={String.raw`\dot F = r(1-\rho)\tfrac{M+\varepsilon\eta S}{k+M+\eta S}\tfrac{F}{1+\beta F} - \mu_F F`} />
      <Equation display tex={String.raw`\dot M = r\rho\tfrac{M+\varepsilon\eta S}{k+M+\eta S}\tfrac{F}{1+\beta F} - \mu_M M + \delta\sigma`} />
    </VisualFrame>
  );
}

function SensitivityVisual({ label, lang }: { label: string; lang: Lang }) {
  const sens = figureIn(lang, "fig-ch3-sensitivity")!;
  return (
    <figure>
      <p className="label mb-2 text-muted">{label}</p>
      <Image src={sens.src} alt={sens.alt} width={sens.width} height={sens.height} className="h-auto w-full" sizes="(min-width: 1024px) 30vw, 100vw" />
    </figure>
  );
}

function RepositoryVisual() {
  return (
    <VisualFrame label="gitlab.com/marinecourtois/thesisData">
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
    </VisualFrame>
  );
}

function capabilityVisuals(lang: Lang) {
  const t = COPY[lang];
  return {
    equations: <EquationsVisual label={t.equations} />,
    phase: (
      <VisualFrame label={t.phase}>
        <BifurcationVisual className="h-auto w-full" lang={lang} />
      </VisualFrame>
    ),
    agents: (
      <VisualFrame label={t.agents}>
        <AgentSimulator compact />
      </VisualFrame>
    ),
    sensitivity: <SensitivityVisual label={t.sensitivity} lang={lang} />,
    distribution: (
      <VisualFrame label={t.distribution}>
        <ScenarioComparisonVisual className="h-auto w-full" lang={lang} />
      </VisualFrame>
    ),
    repository: <RepositoryVisual />,
  };
}

export async function CapabilitySection() {
  const lang = await getLang();
  const projects = projectsIn(lang).map(({ id, slug, title }) => ({ id, slug, title }));
  return (
    <CapabilityExplorer
      capabilities={capabilitiesIn(lang)}
      publications={publicationsIn(lang)}
      research={researchThemesIn(lang)}
      tools={toolsIn(lang)}
      projects={projects}
      visuals={capabilityVisuals(lang)}
    />
  );
}

export async function ThesisSection({ headingLevel = "h3" }: { headingLevel?: "h2" | "h3" }) {
  const lang = await getLang();
  const folderUrls: Record<number, string> = Object.fromEntries(
    THESIS_CHAPTERS.filter((c) => c.folder !== "—").map((c) => [c.number, folderUrl("thesisData", c.folder)]),
  );
  return (
    <ThesisExplorer
      headingLevel={headingLevel}
      chapters={THESIS_CHAPTERS}
      publications={publicationsIn(lang)}
      codeFiles={codeFilesIn(lang)}
      figures={figuresIn(lang)}
      fileUrls={FILE_URLS}
      folderUrls={folderUrls}
    />
  );
}

export async function CodeSection() {
  const lang = await getLang();
  return <CodeExplorer files={codeFilesIn(lang)} figures={figuresIn(lang)} fileUrls={FILE_URLS} repositories={repositoriesIn(lang)} />;
}
