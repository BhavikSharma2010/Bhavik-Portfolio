"use client";

import { useRef, type PointerEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Project } from "@/content/portfolio";
import { FADE_UP } from "@/lib/motion";
import { Magnetic } from "@/components/hero/Magnetic";
import styles from "./now-showing.module.css";

const MAX_TILT_DEG = 5;

interface PosterRowProps {
  project: Project;
  index: number;
  onOpenTrailer: () => void;
}

/**
 * One card in the NOW SHOWING filmstrip: the project's full-width landing
 * capture on top, credits below. Cards sit side by side in a horizontally
 * scrolling strip (see .strip in the CSS module).
 */
export function PosterRow({ project, index, onOpenTrailer }: PosterRowProps) {
  const tiltRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  // Cursor-tracked 3D tilt on the card art, written as CSS vars — skipped
  // for touch pointers and reduced motion.
  const tiltArt = (event: PointerEvent<HTMLElement>) => {
    const tilt = tiltRef.current;
    if (!tilt || prefersReduced || event.pointerType === "touch") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - bounds.left) / bounds.width - 0.5;
    const py = (event.clientY - bounds.top) / bounds.height - 0.5;
    tilt.style.setProperty("--ry", `${(px * MAX_TILT_DEG).toFixed(2)}deg`);
    tilt.style.setProperty("--rx", `${(-py * MAX_TILT_DEG).toFixed(2)}deg`);
    tilt.style.setProperty("--gx", `${((px + 0.5) * 100).toFixed(1)}%`);
    tilt.style.setProperty("--gy", `${((py + 0.5) * 100).toFixed(1)}%`);
    tilt.style.setProperty("--glare", "1");
  };

  const resetTilt = () => {
    const tilt = tiltRef.current;
    if (!tilt) return;
    tilt.style.setProperty("--rx", "0deg");
    tilt.style.setProperty("--ry", "0deg");
    tilt.style.setProperty("--gx", "50%");
    tilt.style.setProperty("--gy", "50%");
    tilt.style.setProperty("--glare", "0");
  };

  return (
    <motion.article
      id={`film-${index + 1}`}
      className={styles.card}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px -8% 0px 0px" }}
      variants={FADE_UP}
    >
      <button
        type="button"
        className={styles.cardArtWrap}
        data-cursor="play"
        aria-label={`Watch trailer: ${project.title}`}
        onClick={onOpenTrailer}
        onPointerMove={tiltArt}
        onPointerLeave={resetTilt}
      >
        <div ref={tiltRef} className={styles.cardArtTilt} aria-hidden="true">
          {project.still ? (
            <img
              className={styles.cardArt}
              src={project.still.src}
              width={project.still.width}
              height={project.still.height}
              alt=""
              loading="lazy"
              decoding="async"
            />
          ) : (
            <span className={`${styles.cardArt} ${styles[`poster${project.cover}`]}`} />
          )}
          <span className={styles.cardScrim} />
          <span className={styles.cardTitle}>{project.title}</span>
        </div>
      </button>

      <div className={styles.cardBody}>
        <p className={styles.slate}>
          SCENE {String(index + 1).padStart(2, "0")} · {project.year} · RUNTIME {project.runtime}
        </p>
        <h3 className={styles.filmTitle}>{project.title}</h3>
        <p className={styles.synopsis}>{project.description}</p>

        <ul className={styles.genres} aria-label="Genre">
          {project.tags.map((tag) => (
            <li key={tag} className={styles.genre}>
              {tag}
            </li>
          ))}
        </ul>

        <div className={styles.links}>
          <Magnetic>
            <button
              type="button"
              className="btn btn-primary"
              onClick={onOpenTrailer}
              data-cursor="play"
            >
              Watch trailer
            </button>
          </Magnetic>
          {project.link !== "#" && (
            <Magnetic>
              <a
                className="btn btn-ghost"
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit the premiere
              </a>
            </Magnetic>
          )}
          {project.repo && (
            <Magnetic>
              <a className="btn btn-ghost" href={project.repo}>
                Read the script
              </a>
            </Magnetic>
          )}
          {project.link === "#" && !project.repo && (
            <p className={styles.privateReel}>In post-production · private reel</p>
          )}
        </div>
      </div>
    </motion.article>
  );
}
