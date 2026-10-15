"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useReducedMotion } from "framer-motion";
import styles from "./scroll-progress.module.css";

/** The projector line: a thin red beam across the very top of the page. */
export function ScrollProgress() {
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    ...(prefersReduced ? { stiffness: 1000, damping: 1000 } : {}),
  });

  return <motion.div className={styles.bar} style={{ scaleX }} aria-hidden="true" />;
}
