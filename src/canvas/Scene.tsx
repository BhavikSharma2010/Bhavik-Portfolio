"use client";

import { Suspense, useRef, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Avatar } from "@/canvas/Avatar";
import { Backdrop } from "@/canvas/Backdrop";
import { Vinyl } from "@/canvas/Vinyl";
import { scrollState } from "@/lib/scrollStore";

const SECTION_COUNT = 7;

/**
 * Camera keyframes, one per track. The rig eases between the current and
 * next keyframe using within-section progress, so scrolling literally
 * "moves the camera" through the album.
 */
const CAMERA_KEYS = [
  { pos: [0.1, 1.15, 5.6], look: [-0.75, 1.05, 0] }, // 01 hero — avatar right of the headline
  { pos: [1.6, 1.3, 5.9], look: [1.0, 1.1, 0] }, // 02 about — avatar drifts left, clear of the text column
  { pos: [0.5, 1.5, 6.2], look: [-1.4, 1.0, 0] }, // 03 skills — avatar frames right
  { pos: [-0.8, 1.1, 6.6], look: [0.6, 1.0, 0] }, // 04 projects — vinyl stage-left
  { pos: [1.2, 1.4, 5.2], look: [-1.0, 1.2, 0] }, // 05 experience
  { pos: [0.2, 1.6, 6.8], look: [-1.2, 0.9, 0] }, // 06 deliverables — wide, avatar right
  { pos: [0.0, 1.25, 4.2], look: [0.0, 1.35, 0] }, // 07 encore — close-up behind the CTA
] as const;

function CameraRig(): ReactNode {
  const lookTarget = useRef<number[]>(CAMERA_KEYS[0].look.slice() as number[]);

  useFrame(({ camera, pointer }, delta) => {
    const index = Math.min(scrollState.sectionIndex, SECTION_COUNT - 1);
    const current = CAMERA_KEYS[index];

    // keyframe position + pointer parallax = where the camera wants to be
    const targetX = current.pos[0] + pointer.x * 0.18;
    const targetY = current.pos[1] + pointer.y * 0.1;
    const targetZ = current.pos[2];

    const eased = Math.min(1, delta * 2.2);

    camera.position.x += (targetX - camera.position.x) * eased;
    camera.position.y += (targetY - camera.position.y) * eased;
    camera.position.z += (targetZ - camera.position.z) * eased;

    lookTarget.current[0] += (current.look[0] - lookTarget.current[0]) * eased;
    lookTarget.current[1] += (current.look[1] - lookTarget.current[1]) * eased;
    camera.lookAt(lookTarget.current[0], lookTarget.current[1], 0);
  });

  return null;
}

function StageLights(): ReactNode {
  return (
    <>
      <ambientLight intensity={0.55} />
      {/* key */}
      <directionalLight position={[3.5, 4.5, 4]} intensity={1.6} color="#fff4e0" />
      {/* rim — the signature green edge light */}
      <directionalLight position={[-4, 3, -3]} intensity={2.4} color="#1ed760" />
      {/* warm bounce from below-front */}
      <pointLight position={[0, 0.4, 3]} intensity={6} color="#db2777" distance={9} />
    </>
  );
}

const NARROW_ASPECT = 0.85;

/**
 * On narrow (portrait) screens the stage moves back and up so the avatar
 * sits behind the text as atmosphere instead of fighting it for space.
 */
function ResponsiveStage({ children }: { children: ReactNode }): ReactNode {
  const { size } = useThree();
  const isNarrow = size.width / size.height < NARROW_ASPECT;
  return (
    <group
      position={isNarrow ? [0, 1.6, -2.6] : [0, 0, 0]}
      scale={isNarrow ? 0.85 : 1}
    >
      {children}
    </group>
  );
}

export default function Scene(): ReactNode {
  return (
    <Canvas
      className="scene-canvas"
      dpr={[1, 1.75]}
      camera={{ fov: 42, near: 0.1, far: 40, position: CAMERA_KEYS[0].pos }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
    >
      <StageLights />
      <Suspense fallback={null}>
        <ResponsiveStage>
          <Avatar />
          <Vinyl />
        </ResponsiveStage>
        <Backdrop />
      </Suspense>
      <CameraRig />
    </Canvas>
  );
}
