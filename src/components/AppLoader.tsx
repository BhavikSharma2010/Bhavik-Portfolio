"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { EASE_OUT_EXPO } from "@/lib/motion";
import styles from "./loader.module.css";

const INTRO_IMAGE = "/intro/hero-face.jpg";
const COUNT_FROM = 3;
const SEEN_KEY = "bhavik-studios-intro-seen";

type Phase = "checking" | "face" | "flash" | "done";

/**
 * The studio leader: the hero face holds under a viewfinder while a film
 * countdown sweeps 3 → 2 → 1, then a flash frame irises open onto the site.
 * Plays once per browser session.
 */
export function AppLoader() {
  const [phase, setPhase] = useState<Phase>("checking");
  const [imageFailed, setImageFailed] = useState(false);
  const [count, setCount] = useState(COUNT_FROM);
  const imageRef = useRef<HTMLImageElement>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {
      seen = false;
    }
    if (seen) {
      setPhase("done");
      return;
    }
    setPhase("face");
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      // Private mode: the intro just replays per navigation — acceptable.
    }

    if (prefersReduced) {
      const quick = window.setTimeout(() => setPhase("done"), 400);
      return () => window.clearTimeout(quick);
    }

    const timers: number[] = [];
    for (let step = 1; step <= COUNT_FROM; step++) {
      timers.push(window.setTimeout(() => setCount(COUNT_FROM - step + 1), (step - 1) * 1000));
    }
    timers.push(window.setTimeout(() => setPhase("flash"), COUNT_FROM * 1000));
    timers.push(window.setTimeout(() => setPhase("done"), COUNT_FROM * 1000 + 450));

    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [prefersReduced]);

  // The img can 404 before hydration attaches onError — catch that here too.
  useEffect(() => {
    const img = imageRef.current;
    if (img && img.complete && img.naturalWidth === 0) {
      setImageFailed(true);
    }
  }, [imageFailed]);

  const showFace = phase === "face" || phase === "flash";

  return (
    <AnimatePresence>
      {phase === "face" && (
        <motion.div
          className={styles.loader}
          role="status"
          aria-label="Loading Bhavik Studios"
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
        >
          <motion.div
            className={styles.introMedia}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {imageFailed ? (
              <div className={styles.maskStage}>
                <p className={styles.titleCard}>Bhavik Studios</p>
              </div>
            ) : (
              <motion.img
                ref={imageRef}
                className={styles.introImage}
                src={INTRO_IMAGE}
                alt=""
                onError={() => setImageFailed(true)}
                animate={{ scale: [1, 1.08] }}
                transition={{ duration: (COUNT_FROM * 1000) / 1000, ease: "easeOut" }}
              />
            )}
            <div className={styles.vignette} aria-hidden="true" />
          </motion.div>

          {/* viewfinder chrome */}
          <div className={styles.viewfinder} aria-hidden="true">
            <span className={`${styles.corner} ${styles.cornerTL}`} />
            <span className={`${styles.corner} ${styles.cornerTR}`} />
            <span className={`${styles.corner} ${styles.cornerBL}`} />
            <span className={`${styles.corner} ${styles.cornerBR}`} />
            <span className={styles.crosshair} />
            <span className={styles.recBadge}>
              <i className={styles.recDot} />
              REC
            </span>
            <span className={styles.slate}>BHAVIK STUDIOS · 24 FPS · REEL 01</span>
          </div>

          {/* the countdown */}
          <div className={styles.countdown} aria-hidden="true">
            <svg viewBox="0 0 120 120" className={styles.sweepRing}>
              <circle cx="60" cy="60" r="56" className={styles.ringTrack} />
              <circle
                cx="60"
                cy="60"
                r="56"
                className={styles.ringSweep}
                key={count}
                style={{ animationDuration: "1s" }}
              />
            </svg>
            <AnimatePresence mode="popLayout">
              <motion.span
                key={count}
                className={styles.countDigit}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.3 }}
                transition={{ duration: 0.32, ease: EASE_OUT_EXPO }}
              >
                {count}
              </motion.span>
            </AnimatePresence>
          </div>

          <div className={styles.loaderFoot}>
            <p className={styles.loaderKicker}>Bhavik Studios presents</p>
          </div>
        </motion.div>
      )}

      {phase === "flash" && (
        <motion.div
          className={styles.flash}
          initial={{ opacity: 1 }}
          exit={{
            clipPath: "circle(0% at 50% 50%)",
            opacity: 1,
            transition: { duration: 0.45, ease: EASE_OUT_EXPO },
          }}
          animate={{ opacity: [1, 0.92] }}
        />
      )}
    </AnimatePresence>
  );
}
