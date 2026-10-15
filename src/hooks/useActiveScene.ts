"use client";

import { useEffect, useState } from "react";

export const SCENE_IDS = ["hero", "showing", "origin", "cast", "press", "pitch", "premiere"] as const;

export type SceneId = (typeof SCENE_IDS)[number];

/**
 * Tracks which scene is crossing the viewport center so the top nav can
 * highlight it. Pure window scroll — no dependencies on containers.
 */
export function useActiveScene(): SceneId {
  const [activeId, setActiveId] = useState<SceneId>("hero");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id as SceneId);
          }
        }
      },
      // A scene wins when it crosses the viewport's vertical center.
      { rootMargin: "-45% 0px -45% 0px" },
    );

    const elements = SCENE_IDS.map((id) => document.getElementById(id)).filter(
      (element): element is HTMLElement => element !== null,
    );
    for (const element of elements) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return activeId;
}
