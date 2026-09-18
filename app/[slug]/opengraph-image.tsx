import { getDoctor, getDoctors, getLocation, getLocations, getSite } from "@/lib/content";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "Skin Essence";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return [...getLocations().map((l) => ({ slug: l.slug })), ...getDoctors().map((d) => ({ slug: d.slug }))];
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const site = getSite();
  const location = getLocation(slug);
  if (location) {
    const place = location.area === location.city ? location.city : `${location.area}, ${location.city}`;
    return renderOgImage({ eyebrow: site.category, title: location.heroTitle, subtitle: `Skin Essence, ${place}` });
  }
  const doctor = getDoctor(slug);
  return renderOgImage({
    eyebrow: doctor ? doctor.title : site.positioning,
    title: doctor ? `${doctor.name}, ${doctor.qualifications.join(", ")}` : site.name,
    subtitle: doctor?.shortBio,
  });
}
