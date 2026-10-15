import styles from "./marquee.module.css";

interface MarqueeProps {
  items: string[];
  reverse?: boolean;
  gold?: boolean;
}

/** Seamless ticker: the track renders twice, then slides -50%. */
export function Marquee({ items, reverse, gold }: MarqueeProps) {
  const line = items.join("  ·  ");

  return (
    <div className={styles.strip} data-gold={gold || undefined} aria-hidden="true">
      <div className={styles.track} data-reverse={reverse || undefined}>
        <span className={styles.chunk}>{line}  ·  </span>
        <span className={styles.chunk}>{line}  ·  </span>
      </div>
    </div>
  );
}
