"use client";

import { useEffect, useRef } from "react";
import { useInView, useReducedMotion } from "framer-motion";

/** Uppercase-only glyph pool: keeps Anton's churn near-uniform in width. */
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#/▮·";

const SCRAMBLE_MS = 900;
const FRAME_MS = 42;

interface ScrambleTextProps {
  text: string;
}

/**
 * Film-leader decode: on first view the glyphs churn like an untuned
 * projector, then resolve left-to-right into the real text. The real string
 * renders for SSR and no-JS; under reduced motion the effect is a no-op.
 */
export function ScrambleText({ text }: ScrambleTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (!inView || prefersReduced) return;
    const node = ref.current;
    if (!node) return;

    let timer = 0;
    const start = performance.now();

    const scramble = () => {
      const progress = Math.min((performance.now() - start) / SCRAMBLE_MS, 1);
      const resolved = Math.floor(progress * text.length);
      let output = text.slice(0, resolved);
      for (let i = resolved; i < text.length; i++) {
        const char = text[i];
        output +=
          char === " "
            ? " "
            : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      node.textContent = output;
      if (progress < 1) {
        timer = window.setTimeout(scramble, FRAME_MS);
      }
    };

    scramble();
    return () => window.clearTimeout(timer);
  }, [inView, prefersReduced, text]);

  return (
    <>
      <span className="sr-only">{text}</span>
      <span ref={ref} aria-hidden="true">
        {text}
      </span>
    </>
  );
}
