import { getLegalPage, getSite } from "@/lib/content";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "Skin Essence privacy policy";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  const site = getSite();
  return renderOgImage({ eyebrow: "Legal", title: getLegalPage("privacy-policy").title, subtitle: site.positioning });
}
