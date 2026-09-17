import Image from "next/image";
import Link from "next/link";
import type { Machine } from "@/content/schema";
import { routes } from "@/lib/links";
import { ArrowBadge } from "@/components/ui/ArrowBadge";

const CLINIC = { pune: "Kalyani Nagar, Pune", ahmedabad: "Ahmedabad" } as const;

/** Image card linking to a machine page. */
export function MachineCard({ machine, showClinic = true }: { machine: Machine; showClinic?: boolean }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-brand-100 bg-white transition-all hover:-translate-y-0.5 hover:border-brand-400 hover:shadow-soft">
      <div className="relative aspect-[4/3] bg-surface-3">
        <Image
          src={machine.image.src}
          alt={machine.image.alt}
          width={machine.image.width}
          height={machine.image.height}
          loading="lazy"
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        {showClinic && (
          <span className="absolute left-3 top-3 rounded-full bg-brand-600 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow-pill">
            {CLINIC[machine.location]}
          </span>
        )}
        <ArrowBadge className="absolute bottom-3 right-3" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs text-brand-700">{machine.kicker}</p>
        <h3 className="mt-1 text-lg font-semibold">
          <Link href={routes.machine(machine.slug)} className="after:absolute after:inset-0">
            {machine.name}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">{machine.shortDesc}</p>
      </div>
    </article>
  );
}
