"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Project } from "@/content/portfolio";
import { EASE_OUT_EXPO } from "@/lib/motion";
import { blip, startWhir, stopWhir } from "@/lib/sound";
import posterStyles from "@/components/scenes/now-showing.module.css";
import styles from "./trailer.module.css";

const SHOT_MS = 2600;

interface TrailerModalProps {
  project: Project;
  onClose: () => void;
}

/**
 * The screening room: a letterboxed 2.39:1 screen auto-playing the film's
 * mock trailer (kinetic typography over its poster palette), with synopsis,
 * tech-stack-as-credits and the real links below. Iris-in matches the
 * intro's clip-path exit. Focus is trapped; Escape/backdrop close and focus
 * returns to the poster that opened it.
 */
export function TrailerModal({ project, onClose }: TrailerModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [frameIndex, setFrameIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const prefersReduced = useReducedMotion();

  const trailer = project.trailer;
  const shots = trailer?.shots ?? [];

  // Text and footage alternate: every text shot is followed by a frame of
  // pure "footage" (the Ken Burns still). Reduced motion parks on the first
  // text frame.
  const frames = shots.flatMap((shot) => [
    { kind: "text" as const, shot },
    { kind: "footage" as const },
  ]);
  const frame = frames[frameIndex];

  // Projector starts up: leader blips + a looping hum (skipped under
  // reduced motion for consistency with the motion kill switch).
  useEffect(() => {
    blip();
    const leader = window.setTimeout(blip, 220);
    if (!prefersReduced) startWhir();
    return () => {
      window.clearTimeout(leader);
      stopWhir();
    };
  }, [prefersReduced]);

  // Scroll lock, initial focus, and focus restoration on unmount.
  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, []);

  // Escape closes from anywhere; Tab is trapped inside the dialog.
  useEffect(() => {
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  // Auto-advance the frames — skipped entirely under reduced motion, paused
  // while the pointer rests on the screen.
  useEffect(() => {
    if (prefersReduced || paused || frames.length < 2) return;
    const timer = window.setInterval(() => {
      setFrameIndex((current) => (current + 1) % frames.length);
    }, SHOT_MS);
    return () => window.clearInterval(timer);
  }, [prefersReduced, paused, frames.length]);

  const shotTransition = { duration: prefersReduced ? 0 : 0.45, ease: EASE_OUT_EXPO };

  return createPortal(
    <div className={styles.host}>
      <motion.div
        className={styles.backdrop}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
        aria-hidden="true"
      />

      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="trailer-title"
        tabIndex={-1}
        className={styles.dialog}
        initial={
          prefersReduced
            ? { opacity: 0 }
            : { opacity: 0, clipPath: "circle(0% at 50% 42%)" }
        }
        animate={
          prefersReduced
            ? { opacity: 1 }
            : { opacity: 1, clipPath: "circle(100% at 50% 42%)" }
        }
        exit={
          prefersReduced
            ? { opacity: 0 }
            : { opacity: 0, clipPath: "circle(0% at 50% 42%)" }
        }
        transition={{ duration: prefersReduced ? 0.15 : 0.55, ease: EASE_OUT_EXPO }}
        onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
          if (event.key === "Escape") onClose();
        }}
      >
        <header className={styles.slate}>
          <span className={styles.slateText}>
            NOW SHOWING · {project.year} · RUNTIME {project.runtime}
          </span>
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Close trailer"
          >
            CLOSE ✕
          </button>
        </header>

        <div
          className={styles.screen}
          onPointerEnter={() => setPaused(true)}
          onPointerLeave={() => setPaused(false)}
        >
          <div
            className={`${styles.screenArt} ${posterStyles[`poster${project.cover}`]}`}
            aria-hidden="true"
          >
            {project.still ? (
              <div className={styles.screenFootage} data-paused={paused || undefined}>
                <div className={styles.footagePan}>
                  <img
                    className={styles.footageImg}
                    src={project.still.src}
                    width={project.still.width}
                    height={project.still.height}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <span className={styles.footageScrim} />
              </div>
            ) : null}

            <AnimatePresence mode="wait">
              {frame?.kind === "text" ? (
                <motion.div
                  key={frameIndex}
                  className={styles.shot}
                  initial={{ opacity: 0, y: 26 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -26 }}
                  transition={shotTransition}
                >
                  <span className={styles.shotKicker}>{frame.shot.kicker}</span>
                  <span className={styles.shotLine}>{frame.shot.line}</span>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          {shots.length > 1 ? (
            <div className={styles.shotDots}>
              {shots.map((entry, dotIndex) => (
                <button
                  key={entry.kicker}
                  type="button"
                  className={styles.shotDot}
                  data-active={frameIndex === dotIndex * 2 || undefined}
                  aria-label={`Go to shot ${dotIndex + 1}: ${entry.kicker}`}
                  onClick={() => setFrameIndex(dotIndex * 2)}
                />
              ))}
            </div>
          ) : null}
        </div>

        <h3 className={styles.title} id="trailer-title">
          {project.title}
        </h3>
        {trailer ? <p className={styles.logline}>{trailer.logline}</p> : null}
        <p className={styles.synopsis}>{project.description}</p>

        {trailer ? (
          <ul className={styles.castList} aria-label="Cast and crew">
            {trailer.cast.map((entry) => (
              <li key={entry.name} className={styles.castEntry}>
                <span className={styles.castRole}>{entry.role}</span>
                <span className={styles.castName}>{entry.name}</span>
              </li>
            ))}
          </ul>
        ) : null}

        <footer className={styles.actions}>
          {project.link !== "#" && (
            <a
              className="btn btn-primary"
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit the premiere
            </a>
          )}
          {project.repo ? (
            <a className="btn btn-ghost" href={project.repo}>
              Read the script
            </a>
          ) : null}
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Leave the screening
          </button>
        </footer>
      </motion.div>
    </div>,
    document.body,
  );
}
