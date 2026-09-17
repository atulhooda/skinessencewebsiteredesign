import { getHomePage, getPrimaryDoctor, getSite } from "@/lib/content";
import { formatPhone } from "@/lib/links";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "Skin Essence, MD Dermatologist in Kalyani Nagar, Pune";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  const site = getSite();
  const home = getHomePage();
  const doctor = getPrimaryDoctor();
  return renderOgImage({
    eyebrow: site.category,
    title: home.hero.title,
    subtitle: `${doctor.name}, ${doctor.qualifications.join(", ")} · ${doctor.yearsExperience}+ years · ${site.stats[1]?.value} patients treated`,
    footer: `${formatPhone(site.phone)} · ${site.tagline}`,
  });
}
