"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Howl } from "howler";

const MUTE_STORAGE_KEY = "bhavik-fm-muted";
const VOLUME = 0.32;

interface AudioPlayer {
  isPlaying: boolean;
  isMuted: boolean;
  /** False until the track is loaded and the browser allows playback. */
  isReady: boolean;
  toggle: () => void;
  toggleMute: () => void;
}

function readStoredMute(): boolean {
  try {
    return localStorage.getItem(MUTE_STORAGE_KEY) !== "false";
  } catch {
    return true;
  }
}

/**
 * Howler-backed background music. Never autoplays: playback starts only from
 * an explicit user gesture (browser policy friendly). Mute preference persists.
 */
export function useAudioPlayer(src: string): AudioPlayer {
  const howlRef = useRef<Howl | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadTrack(): Promise<void> {
      const { Howl } = await import("howler");
      if (cancelled) return;

      const howl = new Howl({
        src: [src],
        loop: true,
        volume: VOLUME,
        html5: true,
        onload: () => {
          if (!cancelled) setIsReady(true);
        },
        onloaderror: () => {
          // Missing or unreadable track: player becomes decorative, site works.
          if (!cancelled) setIsReady(false);
        },
      });
      howlRef.current = howl;
    }

    loadTrack().catch(() => setIsReady(false));

    return () => {
      cancelled = true;
      howlRef.current?.unload();
      howlRef.current = null;
    };
  }, [src]);

  const toggle = useCallback(() => {
    const howl = howlRef.current;
    if (!howl) return;

    if (howl.playing()) {
      howl.pause();
      setIsPlaying(false);
    } else {
      howl.mute(isMuted);
      howl.play();
      setIsPlaying(true);
    }
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      howlRef.current?.mute(next);
      try {
        localStorage.setItem(MUTE_STORAGE_KEY, String(next));
      } catch {
        // Private mode: preference just won't persist.
      }
      return next;
    });
  }, []);

  return { isPlaying, isMuted, isReady, toggle, toggleMute };
}
