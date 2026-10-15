/**
 * Scrolls through every track and screenshots it — visual verification for
 * the whole album. Run: node scripts/shoot-sections.mjs [baseURL]
 * Writes PNGs to the directory given via SHOTS_DIR (default: OS temp).
 */
import { chromium } from "file:///C:/Users/MY HOME/AppData/Roaming/npm/node_modules/playwright/index.mjs";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const BASE = process.argv[2] ?? "http://localhost:3000";
const OUT = process.env.SHOTS_DIR ?? join(tmpdir(), "bhavik-shots");
mkdirSync(OUT, { recursive: true });

const TRACKS = [
  ["01-intro", "#intro"],
  ["02-about", "#about"],
  ["03-skills", "#skills"],
  ["04-projects", "#projects"],
  ["05-experience", "#experience"],
  ["06-deliverables", "#deliverables"],
  ["07-contact", "#contact"],
];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(BASE, { waitUntil: "networkidle" });
await page.waitForTimeout(3000);

for (const [name, selector] of TRACKS) {
  await page.locator(selector).scrollIntoViewIfNeeded();
  // allow smooth scroll + reveal animations to settle
  await page.waitForTimeout(2200);
  await page.screenshot({ path: join(OUT, `${name}.png`) });
  console.log(`shot ${name}`);
}

await browser.close();
console.log(`done -> ${OUT}`);
