import type { Metadata } from "next";
import type { Doctor, Location } from "@/content/schema";

export const SITE_NAME = "Skin Essence";
export const LOCALITY = "Kalyani Nagar, Pune";
export const OG_LOCALE = "en_IN";
export const HOME_TITLE = `MD Dermatologist in ${LOCALITY} | ${SITE_NAME}`;

/** Canonical origin, no trailing slash. Override with NEXT_PUBLIC_SITE_URL. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://skinessence2017.com").replace(/\/+$/, "");

export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//.test(path)) return path;
  const clean = path.startsWith("/") ? path : `/${path}`;
  return clean === "/" ? `${SITE_URL}/` : `${SITE_URL}${clean.replace(/\/+$/, "")}`;
}

/* ---------- Title patterns (brief section 6.4) ---------- */

/** Treatment: "{Treatment} in Kalyani Nagar, Pune | Skin Essence" */
export function localTitle(name: string): string {
  return `${name} in ${LOCALITY} | ${SITE_NAME}`;
}

/** Concern: "{Concern} Treatment in Pune by MD Dermatologist | Skin Essence" */
export function concernTitle(name: string): string {
  return `${name} Treatment in Pune by MD Dermatologist | ${SITE_NAME}`;
}

/** Location: primary → "Dermatologist in Kalyani Nagar, Pune | Dr. Daksha Patel, MD"; others → "Dermatologist in Ahmedabad | Skin Essence" */
export function locationTitle(location: Location, doctor?: Doctor): string {
  if (location.isPrimary && doctor) return `Dermatologist in ${location.area}, ${location.city} | ${doctor.name}, MD`;
  return `Dermatologist in ${location.city} | ${SITE_NAME}`;
}

/** Doctor: "Dr. Daksha Patel, MBBS MD (Skin & VD) | Dermatologist in Pune" */
export function doctorTitle(doctor: Doctor): string {
  return `${doctor.name}, ${doctor.qualifications.join(" ")} | Dermatologist in Pune`;
}

/** Blog: "{Post title} | Skin Essence Pune" */
export function blogTitle(title: string): string {
  return `${title} | ${SITE_NAME} Pune`;
}

type BuildMetadataInput = {
  /** Complete title, including the "| Skin Essence" suffix. */
  title: string;
  /** Under 155 characters, mentions a locality and ends with a call to action. */
  description: string;
  /** Route path, e.g. "/treatments/acne-treatment". */
  path: string;
  type?: "website" | "article";
  noIndex?: boolean;
};

/**
 * Metadata shared by every route: canonical, Open Graph (en_IN), Twitter card
 * and robots. Open Graph images come from the `opengraph-image.tsx` file in
 * each route segment, which Next merges in automatically.
 */
export function buildMetadata(input: BuildMetadataInput): Metadata {
  const url = absoluteUrl(input.path);
  const description = input.description.trim();
  // Non-negotiable: descriptions must fit Google's ~155-character snippet. Fail the build otherwise.
  if (description.length > 155) {
    throw new Error(`Meta description for ${input.path} is ${description.length} chars (max 155).`);
  }
  return {
    title: { absolute: input.title },
    description,
    alternates: { canonical: url },
    openGraph: {
      type: input.type ?? "website",
      locale: OG_LOCALE,
      url,
      siteName: SITE_NAME,
      title: input.title,
      description,
    },
    twitter: { card: "summary_large_image", title: input.title, description },
    robots: input.noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
        },
  };
}
