import Image from "next/image";
import type { MediaAsset } from "@/types/portfolio";
import { cn } from "@/lib/utils/cn";

/** One media asset with its caption and credit. Videos get native controls and a poster frame. */
export function MediaFigure({ media, className, sizes = "(min-width: 1024px) 50vw, 100vw" }: { media: MediaAsset; className?: string; sizes?: string }) {
  return (
    <figure className={cn("min-w-0", className)}>
      <div className="border border-ink/15 bg-white">
        {media.kind === "video" ? (
          <video src={media.src} poster={media.poster} controls preload="none" className="block h-auto w-full" width={media.width} height={media.height} aria-label={media.alt} />
        ) : (
          <Image src={media.src} alt={media.alt} width={media.width} height={media.height} sizes={sizes} className="block h-auto w-full" unoptimized={media.kind === "gif"} />
        )}
      </div>
      <figcaption className="mt-2 text-sm leading-snug text-ink/80">
        {media.caption}
        {media.credit && <span className="mt-1 block text-xs text-muted">{media.credit}</span>}
      </figcaption>
    </figure>
  );
}
