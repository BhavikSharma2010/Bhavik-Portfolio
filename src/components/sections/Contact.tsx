"use client";

import { motion } from "framer-motion";
import { portfolio } from "@/content/portfolio";
import { FADE_UP, STAGGER_CHILDREN } from "@/lib/motion";
import styles from "./sections.module.css";

/** Scene 06 — premiere night: the invite, the afterparty, the credits. */
export function Contact() {
  const { contact, profile } = portfolio;

  return (
    <section id="premiere" className="section-shell" aria-labelledby="premiere-heading">
      <motion.div
        id="contact-encore"
        className={styles.encore}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10%" }}
        variants={STAGGER_CHILDREN}
      >
        <motion.p className="kicker" variants={FADE_UP}>
          Scene 06 · You're invited
        </motion.p>

        <motion.h2 className={styles.encoreTitle} variants={FADE_UP} id="premiere-heading">
          {contact.heading}
        </motion.h2>

        <motion.p className={styles.encoreBlurb} variants={FADE_UP}>
          {contact.blurb}
        </motion.p>

        <motion.div className={styles.encoreActions} variants={FADE_UP}>
          <a className="btn btn-primary" href={`mailto:${profile.email}`}>
            RSVP by email
          </a>
          <a className="btn btn-ghost" href={`tel:${profile.phone.replace(/\s/g, "")}`}>
            Call the studio
          </a>
          <a className="btn btn-ghost" href={profile.resumeUrl}>
            Read the treatment
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
          Written &amp; directed by {profile.name} · Shot on Next.js · © {new Date().getFullYear()} Bhavik Studios
        </motion.p>
      </motion.div>
    </section>
  );
}
