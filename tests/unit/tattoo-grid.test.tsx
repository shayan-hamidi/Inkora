import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { TattooGrid } from "@/features/tattoos/components/tattoo-grid";
import type { TattooCard } from "@/features/tattoos/types";

afterEach(() => {
  cleanup();
});

const sample: TattooCard = {
  id: "55555555-5555-4555-8555-555555555504",
  title: "Quiet Moon",
  slug: "quiet-moon",
  description: null,
  imagePath: "/demo/tattoos/minimal-moon.svg",
  imageAlt: "Moon",
  imageWidth: 800,
  imageHeight: 1000,
  isDemo: true,
  isFeatured: true,
  category: { id: "1", name: "Nature", slug: "nature" },
  styles: [{ id: "2", name: "Minimal", slug: "minimal" }],
  placements: [],
  tags: [],
};

describe("TattooGrid", () => {
  it("renders an empty state", () => {
    render(<TattooGrid tattoos={[]} />);
    expect(screen.getByText(/No tattoos matched/i)).toBeInTheDocument();
  });

  it("renders tattoo cards", () => {
    render(<TattooGrid tattoos={[sample]} />);
    expect(
      screen.getByRole("link", { name: /Quiet Moon/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Moon" })).toHaveAttribute(
      "src",
      "/demo/tattoos/minimal-moon.svg",
    );
  });
});
