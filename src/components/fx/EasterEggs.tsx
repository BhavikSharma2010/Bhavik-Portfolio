"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import styles from "./easter-eggs.module.css";

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

const TOAST_MS = 4200;
const FLASH_MS = 450;

/**
 * The projection booth's secrets: the Konami code toggles a "director's
 * cut" grade on <html data-directors-cut> (heavier grain + a red wash,
 * defined in globals.css), with a slate-clap flash and a live-region toast.
 * Nothing persists — it is per-session whimsy.
 */
export function EasterEggs() {
  const [enabled, setEnabled] = useState(false);
  const [flash, setFlash] = useState(false);
  const [toast, setToast] = useState(false);
  const prefersReduced = useReducedMotion();

  // Konami detection: advance through the sequence, resetting on a miss
  // (unless the missed key re-starts the sequence).
  useEffect(() => {
    let progress = 0;
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      if (key === KONAMI[progress]) {
        progress += 1;
      } else {
        progress = key === KONAMI[0] ? 1 : 0;
      }
      if (progress !== KONAMI.length) return;
      progress = 0;
      setEnabled((current) => !current);
      setToast(true);
      if (!prefersReduced) {
        setFlash(true);
        window.setTimeout(() => setFlash(false), FLASH_MS);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [prefersReduced]);

  useEffect(() => {
    const root = document.documentElement;
    if (enabled) {
      root.setAttribute("data-directors-cut", "");
    } else {
      root.removeAttribute("data-directors-cut");
    }
    return () => root.removeAttribute("data-directors-cut");
  }, [enabled]);

  // Auto-dismiss the toast.
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(false), TOAST_MS);
    return () => window.clearTimeout(timer);
  }, [toast]);

  return (
    <>
      {flash ? <div className={styles.flash} aria-hidden="true" /> : null}
      {toast ? (
        <div className={styles.toast} role="status">
          {enabled
            ? "Director's cut enabled — enter the code again to restore"
            : "Back to the theatrical version"}
        </div>
      ) : null}
    </>
  );
}
