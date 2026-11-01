// Usage: node scripts/scrollshots.mjs <path> <width> <outPrefix> [maxShots]
import { chromium } from "@playwright/test";
const [, , path = "/", width = "1440", prefix = "s", max = "20"] = process.argv;
const base = process.env.BASE_URL ?? "http://localhost:3100";
const w = Number(width);
const h = w < 600 ? 844 : 900;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: w, height: h } });
const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push(String(e)));
await page.goto(base + path, { waitUntil: "networkidle" });
await page.waitForTimeout(800);
const total = await page.evaluate(() => document.documentElement.scrollHeight);
let i = 0;
for (let y = 0; y < total && i < Number(max); y += h - 60, i++) {
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${prefix}-${String(i).padStart(2, "0")}.png` });
}
const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
console.log(JSON.stringify({ total, shots: i, overflow, errors: errors.slice(0, 8) }));
await browser.close();
