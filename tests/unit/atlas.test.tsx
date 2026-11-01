import { describe, it, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { danglingReferences, axisRelations, toolRealizations, projectsForPublication } from "@/data/relations";
import { RESEARCH_AXES } from "@/data/research-axes";
import { PROJECTS, PUBLIC_PROJECTS, getProject } from "@/data/projects";
import { COMMUNICATIONS } from "@/data/communications";
import { EXPERIENCES } from "@/data/experiences";
import { publicQuestions } from "@/data/questions";
import { TEACHING_ACTIVITIES } from "@/data/teaching";
import { maskCells, maskBumps, growthOrder, leafMask } from "@/lib/puzzle/mask";
import { LEAF, buildCareerBoard, orderedExperiences } from "@/components/parcours/board";
import { CareerPuzzle } from "@/components/parcours/CareerPuzzle";
import { projectSchema } from "@/types/portfolio";

describe("content relations", () => {
  it("has no id pointing to nothing", () => {
    expect(danglingReferences()).toEqual([]);
  });
  it("gives every verified theme an axis, and axis D no invented question", () => {
    expect(RESEARCH_AXES.map((a) => a.letter)).toEqual(["A", "B", "C", "D"]);
    expect(axisRelations(RESEARCH_AXES[1]).projects.map((p) => p.id)).toContain("modele-individu-centre");
    expect(publicQuestions("emergentes")).toEqual([]);
  });
  it("links a tool to the projects that use it", () => {
    expect(toolRealizations("mesa").projects.map((p) => p.slug)).toEqual(["modele-individu-centre"]);
    expect(toolRealizations("power-bi").projects).toEqual([]);
    expect(projectsForPublication("pub-2026-functional-response").map((p) => p.slug)).toEqual(["reponses-fonctionnelles"]);
  });
});

describe("projects", () => {
  it("never publishes a draft", () => {
    const drafts = PROJECTS.filter((p) => p.visibility !== "public");
    expect(drafts.map((d) => d.id)).toEqual(["deep-learning", "application-shiny"]);
    for (const d of drafts) expect(getProject(d.slug)).toBeUndefined();
    expect(PUBLIC_PROJECTS.every((p) => p.results.length > 0)).toBe(true);
  });
  it("rejects an unknown maturity status", () => {
    const base = { ...PROJECTS[0], status: "fini" };
    expect(() => projectSchema.parse(base)).toThrow();
  });
});

describe("communications and teaching", () => {
  it("holds the twelve HAL records, newest first, without duplicates", () => {
    expect(COMMUNICATIONS).toHaveLength(12);
    expect(new Set(COMMUNICATIONS.map((c) => c.halId)).size).toBe(12);
    const dates = COMMUNICATIONS.map((c) => c.date);
    expect(dates).toEqual([...dates].sort().reverse());
    expect(COMMUNICATIONS.filter((c) => c.type === "poster")).toHaveLength(4);
  });
  it("lists no teaching that was not supplied", () => {
    expect(TEACHING_ACTIVITIES).toEqual([]);
  });
});

describe("career leaf", () => {
  it("has one cell per verified piece, interlocking inside and flat on the outline", () => {
    const cells = maskCells(LEAF);
    expect(cells).toHaveLength(EXPERIENCES.length);
    for (const { r, c } of cells) {
      const b = maskBumps(LEAF, r, c);
      if (LEAF[r][c + 1] === "#") expect(b.right).toBe(-maskBumps(LEAF, r, c + 1).left);
      else expect(b.right).toBe(0);
      if (LEAF[r + 1]?.[c] === "#") expect(b.bottom).toBe(-maskBumps(LEAF, r + 1, c).top);
      else expect(b.bottom).toBe(0);
    }
  });
  it("grows from the stalk to the tip, in chronological order, skills last", () => {
    const order = growthOrder(maskCells(LEAF));
    expect(order[0].r).toBe(LEAF.length - 1);
    expect(order.at(-1)!.r).toBe(0);
    const items = orderedExperiences();
    const dated = items.filter((e) => e.date).map((e) => e.date!);
    expect(dated).toEqual([...dated].sort());
    expect(items.at(-1)!.kind).toBe("competence");
  });
  it("refuses a silhouette that does not match the number of pieces", () => {
    expect(() => buildCareerBoard(EXPERIENCES, ["##"])).toThrow(/cells/);
  });
  it("draws a leaf for any number of pieces, so adding a career entry never breaks it", () => {
    expect(leafMask(24)).toEqual(["..##..", ".####.", "######", "######", ".####.", "..##.."]);
    for (let n = 3; n <= 40; n++) {
      const mask = leafMask(n);
      expect(maskCells(mask)).toHaveLength(n);
      for (let r = 1; r < mask.length; r++) {
        const overlap = [...mask[r]].some((ch, c) => ch === "#" && mask[r - 1][c] === "#");
        expect(overlap, `n=${n} row ${r}`).toBe(true);
      }
    }
  });
  it("selects a piece and moves with the arrow keys", () => {
    render(<CareerPuzzle board={buildCareerBoard()} />);
    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent("Doctorante");
    const doctorat = screen.getByRole("button", { name: /^Doctorat/ });
    fireEvent.keyDown(doctorat, { key: "ArrowRight" });
    expect(screen.getByRole("button", { pressed: true })).not.toBe(doctorat);
    fireEvent.click(screen.getByRole("button", { name: /^Soutenance/ }));
    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent("Soutenance de thèse");
  });
});
