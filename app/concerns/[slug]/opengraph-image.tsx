import { getConcern, getConcerns } from "@/lib/content";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "Skin and hair concern treated at Skin Essence, Kalyani Nagar, Pune";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return getConcerns().map((c) => ({ slug: c.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const concern = getConcern(slug);
  return renderOgImage({ eyebrow: "Concerns · Kalyani Nagar, Pune", title: concern?.heroTitle ?? "Skin & Hair Concerns", subtitle: concern?.shortDesc });
}
