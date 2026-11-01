import { fireEvent, render, screen } from "@testing-library/react";
import { ARTICLES, COMMUNICATIONS } from "@/data/publications";
import { MILESTONES, dateToYear } from "@/data/milestones";
import { DECLARED_TOOLS, groupToolkit } from "@/data/toolkit";
import { TOOLS } from "@/data/skills";
import { declaredToolSchema } from "@/types/content";
import { INTRO, MOVE, STEP, axisX, filmCursor, filmDuration, reachedCount, OUTRO } from "@/components/timeline/film/layout";
import { Toolkit } from "@/components/interactions/Toolkit";

describe("milestones", () => {
  it("lists every communication, article and the defence, oldest first", () => {
    expect(MILESTONES).toHaveLength(COMMUNICATIONS.length + ARTICLES.length + 1);
    const dates = MILESTONES.map((m) => m.date);
    expect(dates).toEqual([...dates].sort());
    expect(MILESTONES.find((m) => m.kind === "doctorat")?.date).toBe("2025-11-27");
  });
  it("keeps only the acronym of an event as its short name", () => {
    expect(MILESTONES[0].short).toBe("ECMTB 2022");
  });
  it("places dates on a continuous year axis", () => {
    expect(dateToYear("2024")).toBe(2024);
    expect(dateToYear("2024-07")).toBe(2024.5);
    expect(dateToYear("2025-11-27")).toBeGreaterThan(dateToYear("2025-11"));
  });
});

describe("career film timing", () => {
  const n = 12;
  it("has no milestone before the intro ends", () => {
    expect(filmCursor(0, n)).toMatchObject({ index: -1, done: false });
    expect(reachedCount(INTRO - 1, n)).toBe(0);
  });
  it("counts a milestone once the playhead arrives on it", () => {
    expect(reachedCount(INTRO + MOVE - 1, n)).toBe(0);
    expect(reachedCount(INTRO + MOVE, n)).toBe(1);
    expect(reachedCount(INTRO + STEP + MOVE, n)).toBe(2);
  });
  it("ends with every milestone reached and the outro playing", () => {
    const last = filmDuration(n) - 1;
    expect(last).toBe(INTRO + n * STEP + OUTRO - 1);
    expect(filmCursor(last, n)).toMatchObject({ index: n - 1, done: true });
    expect(reachedCount(last, n)).toBe(n);
  });
  it("maps later dates further right, inside the padding", () => {
    const [w, pad] = [1280, 72];
    const xs = MILESTONES.map((m) => axisX(m.date, w, pad));
    expect(xs).toEqual([...xs].sort((a, b) => a - b));
    expect(Math.min(...xs)).toBeGreaterThan(pad);
    expect(Math.max(...xs)).toBeLessThan(w - pad);
  });
});

describe("toolkit", () => {
  const all = groupToolkit().flatMap((f) => f.tools);
  it("includes every published-code tool and every declared tool exactly once", () => {
    expect(all).toHaveLength(TOOLS.length + DECLARED_TOOLS.length);
    expect(new Set(all.map((t) => t.id)).size).toBe(all.length);
  });
  it("marks R, R Shiny, MySQL and Power BI as outside the published code", () => {
    for (const name of ["R", "R Shiny", "MySQL", "Power BI"]) {
      expect(all.find((t) => t.name === name)?.inPublicCode).toBe(false);
    }
    expect(all.find((t) => t.name === "Python")?.inPublicCode).toBe(true);
  });
  it("rejects a declared tool without a known family", () => {
    expect(() => declaredToolSchema.parse({ id: "x", name: "X", role: "y", family: "autre" })).toThrow();
  });
});

describe("Toolkit", () => {
  it("highlights the declared tools and dims the others", () => {
    render(<Toolkit families={groupToolkit()} />);
    expect(screen.getByRole("status")).toHaveTextContent(`${TOOLS.length + DECLARED_TOOLS.length} outils`);
    const declared = screen.getByRole("button", { name: "Également utilisés" });
    fireEvent.click(declared);
    expect(declared).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("status")).toHaveTextContent(`${DECLARED_TOOLS.length} outils`);
    expect(screen.getByTestId("tool-python")).toHaveAttribute("data-dim", "true");
    expect(screen.getByTestId("tool-r")).toHaveAttribute("data-dim", "false");
  });
  it("returns to every tool at full strength", () => {
    render(<Toolkit families={groupToolkit()} />);
    fireEvent.click(screen.getByRole("button", { name: "Dans le code publié" }));
    expect(screen.getByTestId("tool-power-bi")).toHaveAttribute("data-dim", "true");
    fireEvent.click(screen.getByRole("button", { name: "Tous" }));
    expect(screen.getByTestId("tool-power-bi")).toHaveAttribute("data-dim", "false");
  });
});
