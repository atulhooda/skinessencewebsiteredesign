import type { Metadata } from "next";
import { AddressPanel } from "@/components/location/AddressPanel";
import { ArrivalSteps } from "@/components/location/ArrivalSteps";
import { FindUsHero } from "@/components/location/FindUsHero";
import { FloorReminder } from "@/components/location/FloorReminder";
import { NeedHelp } from "@/components/location/NeedHelp";
import { JsonLd } from "@/components/seo/JsonLd";
import { getDoctorsForLocation, getLocation, getLocationPage, getPrimaryLocation, getSite, getTreatments } from "@/lib/content";
import { routes } from "@/lib/links";
import { getLocationConfig } from "@/lib/location-config";
import { breadcrumbJsonLd, medicalClinicJsonLd, type Crumb } from "@/lib/schema-org";
import { buildMetadata } from "@/lib/seo";

/**
 * Wayfinding page for the printed QR code.
 *
 * The QR encodes this URL, never a Google Maps link, so the floor, the arrival
 * steps and the phone numbers can change without reprinting anything. Google
 * Maps is only asked to do what it can do: reach the building.
 *
 * Everything on the page comes from content/pages/location.json plus the
 * clinic's own files, resolved in lib/location-config.ts.
 */
const crumbs: Crumb[] = [
  { name: "Home", path: routes.home },
  { name: "Find Us", path: routes.findUs },
];

export function generateMetadata(): Metadata {
  const page = getLocationPage();
  return buildMetadata({ title: page.metaTitle, description: page.metaDescription, path: routes.findUs });
}

export default function FindUsPage() {
  const config = getLocationConfig();
  const page = getLocationPage();
  const site = getSite();
  const clinic = getLocation(page.locationSlug) ?? getPrimaryLocation();

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd(crumbs),
          medicalClinicJsonLd({
            location: clinic,
            site,
            doctors: getDoctorsForLocation(clinic),
            treatments: getTreatments(),
          }),
        ]}
      />
      <FindUsHero config={config} />
      <ArrivalSteps config={config} />
      <FloorReminder config={config} />
      <AddressPanel config={config} />
      <NeedHelp config={config} />
    </>
  );
}
