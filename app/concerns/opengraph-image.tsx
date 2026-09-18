import { getSimplePage, getSite } from "@/lib/content";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "Skin and hair concerns treated at Skin Essence, Kalyani Nagar, Pune";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  const site = getSite();
  const page = getSimplePage("concerns");
  return renderOgImage({ eyebrow: "Skin & Hair Concerns", title: page.title, subtitle: site.positioning });
}
