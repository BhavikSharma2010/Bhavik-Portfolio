"use client";

import { motion } from "framer-motion";
import { portfolio } from "@/content/portfolio";
import { FADE_UP, STAGGER_CHILDREN } from "@/lib/motion";
import { SectionHead } from "@/components/sections/SectionHead";
import styles from "./sections.module.css";

/** Track 02 — liner notes: who Bhavik is, told like album credits. */
export function About() {
  const { about } = portfolio;

  return (
    <section id="about" className="section-shell" aria-labelledby="about-heading">
      <SectionHead index="02" title="Liner Notes" id="about-heading" />

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
          {about.paragraphs.map((paragraph) => (
            <motion.p key={paragraph.slice(0, 32)} className={styles.reveal} variants={FADE_UP}>
              {paragraph}
            </motion.p>
          ))}
        </motion.div>
      </div>

      <motion.div
        className={styles.stats}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10%" }}
        variants={STAGGER_CHILDREN}
      >
        {about.stats.map((stat) => (
          <motion.div key={stat.label} className={styles.stat} variants={FADE_UP}>
            <span className={styles.statValue}>{stat.value}</span>
            <span className={styles.statLabel}>{stat.label}</span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
