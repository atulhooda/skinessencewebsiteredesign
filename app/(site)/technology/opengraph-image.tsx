import { getSite } from "@/lib/content";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "The machines behind the treatments at Skin Essence, Kalyani Nagar, Pune";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  const site = getSite();
  return renderOgImage({
    eyebrow: `Advanced Technology · ${site.positioning}`,
    title: "The Machines Behind Our Treatments",
    subtitle: "Lasers, hydrodermabrasion and skin systems, each explained in detail",
  });
}
