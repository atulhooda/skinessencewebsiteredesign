import type { GoogleProfile, Stat, Testimonial } from "@/content/schema";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionCard } from "@/components/ui/SectionCard";
import { StatsRow } from "@/components/ui/StatCard";
import { GoogleReviews } from "./GoogleReviews";
import { TestimonialSlider } from "./TestimonialSlider";

type Props = { id?: string; eyebrow: string; title: string; testimonials: Testimonial[]; stats?: Stat[]; google?: GoogleProfile };

/** Dark teal band: centred heading, testimonial slider, Google reviews slot, optional stats cards. */
export function TestimonialBand({ id = "patient-stories", eyebrow, title, testimonials, stats, google }: Props) {
  return (
    <SectionCard id={id} headingId={`${id}-heading`} tone="brand" className="rounded-[2.5rem] md:rounded-[3rem]">
      <Container>
        <div className="text-center">
          <Eyebrow tone="light" className="justify-center">
            {eyebrow}
          </Eyebrow>
          <h2 id={`${id}-heading`} className="mx-auto mt-4 max-w-2xl text-3xl font-medium leading-[1.1] sm:text-4xl md:text-5xl">
            {title}
          </h2>
        </div>
        <TestimonialSlider items={testimonials} className="mt-12" />
        <GoogleReviews profile={google} />
        {stats && <StatsRow stats={stats} tone="dark" showIcons className="mt-14" />}
      </Container>
    </SectionCard>
  );
}
