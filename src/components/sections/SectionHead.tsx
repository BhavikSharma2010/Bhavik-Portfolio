"use client";

import { motion } from "framer-motion";
import { FADE_UP } from "@/lib/motion";
import { ScrambleText } from "@/components/fx/ScrambleText";

interface SectionHeadProps {
  index: string;
  title: string;
  id: string;
}

/** Film slate header: red SCENE marker + big Anton title that decodes on view. */
export function SectionHead({ index, title, id }: SectionHeadProps) {
  return (
    <motion.header
      className="section-head"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-15%" }}
    >
      <motion.span className="section-index" variants={FADE_UP}>
        SCENE {index} · TAKE 01
      </motion.span>
      <motion.h2 className="section-title" variants={FADE_UP} id={id}>
        <ScrambleText text={title} />
      </motion.h2>
    </motion.header>
  );
}
