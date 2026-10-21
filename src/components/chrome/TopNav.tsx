"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EASE_OUT_EXPO } from "@/lib/motion";
import { blip, isSoundEnabled, setSoundEnabled, whoosh } from "@/lib/sound";
import { useActiveScene, type SceneId } from "@/hooks/useActiveScene";
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
  const lastSceneRef = useRef<SceneId | null>(null);

  useEffect(() => {
    setSoundOn(isSoundEnabled());
  }, []);

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
