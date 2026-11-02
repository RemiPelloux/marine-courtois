import { test, expect, type Page } from "@playwright/test";

/** A view transition seen by the page: the shared-element groups it animated and whether it was aborted. */
type Recorded = { groups: Record<string, number>; aborted: string | null };

declare global {
  interface Window {
    __transitions: Recorded[];
  }
}

/** Wraps document.startViewTransition to record each transition's named groups and their durations. */
async function recordTransitions(page: Page) {
  await page.addInitScript(() => {
    window.__transitions = [];
    const start = document.startViewTransition?.bind(document);
    if (!start) return;
    document.startViewTransition = ((arg: Parameters<typeof start>[0]) => {
      const t = start(arg);
      const rec: Recorded = { groups: {}, aborted: null };
      window.__transitions.push(rec);
      t.ready.then(
        () => {
          for (const a of document.getAnimations()) {
            const pseudo = (a.effect as KeyframeEffect | null)?.pseudoElement ?? "";
            const name = /^::view-transition-group\((.+)\)$/.exec(pseudo)?.[1];
            if (name && name !== "root") rec.groups[name] = Number(a.effect?.getComputedTiming().duration ?? 0);
          }
        },
        (e: unknown) => (rec.aborted = String(e)),
      );
      return t;
    }) as typeof document.startViewTransition;
  });
}

/** Clicks a link to a detail page and returns the transition that carried the navigation. */
async function navigate(page: Page, selector: string, to: RegExp) {
  const link = page.locator(selector).first();
  await link.scrollIntoViewIfNeeded();
  await link.hover();
  await link.click();
  await page.waitForURL(to);
  await expect.poll(() => page.evaluate(() => window.__transitions.length)).toBeGreaterThan(0);
  await page.waitForTimeout(100);
  return page.evaluate(() => window.__transitions.at(-1)!);
}

test.describe("title morphs from a list into its detail page", () => {
  test.skip(({ browserName }) => browserName !== "chromium", "view transitions with types need Chromium");

  test("a publication title morphs into the publication header", async ({ page }) => {
    await recordTransitions(page);
    await page.goto("/publications");
    const href = await page.locator("main h2 a[href^='/publications/']").first().getAttribute("href");
    const slug = href!.split("/").pop();
    const t = await navigate(page, "main h2 a[href^='/publications/']", /\/publications\/.+/);
    expect(t.aborted).toBeNull();
    expect(t.groups[`pub-${slug}`]).toBeGreaterThan(0);
  });

  test("a project title morphs into the project header", async ({ page }) => {
    await recordTransitions(page);
    await page.goto("/projets");
    const href = await page.locator("main h3 a[href^='/projets/']").first().getAttribute("href");
    const slug = href!.split("/").pop();
    const t = await navigate(page, "main h3 a[href^='/projets/']", /\/projets\/.+/);
    expect(t.aborted).toBeNull();
    expect(t.groups[`project-${slug}`]).toBeGreaterThan(0);
  });

  test("with reduced motion the title swaps without animating", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await recordTransitions(page);
    await page.goto("/publications");
    const t = await navigate(page, "main h2 a[href^='/publications/']", /\/publications\/.+/);
    expect(t.aborted).toBeNull();
    expect(Object.values(t.groups).every((d) => d === 0)).toBe(true);
  });

  test("leaving a list page never aborts on a duplicated title name", async ({ page }) => {
    await recordTransitions(page);
    for (const [list, selector, to] of [
      ["/", "main a[href^='/publications/']", /\/publications\/.+/],
      ["/en/publications", "main h2 a[href^='/en/publications/']", /\/en\/publications\/.+/],
    ] as const) {
      await page.goto(list);
      const t = await navigate(page, selector, to);
      expect(t.aborted, list).toBeNull();
    }
  });
});
