/** Shared motion constants so 3D, UI and scroll choreography stay in sync. */

export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

export const FADE_UP = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE_OUT_EXPO },
  },
} as const;

export const STAGGER_CHILDREN = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
} as const;
