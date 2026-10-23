"use client";

import { useEffect, useState } from "react";
import {
  applyPalette,
  readStoredPalette,
  syncThemeColorMeta,
  type Palette,
} from "@/lib/theme";
import styles from "./topnav.module.css";

/**
 * Olive ↔ forest color-grade switch. Same control grammar as the sound
 * toggle: glyph label, aria-pressed, state persisted via lib/theme.
 */
export function PaletteToggle() {
  const [palette, setPalette] = useState<Palette>("olive");

  // Sync with whatever the anti-FOUC script in layout.tsx already applied.
  useEffect(() => {
    setPalette(readStoredPalette());
  }, []);

  const togglePalette = () => {
    const next: Palette = palette === "olive" ? "forest" : "olive";
    setPalette(next);
    applyPalette(next);
    syncThemeColorMeta(next);
  };

  return (
    <button
      type="button"
      className={styles.soundToggle}
      aria-pressed={palette === "forest"}
      aria-label={
        palette === "olive" ? "Switch to forest grade" : "Switch to olive grade"
      }
      title={palette === "olive" ? "Forest grade" : "Olive grade"}
      onClick={togglePalette}
    >
      {palette === "olive" ? "☀ OLIVE" : "☾ FOREST"}
    </button>
  );
}
