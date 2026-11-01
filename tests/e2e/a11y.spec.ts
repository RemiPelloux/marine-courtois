import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const ROUTES = [
  "/",
  "/parcours",
  "/recherche",
  "/recherche/fertilite-residuelle",
  "/publications",
  "/publications/reponse-fonctionnelle-invasivite",
  "/communications",
  "/vulgarisation",
  "/enseignement",
  "/projets",
  "/projets/modele-individu-centre",
  "/outils",
  "/these",
  "/laboratoire",
  "/contact",
];

test.use({ reducedMotion: "reduce" });

for (const route of ROUTES) {
  test(`${route} has no WCAG 2.2 AA violations`, async ({ page }) => {
    await page.goto(route, { waitUntil: "networkidle" });
    const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
    const summary = violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.length} node(s) — ${v.nodes[0]?.target.join(" ")}`);
    expect(summary).toEqual([]);
  });
}
