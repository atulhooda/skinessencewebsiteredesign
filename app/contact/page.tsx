import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { ContactCards } from "@/components/sections/ContactCards";
import { FaqSection } from "@/components/sections/FaqSection";
import { LeadFormSection } from "@/components/sections/LeadFormSection";
import { LocationDetails } from "@/components/sections/LocationDetails";
import { PageHero } from "@/components/sections/PageHero";
import { Button } from "@/components/ui/Button";
import { getDoctorsForLocation, getFaqGroups, getHomePage, getLeadOptions, getLocations, getPrimaryLocation, getSimplePage, getSite, getTreatments } from "@/lib/content";
import { formatPhone, routes, telUrl, whatsappUrl } from "@/lib/links";
import { breadcrumbJsonLd, faqPageJsonLd, medicalClinicJsonLd, type Crumb } from "@/lib/schema-org";
import { buildMetadata } from "@/lib/seo";

const crumbs: Crumb[] = [
  { name: "Home", path: routes.home },
  { name: "Contact", path: routes.contact },
];

export function generateMetadata(): Metadata {
  const page = getSimplePage("contact");
  return buildMetadata({ title: page.metaTitle, description: page.metaDescription, path: routes.contact });
}

export default function ContactPage() {
  const site = getSite();
  const home = getHomePage();
  const page = getSimplePage("contact");
  const locations = getLocations();
  const primary = getPrimaryLocation();
  const faqGroups = getFaqGroups().filter((g) => g.category === "Booking & Location");
  const whatsappHref = whatsappUrl(site.whatsapp, site.whatsappPrefill);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd(crumbs),
          medicalClinicJsonLd({ location: primary, site, doctors: getDoctorsForLocation(primary), treatments: getTreatments() }),
          faqPageJsonLd(faqGroups.flatMap((g) => g.items)),
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
            <Button href={telUrl(site.phone)} variant="outline" icon="none">
              Call {formatPhone(site.phone)}
            </Button>
          </>
        }
      />
      <ContactCards site={site} />
      {locations.map((location, i) => (
        <LocationDetails
          key={location.slug}
          id={`visit-${location.city.toLowerCase()}`}
          eyebrow={location.isPrimary ? "Primary Clinic" : "Also In"}
          title={`Skin Essence, ${location.area === location.city ? location.city : `${location.area}, ${location.city}`}`}
          location={location}
          site={site}
          tone={i % 2 === 0 ? "white" : "muted"}
        />
      ))}
      <FaqSection eyebrow="Helpful Answers" title="Booking And Visiting" groups={faqGroups} tone="white" />
      <LeadFormSection
        eyebrow={home.leadForm.eyebrow}
        title={home.leadForm.title}
        description={home.leadForm.description}
        location={primary}
        site={site}
        options={getLeadOptions()}
        locations={locations.map((l) => ({ value: l.slug, label: l.city }))}
        whatsappHref={whatsappHref}
      />
    </>
  );
}
