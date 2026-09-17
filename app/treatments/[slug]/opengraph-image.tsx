import { getCategory, getTreatment, getTreatments } from "@/lib/content";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";
import { LOCALITY } from "@/lib/seo";

export const alt = "Treatment at Skin Essence, Kalyani Nagar, Pune";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return getTreatments().map((t) => ({ slug: t.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const treatment = getTreatment(slug);
  const category = treatment ? getCategory(treatment.category) : undefined;
  return renderOgImage({
    eyebrow: `${category?.name ?? "Treatment"} · ${LOCALITY}`,
    title: treatment?.heroTitle ?? "Treatment",
    subtitle: treatment?.shortDesc,
  });
}
