"use client";

import { motion } from "framer-motion";
import { portfolio } from "@/content/portfolio";
import { FADE_UP, STAGGER_CHILDREN } from "@/lib/motion";
import { SectionHead } from "@/components/sections/SectionHead";
import styles from "./sections.module.css";

/** Scene 05 — the pitch: what you bring to the table, what ships. */
export function Deliverables() {
  const { deliverables } = portfolio;

  return (
    <section id="pitch" className="section-shell" aria-labelledby="pitch-heading">
      <SectionHead index="05" title="The Pitch" id="pitch-heading" />

      <motion.div
        className={styles.exchangeList}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10%" }}
        variants={STAGGER_CHILDREN}
      >
        {deliverables.map((exchange, index) => (
          <motion.div
            key={exchange.take}
            id={`del-${exchange.slug ?? index + 1}`}
            className={styles.exchange}
            variants={FADE_UP}
          >
            <p className={styles.exchangeTake}>{exchange.take}</p>
            <span className={styles.exchangeArrow} aria-hidden="true">
              ──▶
            </span>
            <p className={styles.exchangeDeliver}>{exchange.deliver}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
