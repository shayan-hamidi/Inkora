import { TattooCard } from "@/features/tattoos/components/tattoo-card";
import type { TattooCard as TattooCardData } from "@/features/tattoos/types";

type TattooGridProps = {
  tattoos: TattooCardData[];
};

export function TattooGrid({ tattoos }: TattooGridProps) {
  if (tattoos.length === 0) {
    return (
      <div className="border-border/70 rounded-sm border border-dashed px-6 py-16 text-center">
        <p className="font-heading text-2xl text-ink">No tattoos matched.</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Try clearing filters or searching a broader term.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {tattoos.map((tattoo, index) => (
        <TattooCard key={tattoo.id} tattoo={tattoo} priority={index < 3} />
      ))}
    </div>
  );
}
