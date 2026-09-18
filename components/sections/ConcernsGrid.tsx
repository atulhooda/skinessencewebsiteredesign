import Image from "next/image";
import Link from "next/link";
import type { Concern } from "@/content/schema";
import { routes } from "@/lib/links";
import { ArrowBadge } from "@/components/ui/ArrowBadge";
import { Container } from "@/components/ui/Container";
import { SectionCard } from "@/components/ui/SectionCard";
import { SectionHeading } from "@/components/ui/SectionHeading";

type Props = { id?: string; eyebrow: string; title: string; concerns: Concern[]; tone?: "white" | "muted" };

/** Image cards for patient concerns, linking to /concerns/[slug]. */
export function ConcernsGrid({ id = "concerns", eyebrow, title, concerns, tone = "white" }: Props) {
  return (
    <SectionCard id={id} headingId={`${id}-heading`} tone={tone}>
      <Container>
        <SectionHeading id={`${id}-heading`} eyebrow={eyebrow} title={title} align="left" size="md" />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {concerns.map((concern) => (
            <li key={concern.slug}>
              <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-brand-100 bg-white transition-all hover:-translate-y-0.5 hover:border-brand-400 hover:shadow-soft">
                <div className="relative aspect-[4/3] bg-surface-3">
                  <Image
                    src={concern.heroImage.src}
                    alt={concern.heroImage.alt}
                    width={concern.heroImage.width}
                    height={concern.heroImage.height}
                    loading="lazy"
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <ArrowBadge className="absolute bottom-3 right-3" />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-lg font-semibold">
                    <Link href={routes.concern(concern.slug)} className="after:absolute after:inset-0">
                      {concern.name}
                    </Link>
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">{concern.shortDesc}</p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </Container>
    </SectionCard>
  );
}
