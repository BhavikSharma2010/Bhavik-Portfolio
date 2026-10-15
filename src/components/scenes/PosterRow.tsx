"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import type { Project } from "@/content/portfolio";
import { FADE_UP } from "@/lib/motion";
import { Magnetic } from "@/components/hero/Magnetic";
import styles from "./now-showing.module.css";

interface PosterRowProps {
  project: Project;
  index: number;
}

/** One film in the NOW SHOWING bill: poster panel + credits column. */
export function PosterRow({ project, index }: PosterRowProps) {
  const ref = useRef<HTMLElement>(null);
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const posterY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const even = index % 2 === 1;

  return (
    <motion.article
      ref={ref}
      id={`film-${index + 1}`}
      className={styles.row}
      data-even={even || undefined}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-12%" }}
      variants={FADE_UP}
    >
      <div className={styles.posterWrap}>
        <motion.div
          className={`${styles.poster} ${styles[`poster${project.cover}`]}`}
          style={prefersReduced ? undefined : { y: posterY }}
          aria-hidden="true"
        >
          <span className={styles.posterTitle}>{project.title}</span>
          <span className={styles.posterYear}>{project.year}</span>
        </motion.div>
      </div>

      <div className={styles.details}>
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
          {project.link !== "#" && (
            <Magnetic>
              <a className="btn btn-primary" href={project.link}>
                Watch trailer
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
