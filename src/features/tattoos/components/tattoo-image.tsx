import { cn } from "@/lib/utils";

type TattooImageProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  width?: number | null;
  height?: number | null;
};

export function TattooImage({
  src,
  alt,
  className,
  priority = false,
  width,
  height,
}: TattooImageProps) {
  return (
    // Demo assets are local SVG/PNG under /public — native img avoids optimizer quirks.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={width ?? 800}
      height={height ?? 1000}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className={cn("h-full w-full object-cover", className)}
    />
  );
}
