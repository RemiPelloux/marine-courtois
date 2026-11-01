// Captures README screenshots from a running production server (default :3300).
import { chromium } from "@playwright/test";
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync } from "node:fs";

const BASE = process.env.BASE_URL ?? "http://localhost:3300";
const DIR = "docs/assets/screens";
mkdirSync(DIR, { recursive: true });
const browser = await chromium.launch();

async function shot(name, { path, width = 1440, height = 900, selector, scrollTo, wait = 1200, before }) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 2 });
  await page.goto(BASE + path, { waitUntil: "networkidle" });
  if (scrollTo) await page.locator(scrollTo).first().scrollIntoViewIfNeeded();
  if (before) await before(page);
  await page.waitForTimeout(wait);
  const png = `${DIR}/${name}.png`;
  if (selector) {
    // sticky header and skip link are stitched into tall element captures — hide them
    await page.addStyleTag({ content: 'header.sticky, a[href="#contenu"], nextjs-portal { display: none !important; }' });
    await page.locator(selector).first().screenshot({ path: png });
  }
  else await page.screenshot({ path: png });
  execFileSync("cwebp", ["-quiet", "-q", "82", "-resize", String(Math.min(width, 1440) * (selector ? 1 : 1)), "0", png, "-o", `${DIR}/${name}.webp`]);
  rmSync(png);
  await page.close();
}

await shot("hero", { path: "/", wait: 5000 });
await shot("model-explorer", {
  path: "/laboratoire",
  selector: "#module-1",
  height: 1100,
  before: async (p) => {
    const s = p.locator("#module-1").getByRole("slider", { name: /Mâles relâchés fertiles/ });
    await s.focus();
    for (let i = 0; i < 3; i++) await p.keyboard.press("ArrowRight");
    await p.locator("body").click({ position: { x: 5, y: 5 } });
  },
});
await shot("agents", { path: "/laboratoire", selector: "#module-3", scrollTo: "#module-3", wait: 9000 });
await shot("code", { path: "/laboratoire", selector: "#code", scrollTo: "#code" });
await shot("toolkit", { path: "/outils", selector: ".tk-stack", scrollTo: ".tk-stack", wait: 3000 });
await shot("timeline", { path: "/communications", selector: ".ctl", scrollTo: ".ctl", wait: 5500 });
await shot("fish", { path: "/", selector: "#poissons", scrollTo: "#poissons", wait: 3500 });
await shot("leaf", { path: "/parcours", selector: "section[aria-labelledby=feuille]", scrollTo: "section[aria-labelledby=feuille]", wait: 4500 });
await shot("depth", { path: "/publications/reponse-fonctionnelle-invasivite", selector: "#approfondir", scrollTo: "#approfondir", wait: 1500 });
await shot("publications", { path: "/publications", wait: 1500 });
await shot("axes", { path: "/", selector: "#recherche", scrollTo: "#recherche", wait: 1500 });
await shot("mobile-hero", { path: "/", width: 390, height: 844, wait: 2000 });
await shot("mobile-explorer", { path: "/laboratoire", width: 390, height: 844, scrollTo: "#module-1 [role=tablist]", wait: 1500 });
await browser.close();
console.log("done");
