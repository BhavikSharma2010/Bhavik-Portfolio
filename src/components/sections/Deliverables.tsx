"use client";

import { motion } from "framer-motion";
import { portfolio } from "@/content/portfolio";
import { FADE_UP, STAGGER_CHILDREN } from "@/lib/motion";
import { SectionHead } from "@/components/sections/SectionHead";
import styles from "./sections.module.css";

/** Track 06 — the working agreement: what I take, what I deliver. */
export function Deliverables() {
  const { deliverables } = portfolio;

  return (
    <section id="deliverables" className="section-shell" aria-labelledby="deliverables-heading">
      <SectionHead index="06" title="In the Studio" id="deliverables-heading" />

      <motion.div
        className={styles.exchangeList}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10%" }}
        variants={STAGGER_CHILDREN}
      >
        {deliverables.map((exchange) => (
          <motion.div key={exchange.take} className={styles.exchange} variants={FADE_UP}>
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
