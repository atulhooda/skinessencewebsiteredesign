import type { ArrivalStep, Image } from "@/content/schema";
import { getLocation, getLocationPage, getPrimaryLocation, getSite } from "@/lib/content";
import { hasAddress } from "@/lib/format";
import { formatPhone, locationMapLink, routes, telUrl, whatsappUrl } from "@/lib/links";

/**
 * Everything the QR wayfinding page renders, resolved once.
 *
 * Edit content/pages/location.json to change the floor, building, arrival
 * steps or copy. Name, address, phone, WhatsApp number and the map link come
 * from the clinic's own files (content/locations, content/site.json) so they
 * cannot drift from the rest of the site; content/pages/location.json can
 * override the last three when this page needs its own.
 *
 * Optional fields are genuinely optional: the page hides the matching action
 * rather than rendering a link that goes nowhere.
 */
export type LocationConfig = {
  clinicName: string;
  tagline: string;
  logo: Image;
  buildingName: string;
  /** The same building under the name Google Maps shows, when they differ. */
  buildingAka?: string;
  tower?: string;
  unit?: string;
  landmark?: string;
  /** "21st Floor" */
  floor: string;
  /** "21" */
  floorNumber: string;
  addressLines: string[];
  /** "Pune, Maharashtra" */
  cityLine: string;
  country: string;
  postalCode?: string;
  googleMapsUrl?: string;
  phoneDisplay?: string;
  telHref?: string;
  whatsappHref?: string;
  mapsNote: string;
  steps: ArrivalStep[];
  help: { title: string; description: string };
  eyebrow: string;
  metaTitle: string;
  metaDescription: string;
  /** This page. */
  path: string;
  /** The clinic's full landing page, for anyone who wants more than directions. */
  clinicPath: string;
};

const COUNTRY_NAMES: Record<string, string> = { IN: "India" };

export function getLocationConfig(): LocationConfig {
  const site = getSite();
  const page = getLocationPage();
  const clinic = getLocation(page.locationSlug) ?? getPrimaryLocation();

  const phone = page.phone ?? clinic.phone ?? site.phone;
  const whatsapp = page.whatsapp ?? clinic.whatsapp ?? site.whatsapp;
  // Only offer Maps when there is something for it to resolve; never a dead button.
  const mappable = hasAddress(clinic) || Boolean(clinic.mapQuery) || Boolean(clinic.mapLink);
  const googleMapsUrl = page.googleMapsUrl ?? (mappable ? locationMapLink(clinic, site.name) : undefined);

  return {
    clinicName: site.name,
    tagline: site.tagline,
    logo: site.logoMono ?? site.logo,
    buildingName: page.buildingName,
    buildingAka: page.buildingAka,
    tower: page.tower,
    unit: page.unit,
    landmark: page.landmark,
    floor: page.floor,
    floorNumber: page.floorNumber,
    addressLines: clinic.addressLines,
    cityLine: [clinic.city, clinic.region].filter(Boolean).join(", "),
    country: COUNTRY_NAMES[clinic.country] ?? clinic.country,
    postalCode: clinic.postalCode,
    googleMapsUrl,
    phoneDisplay: phone ? formatPhone(phone) : undefined,
    telHref: phone ? telUrl(phone) : undefined,
    whatsappHref: whatsapp ? whatsappUrl(whatsapp, page.whatsappMessage) : undefined,
    mapsNote: page.mapsNote,
    steps: page.steps,
    help: page.help,
    eyebrow: page.eyebrow,
    metaTitle: page.metaTitle,
    metaDescription: page.metaDescription,
    path: routes.findUs,
    clinicPath: routes.location(clinic.slug),
  };
}
