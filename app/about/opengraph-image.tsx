import { getAboutPage, getSite } from "@/lib/content";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "About Skin Essence, Kalyani Nagar, Pune";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  const site = getSite();
  return renderOgImage({ eyebrow: `About ${site.name}`, title: getAboutPage().understanding.title, subtitle: site.tagline });
}
