"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { portfolio } from "@/content/portfolio";
import { EASE_OUT_EXPO } from "@/lib/motion";
import { SectionHead } from "@/components/sections/SectionHead";
import styles from "./sections.module.css";

/** Track 05 — career history as a tour setlist. Rows expand like liner notes. */
export function Experience() {
  const { experience } = portfolio;
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="experience" className="section-shell" aria-labelledby="experience-heading">
      <SectionHead index="05" title="Tour History" id="experience-heading" />

      <div className={styles.tracklist}>
        {experience.map((item, index) => {
          const isOpen = index === openIndex;
          const panelId = `experience-panel-${index}`;
          return (
            <div key={`${item.company}-${item.role}`} className={styles.trackRow}>
              <button
                type="button"
                className={styles.trackRowHead}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
              >
                <span className={styles.trackRowNumber}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>
                  <span className={styles.trackRowTitle}>{item.role}</span>
                  <span className={styles.trackRowCompany}>{item.company}</span>
                </span>
                <span className={styles.trackRowPeriod}>{item.period}</span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={panelId}
                    className={styles.trackRowBody}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
                    style={{ overflow: "hidden" }}
                  >
                    <p className={styles.trackRowSummary}>{item.summary}</p>
                    <ul className={styles.trackRowHighlights}>
                      {item.highlights.map((highlight) => (
                        <li key={highlight}>{highlight}</li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
