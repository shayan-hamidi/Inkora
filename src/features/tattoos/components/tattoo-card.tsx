import Link from "next/link";
import { TattooImage } from "@/features/tattoos/components/tattoo-image";
import type { TattooCard as TattooCardData } from "@/features/tattoos/types";

type TattooCardProps = {
  tattoo: TattooCardData;
  priority?: boolean;
};

export function TattooCard({ tattoo, priority = false }: TattooCardProps) {
  return (
    <article className="group">
      <Link href={`/tattoos/${tattoo.slug}`} className="block space-y-3">
        <div className="bg-paper aspect-[4/5] overflow-hidden">
          <TattooImage
            src={tattoo.imagePath}
            alt={tattoo.imageAlt ?? tattoo.title}
            priority={priority}
            width={tattoo.imageWidth}
            height={tattoo.imageHeight}
            className="transition-transform duration-500 motion-safe:group-hover:scale-[1.02]"
          />
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-heading text-xl text-ink">{tattoo.title}</h3>
            {tattoo.isDemo ? <span className="text-meta">Demo</span> : null}
          </div>
          <p className="text-sm text-muted-foreground">
            {tattoo.styles.map((style) => style.name).join(" · ") ||
              tattoo.category?.name ||
              "Inspiration"}
          </p>
        </div>
      </Link>
    </article>
  );
}
