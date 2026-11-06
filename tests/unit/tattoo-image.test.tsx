import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { TattooImage } from "@/features/tattoos/components/tattoo-image";

afterEach(() => {
  cleanup();
});

describe("TattooImage", () => {
  it("renders with explicit dimensions and eager loading when prioritized", () => {
    render(
      <TattooImage
        src="/demo/tattoos/minimal-moon.svg"
        alt="Quiet Moon"
        priority
        width={800}
        height={1000}
      />,
    );

    const image = screen.getByRole("img", { name: "Quiet Moon" });
    expect(image).toHaveAttribute("src", "/demo/tattoos/minimal-moon.svg");
    expect(image).toHaveAttribute("width", "800");
    expect(image).toHaveAttribute("height", "1000");
    expect(image).toHaveAttribute("loading", "eager");
  });

  it("falls back to default dimensions and lazy loading", () => {
    render(<TattooImage src="/demo/tattoos/line-serpent.svg" alt="Serpent" />);

    const image = screen.getByRole("img", { name: "Serpent" });
    expect(image).toHaveAttribute("width", "800");
    expect(image).toHaveAttribute("height", "1000");
    expect(image).toHaveAttribute("loading", "lazy");
  });
});
