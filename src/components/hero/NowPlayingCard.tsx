"use client";

import { motion, type MotionValue } from "framer-motion";
import { tracks } from "@/content/portfolio";
import { EASE_OUT_EXPO } from "@/lib/motion";
import { HeroFaceArt } from "@/components/hero/HeroFaceArt";
import styles from "@/components/sections/hero.module.css";

interface NowPlayingCardProps {
  rotateX: MotionValue<number>;
  rotateY: MotionValue<number>;
}

/** Floating glass "Now Playing" card — the hero's album widget. */
export function NowPlayingCard({ rotateX, rotateY }: NowPlayingCardProps) {
  const track = tracks[0];

  return (
    <div className={styles.cardStage}>
      <motion.article
        className={styles.npCard}
        style={{ rotateX, rotateY, transformPerspective: 900 }}
        initial={{ opacity: 0, y: 44 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.75, duration: 0.8, ease: EASE_OUT_EXPO }}
        aria-label={`Now playing: ${track.title}`}
      >
        <div className={styles.npArt} aria-hidden="true">
          <HeroFaceArt />
        </div>
        <div className={styles.npMeta}>
          <span className={styles.npKicker}>
            <span className={styles.npEq} aria-hidden="true">
              <i /><i /><i /><i />
            </span>
            Now Playing
          </span>
          <span className={styles.npTitle}>{track.title}</span>
          <span className={styles.npSub}>Bhavik · {track.number}/{tracks.length} · {track.duration}</span>
        </div>
        <div className={styles.npProgress} aria-hidden="true">
          <span />
        </div>
      </motion.article>
    </div>
  );
}
