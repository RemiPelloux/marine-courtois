import { describe, it, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { PROJECTS, PUBLIC_PROJECTS, getProjectIn, projectsIn } from "@/data/projects";
import { CAPABILITIES, capabilitiesIn } from "@/data/skills";
import { CODE_FILES, codeFileIn, figureIn } from "@/data/code";
import { groupToolkit } from "@/data/toolkit";
import { LangProvider } from "@/i18n/client";
import { Toolkit } from "@/components/interactions/Toolkit";
import { MaturityBadge } from "@/components/projects/MaturityBadge";

const ode = PUBLIC_PROJECTS.find((p) => p.id === "modele-equations-differentielles");
const ibm = PUBLIC_PROJECTS.find((p) => p.id === "modele-individu-centre");

describe("the two modelling projects", () => {
  it("publishes the differential-equation project with its thesisData code and the BMB article", () => {
    expect(ode?.status).toBe("publie");
    expect(ode?.visibility).toBe("public");
    expect(ode?.publicationIds).toContain("pub-2025-residual-fertility");
    expect(ode?.links.map((l) => l.url)).toContain("https://gitlab.com/marinecourtois/thesisData");
    const repos = ode!.codeFileIds.map((id) => CODE_FILES.find((c) => c.id === id)?.repository);
    expect(repos).toContain("thesisData");
    expect(ode?.toolIds).toEqual(expect.arrayContaining(["python", "scipy", "sympy", "python-control", "numpy", "matplotlib"]));
  });

  it("keeps the equation model and the individual-based model distinct", () => {
    expect(ode?.slug).not.toBe(ibm?.slug);
    expect(ode?.toolIds).not.toContain("mesa");
    expect(ibm?.toolIds).toContain("mesa");
    expect(ibm?.toolIds).not.toContain("sympy");
    expect(ode?.codeFileIds.filter((id) => ibm?.codeFileIds.includes(id))).toEqual([]);
    expect(ibm?.links.map((l) => l.url)).toContain("https://gitlab.com/marinecourtois/sit_remating_abm");
  });

  it("explains the aim and the scientific value of every public project, in both languages", () => {
    for (const lang of ["fr", "en"] as const) {
      for (const p of projectsIn(lang)) {
        expect(p.objective, `${lang} ${p.id}`).not.toBe("");
        expect(p.value, `${lang} ${p.id}`).not.toBe("");
      }
    }
    const en = getProjectIn("en", "modele-equations-differentielles");
    expect(en?.title).toBe("Differential-equation models of the SIT");
    expect(en?.links[0].url).toBe(ode?.links[0].url);
  });

  it("never serves a draft, in either language", () => {
    expect(getProjectIn("en", "deep-learning")).toBeUndefined();
    expect(getProjectIn("fr", "application-shiny")).toBeUndefined();
    expect(PROJECTS.filter((p) => p.visibility === "draft").every((p) => p.results.length === 0)).toBe(true);
  });
});

describe("project and capability links", () => {
  it("resolves every code file a project cites", () => {
    for (const p of PROJECTS) for (const id of p.codeFileIds) expect(CODE_FILES.find((c) => c.id === id), `${p.id} → ${id}`).toBeDefined();
  });

  it("points every capability to public projects", () => {
    for (const c of CAPABILITIES) {
      expect(c.projectIds.length, c.id).toBeGreaterThan(0);
      for (const id of c.projectIds) expect(PUBLIC_PROJECTS.some((p) => p.id === id), `${c.id} → ${id}`).toBe(true);
    }
    expect(CAPABILITIES.find((c) => c.id === "statistique")?.toolIds).toContain("r");
  });

  it("translates capabilities, code files and figures while keeping facts", () => {
    const en = capabilitiesIn("en").find((c) => c.id === "formalisation");
    expect(en?.title).toBe("Mathematical formalisation");
    expect(en?.links[0].url).toBe("https://doi.org/10.1007/s11538-024-01401-1");
    const file = codeFileIn("en", "ch3-rf");
    expect(file?.description).toMatch(/^Simulations of the SIT model/);
    expect(file?.excerpt?.code).toBe(codeFileIn("fr", "ch3-rf")?.excerpt?.code);
    expect(figureIn("en", "fig-ch3-dynamics")?.src).toBe(figureIn("fr", "fig-ch3-dynamics")?.src);
    expect(codeFileIn("en", "missing")).toBeUndefined();
  });
});

describe("English rendering", () => {
  it("renders the toolkit in English inside an English provider", () => {
    render(
      <LangProvider lang="en">
        <Toolkit families={groupToolkit("en")} />
      </LangProvider>,
    );
    const total = groupToolkit("en").flatMap((f) => f.tools).length;
    expect(screen.getByRole("status")).toHaveTextContent(`${total} tools`);
    fireEvent.click(screen.getByRole("button", { name: "Also used" }));
    expect(screen.getByTestId("tool-python")).toHaveAttribute("data-dim", "true");
    expect(screen.getByRole("heading", { name: "Computing and modelling" })).toBeInTheDocument();
    expect(screen.queryByText(/outils/)).toBeNull();
  });

  it("writes the maturity label in the page language", () => {
    render(
      <LangProvider lang="en">
        <MaturityBadge status="demo" />
      </LangProvider>,
    );
    expect(screen.getByText("Demo available")).toBeInTheDocument();
    render(<MaturityBadge status="demo" />);
    expect(screen.getByText("Démonstration disponible")).toBeInTheDocument();
  });
});
