"use client";

import dynamic from "next/dynamic";

const InkOrb = dynamic(
  () =>
    import("@/features/discovery/components/ink-orb").then(
      (module) => module.InkOrb,
    ),
  {
    ssr: false,
    loading: () => (
      <div
        aria-hidden
        className="bg-paper mx-auto aspect-square w-full max-w-md rounded-full"
      />
    ),
  },
);

export function InkOrbLazy() {
  return <InkOrb />;
}
