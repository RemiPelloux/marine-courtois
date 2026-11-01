import { describe, it, expect } from "vitest";
import { danglingReferences, axisRelations, toolRealizations, projectsForPublication } from "@/data/relations";
import { RESEARCH_AXES } from "@/data/research-axes";
import { PROJECTS, PUBLIC_PROJECTS, getProject } from "@/data/projects";
import { COMMUNICATIONS } from "@/data/communications";
import { TEACHING_ACTIVITIES } from "@/data/teaching";
import { projectSchema } from "@/types/portfolio";

describe("content relations", () => {
  it("has no id pointing to nothing", () => {
    expect(danglingReferences()).toEqual([]);
  });
  it("attaches the individual-based model to the thesis axis", () => {
    expect(axisRelations(RESEARCH_AXES[0]).projects.map((p) => p.id)).toContain("modele-individu-centre");
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
  it("lists only the teaching Marine supplied", () => {
    expect(TEACHING_ACTIVITIES.map((t) => t.id)).toEqual(["polytech-genie-biologique", "isa-licence-pro", "m1-biocontrol", "m2-bioinformatique", "uca-l2", "uca-l3"]);
  });
});
