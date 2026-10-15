"use client";

import type { PointerEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { portfolio, type SkillGroup } from "@/content/portfolio";
import { FADE_UP, STAGGER_CHILDREN } from "@/lib/motion";
import { SectionHead } from "@/components/sections/SectionHead";
import styles from "./sections.module.css";

/** Stock-ticker style monograms; anything unmapped falls back to its first two letters. */
const MONOGRAMS: Record<string, string> = {
  "React.js": "RE",
  "JavaScript (ES6+)": "JS",
  "TypeScript": "TS",
  "HTML5": "H5",
  "CSS3": "C3",
  "Tailwind CSS": "TW",
  "Responsive Design": "RD",
  "Node.js": "ND",
  "REST APIs": "AP",
  "MongoDB": "MG",
  "Supabase": "SB",
  "PostgreSQL": "PG",
  "Git": "GT",
  "GitHub": "GH",
  "VS Code": "VS",
  "Cursor": "CU",
  "Netlify": "NL",
  "Vercel": "VC",
  "Claude Code": "CC",
  "Generative AI": "AI",
  "Prompt Engineering": "PE",
};

function monogramFor(skill: string): string {
  return MONOGRAMS[skill] ?? skill.slice(0, 2).toUpperCase();
}

const VIEWPORT = { once: true, margin: "-10%" } as const;

/** Scene 03 — Cast & Crew: skills as an interactive card grid of the studio's billing list. */
export function Skills() {
  const { skills } = portfolio;
  const prefersReduced = useReducedMotion();

  // one pointer handler for the whole section: track the hovered card's
  // spotlight position via CSS variables, no React state
  const trackSpotlight = (event: PointerEvent<HTMLDivElement>) => {
    if (prefersReduced) return;
    const target = event.target as Element;
    const card = target.closest<HTMLElement>("[data-cast-card]");
    if (!card) return;
    const bounds = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${event.clientX - bounds.left}px`);
    card.style.setProperty("--my", `${event.clientY - bounds.top}px`);
  };

  return (
    <section id="cast" className="section-shell" aria-labelledby="cast-heading">
      <SectionHead index="03" title="Cast & Crew" id="cast-heading" />

      <div onPointerMove={trackSpotlight}>
        {skills.map((group) => (
          <motion.div
            key={group.name}
            className={styles.castGroup}
            initial={prefersReduced ? false : "hidden"}
            whileInView={prefersReduced ? undefined : "visible"}
            viewport={VIEWPORT}
          >
            <CastGroup group={group} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function CastGroup({ group }: { group: SkillGroup }) {
  return (
    <>
      <div className={styles.castGroupHead}>
        <span className={styles.castKicker}>Now Appearing · {group.name}</span>
        <span className={styles.castCount}>
          {String(group.skills.length).padStart(2, "0")} credits
        </span>
      </div>

      <motion.div className={styles.castGrid} variants={STAGGER_CHILDREN}>
        {group.skills.map((skill) => {
          const tagline = group.featured?.[skill];
          const isFeatured = tagline !== undefined;
          return (
            <motion.article
              key={skill}
              className={
                isFeatured
                  ? `${styles.castCard} ${styles.castCardFeatured}`
                  : styles.castCard
              }
              variants={FADE_UP}
              data-cast-card
            >
              <span className={styles.castBadge} aria-hidden>
                {monogramFor(skill)}
              </span>
              <span className={styles.castName}>{skill}</span>
              {isFeatured && <p className={styles.castTagline}>{tagline}</p>}
              <span className={isFeatured ? styles.castBilling : styles.castRole}>
                {isFeatured ? "Starring" : `Supporting · ${group.name}`}
              </span>
            </motion.article>
          );
        })}
      </motion.div>
    </>
  );
}
