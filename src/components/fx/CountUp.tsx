"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

const COUNT_MS = 1100;

/** Leading integer of a stat value; "∞" (no digits) counts as null. */
function parseLeadingInt(value: string): number | null {
  const match = value.match(/^\d+/);
  return match ? Number.parseInt(match[0], 10) : null;
}

interface CountUpProps {
  /** Final stat value, e.g. "3" or "∞". Rendered as-is for SSR/no-JS. */
  value: string;
}

/**
 * Box-office counter: rolls the leading integer up from zero when the stat
 * scrolls into view, then settles on the exact original value. Non-numeric
 * values ("∞") and reduced motion render the final value statically.
 */
export function CountUp({ value }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const target = parseLeadingInt(value);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (target === null || !inView || prefersReduced) return;
    const node = ref.current;
    if (!node) return;

    const controls = animate(0, target, {
      duration: COUNT_MS / 1000,
      ease: "easeOut",
      onUpdate: (latest) => {
        node.textContent = String(Math.round(latest));
      },
      onComplete: () => {
        node.textContent = value;
      },
    });
    return () => controls.stop();
  }, [target, inView, prefersReduced, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {value}
    </span>
  );
}
