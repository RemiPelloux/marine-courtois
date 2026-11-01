import { test, expect, type Page } from "@playwright/test";

const ROUTES = [
  "/",
  "/recherche",
  "/recherche/fertilite-residuelle",
  "/methodes",
  "/publications",
  "/publications/polyandrie-technique-insecte-sterile",
  "/these",
  "/laboratoire",
  "/a-propos",
  "/contact",
];

function trackErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));
  return errors;
}

for (const route of ROUTES) {
  test(`renders ${route} without errors or horizontal overflow`, async ({ page }) => {
    const errors = trackErrors(page);
    const res = await page.goto(route);
    expect(res?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("main")).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    const title = await page.title();
    expect(title).toContain("Marine Courtois");
    const description = await page.locator('meta[name="description"]').getAttribute("content");
    expect(description?.length).toBeGreaterThan(40);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    expect(errors).toEqual([]);
  });
}

test("internal links all resolve", async ({ page, request }) => {
  const hrefs = new Set<string>();
  for (const route of ROUTES) {
    await page.goto(route);
    const links = await page.$$eval("a[href^='/']", (as) => as.map((a) => a.getAttribute("href")!.split("#")[0]));
    links.forEach((h) => h && hrefs.add(h));
  }
  for (const href of hrefs) {
    const r = await request.get(href);
    expect(r.status(), href).toBe(200);
  }
});

test("main navigation works", async ({ page, isMobile }) => {
  await page.goto("/");
  if (isMobile) await page.getByRole("button", { name: "Ouvrir le menu" }).click();
  const nav = page.getByRole("navigation", { name: isMobile ? "Navigation mobile" : "Navigation principale" });
  await nav.getByRole("link", { name: "Publications" }).click();
  await expect(page).toHaveURL(/\/publications$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Des questions");
});

test("publication filters update the index", async ({ page }) => {
  await page.goto("/publications");
  await expect(page.getByRole("status").first()).toContainText("4 résultats");
  await page.getByLabel("Année").selectOption("2026");
  await expect(page.getByRole("status").first()).toContainText("2 résultats");
});

test("scientific resources point to the verified sources", async ({ page }) => {
  await page.goto("/publications");
  for (const doi of ["10.1007/s11538-024-01401-1", "10.1371/journal.pcbi.1014212", "10.1111/1365-2656.70232"]) {
    await expect(page.locator(`a[href="https://doi.org/${doi}"]`).first()).toBeAttached();
  }
  await page.goto("/laboratoire");
  await expect(page.locator('a[href="https://gitlab.com/marinecourtois/thesisData"]').first()).toBeAttached();
  await expect(page.locator('a[href="https://gitlab.com/marinecourtois/sit_remating_abm"]').first()).toBeAttached();
});

test("model explorer controls and reset", async ({ page }) => {
  await page.goto("/laboratoire");
  const explorer = page.locator("#module-1");
  const sigma = explorer.getByRole("slider", { name: /Intensité des lâchers/ });
  await sigma.focus();
  await page.keyboard.press("End");
  await expect(explorer.locator("output").first()).toContainText("5");
  await explorer.getByRole("button", { name: /Réinitialiser/ }).click();
  await expect(explorer.locator("output").first()).toContainText("500");
  await explorer.getByRole("tab", { name: "Accouplements multiples" }).click();
  await expect(explorer.getByRole("tabpanel")).toContainText("First");
  await explorer.getByRole("tab", { name: "Dynamique des populations" }).press("ArrowLeft");
  await expect(explorer.getByRole("tab", { name: "Accouplements multiples" })).toHaveAttribute("aria-selected", "true");
});

test("hero living system can be paused and switched to comparison", async ({ page }) => {
  await page.goto("/");
  const hero = page.locator("figure").filter({ has: page.locator("#living-system-title") });
  await hero.getByRole("button", { name: "Pause" }).click();
  await expect(hero.getByRole("button", { name: "Lecture" })).toBeVisible();
  await hero.getByRole("radio", { name: "Comparer" }).click();
  await expect(hero).toContainText("Avec 1 % de mâles fertiles");
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });
  test("hero renders its final state immediately", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#hero-title")).toBeVisible();
    await expect(page.getByRole("button", { name: "Lecture" }).first()).toBeVisible();
  });
});

test("sitemap and robots are served", async ({ request }) => {
  const sm = await request.get("/sitemap.xml");
  expect(sm.status()).toBe(200);
  expect(await sm.text()).toContain("/publications/");
  expect((await request.get("/robots.txt")).status()).toBe(200);
});
