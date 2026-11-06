import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { SiteHeader } from "@/components/layout/site-header";

afterEach(() => {
  cleanup();
});

describe("SiteHeader", () => {
  it("renders the brand and primary links", () => {
    render(<SiteHeader />);

    expect(
      screen.getByRole("link", { name: "INKORA home" }),
    ).toBeInTheDocument();

    const primaryNav = screen.getByRole("navigation", { name: "Primary" });
    expect(
      within(primaryNav).getByRole("link", { name: "Discover" }),
    ).toBeInTheDocument();
  });

  it("toggles the mobile navigation", async () => {
    const user = userEvent.setup();
    render(<SiteHeader />);

    const toggle = screen.getByTestId("mobile-menu-toggle");
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.queryByRole("navigation", { name: "Mobile" }),
    ).not.toBeInTheDocument();

    await user.click(toggle);

    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getByRole("navigation", { name: "Mobile" }),
    ).toBeInTheDocument();
  });
});
