"use client";

import { tracks } from "@/content/portfolio";
import { useActiveSection } from "@/hooks/useActiveSection";
import { scrollToId } from "@/components/SmoothScroll";
import styles from "./nav.module.css";

/** Desktop-only side tracklist — the site's table of contents as a record sleeve. */
export function TrackNav() {
  const activeIndex = useActiveSection();

  return (
    <nav className={styles.nav} aria-label="Album tracks">
      <ol className={styles.list}>
        {tracks.map((track, index) => (
          <li key={track.id}>
            <button
              type="button"
              className={styles.item}
              data-active={index === activeIndex}
              onClick={() => scrollToId(track.id)}
              aria-current={index === activeIndex ? "true" : undefined}
            >
              <span className={styles.number}>{track.number}</span>
              <span className={styles.title}>{track.title}</span>
              <span className={styles.duration}>{track.duration}</span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}
