import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { pieceBumps, piecePath } from "@/lib/puzzle/geometry";
import { layoutPuzzle, COLS, ROWS } from "@/lib/puzzle/layout";
import { buildBoard } from "@/components/puzzle/board";
import { ToolPuzzle } from "@/components/puzzle/ToolPuzzle";
import { delayFor } from "@/components/puzzle/constants";
import { LangProvider } from "@/i18n/client";

describe("puzzle geometry", () => {
  it("gives neighbours complementary edges so the pieces interlock", () => {
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const b = pieceBumps(r, c, ROWS, COLS);
        if (c < COLS - 1) expect(b.right).toBe(-pieceBumps(r, c + 1, ROWS, COLS).left);
        if (r < ROWS - 1) expect(b.bottom).toBe(-pieceBumps(r + 1, c, ROWS, COLS).top);
        if (c > 0) expect(b.left).not.toBe(0);
      }
    }
  });

  it("keeps the border of the board flat", () => {
    expect(pieceBumps(0, 0, ROWS, COLS)).toMatchObject({ top: 0, left: 0 });
    expect(pieceBumps(ROWS - 1, COLS - 1, ROWS, COLS)).toMatchObject({ bottom: 0, right: 0 });
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
  const domains = ["a", "b", "c", "d", "e", "f", "g", "h", "i"];

  it("keeps the centre for the project, closes the cross with four themes and fills the bottom row with the rest", () => {
    const slots = layoutPuzzle(tools, domains);
    expect(slots).toHaveLength(ROWS * COLS);
    expect(slots.find((s) => s.kind === "project")).toMatchObject({ r: 2, c: 2 });
    const themes = slots.filter((s) => s.kind === "domain").map((s) => `${s.r},${s.c}`);
    expect(themes).toEqual(["1,2", "2,1", "2,3", "3,2", "5,0", "5,1", "5,2", "5,3", "5,4"]);
    expect(slots.filter((s) => s.kind === "tool").every((s) => s.r < COLS)).toBe(true);
    expect(new Set(slots.map((s) => `${s.r},${s.c}`)).size).toBe(ROWS * COLS);
  });

  it("refuses a theme count that does not fill the board", () => {
    expect(() => layoutPuzzle(tools, domains.slice(0, 4))).toThrow(/9 themes/);
  });

  it("refuses a tool count that does not fill the board", () => {
    expect(() => layoutPuzzle(tools.slice(1), domains)).toThrow(/20 tools/);
  });

  it("lands every tool before the themes and the themes before the centre", () => {
    expect(delayFor(20, 20)).toBeGreaterThan(delayFor(19, 20));
    expect(delayFor(28, 20) - delayFor(27, 20)).toBeLessThan(0.5);
    expect(delayFor(29, 20)).toBeGreaterThan(delayFor(28, 20) + 0.5);
  });
});

describe("ToolPuzzle", () => {
  it("builds the board from the real toolkit, machine learning included", () => {
    const board = buildBoard("fr");
    expect(board.tools).toHaveLength(20);
    expect(board.families.find((f) => f.id === "ml")?.count).toBe(4);
  });

  it("explains a family when it is picked, and dims the others", () => {
    const { container } = render(<ToolPuzzle board={buildBoard("fr")} />);
    const ml = screen.getByRole("button", { name: /Machine learning/ });
    fireEvent.click(ml);
    expect(ml).toHaveAttribute("aria-pressed", "true");
    expect(container.querySelector("figcaption")).toHaveTextContent("scikit-learn, PyTorch");
    expect(container.querySelectorAll('.pz-face[data-kind="tool"]:not([data-dim])')).toHaveLength(4);
    fireEvent.click(ml);
    expect(container.querySelectorAll(".pz-face[data-dim]")).toHaveLength(0);
  });

  it("links the empty centre to the contact page", () => {
    render(<ToolPuzzle board={buildBoard("fr")} />);
    expect(screen.getByRole("link", { name: /Votre projet/ })).toHaveAttribute("href", "/contact");
  });

  it("puts maths, stats, biology and ecology around the centre and five more themes below", () => {
    const board = buildBoard("fr");
    const at = (row: (r: number) => boolean) => board.slots.flatMap((s) => (s.kind === "domain" && row(s.r) ? [s.item.short] : []));
    expect(at((r) => r < COLS)).toEqual(["Maths", "Stats", "Biologie", "Écologie"]);
    expect(at((r) => r === ROWS - 1)).toEqual(["Populations", "Biocontrôle", "Modèles", "Data & ML", "Calcul"]);
  });

  it("links every theme to the page that backs it", () => {
    render(<ToolPuzzle board={buildBoard("fr")} />);
    expect(screen.getByRole("link", { name: "Écologie" })).toHaveAttribute("href", "/recherche#invasions-biologiques");
    expect(screen.getByRole("link", { name: "Statistiques" })).toHaveAttribute("href", "/recherche#invasions-biologiques");
    expect(screen.getByText("20 outils, 9 thèmes.")).toBeInTheDocument();
  });

  it("speaks English and links to English pages under /en", () => {
    render(
      <LangProvider lang="en">
        <ToolPuzzle board={buildBoard("en")} />
      </LangProvider>,
    );
    expect(screen.getByRole("link", { name: /Your project/ })).toHaveAttribute("href", "/en/contact");
    expect(screen.getByRole("link", { name: "Applied mathematics" })).toHaveAttribute("href", "/en/research#biocontrole");
    expect(screen.getByRole("link", { name: "Data science and machine learning" })).toHaveAttribute("href", "/en/research#multiomique");
    expect(screen.getByRole("button", { name: /Computing and modelling/ })).toBeInTheDocument();
  });
});
