import { getSimplePage, getSite } from "@/lib/content";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "Skin Essence blog: skin and hair advice from Kalyani Nagar, Pune";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  const site = getSite();
  const page = getSimplePage("blog");
  return renderOgImage({ eyebrow: "Blog", title: page.title, subtitle: site.positioning });
}
