"use client";

import { useEffect, useState, type MouseEvent, type ReactNode } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { portfolio } from "@/content/portfolio";
import { EASE_OUT_EXPO, FADE_UP, STAGGER_CHILDREN } from "@/lib/motion";
import { scrollToId } from "@/components/SmoothScroll";
import { HeroFaceArt } from "@/components/hero/HeroFaceArt";
import { Magnetic } from "@/components/hero/Magnetic";
import { NowPlayingCard } from "@/components/hero/NowPlayingCard";
import styles from "./hero.module.css";

const ROLE_ROTATE_MS = 2800;
const NAME = portfolio.profile.name;

/** Track 01 — the "Now Playing" screen. */
export function Hero() {
  const { roles, tagline, location, email } = portfolio.profile;
  const [roleIndex, setRoleIndex] = useState(0);
  const prefersReduced = useReducedMotion();

  // shared pointer (-1..1) drives the face parallax and the card tilt
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 55, damping: 18 });
  const smoothY = useSpring(pointerY, { stiffness: 55, damping: 18 });
  const faceX = useTransform(smoothX, (v) => v * -16);
  const faceY = useTransform(smoothY, (v) => v * -10);
  const cardRotateY = useTransform(smoothX, (v) => v * 10);
  const cardRotateX = useTransform(smoothY, (v) => v * -8);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setRoleIndex((index) => (index + 1) % roles.length);
    }, ROLE_ROTATE_MS);
    return () => window.clearInterval(timer);
  }, [roles.length]);

  const onPointerMove = (event: MouseEvent<HTMLElement>): void => {
    if (prefersReduced) return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set(((event.clientX - rect.left) / rect.width) * 2 - 1);
    pointerY.set(((event.clientY - rect.top) / rect.height) * 2 - 1);
  };

  const onPointerLeave = (): void => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <section
      id="intro"
      className={styles.hero}
      onMouseMove={onPointerMove}
      onMouseLeave={onPointerLeave}
      aria-labelledby="hero-heading"
    >
      {/* treated avatar face, melts into the dark */}
      <motion.div className={styles.faceArt} style={{ x: faceX, y: faceY }} aria-hidden="true">
        <HeroFaceArt />
        <span className={styles.faceScan} />
      </motion.div>

      <motion.div
        className={styles.inner}
        variants={STAGGER_CHILDREN}
        initial="hidden"
        animate="visible"
      >
        <motion.p className="kicker" variants={FADE_UP}>
          ▶ Now playing · {location}
        </motion.p>

        <motion.h1 className={styles.title} variants={FADE_UP} id="hero-heading">
          {NAME.split("").map((letter, index) => (
            <motion.span
              key={`${letter}-${index}`}
              className={styles.letter}
              initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 70, rotateX: -75 }}
              animate={prefersReduced ? { opacity: 1 } : { opacity: 1, y: 0, rotateX: 0 }}
              transition={{ delay: 0.15 + index * 0.06, duration: 0.7, ease: EASE_OUT_EXPO }}
              whileHover={prefersReduced ? undefined : { y: -12, color: "#1ed760" }}
            >
              {letter}
            </motion.span>
          ))}
          <span className={styles.titleDot} aria-hidden="true">.</span>
        </motion.h1>

        <motion.div className={styles.roleLine} variants={FADE_UP} aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.span
              key={roleIndex}
              className={styles.role}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
            >
              {roles[roleIndex]}
            </motion.span>
          </AnimatePresence>
        </motion.div>

        <motion.p className={styles.tagline} variants={FADE_UP}>
          {tagline}
        </motion.p>

        <motion.div className={styles.actions} variants={FADE_UP}>
          <Magnetic>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => scrollToId("about")}
            >
              Play the album
              <PlayIcon />
            </button>
          </Magnetic>
          <Magnetic>
            <a className="btn btn-ghost" href={`mailto:${email}`}>
              Skip to contact
            </a>
          </Magnetic>
        </motion.div>
      </motion.div>

      <NowPlayingCard rotateX={cardRotateX} rotateY={cardRotateY} />

      <div className={styles.scrollHint} aria-hidden="true">
        <span>scroll to play</span>
        <span className={styles.scrollLine} />
      </div>
    </section>
  );
}

function PlayIcon(): ReactNode {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
      <path d="M8 5.5v13a1 1 0 0 0 1.54.84l10-6.5a1 1 0 0 0 0-1.68l-10-6.5A1 1 0 0 0 8 5.5Z" />
    </svg>
  );
}
