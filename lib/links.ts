import type { Doctor, Location } from "@/content/schema";

/** Route builders and contact links. Keep every internal href here so a URL change is one edit. */
export const routes = {
  home: "/",
  treatments: "/treatments",
  treatment: (slug: string) => `/treatments/${slug}`,
  category: (slug: string) => `/treatments#${slug}`,
  concerns: "/concerns",
  concern: (slug: string) => `/concerns/${slug}`,
  technology: "/technology",
  machine: (slug: string) => `/technology/${slug}`,
  location: (slug: string) => `/${slug}`,
  about: "/about",
  /** Dr. Patel's profile is the #doctor section of the About page (the two pages were merged). */
  aboutDoctor: "/about#doctor",
  /** Standalone profile page; only for doctors without `profileOnAbout`. Link with doctorHref() instead. */
  doctorProfile: (slug: string) => `/${slug}`,
  contact: "/contact",
  blog: "/blog",
  blogPost: (slug: string) => `/blog/${slug}`,
  privacy: "/privacy-policy",
  terms: "/terms",
  /** In-page anchor of the lead form. Every page template renders it. */
  book: "#book",
} as const;

type DoctorRef = Pick<Doctor, "slug" | "profileOnAbout">;

/** Link to a doctor's profile: the About page section, or their own page. */
export function doctorHref(doctor: DoctorRef): string {
  return doctor.profileOnAbout ? routes.aboutDoctor : routes.doctorProfile(doctor.slug);
}

/** The page a doctor's profile lives on, without the hash (canonical, JSON-LD, sitemap). */
export function doctorPagePath(doctor: DoctorRef): string {
  return doctor.profileOnAbout ? routes.about : routes.doctorProfile(doctor.slug);
}

export function telUrl(phone: string): string {
  return `tel:${phone.replace(/\s+/g, "")}`;
}

export function whatsappUrl(number: string, text?: string): string {
  const base = `https://wa.me/${number.replace(/\D/g, "")}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

/**
 * "Hi, I want to book a consultation at Skin Essence Kalyani Nagar." + topic →
 * "Hi, I want to book a consultation at Skin Essence Kalyani Nagar for Acne Treatment."
 */
export function whatsappMessage(prefill: string, topic?: string): string {
  if (!topic) return prefill;
  return `${prefill.replace(/[.\s]+$/, "")} for ${topic}.`;
}

export function mailtoUrl(email: string): string {
  return `mailto:${email}`;
}

/** "+919157731020" → "+91 91577 31020" */
export function formatPhone(phone: string): string {
  const match = phone.match(/^\+91(\d{5})(\d{5})$/);
  return match ? `+91 ${match[1]} ${match[2]}` : phone;
}

/** Google Maps search for an address. No API key, no invented place URL. */
export function mapsSearchUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/** Keyless Google Maps embed: the client's embed URL when supplied, otherwise a search for the verified address. Undefined when there is no address. */
export function locationMapEmbed(location: Location, siteName: string): string | undefined {
  if (location.mapEmbedUrl) return location.mapEmbedUrl;
  if (!location.addressLines.length) return undefined;
  const query = location.mapQuery ?? [siteName, ...location.addressLines].join(", ");
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=16&output=embed`;
}

/** The client's map link when supplied, otherwise a Maps search for the clinic name + address. */
export function locationMapLink(location: Location, siteName: string): string {
  if (location.mapLink) return location.mapLink;
  if (location.mapQuery) return mapsSearchUrl(location.mapQuery);
  const parts = [siteName, ...location.addressLines];
  if (!location.addressLines.length) parts.push(location.area, location.city);
  return mapsSearchUrl(parts.join(", "));
}
