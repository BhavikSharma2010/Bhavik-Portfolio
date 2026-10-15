"use client";

import dynamic from "next/dynamic";
import { useReducedMotion } from "framer-motion";

const Scene = dynamic(() => import("@/canvas/Scene"), { ssr: false });

/**
 * Full-viewport fixed 3D stage behind the whole page. Decorative only —
 * pointer-events pass through so content stays selectable.
 */
export function SceneBackground() {
  const prefersReduced = useReducedMotion();
  if (prefersReduced) {
    // Static atmosphere instead of a live canvas
    return <div className="scene-bg scene-bg--static" aria-hidden="true" />;
  }
  return (
    <div className="scene-bg" aria-hidden="true">
      <Scene />
    </div>
  );
}
