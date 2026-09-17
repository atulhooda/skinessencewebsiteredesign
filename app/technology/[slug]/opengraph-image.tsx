import { getMachine, getMachines } from "@/lib/content";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "Machine at Skin Essence";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return getMachines().map((m) => ({ slug: m.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const machine = getMachine(slug);
  const clinic = machine?.location === "ahmedabad" ? "Ahmedabad" : "Kalyani Nagar, Pune";
  return renderOgImage({
    eyebrow: `${machine?.kicker ?? "Technology"} · ${clinic}`,
    title: machine?.heroTitle ?? "Technology",
    subtitle: machine?.shortDesc,
  });
}
