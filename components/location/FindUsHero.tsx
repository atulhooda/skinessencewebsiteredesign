import type { LocationConfig } from "@/lib/location-config";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ArrowUpRightIcon, Building2Icon, MapPinIcon, NavigationIcon } from "@/components/ui/icons";

/**
 * The first screen after a QR scan. Reading order is the same on every size:
 * clinic, building, floor, city, then the map button. On large screens the
 * floor panel moves beside the text with grid placement, so the markup order
 * (and therefore the mobile order) never changes.
 */
export function FindUsHero({ config }: { config: LocationConfig }) {
  return (
    <section
      aria-labelledby="find-us-heading"
      className="relative overflow-hidden rounded-3xl bg-brand-800 text-white md:rounded-4xl"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(110%_90%_at_80%_0%,#1d909a_0%,#106d76_45%,#08444a_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-40 [background:linear-gradient(112deg,transparent_58%,rgba(255,255,255,0.12)_58.5%,transparent_59.5%)]"
      />
      <Container size="default" className="relative px-5 pb-10 pt-24 md:px-10 md:pb-14 md:pt-32">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start lg:gap-14">
          <div className="rise-in lg:col-start-1">
            <Eyebrow tone="light">{config.eyebrow}</Eyebrow>
            <h1 id="find-us-heading" className="mt-4 text-4xl font-medium leading-[1.05] sm:text-5xl">
              {config.clinicName}
            </h1>
            <p className="mt-4 flex items-start gap-2.5 text-base leading-relaxed text-white/85 sm:text-lg">
              <Building2Icon className="mt-1 size-5 shrink-0 text-brand-200" />
              <span>
                {config.buildingName}
                {config.tower ? `, ${config.tower}` : ""}
                {config.landmark && <span className="mt-0.5 block text-sm text-white/65">{config.landmark}</span>}
              </span>
            </p>
          </div>

          {/* The single fact this page exists to deliver. */}
          <div className="rise-in rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm [animation-delay:90ms] sm:p-7 lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:min-w-[16rem]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-200">Your destination</p>
            <p className="mt-3">
              <span aria-hidden="true" className="flex items-baseline gap-2.5">
                <span className="text-7xl font-medium leading-[0.8] tabular-nums sm:text-8xl">{config.floorNumber}</span>
                <span className="text-xl font-medium uppercase tracking-[0.18em] text-white/90 sm:text-2xl">Floor</span>
              </span>
              <span className="sr-only">{config.floor}</span>
            </p>
            {config.unit && <p className="mt-5 text-sm leading-relaxed text-white/75">{config.unit}</p>}
          </div>

          <div className="rise-in [animation-delay:160ms] lg:col-start-1">
            <p className="flex items-center gap-2.5 text-sm text-white/80">
              <MapPinIcon className="size-4 shrink-0 text-brand-200" />
              <span>
                {config.cityLine}
                {config.postalCode ? ` ${config.postalCode}` : ""}
              </span>
            </p>

            {config.googleMapsUrl ? (
              <a
                href={config.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex w-full items-center justify-center gap-3 rounded-full bg-white px-6 py-4 text-base font-medium text-ink shadow-float transition-colors duration-200 hover:bg-brand-50 sm:w-fit sm:px-8"
              >
                <NavigationIcon className="size-5 shrink-0 text-brand-700" />
                <span>Open in Google Maps</span>
                <span className="sr-only">(opens in a new tab)</span>
                <ArrowUpRightIcon className="size-4 shrink-0 text-muted" />
              </a>
            ) : (
              <p className="mt-6 rounded-2xl border border-white/20 bg-white/5 px-5 py-4 text-sm leading-relaxed text-white/80">
                Search your maps app for {config.buildingName}, {config.cityLine}.
              </p>
            )}

            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70">{config.mapsNote}</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
