import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { FaqSection } from "@/components/sections/FaqSection";
import { LeadFormSection } from "@/components/sections/LeadFormSection";
import { LocationsSection } from "@/components/sections/LocationsSection";
import { PageHero } from "@/components/sections/PageHero";
import { TreatmentsByCategory } from "@/components/sections/TreatmentsByCategory";
import { WhyPatientsStay } from "@/components/sections/WhyPatientsStay";
import { Button } from "@/components/ui/Button";
import {
  getFaqGroups,
  getHomePage,
  getLeadOptions,
  getLocations,
  getPrimaryLocation,
  getPrinciples,
  getSite,
  getTreatments,
  getTreatmentsByCategory,
  getTreatmentsPage,
} from "@/lib/content";
import { routes, whatsappUrl } from "@/lib/links";
import { breadcrumbJsonLd, faqPageJsonLd, type Crumb } from "@/lib/schema-org";
import { absoluteUrl, buildMetadata, localTitle } from "@/lib/seo";

const crumbs: Crumb[] = [
  { name: "Home", path: routes.home },
  { name: "Treatments", path: routes.treatments },
];

export const metadata: Metadata = buildMetadata({
  title: localTitle("Skin, Hair, Laser & Cosmetic Treatments"),
  description:
    "Skin, hair, laser and cosmetic treatments at Skin Essence, Kalyani Nagar, Pune, planned by an MD dermatologist. Explore treatments and book a consultation.",
  path: routes.treatments,
});

export default function TreatmentsIndexPage() {
  const site = getSite();
  const page = getTreatmentsPage();
  const home = getHomePage();
  const location = getPrimaryLocation();
  const faqGroups = getFaqGroups().filter((g) => g.category !== "Treatment & Safety");
  const whatsappHref = whatsappUrl(site.whatsapp, site.whatsappPrefill);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd(crumbs),
          faqPageJsonLd(faqGroups.flatMap((g) => g.items)),
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Treatments at Skin Essence",
            itemListElement: getTreatments().map((t, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: t.name,
              url: absoluteUrl(routes.treatment(t.slug)),
            })),
          },
        ]}
      />
      <PageHero
        crumbs={crumbs}
        eyebrow={page.hero.eyebrow}
        title={page.hero.title}
        description={page.hero.description}
        image={page.hero.image}
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
      <TreatmentsByCategory
        eyebrow={page.listing.eyebrow}
        title={page.listing.title}
        categories={getTreatmentsByCategory()}
        action={
          <Button href={routes.book} variant="primary" icon="arrow-right">
            Book Consultation
          </Button>
        }
      />
      <WhyPatientsStay
        eyebrow={home.whyChoose.eyebrow}
        title={home.whyChoose.title}
        image={home.whyChoose.image}
        principles={getPrinciples()}
        tone="muted"
      />
      <FaqSection eyebrow={page.faq.eyebrow} title={page.faq.title} groups={faqGroups} />
      <LocationsSection eyebrow="Where To Find Us" title={`Visit Skin Essence In ${location.area}, ${location.city}`} locations={[location]} site={site} />
      <LeadFormSection
        eyebrow={home.leadForm.eyebrow}
        title={home.leadForm.title}
        description={home.leadForm.description}
        location={location}
        site={site}
        options={getLeadOptions()}
        locations={getLocations().map((l) => ({ value: l.slug, label: l.city }))}
        whatsappHref={whatsappHref}
      />
    </>
  );
}
