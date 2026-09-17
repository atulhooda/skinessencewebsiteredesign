import Image from "next/image";
import Link from "next/link";
import type { Image as ImageData, Treatment } from "@/content/schema";
import { cn } from "@/lib/cn";
import { routes } from "@/lib/links";
import { ArrowBadge } from "@/components/ui/ArrowBadge";

type Props = {
  treatment: Treatment;
  /** Display name override (defaults to the treatment name). */
  name?: string;
  /** Link override (defaults to the treatment page). */
  href?: string;
  /** Image override for the header (defaults to the treatment's heroImage). */
  image?: ImageData;
  /** Small category label above the name. */
  label?: string;
  /** Show a short image header (the treatment's heroImage) above the name. */
  withImage?: boolean;
  className?: string;
};

/** A rectangle that names one treatment and links to its page, optionally with a small image header. */
export function TreatmentTile({ treatment, name, href, image, label, withImage = false, className }: Props) {
  const img = image ?? treatment.heroImage;
  return (
    <Link
      href={href ?? routes.treatment(treatment.slug)}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-2xl border border-brand-100 bg-white transition-all hover:-translate-y-0.5 hover:border-brand-600 hover:bg-brand-600 hover:text-white hover:shadow-pill",
        className,
      )}
    >
      {withImage && (
        <span className="relative block aspect-[2/1] overflow-hidden bg-surface-2">
          <Image
            src={img.src}
            alt={img.alt}
            width={img.width}
            height={img.height}
            loading="lazy"
            sizes="(min-width: 1024px) 22vw, (min-width: 640px) 50vw, 100vw"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </span>
      )}
      <span className="flex flex-1 items-center justify-between gap-2 px-3 py-3 sm:gap-3 sm:px-4 sm:py-4 md:px-5">
        <span className="min-w-0">
          {label && label !== (name ?? treatment.name) && <span className="block text-xs text-brand-700 transition-colors group-hover:text-white/80">{label}</span>}
          <span className="mt-0.5 block text-sm font-semibold leading-snug text-ink transition-colors group-hover:text-white sm:text-base">{name ?? treatment.name}</span>
        </span>
        <ArrowBadge tone="brand" className="hidden shrink-0 sm:grid" />
      </span>
    </Link>
  );
}
