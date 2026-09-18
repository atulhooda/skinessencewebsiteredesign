import type { Location, Site } from "@/content/schema";
import { closedDays, groupHours, hasAddress } from "@/lib/format";
import { formatPhone, locationMapEmbed, locationMapLink, mailtoUrl, telUrl, whatsappUrl } from "@/lib/links";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Container } from "@/components/ui/Container";
import { ClockIcon, MailIcon, MapPinIcon, PhoneIcon, WhatsAppIcon } from "@/components/ui/icons";
import { SectionCard } from "@/components/ui/SectionCard";
import { SectionHeading } from "@/components/ui/SectionHeading";

type Props = { id?: string; eyebrow: string; title: string; location: Location; site: Site; tone?: "white" | "muted" };

/** NAP, hours, areas served and a map for one clinic. */
export function LocationDetails({ id = "visit", eyebrow, title, location, site, tone = "white" }: Props) {
  const phone = location.phone ?? site.phone;
  const email = location.email ?? site.email;
  const whatsapp = location.whatsapp ?? site.whatsapp;
  const hoursRows = location.hours ? groupHours(location.hours) : [];
  const closed = location.hours ? closedDays(location.hours) : [];
  const embed = locationMapEmbed(location, site.name);
  const term = "flex items-center gap-3 text-xs text-muted";
  const icon = "size-4 shrink-0 text-brand-600";

  return (
    <SectionCard id={id} headingId={`${id}-heading`} tone={tone}>
      <Container>
        <SectionHeading id={`${id}-heading`} eyebrow={eyebrow} title={title} align="left" size="md" />
        <div className="mt-10 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
          <div className="rounded-3xl border border-brand-100 bg-white p-6 md:p-8">
            <dl className="space-y-5 text-sm">
              <div>
                <dt className={term}>
                  <MapPinIcon className={icon} />
                  Address
                </dt>
                <dd className="mt-1 pl-7">
                  {hasAddress(location) ? (
                    <address className="not-italic leading-relaxed">
                      {location.addressLines.map((line) => (
                        <span key={line} className="block">
                          {line}
                        </span>
                      ))}
                    </address>
                  ) : (
                    <span className="leading-relaxed text-ink-2">
                      {location.area}, {location.region}. The full address is shared when you call or book.
                    </span>
                  )}
                </dd>
              </div>
              <div>
                <dt className={term}>
                  <PhoneIcon className={icon} />
                  Phone
                </dt>
                <dd className="mt-1 pl-7">
                  <a href={telUrl(phone)} className="font-medium text-brand-700 hover:underline">
                    {formatPhone(phone)}
                  </a>
                </dd>
              </div>
              <div>
                <dt className={term}>
                  <WhatsAppIcon className={icon} />
                  WhatsApp
                </dt>
                <dd className="mt-1 pl-7">
                  <a href={whatsappUrl(whatsapp, site.whatsappPrefill)} target="_blank" rel="noopener noreferrer" className="font-medium text-brand-700 hover:underline">
                    Message the clinic
                  </a>
                </dd>
              </div>
              <div>
                <dt className={term}>
                  <MailIcon className={icon} />
                  Email
                </dt>
                <dd className="mt-1 pl-7">
                  <a href={mailtoUrl(email)} className="font-medium text-brand-700 hover:underline">
                    {email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className={term}>
                  <ClockIcon className={icon} />
                  Opening hours
                </dt>
                <dd className="mt-1 pl-7 leading-relaxed">
                  {hoursRows.length ? (
                    <ul>
                      {hoursRows.map((r) => (
                        <li key={r.days}>
                          {r.days}: {r.time}
                        </li>
                      ))}
                      {closed.length > 0 && <li>{closed.join(", ")}: Closed</li>}
                    </ul>
                  ) : (
                    <span className="text-ink-2">Please call or WhatsApp for current timings.</span>
                  )}
                </dd>
              </div>
            </dl>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href={telUrl(phone)} variant="primary" icon="none" size="sm">
                Call The Clinic
              </Button>
              {hasAddress(location) && (
                <Button href={locationMapLink(location, site.name)} variant="light" icon="arrow-up-right" size="sm">
                  Directions
                </Button>
              )}
            </div>
          </div>
          {embed ? (
            <div className="min-h-[320px] overflow-hidden rounded-3xl border border-brand-100 bg-surface-3">
              <iframe
                src={embed}
                title={`Map showing ${location.name}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full min-h-[320px] w-full border-0"
              />
            </div>
          ) : (
            <div className="flex min-h-[240px] flex-col justify-center rounded-3xl border border-brand-100 bg-white p-6 md:p-8">
              <p className="text-lg font-semibold">Visiting our {location.city} clinic</p>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-2">
                Call or WhatsApp {formatPhone(phone)} and the team will share the clinic address, directions and the next available consultation days.
              </p>
            </div>
          )}
        </div>
        {location.nearbyAreas.length > 0 && (
          <div className="mt-8">
            <h3 className="text-sm font-semibold">Areas we serve from this clinic</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {[location.area, ...location.nearbyAreas].filter((a, i, all) => all.indexOf(a) === i).map((area) => (
                <li key={area}>
                  <Chip tone="brand">{area}</Chip>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Container>
    </SectionCard>
  );
}
