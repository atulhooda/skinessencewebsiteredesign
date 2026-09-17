import type { Site } from "@/content/schema";
import type { LeadSelectOption } from "@/lib/lead-shared";
import { formatPhone, telUrl } from "@/lib/links";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionCard } from "@/components/ui/SectionCard";
import { LeadForm } from "./LeadForm";
import { NextSteps } from "./NextSteps";

type Props = {
  eyebrow: string;
  /** First half of the headline, rendered in ink. */
  lead: string;
  /** Second half, rendered in muted grey. */
  rest: string;
  site: Site;
  options: LeadSelectOption[];
  locations: LeadSelectOption[];
  defaultLocation: string;
  whatsappHref: string;
};

/** Patient details form directly under the homepage hero, headed by the two-tone statement from the reference design. Anchored at #book. */
export function IntakeSection({ eyebrow, lead, rest, site, options, locations, defaultLocation, whatsappHref }: Props) {
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
        <div className="mx-auto mt-10 max-w-5xl rounded-3xl border border-brand-100 bg-white p-6 shadow-soft md:p-8">
          <LeadForm layout="wide" options={options} locations={locations} defaultLocation={defaultLocation} whatsappHref={whatsappHref} />
          <NextSteps className="mt-8" />
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-xs leading-relaxed text-muted">
          Prefer to talk? Call{" "}
          <a href={telUrl(site.phone)} className="font-medium text-brand-700 underline-offset-2 hover:underline">
            {formatPhone(site.phone)}
          </a>{" "}
          or{" "}
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="font-medium text-brand-700 underline-offset-2 hover:underline">
            WhatsApp us
          </a>
          . Your details are used only to contact you about your appointment.
        </p>
      </Container>
    </SectionCard>
  );
}
