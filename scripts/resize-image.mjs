/**
 * Downscale an image using Chromium via Playwright (no ffmpeg/imagemagick needed).
 * Usage: node scripts/resize-image.mjs <input> <output> [width] [height] [quality]
 */
import { chromium } from "file:///C:/Users/MY HOME/AppData/Roaming/npm/node_modules/playwright/index.mjs";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const [, , input, output, w = "2560", h = "1440", q = "80"] = process.argv;
if (!input || !output) {
  console.error("usage: node scripts/resize-image.mjs <input> <output> [w] [h] [quality]");
  process.exit(1);
}

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: Number(w), height: Number(h) },
  deviceScaleFactor: 1,
});
// Chromium's built-in image viewer scales the image to fit the viewport
await page.goto(pathToFileURL(resolve(input)).href);
await page.waitForLoadState("load");
await page.waitForTimeout(500);
await page.screenshot({ path: output, type: "jpeg", quality: Number(q) });
await browser.close();
console.log(`wrote ${output}`);
