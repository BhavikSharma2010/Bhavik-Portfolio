"use client";

import { useMemo, useRef, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import * as THREE from "three";
import { scrollState } from "@/lib/scrollStore";

const LABEL_TEXT = "BHAVIK · SIDE A";

function createLabelTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    const gradient = ctx.createRadialGradient(128, 128, 20, 128, 128, 128);
    gradient.addColorStop(0, "#3ce477");
    gradient.addColorStop(1, "#0f8a3d");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);

    ctx.fillStyle = "#04110a";
    ctx.font = '700 20px "JetBrains Mono", monospace';
    ctx.textAlign = "center";
    ctx.fillText(LABEL_TEXT, 128, 122);
    ctx.font = "400 16px sans-serif";
    ctx.fillText("33⅓ RPM", 128, 152);
    // spindle hole
    ctx.beginPath();
    ctx.arc(128, 128, 10, 0, Math.PI * 2);
    ctx.fillStyle = "#08080d";
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 4;
  return texture;
}

/**
 * Floating vinyl that spins faster with scroll velocity and only takes
 * the stage during the Projects track (section index 3).
 */
export function Vinyl(): ReactNode {
  const group = useRef<Group>(null);
  const disc = useRef<Group>(null);
  const labelTexture = useMemo(createLabelTexture, []);

  useFrame((_, delta) => {
    const stage = group.current;
    const spin = disc.current;
    if (!stage || !spin) return;

    const t = performance.now() / 1000;
    const onProjects = scrollState.sectionIndex === 3 ? 1 : 0.12;

    // take the stage / exit
    const targetScale = 0.55 + onProjects * 0.45;
    stage.scale.x += (targetScale * (onProjects > 0.5 ? 1 : 0.001) - stage.scale.x) * Math.min(1, delta * 3);
    stage.scale.y = stage.scale.z = stage.scale.x;
    stage.position.y = 1.35 + Math.sin(t * 0.9) * 0.08;
    stage.rotation.z = Math.sin(t * 0.6) * 0.05;

    spin.rotation.y += delta * (0.8 + Math.min(6, Math.abs(scrollState.velocity) * 0.02));
  });

  return (
    <group ref={group} position={[-2.7, 1.35, 0.4]} rotation={[0.45, 0.35, 0]}>
      <group ref={disc}>
        {/* record body */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[1, 1, 0.02, 64]} />
          <meshStandardMaterial color="#0b0b10" roughness={0.28} metalness={0.35} />
        </mesh>
        {/* grooves sheen */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.011, 0]}>
          <torusGeometry args={[0.82, 0.004, 8, 72]} />
          <meshStandardMaterial color="#2a2a35" roughness={0.2} metalness={0.6} />
        </mesh>
        {/* label */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]}>
          <circleGeometry args={[0.34, 48]} />
          <meshStandardMaterial map={labelTexture} roughness={0.5} />
        </mesh>
      </group>
    </group>
  );
}
