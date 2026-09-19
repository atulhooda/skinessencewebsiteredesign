import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { BlogGrid } from "@/components/sections/BlogGrid";
import { LeadFormSection } from "@/components/sections/LeadFormSection";
import { PageHero } from "@/components/sections/PageHero";
import { Button } from "@/components/ui/Button";
import { getBlogPosts, getHomePage, getLeadOptions, getLocations, getPrimaryLocation, getSimplePage, getSite } from "@/lib/content";
import { routes, whatsappUrl } from "@/lib/links";
import { breadcrumbJsonLd, type Crumb } from "@/lib/schema-org";
import { absoluteUrl, buildMetadata } from "@/lib/seo";

const crumbs: Crumb[] = [
  { name: "Home", path: routes.home },
  { name: "Blog", path: routes.blog },
];

export function generateMetadata(): Metadata {
  const page = getSimplePage("blog");
  return buildMetadata({ title: page.metaTitle, description: page.metaDescription, path: routes.blog });
}

export default function BlogIndexPage() {
  const site = getSite();
  const home = getHomePage();
  const page = getSimplePage("blog");
  const posts = getBlogPosts();
  const whatsappHref = whatsappUrl(site.whatsapp, site.whatsappPrefill);
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd(crumbs),
          { "@context": "https://schema.org", "@type": "Blog", name: `${site.name} Blog`, url: absoluteUrl(routes.blog), inLanguage: "en-IN", blogPost: posts.map((p) => ({ "@type": "BlogPosting", headline: p.title, url: absoluteUrl(routes.blogPost(p.slug)), datePublished: p.date })) },
        ]}
      />
      <PageHero
        crumbs={crumbs}
        eyebrow={page.eyebrow}
        title={page.title}
        description={page.description}
        image={page.heroImage}
        actions={
          <Button href={routes.treatments} variant="light" icon="arrow-right">
            Explore Treatments
          </Button>
        }
      />
      <BlogGrid eyebrow="Latest Articles" title="From The Clinic" posts={posts} />
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
