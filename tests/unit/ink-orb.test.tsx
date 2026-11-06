import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("motion/react", () => ({
  useReducedMotion: () => true,
}));

vi.mock("@react-three/fiber", () => ({
  Canvas: () => null,
}));

vi.mock("@react-three/drei", () => ({
  Float: ({ children }: { children: React.ReactNode }) => children,
}));

import { InkOrb, StaticOrbFallback } from "@/features/discovery/components/ink-orb";

afterEach(() => {
  cleanup();
});

describe("InkOrb", () => {
  it("renders a static fallback when reduced motion is preferred", () => {
    const { container } = render(<InkOrb />);
    expect(container.querySelector("[aria-hidden]")).toBeTruthy();
    expect(container.querySelector("canvas")).toBeNull();
  });

  it("exposes a static fallback component", () => {
    const { container } = render(<StaticOrbFallback />);
    expect(container.firstChild).toBeTruthy();
  });
});
