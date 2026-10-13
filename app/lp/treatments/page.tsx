import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LandingForm } from "@/components/lp/LandingForm";
import { TrackedLink } from "@/components/lp/TrackedLink";
import { CheckIcon, MapPinIcon, NavigationIcon, PhoneIcon, WhatsAppIcon } from "@/components/ui/icons";
import { getLandingPage, getLeadOptions, getLocations, getPrimaryLocation, getSite } from "@/lib/content";
import { formatPhone, routes, telUrl, whatsappUrl } from "@/lib/links";
import { getLocationConfig } from "@/lib/location-config";
import { buildMetadata } from "@/lib/seo";

/**
 * Google Ads landing page.
 *
 * Self-contained by design: no site nav, footer or popup (see app/lp/layout.tsx),
 * no structured data listing the full treatment catalogue, and copy that names
 * no prescription drug, injectable, peel product brand or acid. Edit the copy in
 * content/pages/lp-treatments.json and keep it that way.
 */
export function generateMetadata(): Metadata {
  const page = getLandingPage();
  return buildMetadata({ title: page.metaTitle, description: page.metaDescription, path: "/lp/treatments", noIndex: true });
}

export default function LandingTreatmentsPage() {
  const page = getLandingPage();
  const site = getSite();
  const clinic = getLocationConfig();
  const telHref = telUrl(site.phone);
  const waHref = whatsappUrl(site.whatsapp, site.whatsappPrefill);
  const phoneDisplay = formatPhone(site.phone);

  const btn = "inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full px-6 py-3 text-sm font-medium transition-colors duration-200";

  return (
    <>
      {/* Minimal top bar: brand and a call button, nothing that leads away. */}
      <header className="px-3 pt-3 md:px-5 md:pt-5">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-4 rounded-3xl bg-white px-5 py-3 md:px-8">
          <span className="flex items-center gap-3">
            <Image src={site.logo.src} alt={site.logo.alt} width={40} height={45} className="h-10 w-auto" priority />
            <span className="text-base font-semibold text-ink">{site.name}</span>
          </span>
          <TrackedLink href={telHref} event="click_call" className="hidden min-h-12 items-center justify-center gap-2.5 rounded-full bg-brand-600 px-6 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-brand-700 md:inline-flex">
            <PhoneIcon className="size-4" />
            {phoneDisplay}
          </TrackedLink>
        </div>
      </header>

      <div className="flex flex-col gap-3 px-3 py-3 md:gap-5 md:px-5 md:py-5">
        {/* Hero */}
        <section aria-labelledby="lp-heading" className="relative overflow-hidden rounded-3xl bg-brand-800 text-white md:rounded-4xl">
          <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(110%_90%_at_80%_0%,#1d909a_0%,#106d76_45%,#08444a_100%)]" />
          <div className="relative mx-auto grid max-w-[1180px] gap-10 px-5 py-10 md:px-10 md:py-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-center">
            <div>
              <p className="flex items-center gap-2 text-xs font-medium text-white/90">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-brand-300" />
                {page.eyebrow}
              </p>
              <h1 id="lp-heading" className="mt-4 text-4xl font-medium leading-[1.05] sm:text-5xl">
                {page.headline}
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 md:text-lg">{page.subheadline}</p>
              <ul className="mt-6 space-y-2.5">
                {page.trustPoints.map((point) => (
                  <li key={point} className="flex items-start gap-2.5 text-sm text-white/90">
                    <CheckIcon className="mt-0.5 size-4 shrink-0 text-brand-200" />
                    {point}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#book" className={`${btn} bg-white text-ink hover:bg-brand-50`}>
                  Book Consultation
                </a>
                <TrackedLink href={waHref} event="click_whatsapp" external className={`${btn} border border-white/40 bg-white/10 text-white hover:bg-white/20`}>
                  <WhatsAppIcon className="size-4" />
                  WhatsApp
                </TrackedLink>
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/15">
              <Image
                src={page.heroImage.src}
                alt={page.heroImage.alt}
                width={page.heroImage.width}
                height={page.heroImage.height}
                priority
                fetchPriority="high"
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* Treatments */}
        <section aria-labelledby="lp-treatments-heading" className="rounded-3xl bg-white px-5 py-12 md:rounded-4xl md:px-10 md:py-16">
          <div className="mx-auto max-w-[1180px]">
            <h2 id="lp-treatments-heading" className="text-2xl font-medium leading-[1.12] sm:text-3xl md:text-4xl">
              Treatments At Skin Essence
            </h2>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {page.treatments.map((t) => (
                <li key={t.name} className="rounded-2xl border border-brand-100 bg-surface p-5">
                  <h3 className="text-base font-semibold text-ink">{t.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{t.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Clinic */}
        <section aria-labelledby="lp-clinic-heading" className="rounded-3xl bg-surface-2 px-5 py-12 md:rounded-4xl md:px-10 md:py-16">
          <div className="mx-auto grid max-w-[1180px] gap-8 lg:grid-cols-2 lg:items-center">
            <div className="relative aspect-[3/2] overflow-hidden rounded-3xl">
              <Image
                src={page.clinicImage.src}
                alt={page.clinicImage.alt}
                width={page.clinicImage.width}
                height={page.clinicImage.height}
                loading="lazy"
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
            <div>
              <h2 id="lp-clinic-heading" className="text-2xl font-medium leading-[1.12] sm:text-3xl">
                Visit The Clinic
              </h2>
              <address className="mt-5 flex gap-3 text-sm not-italic leading-relaxed text-ink-2">
                <MapPinIcon className="mt-0.5 size-5 shrink-0 text-brand-600" />
                <span>
                  <span className="block font-semibold text-ink">{site.name}</span>
                  {clinic.addressLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </span>
              </address>
              <div className="mt-6 flex flex-wrap gap-3">
                {clinic.googleMapsUrl && (
                  <a href={clinic.googleMapsUrl} target="_blank" rel="noopener noreferrer" className={`${btn} border border-line bg-white text-ink hover:border-ink/25`}>
                    <NavigationIcon className="size-4 text-brand-700" />
                    Open in Google Maps
                  </a>
                )}
                <TrackedLink href={telHref} event="click_call" className={`${btn} bg-brand-600 text-white hover:bg-brand-700`}>
                  <PhoneIcon className="size-4" />
                  Call {phoneDisplay}
                </TrackedLink>
              </div>
            </div>
          </div>
        </section>

        {/* Booking form */}
        <section id="book" aria-labelledby="lp-book-heading" className="scroll-mt-4 rounded-3xl bg-white px-5 py-12 md:rounded-4xl md:px-10 md:py-16">
          <div className="mx-auto max-w-[860px]">
            <h2 id="lp-book-heading" className="text-2xl font-medium leading-[1.12] sm:text-3xl md:text-4xl">
              {page.formTitle}
            </h2>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-muted">{page.formDescription}</p>
            <div className="mt-8">
              <LandingForm
                options={getLeadOptions()}
                locations={getLocations().map((l) => ({ value: l.slug, label: l.city }))}
                defaultLocation={getPrimaryLocation().slug}
                whatsappHref={waHref}
              />
            </div>
          </div>
        </section>

        <footer className="px-2 pb-2 text-center text-xs text-muted">
          © {new Date().getFullYear()} {site.name}. Information on this page is general and not a substitute for a consultation.{" "}
          <Link href={routes.privacy} className="underline underline-offset-2 hover:text-ink">
            Privacy policy
          </Link>
        </footer>
      </div>

      {/* Mobile: call, WhatsApp and book always within thumb reach. */}
      <nav aria-label="Contact the clinic" className="fixed inset-x-0 bottom-0 z-30 px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] md:hidden">
        <ul className="grid grid-cols-3 gap-1 rounded-full bg-ink/95 p-1.5 text-white shadow-float backdrop-blur">
          <li>
            <TrackedLink href={telHref} event="click_call" className="flex items-center justify-center gap-2 rounded-full py-3 text-xs font-medium hover:bg-white/10">
              <PhoneIcon className="size-4" /> Call
            </TrackedLink>
          </li>
          <li>
            <TrackedLink href={waHref} event="click_whatsapp" external className="flex items-center justify-center gap-2 rounded-full py-3 text-xs font-medium hover:bg-white/10">
              <WhatsAppIcon className="size-4" /> WhatsApp
            </TrackedLink>
          </li>
          <li>
            <a href="#book" className="flex items-center justify-center gap-2 rounded-full bg-brand-600 py-3 text-xs font-medium hover:bg-brand-700">
              Book
            </a>
          </li>
        </ul>
      </nav>
    </>
  );
}
