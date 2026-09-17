import Image from "next/image";
import Link from "next/link";
import type { Treatment } from "@/content/schema";
import { routes } from "@/lib/links";
import { ArrowBadge } from "@/components/ui/ArrowBadge";

/** Image card with the arrow badge, used in related-treatment grids. */
export function TreatmentCard({ treatment, categoryName }: { treatment: Treatment; categoryName?: string }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl border border-line bg-white transition-shadow hover:shadow-soft">
      <div className="relative aspect-[4/3]">
        <Image
          src={treatment.heroImage.src}
          alt={treatment.heroImage.alt}
          width={treatment.heroImage.width}
          height={treatment.heroImage.height}
          loading="lazy"
          sizes="(min-width: 768px) 30vw, 100vw"
          className="h-full w-full object-cover"
        />
        <ArrowBadge className="absolute bottom-3 right-3" />
      </div>
      <div className="p-5">
        {categoryName && <p className="text-xs text-muted">{categoryName}</p>}
        <h3 className="mt-1 text-lg font-semibold">
          <Link href={routes.treatment(treatment.slug)} className="after:absolute after:inset-0">
            {treatment.name}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">{treatment.shortDesc}</p>
      </div>
    </article>
  );
}
