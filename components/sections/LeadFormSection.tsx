import type { Location, Site } from "@/content/schema";
import { closedDays, groupHours, hasAddress } from "@/lib/format";
import type { LeadSelectOption } from "@/lib/lead-shared";
import { formatPhone, locationMapLink, telUrl } from "@/lib/links";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { MapPinIcon } from "@/components/ui/icons";
import { SectionCard } from "@/components/ui/SectionCard";
import { LeadForm } from "./LeadForm";

type Props = {
  eyebrow: string;
  title: string;
  description?: string;
  location: Location;
  site: Site;
  options: LeadSelectOption[];
  locations: LeadSelectOption[];
  defaultOption?: string;
  whatsappHref: string;
};

const NEXT_STEPS = [
  { title: "We call you back", text: "A confirmation call or WhatsApp message during clinic hours." },
  { title: "Your slot is fixed", text: "A time that suits you, with directions to the clinic." },
  { title: "Consultation", text: "Examination, honest options and a written plan." },
];

/** "Ready To Take The First Step?" teal info card (hours, address, map) beside the lead form. Anchored at #book. */
export function LeadFormSection({ eyebrow, title, description, location, site, options, locations, defaultOption, whatsappHref }: Props) {
  const hoursRows = location.hours ? groupHours(location.hours) : [];
  const closed = location.hours ? closedDays(location.hours) : [];
  const phone = location.phone ?? site.phone;

  return (
    <SectionCard id="book" headingId="book-heading" tone="muted">
      <Container size="wide">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.9fr)] lg:items-stretch">
          <div className="flex flex-col rounded-3xl bg-brand-800 p-7 text-white md:p-9">
            <Eyebrow tone="light">{eyebrow}</Eyebrow>
            <h2 id="book-heading" className="mt-3 text-3xl font-medium leading-tight md:text-4xl">
              {title}
            </h2>
            {description && <p className="mt-4 text-sm leading-relaxed text-white/85">{description}</p>}
            <div className="mt-7 space-y-5 text-sm">
              <div>
                <p className="text-xs text-white/75">Opening Hours</p>
                {hoursRows.length ? (
                  <ul className="mt-2 divide-y divide-white/15">
                    {hoursRows.map((row) => (
                      <li key={row.days} className="py-2">
                        <span className="block text-white/90">{row.days}</span>
                        <span className="text-white">{row.time}</span>
                      </li>
                    ))}
                    {closed.length > 0 && (
                      <li className="py-2">
                        <span className="block text-white/90">{closed.join(", ")}</span>
                        <span className="text-white">Closed</span>
                      </li>
                    )}
                  </ul>
                ) : (
                  <p className="mt-2 leading-relaxed text-white/90">
                    Call{" "}
                    <a href={telUrl(phone)} className="font-medium underline underline-offset-2">
                      {formatPhone(phone)}
                    </a>{" "}
                    or WhatsApp us for current timings.
                  </p>
                )}
              </div>
              <div>
                <p className="text-xs text-white/75">Clinic Location</p>
                {hasAddress(location) ? (
                  <address className="mt-2 not-italic leading-relaxed text-white/90">
                    {location.addressLines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </address>
                ) : (
                  <p className="mt-2 leading-relaxed text-white/90">
                    {location.area}, {location.city}. Full address shared when you book.
                  </p>
                )}
              </div>
            </div>
            <div className="mt-7 flex flex-1 items-end">
              <Button href={locationMapLink(location, site.name)} variant="light" icon="none" size="sm">
                <span className="inline-flex items-center gap-1.5">
                  <MapPinIcon className="size-3.5" /> Open Google Map
                </span>
              </Button>
            </div>
          </div>

          <div className="flex flex-col rounded-3xl bg-white p-6 shadow-soft md:p-8">
            <LeadForm options={options} locations={locations} defaultOption={defaultOption} defaultLocation={location.slug} whatsappHref={whatsappHref} />
            <ol className="mt-6 grid gap-3 border-t border-brand-100 pt-6 sm:grid-cols-3" aria-label="What happens next">
              {NEXT_STEPS.map((step, index) => (
                <li key={step.title} className="flex gap-3">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-brand-50 text-xs font-semibold text-brand-800">{index + 1}</span>
                  <span>
                    <span className="block text-sm font-semibold text-ink">{step.title}</span>
                    <span className="block text-xs leading-relaxed text-muted">{step.text}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Container>
    </SectionCard>
  );
}
