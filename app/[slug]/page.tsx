import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DoctorPage } from "@/components/pages/DoctorPage";
import { LocationPage } from "@/components/pages/LocationPage";
import { getDoctor, getDoctors, getDoctorsForLocation, getLocation, getLocations } from "@/lib/content";
import { routes } from "@/lib/links";
import { buildMetadata, doctorTitle, locationTitle } from "@/lib/seo";

/**
 * Top-level content routes that are data-driven rather than hand-named:
 * location landing pages (/dermatologist-in-kalyani-nagar) and standalone doctor
 * profiles. A doctor with `profileOnAbout` (Dr. Patel) has no page here: the profile
 * is the #doctor section of /about and /<slug> redirects there (next.config.ts).
 */
type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return [...getLocations().map((l) => ({ slug: l.slug })), ...getDoctors().filter((d) => !d.profileOnAbout).map((d) => ({ slug: d.slug }))];
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const location = getLocation(slug);
  if (location) {
    return buildMetadata({ title: locationTitle(location, getDoctorsForLocation(location)[0]), description: location.metaDescription, path: routes.location(slug) });
  }
  const doctor = getDoctor(slug);
  if (doctor && !doctor.profileOnAbout) return buildMetadata({ title: doctorTitle(doctor), description: doctor.metaDescription, path: routes.doctorProfile(slug) });
  return {};
}

export default async function TopLevelContentPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const location = getLocation(slug);
  if (location) return <LocationPage location={location} />;
  const doctor = getDoctor(slug);
  if (doctor && !doctor.profileOnAbout) return <DoctorPage doctor={doctor} />;
  notFound();
}
