import { getSimplePage, getSite } from "@/lib/content";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "Contact Skin Essence, Kalyani Nagar, Pune";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  const site = getSite();
  const page = getSimplePage("contact");
  return renderOgImage({ eyebrow: "Contact", title: page.title, subtitle: site.positioning });
}
