import { describe, it, expect, vi, afterEach, beforeAll, afterAll } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { buildScene, LEVELS } from "@/components/fly-hunt/scene";
import { FlyHunt } from "@/components/fly-hunt/FlyHunt";

const wildOf = (seed: number, level = LEVELS[0]) => buildScene(seed, level).flies.filter((f) => f.kind === "wild");

// each visit draws its tree with Math.random; pinned to 0 here, the game plays tree 1
beforeAll(() => vi.spyOn(Math, "random").mockReturnValue(0));
afterAll(() => vi.restoreAllMocks());

describe("fly hunt scene", () => {
  it("draws the same tree for the same seed and a new one for the next", () => {
    expect(buildScene(1)).toEqual(buildScene(1));
    expect(buildScene(2).flies).not.toEqual(buildScene(1).flies);
  });

  it("hides one wild male among the release's sterile males", () => {
    LEVELS.forEach((level, i) => {
      const { flies } = buildScene(i + 3, level);
      expect(flies.filter((f) => f.kind === "wild")).toHaveLength(1);
      expect(flies.filter((f) => f.kind === "sterile")).toHaveLength(level.sterile);
    });
  });

  it("gets harder with bigger releases: more sterile males, smaller flies", () => {
    expect(LEVELS.map((l) => l.sterile)).toEqual([...LEVELS.map((l) => l.sterile)].sort((a, b) => a - b));
    expect(LEVELS.map((l) => l.size)).toEqual([...LEVELS.map((l) => l.size)].sort((a, b) => b - a));
  });

  it("never lays a leaf over the wild male", () => {
    const [f] = wildOf(7, LEVELS[2]);
    for (const l of buildScene(7, LEVELS[2]).front) expect(Math.hypot(f.x - l.x, f.y - l.y)).toBeGreaterThanOrEqual(16);
  });
});

const flyEl = (container: HTMLElement, id: number) => container.querySelector(`[data-fly="${id}"] ellipse`)!;

describe("FlyHunt", () => {
  afterEach(() => vi.useRealTimers());
  const [target] = wildOf(1);
  const sterile = buildScene(1).flies.find((f) => f.kind === "sterile")!.id;

  it("counts a sterile male as a mistake and stops at the wild male", () => {
    const { container } = render(<FlyHunt />);
    fireEvent.click(flyEl(container, sterile));
    expect(screen.getByText("Pas encore trouvé")).toBeInTheDocument();
    expect(screen.getByText("1 erreur")).toBeInTheDocument();
    fireEvent.click(flyEl(container, target.id));
    expect(screen.getByText("Mâle sauvage trouvé")).toBeInTheDocument();
    fireEvent.click(flyEl(container, sterile));
    expect(screen.getByText("1 erreur")).toBeInTheDocument();
  });

  it("starts the clock at the first click and stops it once he is found", () => {
    vi.useFakeTimers();
    const { container } = render(<FlyHunt />);
    act(() => vi.advanceTimersByTime(5000));
    expect(screen.getByText("0:00")).toBeInTheDocument();
    fireEvent.click(flyEl(container, sterile));
    act(() => vi.advanceTimersByTime(3000));
    fireEvent.click(flyEl(container, target.id));
    act(() => vi.advanceTimersByTime(5000));
    expect(screen.getByText("0:03")).toBeInTheDocument();
    expect(screen.getByText(/plus on lâche de mâles stériles/)).toBeInTheDocument();
  });

  it("switches release size and deals a new tree with a fresh score", () => {
    const { container } = render(<FlyHunt />);
    fireEvent.click(flyEl(container, sterile));
    fireEvent.click(screen.getByRole("button", { name: /Grand lâcher/ }));
    expect(screen.getByText("aucune erreur")).toBeInTheDocument();
    expect(container.querySelectorAll("[data-fly]")).toHaveLength(LEVELS[2].sterile + 1);
  });

  it("starts each visit on a random tree", async () => {
    vi.resetModules();
    vi.spyOn(Math, "random").mockReturnValue(0.42);
    const { FlyHunt: FreshVisit } = await import("@/components/fly-hunt/FlyHunt");
    const { container } = render(<FreshVisit />);
    const [hidden] = wildOf(1 + Math.floor(0.42 * 1e6));
    expect(container.querySelector(".fh-target")).toHaveAttribute("data-fly", String(hidden.id));
    vi.spyOn(Math, "random").mockReturnValue(0);
  });

  it("shows the fly to find in the corner of the tree", () => {
    render(<FlyHunt />);
    expect(screen.getByText("À trouver")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /Le mâle sauvage à trouver/ })).toHaveAttribute("src", expect.stringContaining("wild.webp"));
  });

  it("stamps the corner card once he is found, not when the answer is shown", () => {
    const { container, unmount } = render(<FlyHunt />);
    expect(screen.queryByText("Trouvé")).not.toBeInTheDocument();
    fireEvent.click(flyEl(container, target.id));
    expect(screen.getByText("Trouvé")).toBeInTheDocument();
    expect(container.querySelector(".fh-board")).toHaveClass("fh-won", "fh-over");
    unmount();
    render(<FlyHunt />);
    fireEvent.click(screen.getByRole("button", { name: "Montrer la réponse" }));
    expect(screen.queryByText("Trouvé")).not.toBeInTheDocument();
  });

  it("can show the answer without finding him", () => {
    const { container } = render(<FlyHunt />);
    fireEvent.click(screen.getByRole("button", { name: "Montrer la réponse" }));
    expect(container.querySelectorAll(".fh-ring")).toHaveLength(1);
    expect(screen.queryByRole("button", { name: "Montrer la réponse" })).not.toBeInTheDocument();
  });
});
