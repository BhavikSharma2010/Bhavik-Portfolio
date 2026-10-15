"use client";

import { motion } from "framer-motion";
import { portfolio } from "@/content/portfolio";
import { FADE_UP, STAGGER_CHILDREN } from "@/lib/motion";
import { SectionHead } from "@/components/sections/SectionHead";
import styles from "./sections.module.css";

/** Track 03 — skills presented like a "Liked Songs" playlist. */
export function Skills() {
  const { skills } = portfolio;

  return (
    <section id="skills" className="section-shell" aria-labelledby="skills-heading">
      <SectionHead index="03" title="Liked Sounds" id="skills-heading" />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10%" }}
        variants={STAGGER_CHILDREN}
      >
        {skills.map((group) => (
          <motion.div key={group.name} className={styles.skillGroup} variants={FADE_UP}>
            <h3 className={styles.skillGroupName}>{group.name}</h3>
            <div className={styles.chips}>
              {group.skills.map((skill) => (
                <span key={skill} className={styles.chip}>
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
