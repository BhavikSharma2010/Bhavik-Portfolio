"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EASE_OUT_EXPO } from "@/lib/motion";
import { blip, isSoundEnabled, setSoundEnabled, whoosh } from "@/lib/sound";
import { useActiveScene, type SceneId } from "@/hooks/useActiveScene";
import { PaletteToggle } from "./PaletteToggle";
import styles from "./topnav.module.css";

const LINKS: { id: SceneId; label: string }[] = [
  { id: "showing", label: "Now Showing" },
  { id: "origin", label: "Origin" },
  { id: "cast", label: "Cast" },
  { id: "press", label: "Press" },
  { id: "pitch", label: "Pitch" },
  { id: "premiere", label: "Premiere" },
];

const BURN_MS = 1150;
const REC_SWAP_MS = 1400;

/** Fixed studio bar: wordmark, scene links, sound toggle, blinking REC. */
export function TopNav() {
  const activeId = useActiveScene();
  const prefersReduced = useReducedMotion();
  const [burning, setBurning] = useState(false);
  const [recSwapped, setRecSwapped] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastSceneRef = useRef<SceneId | null>(null);

  useEffect(() => {
    setSoundOn(isSoundEnabled());
  }, []);

  // Close the mobile menu on Escape.
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  // Soft whoosh whenever the active scene changes (skipping the first read).
  useEffect(() => {
    if (!activeId) return;
    if (lastSceneRef.current !== null && activeId !== lastSceneRef.current) {
      whoosh();
    }
    lastSceneRef.current = activeId;
  }, [activeId]);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    if (next) window.setTimeout(blip, 30);
  };

  // Easter egg: double-clicking the wordmark runs a film-burn flash and
  // swaps REC for CUT for a beat. Decorative — no keyboard equivalent.
  const playBurn = () => {
    if (burning) return;
    setBurning(true);
    setRecSwapped(true);
    window.setTimeout(() => setRecSwapped(false), REC_SWAP_MS);
    window.setTimeout(() => setBurning(false), prefersReduced ? 200 : BURN_MS);
  };

  return (
    <header className={styles.topnav}>
      <a
        href="#hero"
        className={styles.wordmark}
        aria-label="Bhavik Studios — back to top"
        title="Double-click for a surprise"
        onDoubleClick={playBurn}
      >
        Bhavik&nbsp;Studios
      </a>

      <nav className={styles.links} aria-label="Scenes">
        {LINKS.map((link) => (
          <a
            key={link.id}
            href={`#${link.id}`}
            className={styles.link}
            data-active={activeId === link.id}
            aria-current={activeId === link.id ? "true" : undefined}
          >
            {link.label}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className={styles.menuToggle}
        aria-expanded={menuOpen}
        aria-controls="mobile-menu"
        aria-label={menuOpen ? "Close scene menu" : "Open scene menu"}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          {menuOpen ? (
            <path
              d="M5 5 L19 19 M19 5 L5 19"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          ) : (
            <path
              d="M3 6 H21 M3 12 H21 M3 18 H21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          )}
        </svg>
      </button>

      <div
        id="mobile-menu"
        className={styles.mobileMenu}
        data-open={menuOpen || undefined}
      >
        <nav aria-label="Scenes">
          {LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className={styles.mobileLink}
              data-active={activeId === link.id}
              aria-current={activeId === link.id ? "true" : undefined}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>

      <PaletteToggle />

      <button
        type="button"
        className={styles.soundToggle}
        aria-pressed={soundOn}
        aria-label={soundOn ? "Mute studio sound" : "Enable studio sound"}
        title={soundOn ? "Mute studio sound" : "Enable studio sound"}
        onClick={toggleSound}
      >
        {soundOn ? "♪ ON" : "♪ OFF"}
      </button>

      <span className={styles.rec} aria-hidden="true">
        <i className={styles.recDot} data-blink />
        {recSwapped ? "CUT" : "REC"}
      </span>

      {burning ? (
        <motion.div
          className={styles.burn}
          aria-hidden="true"
          initial={
            prefersReduced
              ? { opacity: 0.5 }
              : { opacity: 0.9, clipPath: "circle(140% at 50% 50%)" }
          }
          animate={
            prefersReduced
              ? { opacity: 0 }
              : { opacity: 1, clipPath: "circle(0% at 50% 50%)" }
          }
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReduced ? 0.2 : BURN_MS / 1000, ease: "easeIn" }}
        />
      ) : null}
    </header>
  );
}
