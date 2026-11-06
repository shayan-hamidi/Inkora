import { cn } from "@/lib/utils";

type TattooImageProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
};

export function TattooImage({
  src,
  alt,
  className,
  priority = false,
}: TattooImageProps) {
  return (
    // Demo assets are SVG placeholders in /public; keep native img for correct SVG sizing.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className={cn("h-full w-full object-cover", className)}
    />
  );
}
