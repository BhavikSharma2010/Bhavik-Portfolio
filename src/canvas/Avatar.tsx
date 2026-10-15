"use client";

import { Component, useEffect, useRef, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import { useAnimations, useGLTF } from "@react-three/drei";
import type { AnimationClip, Group } from "three";
import { scrollState } from "@/lib/scrollStore";

const MODEL_URL = "/avatar/model.glb";

/**
 * The star of the album. Loads a rigged GLB (Ready Player Me / Mixamo export)
 * and plays its first idle-like clip. Subtle pointer-follow keeps it alive.
 *
 * Swapping avatars: drop any rigged .glb at public/avatar/model.glb.
 * If the file has no clips (typical Ready Player Me export), a gentle
 * procedural sway plays instead. If loading fails entirely, a stylized
 * placeholder keeps the scene composed.
 */
function AvatarModel(): ReactNode {
  const group = useRef<Group>(null);
  const { scene, animations } = useGLTF(MODEL_URL);
  const { actions, names } = useAnimations(animations as AnimationClip[], group);

  useEffect(() => {
    if (names.length === 0) return;
    const idleName = names.find((name) => /idle/i.test(name)) ?? names[0];
    const action = actions[idleName];
    action?.reset().fadeIn(0.4).play();
    return () => {
      action?.fadeOut(0.3);
    };
  }, [actions, names]);

  useFrame((_, delta) => {
    const node = group.current;
    if (!node) return;

    if (names.length === 0) {
      // Procedural sway for animation-less models (e.g. stock RPM exports).
      const t = performance.now() / 1000;
      node.position.y = Math.sin(t * 1.4) * 0.04;
      node.rotation.z = Math.sin(t * 0.9) * 0.02;
    }

    // Ease toward a gentle look-at driven by the pointer.
    node.rotation.y += (scrollState.pointer.x * 0.35 - node.rotation.y) * Math.min(1, delta * 3);
  });

  return (
    <group ref={group} dispose={null}>
      {/* most rigged humanoid exports face +Z (away from a +Z camera) */}
      <group rotation={[0, Math.PI, 0]}>
        <primitive object={scene} />
      </group>
    </group>
  );
}

/** Stylized stand-in: a glowing "ghost DJ" built from primitives. */
function AvatarFallback(): ReactNode {
  const group = useRef<Group>(null);

  useFrame((_, delta) => {
    const node = group.current;
    if (!node) return;
    const t = performance.now() / 1000;
    node.position.y = Math.sin(t * 1.2) * 0.06;
    node.rotation.y += (scrollState.pointer.x * 0.4 - node.rotation.y) * Math.min(1, delta * 3);
  });

  return (
    <group ref={group}>
      {/* body */}
      <mesh position={[0, 0.85, 0]} castShadow>
        <capsuleGeometry args={[0.32, 0.7, 8, 24]} />
        <meshStandardMaterial color="#17171f" roughness={0.35} metalness={0.2} />
      </mesh>
      {/* head */}
      <mesh position={[0, 1.62, 0]} castShadow>
        <sphereGeometry args={[0.26, 32, 32]} />
        <meshStandardMaterial
          color="#1ed760"
          emissive="#1ed760"
          emissiveIntensity={0.55}
          roughness={0.25}
        />
      </mesh>
      {/* visor */}
      <mesh position={[0, 1.64, 0.2]}>
        <boxGeometry args={[0.3, 0.08, 0.06]} />
        <meshStandardMaterial color="#08080d" emissive="#08080d" />
      </mesh>
      {/* headphones */}
      <mesh position={[0, 1.66, 0]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.28, 0.035, 12, 40, Math.PI]} />
        <meshStandardMaterial color="#f5f5f7" roughness={0.4} />
      </mesh>
    </group>
  );
}

interface BoundaryProps {
  children: ReactNode;
}

/** Falls back to the placeholder figure when the GLB is missing or corrupt. */
class AvatarBoundary extends Component<BoundaryProps, { failed: boolean }> {
  constructor(props: BoundaryProps) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError(): { failed: boolean } {
    return { failed: true };
  }

  render(): ReactNode {
    return this.state.failed ? <AvatarFallback /> : this.props.children;
  }
}

export function Avatar(): ReactNode {
  return (
    <AvatarBoundary>
      <AvatarModel />
    </AvatarBoundary>
  );
}

useGLTF.preload(MODEL_URL);
