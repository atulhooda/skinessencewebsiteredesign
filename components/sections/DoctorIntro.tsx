import Image from "next/image";
import type { Doctor, Image as ImageData, Stat } from "@/content/schema";
import { routes } from "@/lib/links";
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
  tone?: "white" | "muted";
};

/** "Our Story" block from the reference: photo left, statement + credentials + stats right. */
export function DoctorIntro({ id = "doctor", eyebrow, title, doctor, image, stats, tone = "muted" }: Props) {
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
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">{doctor.bio[0]}</p>
            <ul className="mt-5 flex flex-wrap gap-2" aria-label="Special interests">
              {doctor.specialInterests.map((interest) => (
                <li key={interest}>
                  <Chip tone="brand">{interest}</Chip>
                </li>
              ))}
            </ul>
            {stats && <StatsRow stats={stats} className="mt-8" />}
            <Button href={routes.doctorProfile(doctor.slug)} variant="light" icon="arrow-up-right" className="mt-8">
              Know Your Doctor
            </Button>
          </div>
        </div>
      </Container>
    </SectionCard>
  );
}
