import { getSite, getTreatmentsPage } from "@/lib/content";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "Skin and hair treatments at Skin Essence, Kalyani Nagar, Pune";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  const site = getSite();
  const page = getTreatmentsPage();
  return renderOgImage({ eyebrow: site.positioning, title: page.hero.title, subtitle: page.hero.description });
}
