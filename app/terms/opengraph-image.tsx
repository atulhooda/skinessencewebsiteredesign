import { getLegalPage, getSite } from "@/lib/content";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "Skin Essence terms of use";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  const site = getSite();
  return renderOgImage({ eyebrow: "Legal", title: getLegalPage("terms").title, subtitle: site.positioning });
}
