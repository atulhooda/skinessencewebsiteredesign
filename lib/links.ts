import type { Location } from "@/content/schema";

/** Route builders and contact links. Keep every internal href here so a URL change is one edit. */
export const routes = {
  home: "/",
  treatments: "/treatments",
  treatment: (slug: string) => `/treatments/${slug}`,
  category: (slug: string) => `/treatments#${slug}`,
  concern: (slug: string) => `/concerns/${slug}`,
  technology: "/technology",
  machine: (slug: string) => `/technology/${slug}`,
  location: (slug: string) => `/${slug}`,
  about: "/about",
  doctor: "/dr-daksha-patel",
  doctorProfile: (slug: string) => `/${slug}`,
  contact: "/contact",
  blog: "/blog",
  blogPost: (slug: string) => `/blog/${slug}`,
  privacy: "/privacy-policy",
  terms: "/terms",
  /** In-page anchor of the lead form. Every page template renders it. */
  book: "#book",
} as const;

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

/** The client's map link when supplied, otherwise a Maps search for the clinic name + address. */
export function locationMapLink(location: Location, siteName: string): string {
  if (location.mapLink) return location.mapLink;
  const parts = [siteName, ...location.addressLines];
  if (!location.addressLines.length) parts.push(location.area, location.city);
  return mapsSearchUrl(parts.join(", "));
}
