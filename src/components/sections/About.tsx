"use client";

import { motion } from "framer-motion";
import { portfolio } from "@/content/portfolio";
import { FADE_UP, STAGGER_CHILDREN } from "@/lib/motion";
import { CountUp } from "@/components/fx/CountUp";
import { SectionHead } from "@/components/sections/SectionHead";
import styles from "./sections.module.css";

/** Scene 02 — the origin story: who Bhavik is, told like a film synopsis. */
export function About() {
  const { about } = portfolio;

  return (
    <section id="origin" className="section-shell" aria-labelledby="origin-heading">
      <SectionHead index="02" title="The Origin Story" id="origin-heading" />

      <div className={styles.aboutGrid}>
        <motion.p
          className={styles.aboutIntro}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          variants={FADE_UP}
        >
          {about.heading}
        </motion.p>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          variants={STAGGER_CHILDREN}
        >
          {about.paragraphs.map((paragraph, index) => {
            const note = about.commentary?.find(
              (entry) => entry.afterParagraph === index + 1,
            );
            return (
              <motion.p
                key={paragraph.slice(0, 32)}
                id={`about-p${index + 1}`}
                className={styles.reveal}
                variants={FADE_UP}
              >
                {paragraph}
                {note ? (
                  <>
                    {" "}
                    <button
                      type="button"
                      className={styles.commentaryMark}
                      popoverTarget={`commentary-${index + 1}`}
                      aria-label="Director's commentary"
                      title="Director's commentary"
                    >
                      ※
                    </button>
                    <span
                      popover="auto"
                      id={`commentary-${index + 1}`}
                      className={styles.commentaryPopover}
                    >
                      {note.note}
                    </span>
                  </>
                ) : null}
              </motion.p>
            );
          })}
        </motion.div>
      </div>

      <motion.div
        id="about-stats"
        className={styles.stats}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10%" }}
        variants={STAGGER_CHILDREN}
      >
        {about.stats.map((stat) => (
          <motion.div key={stat.label} className={styles.stat} variants={FADE_UP}>
            <span className={styles.statValue}>
              <CountUp value={stat.value} />
            </span>
            <span className={styles.statLabel}>{stat.label}</span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
