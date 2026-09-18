import { getAboutPage, getSite } from "@/lib/content";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "About Skin Essence and Dr. Daksha Patel, Kalyani Nagar, Pune";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  const site = getSite();
  return renderOgImage({ eyebrow: `About ${site.name}`, title: getAboutPage().heroTitle, subtitle: site.tagline });
}
