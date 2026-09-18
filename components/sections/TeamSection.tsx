import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { Doctor } from "@/content/schema";
import { doctorHref } from "@/lib/links";
import { ArrowBadge } from "@/components/ui/ArrowBadge";
import { Container } from "@/components/ui/Container";
import { SectionCard } from "@/components/ui/SectionCard";
import { SectionHeading } from "@/components/ui/SectionHeading";

type Props = { id?: string; eyebrow: string; title: string; doctors: Doctor[]; action?: ReactNode; tone?: "white" | "muted" };

/** "Meet The Dentalists" grid → doctor cards. One card today; the grid supports more. */
export function TeamSection({ id = "team", eyebrow, title, doctors, action, tone = "muted" }: Props) {
  return (
    <SectionCard id={id} headingId={`${id}-heading`} tone={tone}>
      <Container>
        <SectionHeading id={`${id}-heading`} eyebrow={eyebrow} title={title} action={action} size="lg" />
        <ul className="mt-12 grid justify-center gap-4 [grid-template-columns:repeat(auto-fit,minmax(260px,340px))]">
          {doctors.map((doctor) => (
            <li key={doctor.slug}>
              <article className="group relative flex flex-col">
                <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
                  <Image
                    src={doctor.photo.src}
                    alt={doctor.photo.alt}
                    width={doctor.photo.width}
                    height={doctor.photo.height}
                    loading="lazy"
                    sizes="(min-width: 640px) 340px, 90vw"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                  <ArrowBadge className="absolute bottom-3 right-3" />
                </div>
                <p className="mt-4 text-sm font-medium text-ink">{doctor.title}</p>
                <h3 className="mt-0.5 text-base font-semibold">
                  <Link href={doctorHref(doctor)} className="after:absolute after:inset-0">
                    {doctor.name}
                  </Link>
                </h3>
                <p className="text-xs text-muted">{doctor.qualifications.join(", ")}</p>
              </article>
            </li>
          ))}
        </ul>
      </Container>
    </SectionCard>
  );
}
