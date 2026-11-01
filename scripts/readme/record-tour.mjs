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
          p < 1 ? requestAnimationFrame(step) : done();
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
const stage = () =>
  page.evaluate(() => {
    const h = [...document.querySelectorAll("#model-explorer h4")].find((e) => e.textContent?.startsWith("Explorer"));
    return h.getBoundingClientRect().top + window.scrollY - 96;
  });

await page.goto(BASE + "/", { waitUntil: "networkidle" });
// 1 — hero: the living system builds itself
await pause(6400);
const hero = page.locator("figure").filter({ has: page.locator("#living-system-title") });
const release = hero.getByRole("slider");
await press(release, "ArrowRight", 6, 220);
await pause(700);
await hero.getByRole("radio", { name: "Comparer" }).click();
await pause(1600);
await press(release, "ArrowLeft", 8, 180);
await pause(1200);

// 2 — Model Explorer
await glide(await top("#model-explorer"), 1800);
await pause(1100);
await glide(await stage(), 1200);
await pause(500);
const panel = page.locator("#model-explorer");
await press(panel.getByRole("slider", { name: /Mâles relâchés fertiles/ }), "ArrowRight", 6, 200);
await pause(600);
await press(panel.getByRole("slider", { name: /Intensité des lâchers/ }), "ArrowRight", 14, 90);
await pause(1200);
await glide(await top("#model-explorer") + 260, 900);
await panel.getByRole("tab", { name: "Accouplements multiples" }).click();
await pause(900);
await glide(await stage(), 900);
await press(panel.getByRole("slider", { name: /Intensité des lâchers/ }), "ArrowRight", 6, 260);
await pause(1400);
await glide(await top("#model-explorer") + 260, 900);
await panel.getByRole("tab", { name: "Dynamique des populations" }).click();
await pause(800);
await glide(await stage(), 900);
await press(panel.getByRole("slider", { name: /Population initiale/ }), "ArrowRight", 10, 160);
await pause(1600);

// 3 — publications
await glide(await top("#publications"), 1600);
await pause(1200);
await page.getByRole("button", { name: /Résumé/ }).first().click();
await pause(2200);

await context.close();
await browser.close();
const file = readdirSync(OUT).find((f) => f.endsWith(".webm"));
renameSync(`${OUT}/${file}`, `${OUT}/tour.webm`);
console.log(`${OUT}/tour.webm`);
