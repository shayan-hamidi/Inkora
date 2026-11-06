"use client";

import { Canvas } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { useReducedMotion } from "motion/react";
import { Component, type ReactNode, useState } from "react";

function InkForm({ animate }: { animate: boolean }) {
  const content = (
    <>
      <mesh>
        <icosahedronGeometry args={[1.2, 0]} />
        <meshStandardMaterial
          color="#171717"
          roughness={0.4}
          metalness={0.2}
        />
      </mesh>
      <mesh position={[0.6, 0.4, 0.45]} scale={0.3}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshStandardMaterial color="#753D43" roughness={0.3} metalness={0.1} />
      </mesh>
    </>
  );

  if (!animate) {
    return <group>{content}</group>;
  }

  return (
    <Float speed={1.2} rotationIntensity={0.35} floatIntensity={0.55}>
      {content}
    </Float>
  );
}

function StaticOrbFallback() {
  return (
    <div
      aria-hidden
      className="bg-paper relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-full"
    >
      <div className="absolute inset-[18%] rounded-full bg-ink shadow-[inset_-18px_-12px_40px_rgba(0,0,0,0.35)]" />
      <div className="bg-burgundy absolute top-[28%] right-[28%] size-[18%] rounded-full" />
    </div>
  );
}

class OrbErrorBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    if (this.state.failed) {
      return <StaticOrbFallback />;
    }
    return this.props.children;
  }
}

export function InkOrb() {
  const prefersReducedMotion = useReducedMotion();
  const [failed, setFailed] = useState(false);

  if (prefersReducedMotion || failed) {
    return <StaticOrbFallback />;
  }

  return (
    <div className="bg-paper mx-auto aspect-square w-full max-w-md overflow-hidden rounded-full">
      <OrbErrorBoundary onError={() => setFailed(true)}>
        <Canvas
          className="h-full w-full"
          dpr={[1, 2]}
          camera={{ position: [0, 0, 4.2], fov: 35 }}
          gl={{ antialias: true, alpha: false }}
          onCreated={({ gl }) => {
            gl.setClearColor("#EAE6DE", 1);
          }}
        >
          <ambientLight intensity={0.85} />
          <directionalLight position={[3.5, 4, 2]} intensity={1.25} />
          <directionalLight position={[-2, -1, 3]} intensity={0.35} />
          <InkForm animate />
        </Canvas>
      </OrbErrorBoundary>
    </div>
  );
}

export { StaticOrbFallback };
