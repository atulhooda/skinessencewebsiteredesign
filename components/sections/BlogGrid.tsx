import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/content/schema";
import { routes } from "@/lib/links";
import { ArrowBadge } from "@/components/ui/ArrowBadge";
import { Container } from "@/components/ui/Container";
import { SectionCard } from "@/components/ui/SectionCard";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function formatPostDate(iso: string): string {
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${iso}T00:00:00+05:30`));
}

type Props = { id?: string; eyebrow: string; title: string; posts: BlogPost[]; tone?: "white" | "muted" };

/** Post cards linking to /blog/[slug]. */
export function BlogGrid({ id = "posts", eyebrow, title, posts, tone = "white" }: Props) {
  return (
    <SectionCard id={id} headingId={`${id}-heading`} tone={tone}>
      <Container>
        <SectionHeading id={`${id}-heading`} eyebrow={eyebrow} title={title} align="left" size="md" />
        {posts.length === 0 ? (
          <p className="mt-8 text-base text-muted">New articles are on the way.</p>
        ) : (
          <ul className="mt-10 grid gap-4 md:grid-cols-2">
            {posts.map((post) => (
              <li key={post.slug}>
                <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-brand-100 bg-white transition-all hover:-translate-y-0.5 hover:border-brand-400 hover:shadow-soft">
                  <div className="relative aspect-[16/9] bg-surface-3">
                    <Image
                      src={post.heroImage.src}
                      alt={post.heroImage.alt}
                      width={post.heroImage.width}
                      height={post.heroImage.height}
                      loading="lazy"
                      sizes="(min-width: 768px) 45vw, 100vw"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    <ArrowBadge className="absolute bottom-3 right-3" />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-xs text-muted">
                      <time dateTime={post.date}>{formatPostDate(post.date)}</time>
                      {post.readingMinutes ? ` · ${post.readingMinutes} min read` : ""}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold leading-snug">
                      <Link href={routes.blogPost(post.slug)} className="after:absolute after:inset-0">
                        {post.title}
                      </Link>
                    </h3>
                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">{post.excerpt}</p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </SectionCard>
  );
}
