import type { LeadSelectOption } from "@/lib/lead-shared";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionCard } from "@/components/ui/SectionCard";
import { LeadForm } from "./LeadForm";

type Props = {
  eyebrow: string;
  /** First half of the headline, rendered in ink. */
  lead: string;
  /** Second half, rendered in muted grey. */
  rest: string;
  options: LeadSelectOption[];
  locations: LeadSelectOption[];
  defaultLocation: string;
  whatsappHref: string;
};

/** Compact patient form directly under the homepage hero, headed by the two-tone statement from the reference design. Anchored at #book. */
export function IntakeSection({ eyebrow, lead, rest, options, locations, defaultLocation, whatsappHref }: Props) {
  return (
    <SectionCard id="book" headingId="book-heading" tone="white">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow className="justify-center">{eyebrow}</Eyebrow>
          <h2 id="book-heading" className="mt-6 text-3xl font-medium leading-[1.15] sm:text-4xl md:text-5xl">
            <span className="text-ink">{lead} </span>
            <span className="text-muted">{rest}</span>
          </h2>
        </div>
        <div className="mx-auto mt-10 max-w-5xl rounded-3xl border border-brand-100 bg-white p-5 shadow-soft md:p-6">
          <LeadForm layout="compact" options={options} locations={locations} defaultLocation={defaultLocation} whatsappHref={whatsappHref} />
        </div>
      </Container>
    </SectionCard>
  );
}
