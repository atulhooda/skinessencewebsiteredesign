import Image from "next/image";
import type { ReactNode } from "react";
import type { Doctor, Image as ImageData } from "@/content/schema";
import { doctorHref } from "@/lib/links";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionCard } from "@/components/ui/SectionCard";

type Props = {
  id?: string;
  eyebrow: string;
  title: string;
  doctor: Doctor;
  /**
   * The doctor's photo. Pass it only on her profile (/about): under the NMC advertising
   * guidelines the photo is a directory entry, not promotional material, so every other
   * placement renders this block as text.
   */
  image?: ImageData;
  /** Show every bio paragraph and the years of experience (the profile on /about). */
  fullBio?: boolean;
  /** Replaces the default "Know Your Doctor" link, e.g. contact buttons on the About page itself. */
  action?: ReactNode;
  tone?: "white" | "muted";
};

/** Doctor block: name, qualifications and registration, bio, special interests; photo only on the profile. */
export function DoctorIntro({ id = "doctor", eyebrow, title, doctor, image, fullBio = false, action, tone = "muted" }: Props) {
  const credentials = (
    <>
      <p className="text-sm font-semibold text-ink">{doctor.name}</p>
      <p className="text-xs text-muted">
        {doctor.qualifications.join(", ")} · {doctor.title}
      </p>
      {doctor.registration && <p className="mt-0.5 text-xs text-muted">{doctor.registration}</p>}
    </>
  );

  return (
    <SectionCard id={id} headingId={`${id}-heading`} tone={tone}>
      <Container>
        <div className={image ? "grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.4fr)] lg:items-center lg:gap-16" : "max-w-3xl"}>
          {image && (
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
              <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white/90 px-4 py-3 shadow-soft backdrop-blur">{credentials}</div>
            </div>
          )}
          <div>
            <Eyebrow>{eyebrow}</Eyebrow>
            <h2 id={`${id}-heading`} className="mt-4 text-2xl font-medium leading-[1.15] sm:text-3xl md:text-4xl">
              {title}
            </h2>
            {!image && <div className="mt-5 rounded-2xl border border-line bg-white px-4 py-3">{credentials}</div>}
            <div className="mt-5 max-w-2xl space-y-4 text-base leading-relaxed text-muted">
              {(fullBio ? doctor.bio : doctor.bio.slice(0, 1)).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {fullBio && <p>Experience: {doctor.yearsExperience}+ years in dermatology and cosmetology.</p>}
            </div>
            <ul className="mt-5 flex flex-wrap gap-2" aria-label="Special interests">
              {doctor.specialInterests.map((interest) => (
                <li key={interest}>
                  <Chip tone="brand">{interest}</Chip>
                </li>
              ))}
            </ul>
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
