import Link from "next/link";

const footerLinks = [
  { href: "/tattoos", label: "Discover" },
  { href: "/studio", label: "AI Studio" },
  { href: "/artists", label: "Artists" },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-border/60 mt-auto border-t bg-paper">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-sm space-y-3">
          <p className="font-heading text-3xl text-ink">INKORA</p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Discover your next tattoo. Give your ideas meaning.
          </p>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap gap-6">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="border-border/60 border-t">
        <div className="text-meta mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <span>Portfolio build in progress</span>
          <span>Phases 0–18</span>
        </div>
      </div>
    </footer>
  );
}
