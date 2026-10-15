/**
 * Interaction shots for the hero: idle vs pointer-left vs pointer-right
 * (face parallax + card tilt), plus button hover (magnetic + shine).
 */
import { chromium } from "file:///C:/Users/MY HOME/AppData/Roaming/npm/node_modules/playwright/index.mjs";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const OUT = process.env.SHOTS_DIR ?? join(tmpdir(), "bhavik-shots");
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForTimeout(4500);

await page.screenshot({ path: join(OUT, "ix-idle.png") });

// pointer top-right: face should drift left, card should tilt right
await page.mouse.move(1250, 180);
await page.waitForTimeout(900);
await page.screenshot({ path: join(OUT, "ix-right.png") });

// pointer bottom-left
await page.mouse.move(300, 620);
await page.waitForTimeout(900);
await page.screenshot({ path: join(OUT, "ix-left.png") });

// hover the primary button (magnetic pull + shine sweep mid-transition)
await page.mouse.move(250, 615, { steps: 8 });
await page.waitForTimeout(300);
await page.screenshot({ path: join(OUT, "ix-hover.png") });

await browser.close();
console.log(`done -> ${OUT}`);
