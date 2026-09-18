/**
 * JSON-LD builders. Each returns a plain object for <JsonLd data={…} />.
 * Types follow schema.org: MedicalClinic, Physician, MedicalProcedure,
 * MedicalCondition, FAQPage, BreadcrumbList, WebSite.
 *
 * Optional client data (hours, geo, address) is omitted when absent rather
 * than filled with guesses.
 */
import type { BlogPost, Concern, Doctor, Faq, Location, Machine, Site, Treatment } from "@/content/schema";
import { absoluteUrl, SITE_URL } from "./seo";
import { doctorPagePath, locationMapLink, routes } from "./links";

export type JsonLdObject = Record<string, unknown>;

const CONTEXT = "https://schema.org";

function postalAddress(location: Location): JsonLdObject | undefined {
  if (!location.addressLines.length) return undefined;
  return {
    "@type": "PostalAddress",
    streetAddress: location.addressLines.slice(0, -1).join(", ") || location.addressLines[0],
    addressLocality: `${location.area}, ${location.city}`,
    ...(location.region ? { addressRegion: location.region } : {}),
    ...(location.postalCode ? { postalCode: location.postalCode } : {}),
    addressCountry: location.country,
  };
}

function physicianSummary(doctor: Doctor): JsonLdObject {
  return {
    "@type": "Physician",
    "@id": `${absoluteUrl(doctorPagePath(doctor))}#physician`,
    name: doctor.name,
    url: absoluteUrl(doctorPagePath(doctor)),
    medicalSpecialty: "Dermatology",
  };
}

const compact = (obj: JsonLdObject): JsonLdObject =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined && v !== null));

export function websiteJsonLd(site: Site): JsonLdObject {
  return {
    "@context": CONTEXT,
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: site.name,
    alternateName: site.tagline,
    url: `${SITE_URL}/`,
    inLanguage: "en-IN",
  };
}

type ClinicInput = {
  location: Location;
  site: Site;
  /** Doctors confirmed at this location. */
  doctors: Doctor[];
  /** Published treatments, listed as availableService. */
  treatments: Treatment[];
  pageUrl?: string;
};

export function medicalClinicJsonLd({ location, site, doctors, treatments, pageUrl }: ClinicInput): JsonLdObject {
  const clinicUrl = absoluteUrl(routes.location(location.slug));
  return compact({
    "@context": CONTEXT,
    "@type": "MedicalClinic",
    "@id": `${clinicUrl}#clinic`,
    name: location.name,
    alternateName: site.name,
    description: site.description,
    url: pageUrl ?? clinicUrl,
    image: absoluteUrl(location.heroImage.src),
    logo: absoluteUrl(site.logo.src),
    telephone: location.phone ?? site.phone,
    email: location.email ?? site.email,
    currenciesAccepted: "INR",
    medicalSpecialty: "Dermatology",
    address: postalAddress(location),
    geo: location.geo
      ? { "@type": "GeoCoordinates", latitude: location.geo.lat, longitude: location.geo.lng }
      : undefined,
    hasMap: location.addressLines.length ? locationMapLink(location, site.name) : undefined,
    openingHoursSpecification: location.hours?.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: `${CONTEXT}/${h.day}`,
      opens: h.open,
      closes: h.close,
    })),
    areaServed: [location.area, ...location.nearbyAreas].map((name) => ({ "@type": "Place", name })),
    availableService: treatments.map((t) => ({
      "@type": "MedicalProcedure",
      name: t.name,
      url: absoluteUrl(routes.treatment(t.slug)),
    })),
    physician: doctors.length ? doctors.map(physicianSummary) : undefined,
    sameAs: site.social.length ? site.social.map((s) => s.url) : undefined,
  });
}

export function physicianJsonLd(doctor: Doctor, site: Site, location: Location): JsonLdObject {
  return compact({
    "@context": CONTEXT,
    "@type": "Physician",
    "@id": `${absoluteUrl(doctorPagePath(doctor))}#physician`,
    name: doctor.name,
    honorificPrefix: "Dr.",
    honorificSuffix: doctor.qualifications.join(", "),
    jobTitle: doctor.title,
    description: doctor.shortBio,
    image: absoluteUrl(doctor.photo.src),
    url: absoluteUrl(doctorPagePath(doctor)),
    telephone: location.phone ?? site.phone,
    email: location.email ?? site.email,
    medicalSpecialty: "Dermatology",
    knowsAbout: doctor.specialInterests,
    address: postalAddress(location),
    hospitalAffiliation: {
      "@type": "MedicalClinic",
      "@id": `${absoluteUrl(routes.location(location.slug))}#clinic`,
      name: location.name,
    },
    sameAs: doctor.sameAs.length ? doctor.sameAs : undefined,
  });
}

export function medicalProcedureJsonLd(treatment: Treatment, site: Site, location: Location, doctor?: Doctor): JsonLdObject {
  const url = absoluteUrl(routes.treatment(treatment.slug));
  return compact({
    "@context": CONTEXT,
    "@type": "MedicalProcedure",
    "@id": `${url}#procedure`,
    name: treatment.name,
    alternateName: treatment.heroTitle,
    description: treatment.metaDescription,
    url,
    image: absoluteUrl(treatment.heroImage.src),
    inLanguage: "en-IN",
    relevantSpecialty: "Dermatology",
    howPerformed: treatment.howItWorks.map((s) => `${s.title}: ${s.description}`).join(" "),
    followup: treatment.aftercare.length ? treatment.aftercare.join(" ") : undefined,
    preparation: treatment.whoIsItFor.join(" "),
    provider: compact({
      "@type": "MedicalClinic",
      "@id": `${absoluteUrl(routes.location(location.slug))}#clinic`,
      name: location.name,
      address: postalAddress(location),
      telephone: location.phone ?? site.phone,
    }),
    performer: doctor ? physicianSummary(doctor) : undefined,
  });
}

export function machineJsonLd(machine: Machine, treatments: Treatment[], location: Location): JsonLdObject {
  const url = absoluteUrl(routes.machine(machine.slug));
  return compact({
    "@context": CONTEXT,
    "@type": "MedicalDevice",
    "@id": `${url}#device`,
    name: machine.name,
    alternateName: machine.shortName,
    description: machine.metaDescription,
    url,
    image: absoluteUrl(machine.image.src),
    manufacturer: { "@type": "Organization", name: machine.manufacturer },
    relevantSpecialty: "Dermatology",
    isRelatedTo: treatments.length
      ? treatments.map((t) => ({ "@type": "MedicalProcedure", name: t.name, url: absoluteUrl(routes.treatment(t.slug)) }))
      : undefined,
    subjectOf: {
      "@type": "MedicalClinic",
      "@id": `${absoluteUrl(routes.location(location.slug))}#clinic`,
      name: location.name,
    },
  });
}

export function medicalConditionJsonLd(concern: Concern, treatments: Treatment[]): JsonLdObject {
  const url = absoluteUrl(routes.concern(concern.slug));
  return {
    "@context": CONTEXT,
    "@type": "MedicalCondition",
    "@id": `${url}#condition`,
    name: concern.name,
    description: concern.metaDescription,
    url,
    possibleTreatment: treatments.map((t) => ({
      "@type": "MedicalProcedure",
      name: t.name,
      url: absoluteUrl(routes.treatment(t.slug)),
    })),
  };
}

export function blogPostingJsonLd(post: BlogPost, site: Site, doctor: Doctor): JsonLdObject {
  const url = absoluteUrl(routes.blogPost(post.slug));
  return {
    "@context": CONTEXT,
    "@type": "BlogPosting",
    "@id": `${url}#post`,
    headline: post.title,
    description: post.metaDescription,
    url,
    mainEntityOfPage: url,
    image: absoluteUrl(post.heroImage.src),
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: "en-IN",
    author: /^Dr\.?\s/.test(post.author)
      ? { "@type": "Person", name: post.author, url: absoluteUrl(doctorPagePath(doctor)) }
      : { "@type": "Organization", name: post.author, url: absoluteUrl(routes.about) },
    publisher: { "@type": "Organization", name: site.name, logo: { "@type": "ImageObject", url: absoluteUrl(site.logo.src) } },
  };
}

export function faqPageJsonLd(faqs: Faq[]): JsonLdObject {
  return {
    "@context": CONTEXT,
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export type Crumb = { name: string; path: string };

export function breadcrumbJsonLd(items: Crumb[]): JsonLdObject {
  return {
    "@context": CONTEXT,
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
