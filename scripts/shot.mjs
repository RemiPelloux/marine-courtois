// Usage: node scripts/shot.mjs <path> <width> <out.png> [fullPage] [waitMs]
import { chromium } from "@playwright/test";
const [, , path = "/", width = "1440", out = "shot.png", full = "0", wait = "1500"] = process.argv;
const base = process.env.BASE_URL ?? "http://localhost:3100";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: Number(width), height: Number(width) < 600 ? 844 : 900 }, deviceScaleFactor: 1 });
const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push(String(e)));
await page.goto(base + path, { waitUntil: "networkidle" });
await page.waitForTimeout(Number(wait));
await page.screenshot({ path: out, fullPage: full === "1" });
const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
console.log(JSON.stringify({ out, overflow, errors }));
await browser.close();
