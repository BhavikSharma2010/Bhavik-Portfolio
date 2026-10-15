"use client";

import { portfolio } from "@/content/portfolio";
import { SectionHead } from "@/components/sections/SectionHead";
import { PosterRow } from "@/components/scenes/PosterRow";
import styles from "./now-showing.module.css";

/** Scene 01 — the feature presentation: six films on the bill. */
export function NowShowing() {
  return (
    <section id="showing" className="section-shell" aria-labelledby="showing-heading">
      <SectionHead index="01" title="Now Showing" id="showing-heading" />
      <div>
        {portfolio.projects.map((project, index) => (
          <PosterRow key={project.title} project={project} index={index} />
        ))}
      </div>
    </section>
  );
}
