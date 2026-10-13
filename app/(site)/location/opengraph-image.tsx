import { getLocationConfig } from "@/lib/location-config";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "Find Skin Essence: 21st floor, Brahma Business Park, Kalyani Nagar, Pune";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  const config = getLocationConfig();
  return renderOgImage({
    eyebrow: "Find Us",
    title: `${config.floor}, ${config.buildingName}`,
    subtitle: `${config.clinicName} · ${config.cityLine}`,
  });
}
