"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/tattoos", label: "Discover" },
  { href: "/studio", label: "Studio" },
  { href: "/artists", label: "Artists" },
] as const;

type SiteHeaderProps = {
  isAuthenticated?: boolean;
};

export function SiteHeader({ isAuthenticated = false }: SiteHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  return (
    <header className="border-border/60 bg-background/90 sticky top-0 z-50 border-b backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="font-heading text-2xl tracking-tight text-ink"
          aria-label="INKORA home"
        >
          INKORA
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <Button asChild>
              <Link href="/account">Account</Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Sign in</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Join</Link>
              </Button>
            </>
          )}
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="md:hidden"
          data-testid="mobile-menu-toggle"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {mobileOpen ? (
        <motion.div
          id="mobile-nav"
          initial={prefersReducedMotion ? false : { height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { duration: 0.2, ease: "easeOut" }
          }
          className={cn("overflow-hidden border-t border-border/60 md:hidden")}
        >
          <nav
            className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6"
            aria-label="Mobile"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-base text-foreground"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex gap-3 pt-2">
              {isAuthenticated ? (
                <Button asChild className="flex-1">
                  <Link href="/account" onClick={() => setMobileOpen(false)}>
                    Account
                  </Link>
                </Button>
              ) : (
                <>
                  <Button variant="outline" asChild className="flex-1">
                    <Link href="/login" onClick={() => setMobileOpen(false)}>
                      Sign in
                    </Link>
                  </Button>
                  <Button asChild className="flex-1">
                    <Link href="/register" onClick={() => setMobileOpen(false)}>
                      Join
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        </motion.div>
      ) : null}
    </header>
  );
}
