import { describe, it, expect } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { delayFor, sweepFor } from "@/components/puzzle/constants";
import { buildBoard } from "@/components/puzzle/board";
import { ToolPuzzle } from "@/components/puzzle/ToolPuzzle";
import { DROP_TIME, dropDelay, selectDomain, type Selection } from "@/components/parcours/assembly";
import { buildCompetenceBoard } from "@/components/parcours/board";
import { CareerPuzzle } from "@/components/parcours/CareerPuzzle";

describe("hero puzzle: light wave after assembly", () => {
  const centreLands = delayFor(29, 20);

  it("starts after the centre lands and runs outward ring by ring", () => {
    const near = sweepFor(1, 2, 20);
    const far = sweepFor(5, 0, 20);
    expect(near).toBeGreaterThan(centreLands);
    expect(far).toBeGreaterThan(near);
    expect(sweepFor(2, 1, 20)).toBe(near);
  });

  it("is rounded to the millisecond, so server and browser write the same style", () => {
    for (const [r, c] of [[0, 0], [1, 3], [5, 4]]) {
      expect(String(sweepFor(r, c, 20))).toMatch(/^\d+(\.\d{1,3})?$/);
    }
  });

  it("lights every piece but the centre, each in its own grid cell", () => {
    const { container } = render(<ToolPuzzle board={buildBoard("fr")} />);
    expect(container.querySelectorAll("svg.pz-cell")).toHaveLength(30);
    expect(container.querySelectorAll(".pz-glint")).toHaveLength(29);
    expect(container.querySelector(".pz-project .pz-glint")).toBeNull();
  });
});

describe("career puzzle: a picked domain reassembles", () => {
  const start: Selection = { selected: "mathematiques", drops: {} };

  it("counts a pick only for the newly selected domain", () => {
    const next = selectDomain(start, "biologie");
    expect(next).toEqual({ selected: "biologie", drops: { biologie: 1 } });
    expect(selectDomain(next, "mathematiques").drops).toEqual({ biologie: 1, mathematiques: 1 });
  });

  it("ignores a pick of the domain already selected", () => {
    expect(selectDomain(start, "mathematiques")).toBe(start);
  });

  it("lands pieces in order, a six-piece block in under 600 ms", () => {
    expect(dropDelay(1)).toBeGreaterThan(dropDelay(0));
    expect(dropDelay(1) - dropDelay(0)).toBeGreaterThanOrEqual(0.04);
    expect(dropDelay(5) + DROP_TIME).toBeLessThan(0.6);
  });

  it("reassembles only the picked block, and not again on a second click", () => {
    const { container } = render(<CareerPuzzle board={buildCompetenceBoard("fr")} />);
    const block = (id: string) => container.querySelector<HTMLButtonElement>(`[data-domain="${id}"]`)!;
    expect(container.querySelectorAll("[data-drop]")).toHaveLength(0);

    fireEvent.click(block("biologie"));
    expect(block("biologie").querySelectorAll("[data-drop]")).toHaveLength(6);
    expect(container.querySelectorAll("[data-drop]")).toHaveLength(6);

    const first = block("biologie").querySelector(".pz-in");
    fireEvent.click(block("biologie"));
    expect(block("biologie").querySelector(".pz-in")).toBe(first);
  });
});
