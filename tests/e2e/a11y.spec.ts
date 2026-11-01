import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const ROUTES = [
  "/",
  "/recherche",
  "/recherche/fertilite-residuelle",
  "/methodes",
  "/publications",
  "/publications/polyandrie-technique-insecte-sterile",
  "/communication",
  "/enseignement",
  "/these",
  "/laboratoire",
  "/a-propos",
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
