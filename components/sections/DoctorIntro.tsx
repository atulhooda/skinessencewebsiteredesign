import Image from "next/image";
import type { ReactNode } from "react";
import type { Doctor, Image as ImageData, Stat } from "@/content/schema";
import { doctorHref } from "@/lib/links";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionCard } from "@/components/ui/SectionCard";
import { StatsRow } from "@/components/ui/StatCard";

type Props = {
  id?: string;
  eyebrow: string;
  title: string;
  doctor: Doctor;
  image: ImageData;
  /** Stat cards (17+ Years, 3,00,000+, 10,000+). Omit for the compact variant. */
  stats?: Stat[];
  /** Show every bio paragraph instead of the first one (the About page, where this block is the full profile). */
  fullBio?: boolean;
  /** Replaces the default "Know Your Doctor" link, e.g. booking buttons on the About page itself. */
  action?: ReactNode;
  tone?: "white" | "muted";
};

/** "Our Story" block from the reference: photo left, statement + credentials + stats right. */
export function DoctorIntro({ id = "doctor", eyebrow, title, doctor, image, stats, fullBio = false, action, tone = "muted" }: Props) {
  return (
    <SectionCard id={id} headingId={`${id}-heading`} tone={tone}>
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.4fr)] lg:items-center lg:gap-16">
          <div className="relative aspect-[4/5] max-w-md overflow-hidden rounded-3xl">
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              loading="lazy"
              sizes="(min-width: 1024px) 36vw, 90vw"
              className="h-full w-full object-cover"
            />
            <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white/90 px-4 py-3 shadow-soft backdrop-blur">
              <p className="text-sm font-semibold text-ink">{doctor.name}</p>
              <p className="text-xs text-muted">
                {doctor.qualifications.join(", ")} · {doctor.title}
              </p>
            </div>
          </div>
          <div>
            <Eyebrow>{eyebrow}</Eyebrow>
            <h2 id={`${id}-heading`} className="mt-4 text-2xl font-medium leading-[1.15] sm:text-3xl md:text-4xl">
              {title}
            </h2>
            <div className="mt-5 max-w-2xl space-y-4 text-base leading-relaxed text-muted">
              {(fullBio ? doctor.bio : doctor.bio.slice(0, 1)).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <ul className="mt-5 flex flex-wrap gap-2" aria-label="Special interests">
              {doctor.specialInterests.map((interest) => (
                <li key={interest}>
                  <Chip tone="brand">{interest}</Chip>
                </li>
              ))}
            </ul>
            {stats && <StatsRow stats={stats} className="mt-8" />}
            {action ?? (
              <Button href={doctorHref(doctor)} variant="light" icon="arrow-up-right" className="mt-8">
                Know Your Doctor
              </Button>
            )}
          </div>
        </div>
      </Container>
    </SectionCard>
  );
}
