import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { ConcernsGrid } from "@/components/sections/ConcernsGrid";
import { LeadFormSection } from "@/components/sections/LeadFormSection";
import { PageHero } from "@/components/sections/PageHero";
import { Button } from "@/components/ui/Button";
import { getConcerns, getHomePage, getLeadOptions, getLocations, getPrimaryLocation, getSimplePage, getSite } from "@/lib/content";
import { routes, whatsappUrl } from "@/lib/links";
import { breadcrumbJsonLd, type Crumb } from "@/lib/schema-org";
import { absoluteUrl, buildMetadata } from "@/lib/seo";

const crumbs: Crumb[] = [
  { name: "Home", path: routes.home },
  { name: "Concerns", path: routes.concerns },
];

export function generateMetadata(): Metadata {
  const page = getSimplePage("concerns");
  return buildMetadata({ title: page.metaTitle, description: page.metaDescription, path: routes.concerns });
}

export default function ConcernsIndexPage() {
  const site = getSite();
  const home = getHomePage();
  const page = getSimplePage("concerns");
  const concerns = getConcerns();
  const whatsappHref = whatsappUrl(site.whatsapp, site.whatsappPrefill);
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd(crumbs),
          { "@context": "https://schema.org", "@type": "ItemList", name: "Skin and hair concerns", itemListElement: concerns.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, url: absoluteUrl(routes.concern(c.slug)) })) },
        ]}
      />
      <PageHero
        crumbs={crumbs}
        eyebrow={page.eyebrow}
        title={page.title}
        description={page.description}
        image={page.heroImage}
        actions={
          <>
            <Button href={routes.book} variant="light" icon="arrow-right">
              Book Consultation
            </Button>
            <Button href={whatsappHref} variant="outline" icon="arrow-up-right">
              Ask On WhatsApp
            </Button>
          </>
        }
      />
      <ConcernsGrid eyebrow="Start With What Bothers You" title="Skin And Hair Concerns We Treat" concerns={concerns} />
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
