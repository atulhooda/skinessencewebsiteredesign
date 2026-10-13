import type { Metadata } from "next";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { getSite } from "@/lib/content";
import { formatPhone, routes, telUrl } from "@/lib/links";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: true },
};

/**
 * Root 404, deliberately self-contained.
 *
 * Next serialises the root not-found tree into the payload of EVERY page,
 * including the ad landing pages under /lp. If this rendered the site header
 * or footer, their full treatment catalogue — with names Google Ads restricts
 * in India — would ride along inside every landing page. So: brand, message
 * and a few safe links, nothing else.
 */
export default function NotFound() {
  const site = getSite();
  return (
    <main id="main" className="flex min-h-screen items-center justify-center px-5 py-16">
      <div className="w-full max-w-xl rounded-4xl bg-white p-8 text-center shadow-soft md:p-12">
        <Image src={site.logo.src} alt={site.logo.alt} width={56} height={63} className="mx-auto h-14 w-auto" />
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">404</p>
        <h1 className="mt-3 text-3xl font-medium leading-[1.1] sm:text-4xl">We Couldn&apos;t Find That Page</h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-muted">
          The link may be out of date. Head back to the home page, browse our treatments, or call the clinic and we will point you in the
          right direction.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href={routes.home} variant="primary" icon="arrow-right">
            Back To Home
          </Button>
          <Button href={routes.treatments} variant="light" icon="arrow-up-right">
            Browse Treatments
          </Button>
        </div>
        <p className="mt-6 text-sm text-muted">
          Or call{" "}
          <a href={telUrl(site.phone)} className="font-medium text-brand-700 underline underline-offset-2">
            {formatPhone(site.phone)}
          </a>
        </p>
      </div>
    </main>
  );
}
