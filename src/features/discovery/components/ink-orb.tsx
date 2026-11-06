"use client";

import { Canvas } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { useReducedMotion } from "motion/react";

function InkForm() {
  return (
    <Float speed={1.2} rotationIntensity={0.35} floatIntensity={0.6}>
      <mesh>
        <icosahedronGeometry args={[1.15, 0]} />
        <meshStandardMaterial
          color="#171717"
          roughness={0.45}
          metalness={0.15}
        />
      </mesh>
      <mesh position={[0.55, 0.35, 0.4]} scale={0.28}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color="#753D43" roughness={0.35} />
      </mesh>
    </Float>
  );
}

export function InkOrb() {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <div
        aria-hidden
        className="bg-paper mx-auto aspect-square w-full max-w-md rounded-full"
      />
    );
  }

  return (
    <div className="mx-auto aspect-square w-full max-w-md" aria-hidden>
      <Canvas camera={{ position: [0, 0, 4], fov: 35 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 4, 2]} intensity={1.1} />
        <InkForm />
      </Canvas>
    </div>
  );
}
