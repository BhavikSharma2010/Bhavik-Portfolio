"use client";

import { motion } from "framer-motion";
import { FADE_UP } from "@/lib/motion";

interface SectionHeadProps {
  index: string;
  title: string;
  id: string;
}

/** Shared section header: track number + big display title. */
export function SectionHead({ index, title, id }: SectionHeadProps) {
  return (
    <motion.header
      className="section-head"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-15%" }}
    >
      <motion.span className="section-index" variants={FADE_UP}>
        {index} /
      </motion.span>
      <motion.h2 className="section-title" variants={FADE_UP} id={id}>
        {title}
      </motion.h2>
    </motion.header>
  );
}
