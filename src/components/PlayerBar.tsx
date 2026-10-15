"use client";

import { useEffect, useRef } from "react";
import { tracks } from "@/content/portfolio";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { useActiveSection } from "@/hooks/useActiveSection";
import { scrollState } from "@/lib/scrollStore";
import { scrollToId } from "@/components/SmoothScroll";
import styles from "./player.module.css";

const PROGRESS_TICK_MS = 1000 / 60;

/**
 * The persistent Spotify-style bar: play/pause for the lo-fi score,
 * track name from the section in view, and a progress bar that doubles
 * as scroll scrubber — click anywhere on it to seek the page.
 */
export function PlayerBar() {
  const { isPlaying, isMuted, isReady, toggle, toggleMute } = useAudioPlayer("/audio/lofi.wav");
  const activeIndex = useActiveSection();
  const track = tracks[activeIndex] ?? tracks[0];
  const fillRef = useRef<HTMLSpanElement>(null);
  const timeRef = useRef<HTMLSpanElement>(null);

  // Progress updates every frame — write straight to the DOM to avoid re-renders.
  useEffect(() => {
    let rafId = 0;
    const tick = (): void => {
      if (fillRef.current) {
        fillRef.current.style.transform = `scaleX(${scrollState.progress})`;
      }
      if (timeRef.current) {
        timeRef.current.textContent = `${Math.round(scrollState.progress * 100)}%`;
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const seek = (event: React.MouseEvent<HTMLDivElement>): void => {
    const rect = event.currentTarget.getBoundingClientRect();
    const fraction = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    const max = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: fraction * max, behavior: "smooth" });
  };

  return (
    <footer className={styles.player} aria-label="Portfolio player">
      {/* seekable scroll progress */}
      <div
        className={styles.progress}
        onClick={seek}
        role="slider"
        aria-label="Page position"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(scrollState.progress * 100)}
        tabIndex={0}
      >
        <span ref={fillRef} className={styles.progressFill} />
      </div>

      <div className={styles.inner}>
        {/* now playing */}
        <div className={styles.nowPlaying}>
          <span className={styles.eq} data-playing={isPlaying} aria-hidden="true">
            <i /><i /><i /><i />
          </span>
          <div className={styles.trackMeta}>
            <span className={styles.trackTitle}>{track.title}</span>
            <span className={styles.trackArtist}>Bhavik · {track.number}/{tracks.length}</span>
          </div>
        </div>

        {/* transport */}
        <div className={styles.transport}>
          <button
            type="button"
            className={styles.playBtn}
            onClick={toggle}
            disabled={!isReady}
            aria-label={isPlaying ? "Pause background music" : "Play background music"}
          >
            {isPlaying ? (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                <path d="M8 5.5v13a1 1 0 0 0 1.54.84l10-6.5a1 1 0 0 0 0-1.68l-10-6.5A1 1 0 0 0 8 5.5Z" />
              </svg>
            )}
          </button>
          <span ref={timeRef} className={styles.progressLabel} aria-hidden="true">0%</span>
        </div>

        {/* right side */}
        <div className={styles.side}>
          <span className={styles.stationLabel}>▶ bhavik.fm · lo-fi radio</span>
          <button
            type="button"
            className={styles.muteBtn}
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute" : "Mute"}
            aria-pressed={!isMuted}
          >
            {isMuted ? (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M11 5 6 9H3v6h3l5 4V5Z" />
                <line x1="16" y1="9" x2="22" y2="15" />
                <line x1="22" y1="9" x2="16" y2="15" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M11 5 6 9H3v6h3l5 4V5Z" />
                <path d="M15.5 8.5a5 5 0 0 1 0 7" />
                <path d="M18.5 5.5a9 9 0 0 1 0 13" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </footer>
  );
}
