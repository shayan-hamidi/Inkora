import Link from "next/link";

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/tattoos", label: "Tattoos" },
  { href: "/admin/taxonomies", label: "Taxonomies" },
  { href: "/admin/consultations", label: "Consultations" },
] as const;

export function AdminNav() {
  return (
    <nav aria-label="Admin" className="flex flex-wrap gap-4">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
