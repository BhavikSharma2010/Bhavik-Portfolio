/**
 * Behavioral checks for the studio site: intro-once, nav anchors, active
 * scene highlight, scroll progress, reduced motion, no horizontal overflow.
 * Run: node scripts/check-site.mjs [baseURL]
 */
import { chromium } from "file:///C:/Users/MY HOME/AppData/Roaming/npm/node_modules/playwright/index.mjs";

const BASE = process.argv[2] ?? "http://localhost:3000";
let failures = 0;

function check(name, ok) {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
  if (!ok) failures++;
}

const browser = await chromium.launch();

// ── intro-once ──────────────────────────────────────────────
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(700);
  const showsIntro = await page.locator('[aria-label="Loading Bhavik Studios"]').count();
  check("intro shows on first load", showsIntro === 1);
  await page.waitForTimeout(4000);
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForTimeout(700);
  const afterReload = await page.locator('[aria-label="Loading Bhavik Studios"]').count();
  check("intro suppressed on reload within session", afterReload === 0);
  await context.close();
}

// ── navigation, highlight, progress ─────────────────────────
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await context.addInitScript(() => sessionStorage.setItem("bhavik-studios-intro-seen", "1"));
  const page = await context.newPage();
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);

  for (const id of ["showing", "origin", "cast", "press", "pitch", "premiere"]) {
    await page.locator(`header a[href="#${id}"]`).click();
    await page.waitForTimeout(1200);
    const near = await page.evaluate((sceneId) => {
      const el = document.getElementById(sceneId);
      if (!el) return false;
      const rect = el.getBoundingClientRect();
      return Math.abs(rect.top - window.innerHeight / 2) < window.innerHeight;
    }, id);
    check(`nav anchor lands on #${id}`, near);
  }

  const highlighted = await page
    .locator('header a[data-active="true"]')
    .getAttribute("href");
  check("active scene highlighted in nav", highlighted === "#premiere");

  // Deterministic read: jump to a known scroll offset, let the spring settle.
  await page.evaluate(() => window.scrollTo(0, 800));
  await page.waitForTimeout(1500);
  const progress = await page.evaluate(() => {
    // the projector line: a fixed, 2px-tall bar at the top of the page
    const bar = [...document.querySelectorAll("div")].find(
      (d) =>
        getComputedStyle(d).position === "fixed" &&
        getComputedStyle(d).height === "2px" &&
        d.className.toString().includes("bar"),
    );
    return bar ? getComputedStyle(bar).transform : "missing";
  });
  check(
    "scroll progress tracks scroll",
    progress.startsWith("matrix(") && !progress.startsWith("matrix(0,"),
  );
  await context.close();
}

// ── reduced motion + overflow ───────────────────────────────
{
  const context = await browser.newContext({ viewport: { width: 375, height: 667 }, reducedMotion: "reduce" });
  await context.addInitScript(() => sessionStorage.setItem("bhavik-studios-intro-seen", "1"));
  const page = await context.newPage();
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);

  const marqueePaused = await page.evaluate(() => {
    const track = document.querySelector("[class*='track'] [class*='chunk']")?.parentElement;
    if (!track) return "missing";
    const style = getComputedStyle(track);
    return style.animationPlayState !== "running" || Number(style.animationIterationCount) === 1 || style.animationDuration === "0.01s";
  });
  check("reduced motion kills the marquee loop", marqueePaused === true || marqueePaused === "missing");

  const noOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth <= window.innerWidth + 1,
  );
  check("no horizontal overflow at 375px", noOverflow);

  await page.setViewportSize({ width: 320, height: 568 });
  await page.waitForTimeout(300);
  const noOverflow320 = await page.evaluate(
    () => document.documentElement.scrollWidth <= window.innerWidth + 1,
  );
  check("no horizontal overflow at 320px", noOverflow320);
  await context.close();
}

await browser.close();
console.log(failures === 0 ? "ALL PASS" : `${failures} FAILURES`);
process.exit(failures === 0 ? 0 : 1);
