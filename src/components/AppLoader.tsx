"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { HeroMask } from "@/components/HeroMask";
import { EASE_OUT_EXPO } from "@/lib/motion";
import styles from "./loader.module.css";

const INTRO_IMAGE = "/intro/hero-face.jpg";
const HOLD_MS = 3000;

/**
 * Cinematic intro: the hero image owns the screen for 3 seconds with a slow
 * Ken Burns zoom, then dissolves into the site. Falls back to the SVG mask
 * if the image is missing.
 */
export function AppLoader() {
  const [dismissed, setDismissed] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const hold = window.setTimeout(() => setDismissed(true), HOLD_MS);
    return () => window.clearTimeout(hold);
  }, []);

  // The img can 404 before hydration attaches onError — catch that here too.
  useEffect(() => {
    const img = imageRef.current;
    if (img && img.complete && img.naturalWidth === 0) {
      setImageFailed(true);
    }
  }, [imageFailed]);

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          className={styles.loader}
          role="status"
          aria-label="Loading portfolio"
          exit={{ opacity: 0, transition: { duration: 0.65, ease: "easeOut" } }}
        >
          <motion.div
            className={styles.introMedia}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{
              opacity: 0,
              scale: prefersReduced ? 1 : 1.08,
              transition: { duration: 0.8, ease: EASE_OUT_EXPO },
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {imageFailed ? (
              <div className={styles.maskStage}>
                <HeroMask />
              </div>
            ) : (
              <motion.img
                ref={imageRef}
                className={styles.introImage}
                src={INTRO_IMAGE}
                alt=""
                onError={() => setImageFailed(true)}
                animate={prefersReduced ? undefined : { scale: [1, 1.06] }}
                transition={{ duration: HOLD_MS / 1000, ease: "easeOut" }}
              />
            )}
            <div className={styles.vignette} aria-hidden="true" />
          </motion.div>

          <motion.div className={styles.loaderFoot} exit={{ opacity: 0, transition: { duration: 0.25 } }}>
            <p className={styles.loaderKicker}>Bhavik Records presents</p>
            <div className={styles.loaderBar} aria-hidden="true">
              <span className={styles.loaderCountdown} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
