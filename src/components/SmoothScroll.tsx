"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { tracks } from "@/content/portfolio";
import { scrollState, setSectionIndex } from "@/lib/scrollStore";

let lenisInstance: Lenis | null = null;

/** Programmatic navigation that respects Lenis when it is active. */
export function scrollToId(id: string): void {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenisInstance) {
    lenisInstance.scrollTo(el, { duration: 1.4 });
  } else {
    el.scrollIntoView({ behavior: "smooth" });
  }
}

/** Section whose content crosses the viewport reading line (40% from top). */
function computeActiveSection(scrollY: number): number {
  const readingLine = scrollY + window.innerHeight * 0.4;
  let active = 0;
  tracks.forEach((track, index) => {
    const el = document.getElementById(track.id);
    if (el && el.offsetTop <= readingLine) active = index;
  });
  return active;
}

function updateScrollState(scrollY: number, velocity: number): void {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  scrollState.progress = max > 0 ? scrollY / max : 0;
  scrollState.velocity = velocity;
  setSectionIndex(computeActiveSection(scrollY));
}

/**
 * Lenis smooth scroll driving the shared scroll state. Falls back to plain
 * window scrolling when the user prefers reduced motion.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      const onScroll = (): void =>
        updateScrollState(window.scrollY, 0);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }

    const lenis = new Lenis({ lerp: 0.09 });
    lenisInstance = lenis;

    let rafId = 0;
    const loop = (time: number): void => {
      lenis.raf(time);
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    const unsubscribe = lenis.on("scroll", ({ scroll, velocity }) => {
      updateScrollState(scroll, velocity);
    });

    return () => {
      cancelAnimationFrame(rafId);
      unsubscribe();
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  // normalized pointer for the avatar look-at
  useEffect(() => {
    const onPointerMove = (event: PointerEvent): void => {
      scrollState.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      scrollState.pointer.y = -((event.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, []);

  return <>{children}</>;
}
