"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { blip, tick } from "@/lib/sound";
import styles from "./cursor.module.css";

const RING_SPRING = { stiffness: 350, damping: 30, mass: 0.55 } as const;

/**
 * Cinema cursor: an instant accent dot plus a trailing focus-ring that
 * leans on interactive elements and shows an optional mono cue label
 * (`data-cursor="play"` renders "PLAY" inside the ring). Fine pointers
 * only; a no-op under reduced motion — when inactive it renders nothing
 * and the native cursor stays.
 */
export function CursorSpotlight() {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [cue, setCue] = useState<string | null>(null);
  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);
  const ringX = useSpring(dotX, RING_SPRING);
  const ringY = useSpring(dotY, RING_SPRING);
  const prefersReduced = useReducedMotion();

  // Activate only for fine pointers with motion allowed; the class hides
  // the native cursor for the whole document while mounted.
  useEffect(() => {
    if (prefersReduced || !window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
    document.documentElement.classList.add("has-custom-cursor");
    return () => document.documentElement.classList.remove("has-custom-cursor");
  }, [prefersReduced]);

  useEffect(() => {
    if (!enabled) return;

    const onMove = (event: PointerEvent) => {
      dotX.set(event.clientX);
      dotY.set(event.clientY);
      setVisible(true);
    };
    const onOver = (event: PointerEvent) => {
      const target = (event.target as Element | null)?.closest?.(
        "a, button, [data-cursor]",
      );
      setCue(target ? (target.getAttribute("data-cursor") ?? "") : null);
    };
    const onOut = (event: PointerEvent) => {
      if (!event.relatedTarget) setVisible(false);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerout", onOut);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
    };
  }, [enabled, dotX, dotY]);

  // Sound cues: a tick when hovering onto a new interactive target and a
  // blip on click. Independent of the cursor being active so touch users
  // get them too; every helper no-ops while sound is disabled.
  const hoverRef = useRef<Element | null>(null);
  useEffect(() => {
    const onOverSound = (event: PointerEvent) => {
      const target =
        (event.target as Element | null)?.closest?.(
          "a, button, [data-cursor]",
        ) ?? null;
      if (target && target !== hoverRef.current) tick();
      hoverRef.current = target;
    };
    const onClickSound = (event: MouseEvent) => {
      const target = (event.target as Element | null)?.closest?.("a, button");
      if (target) blip();
    };
    document.addEventListener("pointerover", onOverSound);
    document.addEventListener("click", onClickSound);
    return () => {
      document.removeEventListener("pointerover", onOverSound);
      document.removeEventListener("click", onClickSound);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        className={styles.cursorDot}
        aria-hidden="true"
        style={{ x: dotX, y: dotY, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: visible ? 1 : 0 }}
      />
      <motion.div
        className={styles.cursorRing}
        data-active={cue !== null || undefined}
        aria-hidden="true"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: visible ? 1 : 0, scale: cue !== null ? 1.9 : 1 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
      >
        {cue ? <span className={styles.cursorCue}>{cue}</span> : null}
      </motion.div>
    </>
  );
}
