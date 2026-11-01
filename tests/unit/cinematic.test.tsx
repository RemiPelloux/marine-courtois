import { render, screen } from "@testing-library/react";
import { PUBLICATIONS } from "@/data/publications";
import { RESEARCH_THEMES } from "@/data/research";
import { publicationPreviews, researchRailItems } from "@/data/research-rail";
import { ResearchRail, railShift } from "@/components/interactions/ResearchRail";
import { ScrubText } from "@/components/editorial/ScrubText";
import { KineticTitle } from "@/components/editorial/KineticTitle";

vi.mock("next/image", () => ({
  default: ({ alt, src }: { alt: string; src: string }) => <span role="img" aria-label={alt} data-src={src} />,
}));

describe("research rail data", () => {
  const items = researchRailItems();
  it("has one panel per detail page, in order, each labelled by its axis", () => {
    expect(items.map((i) => i.slug)).toEqual(RESEARCH_THEMES.map((t) => t.slug));
    expect(new Set(items.map((i) => i.axis))).toEqual(new Set(["A", "B"]));
  });
  it("names the thesis chapter and articles behind each figure", () => {
    expect(items[0].sources).toMatch(/^Thèse, chapitre 2 · /);
    expect(items.find((i) => i.slug === "fertilite-residuelle")?.sources).toBe("Thèse, chapitre 3 · Bulletin of Mathematical Biology 2025");
    expect(researchRailItems("en")[0].sources).toMatch(/^Thesis, chapter 2 · /);
  });
  it("leaves a theme without a thesis figure figureless rather than borrowing one", () => {
    const invasions = items.find((i) => i.slug === "ecologie-des-invasions");
    expect(invasions?.figure).toBeUndefined();
  });
});

describe("railShift", () => {
  it("slides the track so its last panel ends inside the viewport", () => {
    // track = 6 × 56vw + 2 × 5vw = 346vw, of which 246vw slide out
    expect(railShift(6)).toBeCloseTo((246 / 346) * 100, 5);
  });
  it("does not move a track narrower than the viewport", () => {
    expect(railShift(1)).toBe(0);
  });
});

describe("publicationPreviews", () => {
  const previews = publicationPreviews(PUBLICATIONS);
  it("gives the thesis the figure of its first research theme", () => {
    expect(previews["these-2025"]?.src).toBe(researchRailItems()[0].figure?.src);
  });
  it("gives no preview to a publication whose themes have no figure", () => {
    expect(previews["pub-2026-functional-response"]).toBeUndefined();
  });
});

describe("cinematic components without motion", () => {
  it("renders every rail panel with a link to its theme page", () => {
    render(<ResearchRail items={researchRailItems()} />);
    expect(screen.getAllByRole("link", { name: /Lire le détail/ })).toHaveLength(RESEARCH_THEMES.length);
    expect(screen.getByRole("link", { name: /Fertilité résiduelle/ })).toHaveAttribute("href", "/recherche/fertilite-residuelle");
  });
  it("keeps a scrubbed statement readable as one sentence", () => {
    render(<ScrubText text="Comprendre le vivant par le modèle." />);
    expect(screen.getByText(/Comprendre/).closest("p")).toHaveTextContent("Comprendre le vivant par le modèle.");
  });
  it("renders a kinetic title as a real heading", () => {
    render(<KineticTitle as="h1">Explorer les modèles.</KineticTitle>);
    expect(screen.getByRole("heading", { level: 1, name: "Explorer les modèles." })).toBeInTheDocument();
  });
});
