"use client";

import { useSyncExternalStore } from "react";
import {
  getSectionSnapshot,
  scrollState,
  subscribeSection,
} from "@/lib/scrollStore";

/** Returns the index of the track currently in view (source: scrollStore). */
export function useActiveSection(): number {
  return useSyncExternalStore(subscribeSection, getSectionSnapshot, () => 0);
}

export { scrollState };
