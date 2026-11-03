import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { buildScene, LEVELS } from "@/components/fly-hunt/scene";
import { FlyHunt } from "@/components/fly-hunt/FlyHunt";

const wildOf = (seed: number, level = LEVELS[0]) => buildScene(seed, level).flies.filter((f) => f.kind === "wild");

describe("fly hunt scene", () => {
  it("draws the same tree for the same seed and a new one for the next", () => {
    expect(buildScene(1)).toEqual(buildScene(1));
    expect(buildScene(2).flies).not.toEqual(buildScene(1).flies);
  });

  it("hides the level's wild male among look-alikes and sterile males", () => {
    LEVELS.forEach((level, i) => {
      const { flies } = buildScene(i + 3, level);
      expect(flies).toHaveLength(level.flies);
      expect(flies.filter((f) => f.kind === "wild")).toHaveLength(level.find);
      for (const [kind, n] of Object.entries(level.decoys)) expect(flies.filter((f) => f.kind === kind)).toHaveLength(n);
    });
  });

  it("gets harder with each level: rarer, smaller, more look-alikes, more cover", () => {
    const share = LEVELS.map((l) => l.find / l.flies);
    const decoys = LEVELS.map((l) => Object.values(l.decoys).reduce((a, b) => a + b, 0));
    expect(share).toEqual([...share].sort((a, b) => b - a));
    expect(LEVELS.map((l) => l.size)).toEqual([...LEVELS.map((l) => l.size)].sort((a, b) => b - a));
    expect(decoys).toEqual([...decoys].sort((a, b) => a - b));
    expect(LEVELS.map((l) => l.cover)).toEqual([0, 1, 2]);
  });

  it("covers the wild male's jumper on hard levels, never his hat", () => {
    const [f] = wildOf(7, LEVELS[2]);
    const close = buildScene(7, LEVELS[2]).front.filter((l) => Math.hypot(f.x - l.x, f.y - l.y) < 16);
    expect(close).toHaveLength(LEVELS[2].cover);
    for (const l of close) expect(l.y).toBeGreaterThan(f.y);
    const [easy] = wildOf(7, LEVELS[0]);
    expect(buildScene(7, LEVELS[0]).front.filter((l) => Math.hypot(easy.x - l.x, easy.y - l.y) < 16)).toHaveLength(0);
  });
});

const flyEl = (container: HTMLElement, id: number) => container.querySelector(`[data-fly="${id}"] ellipse`)!;

describe("FlyHunt", () => {
  afterEach(() => vi.useRealTimers());
  const target = wildOf(1).map((f) => f.id);
  const other = buildScene(1).flies.find((f) => f.kind !== "wild")!.id;

  it("counts the wild male once, and a sterile male as a mistake", () => {
    const { container } = render(<FlyHunt />);
    fireEvent.click(flyEl(container, other));
    expect(screen.getByText("0 sur 1 trouvé")).toBeInTheDocument();
    expect(screen.getByText("1 erreur")).toBeInTheDocument();
    fireEvent.click(flyEl(container, target[0]));
    fireEvent.click(flyEl(container, target[0]));
    expect(screen.getByText("1 sur 1 trouvé")).toBeInTheDocument();
    expect(screen.getByText("1 erreur")).toBeInTheDocument();
  });

  it("starts the clock at the first click and stops it once all are found", () => {
    vi.useFakeTimers();
    const { container } = render(<FlyHunt />);
    act(() => vi.advanceTimersByTime(5000));
    expect(screen.getByText("0:00")).toBeInTheDocument();
    fireEvent.click(flyEl(container, other));
    act(() => vi.advanceTimersByTime(3000));
    fireEvent.click(flyEl(container, target[0]));
    act(() => vi.advanceTimersByTime(5000));
    expect(screen.getByText("0:03")).toBeInTheDocument();
    expect(screen.getByText(/on rend le mâle sauvage difficile à trouver/)).toBeInTheDocument();
  });

  it("switches level and deals a new tree with a fresh score", () => {
    const { container } = render(<FlyHunt />);
    fireEvent.click(flyEl(container, other));
    fireEvent.click(screen.getByRole("button", { name: /Niveau 3/ }));
    expect(screen.getByText("aucune erreur")).toBeInTheDocument();
    expect(container.querySelectorAll("[data-fly]")).toHaveLength(LEVELS[2].flies);
  });

  it("shows the fly to find in the corner of the tree", () => {
    render(<FlyHunt />);
    expect(screen.getByText("À trouver")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /Le mâle sauvage à trouver/ })).toHaveAttribute("src", expect.stringContaining("wild.webp"));
  });

  it("can show the answer without finding them", () => {
    const { container } = render(<FlyHunt />);
    fireEvent.click(screen.getByRole("button", { name: "Montrer la réponse" }));
    expect(container.querySelectorAll(".fh-ring")).toHaveLength(LEVELS[0].find);
    expect(screen.queryByRole("button", { name: "Montrer la réponse" })).not.toBeInTheDocument();
  });
});
