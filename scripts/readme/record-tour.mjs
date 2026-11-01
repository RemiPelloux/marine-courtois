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
const stage = () =>
  page.evaluate(() => {
    const h = [...document.querySelectorAll("#model-explorer h3")].find((e) => e.textContent?.startsWith("Explorer"));
    return h.getBoundingClientRect().top + window.scrollY - 96;
  });

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

// 2 — three research axes, then the Model Explorer
await glide(await top("#recherche"), 1600);
await pause(2000);

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

// 3 — communication: the timeline sweeps 2022 → 2026, then teaching
await glide(await top(".ctl"), 1800);
await pause(4600);
await glide(await top("#enseignement"), 1400);
await pause(1800);

// 4 — publications
await glide(await top("#publications"), 1600);
await pause(1200);
await page.getByRole("button", { name: /Résumé/ }).first().click();
await pause(2200);

await context.close();
await browser.close();
const file = readdirSync(OUT).find((f) => f.endsWith(".webm"));
renameSync(`${OUT}/${file}`, `${OUT}/tour.webm`);
console.log(`${OUT}/tour.webm`);
