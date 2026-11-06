import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { FavoriteButton } from "@/features/favorites/components/favorite-button";

afterEach(() => {
  cleanup();
});

describe("FavoriteButton", () => {
  it("prompts unauthenticated users to sign in", () => {
    render(
      <FavoriteButton
        tattooId="55555555-5555-4555-8555-555555555504"
        initialFavorited={false}
        isAuthenticated={false}
      />,
    );

    expect(
      screen.getByRole("link", { name: /sign in to save/i }),
    ).toBeInTheDocument();
  });

  it("renders a toggle for authenticated users", () => {
    render(
      <FavoriteButton
        tattooId="55555555-5555-4555-8555-555555555504"
        initialFavorited={true}
        isAuthenticated={true}
      />,
    );

    expect(screen.getByRole("button", { name: /saved/i })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
});
