import Image from "next/image";
import type { Image as ImageData, Principle } from "@/content/schema";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionCard } from "@/components/ui/SectionCard";
import { NumberedAccordion } from "./NumberedAccordion";

type Props = { id?: string; eyebrow: string; title: string; image: ImageData; principles: Principle[]; tone?: "white" | "muted" };

/** "Why Choose Skin Essence": heading + photo on the left, numbered accordion on the right. */
export function WhyPatientsStay({ id = "why-choose", eyebrow, title, image, principles, tone = "white" }: Props) {
  return (
    <SectionCard id={id} headingId={`${id}-heading`} tone={tone}>
      <Container>
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <Eyebrow>{eyebrow}</Eyebrow>
            <h2 id={`${id}-heading`} className="mt-4 text-3xl font-medium leading-[1.1] sm:text-4xl md:text-5xl">
              {title}
            </h2>
            <p className="mt-3 text-sm text-muted">Tap any point to read more.</p>
            <div className="mt-8 aspect-[4/3] overflow-hidden rounded-3xl">
              <Image
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                loading="lazy"
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <NumberedAccordion items={principles} className="lg:pt-2" />
        </div>
      </Container>
    </SectionCard>
  );
}
