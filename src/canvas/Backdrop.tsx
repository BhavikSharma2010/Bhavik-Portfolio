"use client";

import { Sparkles } from "@react-three/drei";
import { scrollState } from "@/lib/scrollStore";
import { useFrame } from "@react-three/fiber";
import { useRef, type ReactNode } from "react";
import type { Group } from "three";

/** Dust-particle atmosphere + accent ring lights, drifting behind the story. */
export function Backdrop(): ReactNode {
  const drift = useRef<Group>(null);

  useFrame((_, delta) => {
    const node = drift.current;
    if (!node) return;
    // slow parallax drift against scroll for depth
    node.position.y = scrollState.progress * 1.5;
    node.rotation.y += delta * 0.015;
  });

  return (
    <group ref={drift}>
      <Sparkles count={90} scale={[14, 8, 6]} position={[0, 2.5, -2]} size={2.2} speed={0.25} opacity={0.5} color="#1ed760" />
      <Sparkles count={50} scale={[12, 7, 5]} position={[0, 2, -3]} size={1.4} speed={0.18} opacity={0.35} color="#9b9bab" />
    </group>
  );
}
