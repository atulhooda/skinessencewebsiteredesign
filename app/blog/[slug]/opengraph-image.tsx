import { getBlogPost, getBlogPosts } from "@/lib/content";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "Skin Essence blog";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return getBlogPosts().map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  return renderOgImage({ eyebrow: "Skin Essence Blog · Kalyani Nagar, Pune", title: post?.title ?? "Skin Essence Blog", subtitle: post?.excerpt });
}
