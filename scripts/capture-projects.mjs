/**
 * Captures live product imagery for the four films: one full-width landscape
 * landing view (1600x1000) per deployed project, encoded to WebP in-page via
 * a Chromium canvas. The full width of each site is always in frame — nothing
 * is sliced mid-element; only the natural below-the-fold continuation is
 * cropped. Failures warn and continue — existing captures are never deleted,
 * so the gradient fallbacks keep working. Re-run when a source site changes.
 * Run: node scripts/capture-projects.mjs [--strict]
 */
import { chromium } from "file:///C:/Users/MY HOME/AppData/Roaming/npm/node_modules/playwright/index.mjs";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = path.join(ROOT, "public", "screenshots");

const STRICT = process.argv.includes("--strict");
const VIEWPORT = { width: 1600, height: 1000 };
const WEBP_QUALITY = 76;
const SIZE_WARN_BYTES = 250 * 1024;

const PROJECTS = [
  { slug: "prachlit", url: "https://www.prachlit.in", settle: 1500 },
  { slug: "photobooth", url: "https://bhaviks-photobooth.vercel.app/", settle: 2500 },
  { slug: "ems", url: "https://bhaviksems.vercel.app/", settle: 2500 },
  { slug: "stopwatch", url: "https://bhavik-stopwatch.netlify.app", settle: 1500 },
];

/** Encode the raw PNG shot to WebP at native size, inside the browser. */
async function toWebP(page, dataUrl) {
  return page.evaluate(async (source) => {
    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = () => reject(new Error("screenshot decode failed"));
      img.src = source.dataUrl;
    });
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    canvas.getContext("2d").drawImage(img, 0, 0);
    return canvas.toDataURL("image/webp", source.quality);
  }, { dataUrl, quality: WEBP_QUALITY });
}

const browser = await chromium.launch({
  args: [
    // photobooth may auto-open the camera: render a fake feed instead of
    // hanging on a permission prompt
    "--use-fake-ui-for-media-stream",
    "--use-fake-device-for-media-stream",
  ],
});

await mkdir(OUT_DIR, { recursive: true });

let captured = 0;
let totalBytes = 0;
const failed = [];

for (const project of PROJECTS) {
  const context = await browser.newContext({ viewport: VIEWPORT });
  const page = await context.newPage();
  try {
    await page.goto(project.url, { waitUntil: "networkidle", timeout: 45000 });
    // client-rendered apps need a beat after networkidle to finish hydrating
    await page.waitForTimeout(project.settle);

    const shot = await page.screenshot({ type: "png" });
    const dataUrl = `data:image/png;base64,${shot.toString("base64")}`;
    const webp = await toWebP(page, dataUrl);

    const isWebp = webp.startsWith("data:image/webp");
    if (!isWebp) {
      console.log(`WARN  ${project.slug}: WebP encode unsupported, writing PNG`);
    }
    const file = path.join(OUT_DIR, `${project.slug}.${isWebp ? "webp" : "png"}`);
    const bytes = Buffer.from(webp.split(",")[1], "base64");
    await writeFile(file, bytes);
    totalBytes += bytes.length;
    const kb = Math.round(bytes.length / 1024);
    console.log(`${kb > SIZE_WARN_BYTES / 1024 ? "WARN " : "shot "} ${project.slug}.${isWebp ? "webp" : "png"}  ${kb}KB`);
    captured += 1;
  } catch (error) {
    console.log(`WARN  ${project.slug}: capture failed — ${error.message}`);
    console.log("      (existing captures untouched; gradients remain the fallback)");
    failed.push(project.slug);
  } finally {
    await context.close();
  }
}

await browser.close();

console.log(`\ncaptured ${captured}/${PROJECTS.length} · ${(totalBytes / 1024).toFixed(0)}KB total · ${new Date().toISOString().slice(0, 10)}`);
if (failed.length > 0) {
  console.log(`failed: ${failed.join(", ")}`);
}
process.exit(failed.length > 0 && STRICT ? 1 : 0);
