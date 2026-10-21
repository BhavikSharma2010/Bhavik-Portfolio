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

  // new-feature guardrails in the same reduced-motion context
  const cursorAbsent = await page.locator('[class*="cursorDot"]').count();
  check("custom cursor absent under reduced motion", cursorAbsent === 0);
  const hasCursorClass = await page.evaluate(() =>
    document.documentElement.classList.contains("has-custom-cursor"),
  );
  check("native cursor untouched under reduced motion", !hasCursorClass);
  const commentaryMarks = await page.locator("button[popovertarget]").count();
  check("director's commentary markers present", commentaryMarks === 3);

  // trailer footage layer: static under reduced motion (no Ken Burns)
  const posterButton = page.locator('button[aria-label^="Watch trailer:"]').first();
  await posterButton.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await posterButton.click();
  await page.waitForTimeout(900);
  const footageAnimation = await page.evaluate(() => {
    const img = document.querySelector('[class*="screenFootage"] img');
    return img ? getComputedStyle(img).animationName : "missing";
  });
  check("reduced motion freezes the trailer footage", footageAnimation === "none");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(600);
  await context.close();
}

// ── custom cursor on fine pointer ────────────────────────────
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await context.addInitScript(() => sessionStorage.setItem("bhavik-studios-intro-seen", "1"));
  const page = await context.newPage();
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await page.mouse.move(720, 450);
  await page.waitForTimeout(400);

  const cursorShown = await page.locator('[class*="cursorDot"]').count();
  check("custom cursor appears on fine pointer", cursorShown === 1);
  const nativeHidden = await page.evaluate(() =>
    document.documentElement.classList.contains("has-custom-cursor"),
  );
  check("native cursor hidden while custom cursor active", nativeHidden);

  // hover a link: the ring should grow and carry a cue
  await page.locator('header a[href="#showing"]').hover();
  await page.waitForTimeout(300);
  const ringActive = await page.locator('[class*="cursorRing"][data-active]').count();
  check("cursor ring leans on interactive elements", ringActive === 1);
  await context.close();
}

// ── trailer modal ─────────────────────────────────────────────
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await context.addInitScript(() => sessionStorage.setItem("bhavik-studios-intro-seen", "1"));
  const page = await context.newPage();
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(400);

  // real poster art: every poster button carries a loaded, lazy image
  const posterImgs = await page.evaluate(() =>
    [...document.querySelectorAll('button[aria-label^="Watch trailer:"]')].map(
      (button) => {
        const img = button.querySelector("img");
        return Boolean(
          img &&
            img.getAttribute("loading") === "lazy" &&
            img.getAttribute("width") &&
            img.getAttribute("height") &&
            img.naturalWidth > 0,
        );
      },
    ),
  );
  check("all 4 posters carry loaded live captures", posterImgs.length === 4 && posterImgs.every(Boolean));

  const poster = page.locator('button[aria-label^="Watch trailer:"]').first();
  await poster.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await poster.click();
  await page.waitForTimeout(900);

  const dialogVisible = await page.locator('[role="dialog"]').isVisible();
  check("trailer modal opens from poster", dialogVisible);

  const footageLoaded = await page.evaluate(() => {
    const img = document.querySelector('[class*="screenFootage"] img');
    return Boolean(img && img.getAttribute("loading") === "lazy" && img.naturalWidth > 0);
  });
  check("trailer screen shows live footage", footageLoaded);

  const focusInside = await page.evaluate(() => {
    const dialog = document.querySelector('[role="dialog"]');
    return dialog ? dialog.contains(document.activeElement) : false;
  });
  check("focus moves into the modal", focusInside);

  await page.keyboard.press("Escape");
  await page.waitForTimeout(800);
  const dialogGone = (await page.locator('[role="dialog"]').count()) === 0;
  check("Escape closes the modal", dialogGone);

  const focusRestored = await page.evaluate(() => {
    const el = document.activeElement;
    return el ? (el.getAttribute("aria-label") ?? "").startsWith("Watch trailer:") : false;
  });
  check("focus returns to the poster", focusRestored);
  await context.close();
}

// ── konami director's cut ─────────────────────────────────────
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await context.addInitScript(() => sessionStorage.setItem("bhavik-studios-intro-seen", "1"));
  const page = await context.newPage();
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(400);

  for (const key of ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"]) {
    await page.keyboard.press(key);
  }
  await page.waitForTimeout(400);

  const graded = await page.evaluate(() =>
    document.documentElement.hasAttribute("data-directors-cut"),
  );
  check("konami enables director's cut", graded);

  const toast = await page.locator('[role="status"]').count();
  check("director's cut toast is announced", toast === 1);

  for (const key of ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"]) {
    await page.keyboard.press(key);
  }
  await page.waitForTimeout(400);
  const restored = await page.evaluate(() =>
    document.documentElement.hasAttribute("data-directors-cut"),
  );
  check("konami restores theatrical version", !restored);
  await context.close();
}

await browser.close();
console.log(failures === 0 ? "ALL PASS" : `${failures} FAILURES`);
process.exit(failures === 0 ? 0 : 1);
