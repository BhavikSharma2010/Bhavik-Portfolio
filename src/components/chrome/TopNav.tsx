"use client";

import { useActiveScene, type SceneId } from "@/hooks/useActiveScene";
import styles from "./topnav.module.css";

const LINKS: { id: SceneId; label: string }[] = [
  { id: "showing", label: "Now Showing" },
  { id: "origin", label: "Origin" },
  { id: "cast", label: "Cast" },
  { id: "press", label: "Press" },
  { id: "pitch", label: "Pitch" },
  { id: "premiere", label: "Premiere" },
];

/** Fixed studio bar: wordmark, scene links, blinking REC light. */
export function TopNav() {
  const activeId = useActiveScene();

  return (
    <header className={styles.topnav}>
      <a
        href="#hero"
        className={styles.wordmark}
        aria-label="Bhavik Studios — back to top"
      >
        Bhavik&nbsp;Studios
      </a>

      <nav className={styles.links} aria-label="Scenes">
        {LINKS.map((link) => (
          <a
            key={link.id}
            href={`#${link.id}`}
            className={styles.link}
            data-active={activeId === link.id}
            aria-current={activeId === link.id ? "true" : undefined}
          >
            {link.label}
          </a>
        ))}
      </nav>

      <span className={styles.rec} aria-hidden="true">
        <i className={styles.recDot} data-blink />
        REC
      </span>
    </header>
  );
}
