"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import styles from "@/components/sections/hero.module.css";

const MAX_PULL_X = 9;
const MAX_PULL_Y = 7;

interface MagneticProps {
  children: ReactNode;
}

/**
 * Wraps a button so it leans toward the cursor while hovered, then springs
 * home. Disabled when the user prefers reduced motion.
 */
export function Magnetic({ children }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 16 });
  const springY = useSpring(y, { stiffness: 220, damping: 16 });
  const prefersReduced = useReducedMotion();

  const onMouseMove = (event: React.MouseEvent<HTMLDivElement>): void => {
    if (prefersReduced) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(((event.clientX - rect.left) / rect.width - 0.5) * 2 * MAX_PULL_X);
    y.set(((event.clientY - rect.top) / rect.height - 0.5) * 2 * MAX_PULL_Y);
  };

  const onMouseLeave = (): void => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={styles.magnetic}
      style={{ x: springX, y: springY }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </motion.div>
  );
}
