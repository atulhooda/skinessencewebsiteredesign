import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { formatPostDate } from "@/components/sections/BlogGrid";
import { DoctorIntro } from "@/components/sections/DoctorIntro";
import { LeadFormSection } from "@/components/sections/LeadFormSection";
import { PageHero } from "@/components/sections/PageHero";
import { RelatedConcerns } from "@/components/sections/RelatedConcerns";
import { RelatedTreatments } from "@/components/sections/RelatedTreatments";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionCard } from "@/components/ui/SectionCard";
import { getBlogPost, getBlogPosts, getCategories, getConcern, getHomePage, getLeadOptions, getLocations, getPrimaryDoctor, getPrimaryLocation, getSite, getTreatment } from "@/lib/content";
import { routes, whatsappUrl } from "@/lib/links";
import { blogPostingJsonLd, breadcrumbJsonLd, type Crumb } from "@/lib/schema-org";
import { buildMetadata } from "@/lib/seo";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return getBlogPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  return buildMetadata({ title: post.metaTitle, description: post.metaDescription, path: routes.blogPost(slug), type: "article" });
}

export default async function BlogPostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  // Post bodies are MDX files next to their metadata: content/blog/<slug>.mdx
  const { default: Body } = await import(`@/content/blog/${slug}.mdx`);

  const site = getSite();
  const home = getHomePage();
  const doctor = getPrimaryDoctor();
  const treatments = post.relatedTreatments.map((s) => getTreatment(s)).filter((t) => t !== undefined);
  const concerns = post.relatedConcerns.map((s) => getConcern(s)).filter((c) => c !== undefined);
  const whatsappHref = whatsappUrl(site.whatsapp, site.whatsappPrefill);
  const crumbs: Crumb[] = [
    { name: "Home", path: routes.home },
    { name: "Blog", path: routes.blog },
    { name: post.title, path: routes.blogPost(slug) },
  ];

  return (
    <>
      <JsonLd data={[blogPostingJsonLd(post, site, doctor), breadcrumbJsonLd(crumbs)]} />
      <PageHero
        crumbs={crumbs}
        eyebrow={`${site.name} Blog · ${site.positioning}`}
        title={post.title}
        description={post.excerpt}
        image={post.heroImage}
        footer={
          <p className="text-xs text-white/80">
            <time dateTime={post.date}>{formatPostDate(post.date)}</time>
            {post.readingMinutes ? ` · ${post.readingMinutes} min read` : ""} · By {post.author}
            {post.reviewedBy ? ` · Medically reviewed by ${post.reviewedBy}` : ""}
          </p>
        }
      />
      <SectionCard id="article" headingId="article-heading" tone="white">
        <Container size="narrow">
          <h2 id="article-heading" className="sr-only">
            Article
          </h2>
          <article className="[&>*:first-child]:mt-0">
            <Body />
          </article>
          <p className="mt-10 rounded-2xl bg-surface-2 px-5 py-4 text-sm leading-relaxed text-ink-2">
            This article is general information, not a substitute for a consultation. Results vary from person to person.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={routes.book} variant="primary" icon="arrow-right">
              Book Consultation
            </Button>
            <Button href={routes.blog} variant="light" icon="arrow-up-right">
              More Articles
            </Button>
          </div>
        </Container>
      </SectionCard>
      <RelatedTreatments eyebrow="Related Treatments" title="Treatments Mentioned In This Article" treatments={treatments} categories={getCategories()} tone="muted" />
      <RelatedConcerns eyebrow="Related Concerns" title="Read More About The Concern" concerns={concerns} tone="white" />
      <DoctorIntro eyebrow="Your Dermatologist" title={`${doctor.name}, ${doctor.qualifications.join(", ")}`} doctor={doctor} image={doctor.photo} tone="muted" />
      <LeadFormSection
        eyebrow={home.leadForm.eyebrow}
        title={home.leadForm.title}
        description={home.leadForm.description}
        location={getPrimaryLocation()}
        site={site}
        options={getLeadOptions()}
        locations={getLocations().map((l) => ({ value: l.slug, label: l.city }))}
        whatsappHref={whatsappHref}
      />
    </>
  );
}
