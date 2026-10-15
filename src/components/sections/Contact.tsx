"use client";

import { motion } from "framer-motion";
import { portfolio } from "@/content/portfolio";
import { FADE_UP, STAGGER_CHILDREN } from "@/lib/motion";
import styles from "./sections.module.css";

/** Track 07 — encore. The big CTA and the credits roll. */
export function Contact() {
  const { contact, profile } = portfolio;

  return (
    <section id="contact" className="section-shell" aria-labelledby="contact-heading">
      <motion.div
        className={styles.encore}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10%" }}
        variants={STAGGER_CHILDREN}
      >
        <motion.p className="kicker" variants={FADE_UP}>
          07 / Bonus track
        </motion.p>

        <motion.h2 className={styles.encoreTitle} variants={FADE_UP} id="contact-heading">
          {contact.heading}
        </motion.h2>

        <motion.p className={styles.encoreBlurb} variants={FADE_UP}>
          {contact.blurb}
        </motion.p>

        <motion.div className={styles.encoreActions} variants={FADE_UP}>
          <a className="btn btn-primary" href={`mailto:${profile.email}`}>
            Drop a message
          </a>
          <a className="btn btn-ghost" href={profile.resumeUrl}>
            Download resume
          </a>
        </motion.div>

        <motion.div className={styles.socials} variants={FADE_UP}>
          {profile.socials.map((social) => (
            <a
              key={social.label}
              className={styles.socialLink}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {social.label}
            </a>
          ))}
        </motion.div>

        <motion.p className={styles.credits} variants={FADE_UP}>
          Recorded &amp; mixed by {profile.name} · Pressed on the open web · {new Date().getFullYear()}
        </motion.p>
      </motion.div>
    </section>
  );
}
