import { render, screen, fireEvent, within } from "@testing-library/react";
import { PublicationIndex } from "@/components/interactions/PublicationIndex";
import { PUBLICATIONS } from "@/data/publications";

vi.mock("next/link", () => ({
  default: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

describe("PublicationIndex", () => {
  it("filters by year and resets", () => {
    render(<PublicationIndex publications={PUBLICATIONS} />);
    expect(screen.getByRole("status")).toHaveTextContent("4 résultats");
    fireEvent.change(screen.getByLabelText("Année"), { target: { value: "2025" } });
    expect(screen.getByRole("status")).toHaveTextContent("2 résultats");
    fireEvent.click(screen.getByRole("button", { name: "Effacer les filtres" }));
    expect(screen.getByRole("status")).toHaveTextContent("4 résultats");
  });
  it("filters by theme", () => {
    render(<PublicationIndex publications={PUBLICATIONS} />);
    fireEvent.change(screen.getByLabelText("Thème"), { target: { value: "Écologie des invasions" } });
    expect(screen.getByRole("status")).toHaveTextContent("1 résultat");
  });
  it("expands a publication row", () => {
    render(<PublicationIndex publications={PUBLICATIONS} showFilters={false} />);
    const btn = screen.getAllByRole("button", { name: /Résumé/ })[0];
    fireEvent.click(btn);
    expect(btn).toHaveAttribute("aria-expanded", "true");
    const row = btn.closest("article")!;
    expect(within(row).getAllByText(/DOI/).length).toBeGreaterThan(0);
  });
});
