/**
 * Scroll-position sweep of the one-page studio site — screenshots each scene
 * at desktop + mobile. Run: node scripts/shoot-page.mjs [baseURL]
 * Writes PNGs to SHOTS_DIR (default: OS temp).
 */
import { chromium } from "file:///C:/Users/MY HOME/AppData/Roaming/npm/node_modules/playwright/index.mjs";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const BASE = process.argv[2] ?? "http://localhost:3000";
const OUT = process.env.SHOTS_DIR ?? join(tmpdir(), "bhavik-studio-shots");
mkdirSync(OUT, { recursive: true });

const SCENES = ["hero", "showing", "origin", "cast", "press", "pitch", "premiere"];

const browser = await chromium.launch();

async function sweep(width, height, suffix) {
  const context = await browser.newContext({ viewport: { width, height } });
  // skip the intro so shots capture the page, not the loader
  await context.addInitScript(() => sessionStorage.setItem("bhavik-studios-intro-seen", "1"));
  const page = await context.newPage();
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);

  for (const scene of SCENES) {
    await page.evaluate((id) => document.getElementById(id)?.scrollIntoView(), scene);
    await page.waitForTimeout(900);
    await page.screenshot({ path: join(OUT, `${scene}-${suffix}.png`) });
    console.log(`shot ${scene}-${suffix}`);
  }

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(900);
  await page.screenshot({ path: join(OUT, `bottom-${suffix}.png`) });

  await context.close();
}

// intro frames on a fresh context (no seeding)
const introContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const introPage = await introContext.newPage();
await introPage.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
for (const [name, at] of [["intro-early", 900], ["intro-count", 2100], ["intro-late", 3200]]) {
  await introPage.waitForTimeout(at - (name === "intro-count" ? 900 : name === "intro-late" ? 2100 : 0));
  await introPage.screenshot({ path: join(OUT, `${name}.png`) });
}
await introContext.close();

await sweep(1440, 900, "desktop");
await sweep(375, 667, "mobile");

await browser.close();
console.log(`done → ${OUT}`);
