import { test, expect } from "@playwright/test";
import { EN_ROUTES, FR_ROUTES } from "./routes";

/** Words that only show up in French prose. Elements marked lang="fr" (French-only sources) are skipped. */
const FRENCH = /\b(les|des|une|pour|avec|dans|sont|aux|leur|cette|ces|nous|vous|sur la|de la|du|au)\b/gi;

test("each language declares itself and links to the other", async ({ page }) => {
  await page.goto("/recherche");
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute("href", /\/en\/research$/);
  await page.goto("/en/research");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/en\/research$/);
  await expect(page.locator('link[rel="alternate"][hreflang="fr"]')).toHaveAttribute("href", /\/recherche$/);
});

test("the language switch opens the same page in the other language", async ({ page }) => {
  await page.goto("/projets/modele-individu-centre");
  await page.getByRole("link", { name: "English" }).click();
  await expect(page).toHaveURL(/\/en\/projects\/modele-individu-centre$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await page.getByRole("link", { name: "Français" }).click();
  await expect(page).toHaveURL(/\/projets\/modele-individu-centre$/);
});

test("prefixed French and half-translated English URLs redirect to the canonical ones", async ({ request }) => {
  for (const [from, to] of [["/fr/recherche", "/recherche"], ["/fr", "/"], ["/en/recherche", "/en/research"], ["/en/projets/x", "/en/projects/x"]]) {
    const r = await request.get(from, { maxRedirects: 0 });
    expect(r.status(), from).toBe(308);
    expect(new URL(r.headers().location, "http://x").pathname, from).toBe(to);
  }
});

test("unknown pages get the site's not-found page in their language", async ({ page }) => {
  await page.goto("/nope");
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");
  await expect(page.locator("header").first()).toBeVisible();
  await page.goto("/en/nope");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator('meta[name="robots"][content*="noindex"]').first()).toBeAttached();
});

for (const route of EN_ROUTES) {
  test(`${route} is written in English`, async ({ page }) => {
    await page.goto(route);
    const text = await page.evaluate(() => {
      const clone = document.body.cloneNode(true) as HTMLElement;
      clone.querySelectorAll('[lang="fr"], script, style, pre, code').forEach((n) => n.remove());
      return clone.innerText;
    });
    const hits = [...text.matchAll(FRENCH)].map((m) => text.slice(Math.max(0, m.index - 30), m.index + 30).replace(/\s+/g, " "));
    expect(hits).toEqual([]);
  });
}

test("French pages stay in French", async ({ page }) => {
  for (const route of FR_ROUTES.slice(0, 3)) {
    await page.goto(route);
    await expect(page.locator("html")).toHaveAttribute("lang", "fr");
    await expect(page.getByRole("navigation", { name: "Langue" })).toBeVisible();
  }
});
