/**
 * Palette switching between the two studio color grades: "olive" (light
 * editorial, the default) and "forest" (dark green luxury, applied via
 * html[data-palette="forest"]). Mirrors lib/sound.ts: localStorage under
 * the bhavik-studios-* convention, try/catch so private mode just won't
 * persist the choice.
 */

export type Palette = "olive" | "forest";

const STORAGE_KEY = "bhavik-studios-theme";

/** Browser-chrome color per palette — kept in sync with layout.tsx. */
export const THEME_COLOR: Record<Palette, string> = {
  olive: "#e8dfc8",
  forest: "#07120d",
};

export function readStoredPalette(): Palette {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "forest"
      ? "forest"
      : "olive";
  } catch {
    return "olive";
  }
}

/** Applies the palette to <html> and persists the choice. */
export function applyPalette(palette: Palette): void {
  const root = document.documentElement;
  if (palette === "forest") {
    root.setAttribute("data-palette", "forest");
  } else {
    root.removeAttribute("data-palette");
  }
  try {
    if (palette === "forest") {
      window.localStorage.setItem(STORAGE_KEY, "forest");
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Private mode: palette just won't persist across visits.
  }
}

/** Keeps the mobile-browser chrome color following the active palette. */
export function syncThemeColorMeta(palette: Palette): void {
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", THEME_COLOR[palette]);
}
