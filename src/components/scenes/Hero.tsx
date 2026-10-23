"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { portfolio } from "@/content/portfolio";
import { EASE_OUT_EXPO, FADE_UP, STAGGER_CHILDREN } from "@/lib/motion";
import styles from "./hero.module.css";

/**
 * Scene 00 — the title card: letterbox bars slide open, the name stamps in
 * like a main title, and a slow spotlight drifts behind. Window-scrolled.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const glowY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const name = portfolio.profile.name.split("");

  return (
    <section ref={ref} id="hero" className={styles.hero} aria-labelledby="hero-heading">
      <motion.div className={styles.glow} style={prefersReduced ? undefined : { y: glowY }} aria-hidden="true" />

      <motion.span className={styles.letterboxTop} initial={{ scaleY: 1 }} animate={{ scaleY: 0 }} transition={{ duration: 1.1, ease: EASE_OUT_EXPO, delay: 0.15 }} aria-hidden="true" />
      <motion.span className={styles.letterboxBottom} initial={{ scaleY: 1 }} animate={{ scaleY: 0 }} transition={{ duration: 1.1, ease: EASE_OUT_EXPO, delay: 0.15 }} aria-hidden="true" />

      <motion.div
        className={styles.inner}
        style={prefersReduced ? undefined : { y: contentY, opacity: contentOpacity }}
        variants={STAGGER_CHILDREN}
        initial="hidden"
        animate="visible"
      >
        <motion.p className="kicker" variants={FADE_UP}>
          Bhavik Studios presents
        </motion.p>

        <motion.h1 className={styles.title} variants={FADE_UP} id="hero-heading">
          {name.map((letter, index) => (
            <motion.span
              key={`${letter}-${index}`}
              className={styles.letter}
              initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 80, rotateX: -70 }}
              animate={prefersReduced ? { opacity: 1 } : { opacity: 1, y: 0, rotateX: 0 }}
              transition={{ delay: 0.35 + index * 0.05, duration: 0.7, ease: EASE_OUT_EXPO }}
              whileHover={prefersReduced ? undefined : { y: -10 }}
            >
              {letter === " " ? " " : letter}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p className={styles.roles} variants={FADE_UP}>
          {portfolio.profile.roles.join(" · ")}
        </motion.p>

        <motion.p className={styles.tagline} variants={FADE_UP}>
          {portfolio.profile.tagline}
        </motion.p>

        <motion.div className={styles.cue} variants={FADE_UP} aria-hidden="true">
          <span>Scroll to enter the studio</span>
          <span className={styles.cueLine} />
        </motion.div>
      </motion.div>
    </section>
  );
}
