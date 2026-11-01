// Records a choreographed tour of the site for the README.
//   pnpm build && pnpm start -p 3300   (in another terminal)
//   node scripts/readme/record-tour.mjs && bash scripts/readme/encode-tour.sh
import { chromium } from "@playwright/test";
import { mkdirSync, readdirSync, renameSync } from "node:fs";

const BASE = process.env.BASE_URL ?? "http://localhost:3300";
const OUT = "docs/assets/.video";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1280, height: 800 },
  deviceScaleFactor: 1,
  recordVideo: { dir: OUT, size: { width: 1280, height: 800 } },
});
const page = await context.newPage();
const pause = (ms) => page.waitForTimeout(ms);
async function glide(to, duration = 1400) {
  await page.evaluate(
    ([target, d]) =>
      new Promise((done) => {
        const from = window.scrollY;
        const start = performance.now();
        const ease = (t) => 1 - Math.pow(1 - t, 3);
        const step = (now) => {
          const p = Math.min(1, (now - start) / d);
          window.scrollTo(0, from + (target - from) * ease(p));
          if (p < 1) requestAnimationFrame(step);
          else done();
        };
        requestAnimationFrame(step);
      }),
    [to, duration],
  );
}
async function press(locator, key, times, gap = 140) {
  await locator.focus();
  for (let i = 0; i < times; i++) {
    await page.keyboard.press(key);
    await pause(gap);
  }
}
const top = (sel) => page.evaluate((s) => document.querySelector(s).getBoundingClientRect().top + window.scrollY - 90, sel);

await page.goto(BASE + "/", { waitUntil: "networkidle" });
// 1 — hero: the tool puzzle assembles, then one family is picked
await pause(4600);
const puzzle = page.locator("figure.pz");
await puzzle.getByRole("button", { name: /Machine learning/ }).click();
await pause(1600);
await puzzle.getByRole("button", { name: /Machine learning/ }).click();
await puzzle.locator('.pz-face[data-kind="tool"]').nth(0).hover();
await pause(1300);
await puzzle.getByRole("link", { name: /Votre projet/ }).hover();
await pause(1400);

// 2 — the aquarium: more prey, captures level off
await glide(await top("#poissons"), 1800);
await pause(1800);
const density = page.locator("#poissons").getByRole("slider", { name: /Densité de proies/ });
await press(density, "ArrowRight", 22, 120);
await pause(2600);

// 3 — research axes A–D, then the career leaf grows
await glide(await top("#recherche"), 1600);
await pause(2000);
await glide(await top("#parcours-titre"), 1600);
await pause(3600);
const leaf = page.getByRole("group", { name: /Parcours en puzzle/ });
for (const name of [/^JFSMA 2024/, /^Article BMB/, /^PLOS Comp/]) {
  await leaf.getByRole("button", { name }).hover();
  await pause(1100);
}

// 4 — transmettre
await glide(await top("#enseignement"), 1400);
await pause(1600);

// 5 — publications
await glide(await top("#publications"), 1600);
await pause(1200);
await page.getByRole("button", { name: /Résumé/ }).first().click();
await pause(2200);

await context.close();
await browser.close();
const file = readdirSync(OUT).find((f) => f.endsWith(".webm"));
renameSync(`${OUT}/${file}`, `${OUT}/tour.webm`);
console.log(`${OUT}/tour.webm`);
