import Link from "next/link";
import type { LocationConfig } from "@/lib/location-config";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionCard } from "@/components/ui/SectionCard";
import { ArrowUpRightIcon, MapPinIcon, NavigationIcon } from "@/components/ui/icons";

/** The full postal address, plus the name the building carries on Google Maps. */
export function AddressPanel({ config }: { config: LocationConfig }) {
  return (
    <SectionCard id="address" headingId="address-heading" tone="muted">
      <Container size="narrow">
        <Eyebrow>Location</Eyebrow>
        <h2 id="address-heading" className="mt-4 text-2xl font-medium leading-[1.12] sm:text-3xl md:text-4xl">
          The Address
        </h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-brand-100 bg-white p-6 md:p-7">
            <div className="flex gap-3.5">
              <MapPinIcon className="mt-0.5 size-5 shrink-0 text-brand-600" />
              <address className="text-sm not-italic leading-relaxed text-ink-2">
                <span className="block font-semibold text-ink">{config.clinicName}</span>
                {/* The clinic's own address lines already carry the floor, city and PIN. */}
                {config.addressLines.length ? (
                  config.addressLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))
                ) : (
                  <span className="block">
                    {config.cityLine}
                    {config.postalCode ? ` ${config.postalCode}` : ""}
                  </span>
                )}
                <span className="block">{config.country}</span>
              </address>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-6 rounded-2xl border border-brand-100 bg-white p-6 md:p-7">
            <div>
              <h3 className="text-base font-semibold">Getting here</h3>
              {config.buildingAka && (
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  Google Maps lists this building as <span className="font-medium text-ink-2">{config.buildingAka}</span>.
                  Both names point to the same place.
                </p>
              )}
              <p className="mt-2 text-sm leading-relaxed text-muted">{config.mapsNote}</p>
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              {config.googleMapsUrl && (
                <a
                  href={config.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-brand-700 hover:underline"
                >
                  <NavigationIcon className="size-4 shrink-0" />
                  Open in Google Maps
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              )}
              <Link
                href={config.clinicPath}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-2 hover:underline"
              >
                About this clinic
                <ArrowUpRightIcon className="size-3.5 shrink-0" />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </SectionCard>
  );
}
