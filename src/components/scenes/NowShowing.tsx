"use client";

import { useCallback, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { portfolio } from "@/content/portfolio";
import { SectionHead } from "@/components/sections/SectionHead";
import { PosterRow } from "@/components/scenes/PosterRow";
import { TrailerModal } from "@/components/trailer/TrailerModal";
import styles from "./now-showing.module.css";

/** Scene 01 — the feature presentation: six films on the bill. */
export function NowShowing() {
  const { projects } = portfolio;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const openTrailer = useCallback((index: number) => setActiveIndex(index), []);
  const closeTrailer = useCallback(() => setActiveIndex(null), []);

  return (
    <section id="showing" className="section-shell" aria-labelledby="showing-heading">
      <SectionHead index="01" title="Now Showing" id="showing-heading" />
      <div className={styles.strip} aria-label="Films now showing">
        {projects.map((project, index) => (
          <PosterRow
            key={project.title}
            project={project}
            index={index}
            onOpenTrailer={() => openTrailer(index)}
          />
        ))}
      </div>

      <AnimatePresence>
        {activeIndex !== null ? (
          <TrailerModal project={projects[activeIndex]} onClose={closeTrailer} />
        ) : null}
      </AnimatePresence>
    </section>
  );
}
