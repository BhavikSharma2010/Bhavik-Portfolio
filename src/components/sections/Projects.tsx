"use client";

import { motion } from "framer-motion";
import { portfolio } from "@/content/portfolio";
import { FADE_UP, STAGGER_CHILDREN } from "@/lib/motion";
import { SectionHead } from "@/components/sections/SectionHead";
import styles from "./sections.module.css";

/** Track 04 — projects as album covers. Every card is a record. */
export function Projects() {
  const { projects } = portfolio;

  return (
    <section id="projects" className="section-shell" aria-labelledby="projects-heading">
      <SectionHead index="04" title="The Albums" id="projects-heading" />

      <motion.div
        className={styles.projectGrid}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-8%" }}
        variants={STAGGER_CHILDREN}
      >
        {projects.map((project) => (
          <motion.a
            key={project.title}
            className={styles.card}
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            variants={FADE_UP}
            aria-label={`${project.title} — open project`}
          >
            <div className={`${styles.cover} ${styles[`cover${project.cover}`]}`}>
              <span className={styles.coverInitial} aria-hidden="true">
                {project.title.charAt(0)}
              </span>
              <span className={styles.playGlyph} aria-hidden="true">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M8 5.5v13a1 1 0 0 0 1.54.84l10-6.5a1 1 0 0 0 0-1.68l-10-6.5A1 1 0 0 0 8 5.5Z" />
                </svg>
              </span>
            </div>

            <div className={styles.cardBody}>
              <div className={styles.cardTitleRow}>
                <h3 className={styles.cardTitle}>{project.title}</h3>
                <span className={styles.cardYear}>{project.year}</span>
              </div>
              <p className={styles.cardDesc}>{project.description}</p>
              <div className={styles.cardTags}>
                {project.tags.map((tag) => (
                  <span key={tag} className={styles.cardTag}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.a>
        ))}
      </motion.div>
    </section>
  );
}
