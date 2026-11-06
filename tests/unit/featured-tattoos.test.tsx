import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { FeaturedTattoos } from "@/features/discovery/components/featured-tattoos";

afterEach(() => {
  cleanup();
});

describe("FeaturedTattoos", () => {
  it("shows empty state copy when there are no featured tattoos", () => {
    render(<FeaturedTattoos tattoos={[]} />);
    expect(screen.getByText(/No featured designs yet/i)).toBeInTheDocument();
  });
});
