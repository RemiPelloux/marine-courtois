import { test, expect, type Page } from "@playwright/test";
import { ALL_ROUTES } from "./routes";

const ROUTES = ALL_ROUTES;

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

test("hero puzzle highlights a family and leads to contact", async ({ page }) => {
  await page.goto("/");
  const puzzle = page.locator("figure.pz");
  const ml = puzzle.getByRole("button", { name: /Machine learning/ });
  await ml.click();
  await expect(ml).toHaveAttribute("aria-pressed", "true");
  await expect(puzzle.locator("figcaption")).toContainText("scikit-learn");
  await expect(puzzle.locator('.pz-face[data-kind="tool"]:not([data-dim])')).toHaveCount(4);
  await puzzle.getByRole("link", { name: /Votre projet/ }).click();
  await expect(page).toHaveURL(/\/contact$/);
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });
  test("hero renders its final state immediately", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#hero-title")).toBeVisible();
    const piece = page.locator(".pz-in").first();
    await expect(piece).toHaveCSS("opacity", "1");
    await expect(piece).toHaveCSS("animation-name", "none");
  });
});

test("sitemap and robots are served", async ({ request }) => {
  const sm = await request.get("/sitemap.xml");
  expect(sm.status()).toBe(200);
  expect(await sm.text()).toContain("/publications/");
  expect((await request.get("/robots.txt")).status()).toBe(200);
});

test("the email stays hidden until a visitor asks for it", async ({ page }) => {
  await page.goto("/contact");
  expect(await page.content()).not.toContain("@inrae.fr");
  await page.getByRole("button", { name: "Afficher l'adresse électronique" }).first().click();
  await expect(page.locator('a[href^="mailto:"]').first()).toHaveText(/@inrae\.fr$/, { timeout: 4000 });
});

test("former URLs redirect to the new sections", async ({ request }) => {
  for (const [from, to] of [["/a-propos", "/parcours"], ["/methodes", "/outils"], ["/communication", "/communications"]]) {
    const r = await request.get(from, { maxRedirects: 0 });
    expect(r.status(), from).toBe(308);
    expect(r.headers().location).toContain(to);
  }
});

test("draft projects stay out of the site", async ({ page }) => {
  // with Cache Components the not-found page streams (status may stay 200); it must be noindex and show none of the draft
  for (const slug of ["deep-learning", "application-shiny"]) {
    await page.goto(`/projets/${slug}`);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("ne mène nulle part");
    await expect(page.locator('meta[name="robots"][content*="noindex"]').first()).toBeAttached();
    await expect(page.locator("body")).not.toContainText(/Expérimentations en deep learning|Application Shiny/);
  }
  await page.goto("/projets");
  await expect(page.locator("#contenu, main").first()).not.toContainText("Expérimentations en deep learning");
});

test("the competence puzzle opens a domain and follows the keyboard", async ({ page }) => {
  await page.goto("/parcours");
  const puzzle = page.getByRole("group", { name: /Compétences par domaine/ });
  await puzzle.getByRole("button", { name: /^Statistiques/ }).click();
  await expect(page.getByRole("heading", { level: 3, name: /Statistiques/ })).toBeVisible();
  await page.keyboard.press("Home");
  await expect(puzzle.getByRole("button", { name: /^Mathématiques/ })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("heading", { level: 3, name: /Mathématiques/ })).toBeVisible();
  await page.keyboard.press("End");
  await expect(page.getByRole("heading", { level: 3, name: /Écologie/ })).toBeVisible();
});

test("the aquarium pauses and its prey density can be changed", async ({ page }) => {
  await page.goto("/publications/reponse-fonctionnelle-invasivite");
  const tank = page.locator("figure").filter({ has: page.getByRole("img", { name: /Aquarium illustratif/ }) });
  await tank.scrollIntoViewIfNeeded();
  await tank.getByRole("button", { name: "Pause" }).click();
  await expect(tank.getByRole("button", { name: "Lecture" })).toBeVisible();
  const slider = tank.getByRole("slider", { name: /Densité de proies/ });
  await slider.focus();
  await page.keyboard.press("End");
  await expect(tank.locator("output").first()).toHaveText("90");
});

test("the publication index searches and exports BibTeX", async ({ page }) => {
  await page.goto("/publications");
  await page.getByRole("searchbox").fill("drosophila");
  await expect(page.getByRole("status").first()).toContainText("1 résultat");
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: /Exporter toutes les références/ }).click();
  expect((await download).suggestedFilename()).toBe("courtois-publications.bib");
});
