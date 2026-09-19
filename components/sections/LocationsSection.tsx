import Image from "next/image";
import type { Location, Site } from "@/content/schema";
import { hasAddress } from "@/lib/format";
import { formatPhone, locationMapLink, routes, telUrl } from "@/lib/links";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionCard } from "@/components/ui/SectionCard";
import { SectionHeading } from "@/components/ui/SectionHeading";

type Props = { id?: string; eyebrow: string; title: string; locations: Location[]; site: Site; tone?: "white" | "muted" };

/** Clinic cards (NAP) linking to the location landing pages. */
export function LocationsSection({ id = "locations", eyebrow, title, locations, site, tone = "white" }: Props) {
  // Two or more clinics sit in a grid, each photo across the top of its card. These are wide
  // signage walls, so a portrait column beside the text cropped away the ends of the sign.
  const grid = locations.length > 1;
  return (
    <SectionCard id={id} headingId={`${id}-heading`} tone={tone}>
      <Container>
        <SectionHeading id={`${id}-heading`} eyebrow={eyebrow} title={title} align="left" size="md" />
        <ul className={grid ? "mt-10 grid gap-4 md:grid-cols-2" : "mt-10 grid gap-4"}>
          {locations.map((location) => {
            const phone = location.phone ?? site.phone;
            return (
              <li key={location.slug} className={`flex flex-col overflow-hidden rounded-3xl border border-line bg-white ${grid ? "" : "md:flex-row"}`}>
                <div className={grid ? "relative aspect-[2/1]" : "relative aspect-[2/1] md:aspect-auto md:w-1/2"}>
                  <Image
                    src={location.heroImage.src}
                    alt={location.heroImage.alt}
                    width={location.heroImage.width}
                    height={location.heroImage.height}
                    loading="lazy"
                    sizes="(min-width: 768px) 45vw, 100vw"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-xs text-muted">{location.isPrimary ? "Primary clinic" : "Also in"}</p>
                  <h3 className="mt-1 text-xl font-semibold">
                    {location.area}
                    {location.city !== location.area && `, ${location.city}`}
                  </h3>
                  {hasAddress(location) ? (
                    <address className="mt-3 text-sm not-italic leading-relaxed text-muted">
                      {location.addressLines.map((line) => (
                        <span key={line} className="block">
                          {line}
                        </span>
                      ))}
                    </address>
                  ) : (
                    <p className="mt-3 text-sm leading-relaxed text-muted">
                      Serving {[location.area, ...location.nearbyAreas].join(" and ")}. Address and timings confirmed when you call or book.
                    </p>
                  )}
                  <p className="mt-2 text-sm">
                    <a href={telUrl(phone)} className="font-medium text-brand-700 hover:underline">
                      {formatPhone(phone)}
                    </a>
                  </p>
                  <div className="mt-auto flex flex-wrap gap-3 pt-6">
                    <Button href={routes.location(location.slug)} variant="light" icon="arrow-up-right" size="sm">
                      Clinic Details
                    </Button>
                    {hasAddress(location) && (
                      <Button href={locationMapLink(location, site.name)} variant="light" icon="none" size="sm">
                        Directions
                      </Button>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </SectionCard>
  );
}
