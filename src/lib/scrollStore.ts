/**
 * Shared scroll state, written by the Lenis provider every frame and read
 * inside the R3F render loop (via the mutable object) and by UI components
 * (via the subscribe/useSyncExternalStore API for the active section).
 */

export interface ScrollState {
  /** 0..1 progress through the whole page */
  progress: number;
  /** signed px/frame velocity, useful for spin/flicker effects */
  velocity: number;
  /** index into the `tracks` array for the section in view */
  sectionIndex: number;
  /** normalized pointer position -1..1 for avatar look-at */
  pointer: { x: number; y: number };
}

export const scrollState: ScrollState = {
  progress: 0,
  velocity: 0,
  sectionIndex: 0,
  pointer: { x: 0, y: 0 },
};

const listeners = new Set<() => void>();

export function setSectionIndex(index: number): void {
  if (scrollState.sectionIndex === index) return;
  scrollState.sectionIndex = index;
  listeners.forEach((notify) => notify());
}

export function subscribeSection(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

export function getSectionSnapshot(): number {
  return scrollState.sectionIndex;
}
