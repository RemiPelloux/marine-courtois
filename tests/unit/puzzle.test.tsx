import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { pieceBumps, piecePath } from "@/lib/puzzle/geometry";
import { layoutPuzzle, GRID } from "@/lib/puzzle/layout";
import { buildBoard } from "@/components/puzzle/board";
import { ToolPuzzle } from "@/components/puzzle/ToolPuzzle";
import { delayFor } from "@/components/puzzle/constants";

describe("puzzle geometry", () => {
  it("gives neighbours complementary edges so the pieces interlock", () => {
    for (let r = 0; r < GRID; r++) {
      for (let c = 0; c < GRID; c++) {
        const b = pieceBumps(r, c, GRID, GRID);
        if (c < GRID - 1) expect(b.right).toBe(-pieceBumps(r, c + 1, GRID, GRID).left);
        if (r < GRID - 1) expect(b.bottom).toBe(-pieceBumps(r + 1, c, GRID, GRID).top);
        if (c > 0) expect(b.left).not.toBe(0);
      }
    }
  });

  it("keeps the border of the board flat", () => {
    expect(pieceBumps(0, 0, GRID, GRID)).toMatchObject({ top: 0, left: 0 });
    expect(pieceBumps(GRID - 1, GRID - 1, GRID, GRID)).toMatchObject({ bottom: 0, right: 0 });
    expect(piecePath({ top: 0, right: 0, bottom: 0, left: 0 }, 100)).toBe("M0 0L100 0L100 100L0 100L0 0Z");
  });

  it("draws a tab outward and a blank inward", () => {
    const tab = piecePath({ top: 1, right: 0, bottom: 0, left: 0 }, 100);
    const blank = piecePath({ top: -1, right: 0, bottom: 0, left: 0 }, 100);
    expect(tab).toContain("50 -20");
    expect(blank).toContain("50 20");
  });
});

describe("puzzle layout", () => {
  const tools = Array.from({ length: 20 }, (_, i) => `t${i}`);
  const axes = ["a", "b", "c", "d"];

  it("keeps the centre for the project and surrounds it with the axes", () => {
    const slots = layoutPuzzle(tools, axes);
    expect(slots).toHaveLength(GRID * GRID);
    expect(slots.find((s) => s.kind === "project")).toMatchObject({ r: 2, c: 2 });
    const cross = slots.filter((s) => s.kind === "axis").map((s) => `${s.r},${s.c}`);
    expect(cross).toEqual(["1,2", "2,1", "2,3", "3,2"]);
    expect(new Set(slots.map((s) => `${s.r},${s.c}`)).size).toBe(GRID * GRID);
  });

  it("refuses a tool count that does not fill the board", () => {
    expect(() => layoutPuzzle(tools.slice(1), axes)).toThrow(/20 tools/);
  });

  it("lands every tool before the axes and the axes before the centre", () => {
    const last = delayFor(19, 20);
    expect(delayFor(20, 20)).toBeGreaterThan(last - 1);
    expect(delayFor(24, 20)).toBeGreaterThan(delayFor(23, 20) + 0.5);
  });
});

describe("ToolPuzzle", () => {
  it("builds the board from the real toolkit, machine learning included", () => {
    const board = buildBoard();
    expect(board.tools).toHaveLength(20);
    expect(board.families.find((f) => f.id === "ml")?.count).toBe(4);
  });

  it("explains a family when it is picked, and dims the others", () => {
    const { container } = render(<ToolPuzzle board={buildBoard()} />);
    const ml = screen.getByRole("button", { name: /Machine learning/ });
    fireEvent.click(ml);
    expect(ml).toHaveAttribute("aria-pressed", "true");
    expect(container.querySelector("figcaption")).toHaveTextContent("scikit-learn, PyTorch");
    expect(container.querySelectorAll('.pz-face[data-kind="tool"]:not([data-dim])')).toHaveLength(4);
    fireEvent.click(ml);
    expect(container.querySelectorAll(".pz-face[data-dim]")).toHaveLength(0);
  });

  it("links the empty centre to the contact page", () => {
    render(<ToolPuzzle board={buildBoard()} />);
    expect(screen.getByRole("link", { name: /Votre projet/ })).toHaveAttribute("href", "/contact");
  });
});
