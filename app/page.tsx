import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { DoctorIntro } from "@/components/sections/DoctorIntro";
import { FaqSection } from "@/components/sections/FaqSection";
import { FeaturedTreatments } from "@/components/sections/FeaturedTreatments";
import { HomeHero } from "@/components/sections/HomeHero";
import { IntakeSection } from "@/components/sections/IntakeSection";
import { LocationsSection } from "@/components/sections/LocationsSection";
import { TechMosaic } from "@/components/sections/TechMosaic";
import { TestimonialBand } from "@/components/sections/TestimonialBand";
import { WhyPatientsStay } from "@/components/sections/WhyPatientsStay";
import { Button } from "@/components/ui/Button";
import {
  getDoctorsForLocation,
  getFaqGroups,
  getHomePage,
  getLeadOptions,
  getLocations,
  getPrimaryDoctor,
  getPrimaryLocation,
  getPrinciples,
  getSite,
  getTechnology,
  getTestimonials,
  getCategories,
  getFeaturedTiles,
  getTreatments,
} from "@/lib/content";
import { routes, whatsappUrl } from "@/lib/links";
import { faqPageJsonLd, medicalClinicJsonLd, websiteJsonLd } from "@/lib/schema-org";
import { absoluteUrl, buildMetadata, HOME_TITLE } from "@/lib/seo";

const HOME_DESCRIPTION =
  "Dr. Daksha Patel, MD dermatologist in Kalyani Nagar, Pune: acne, pigmentation, hair loss, laser and anti-ageing care. Book a consultation.";

export const metadata: Metadata = buildMetadata({ title: HOME_TITLE, description: HOME_DESCRIPTION, path: "/" });

export default function HomePage() {
  const site = getSite();
  const home = getHomePage();
  const doctor = getPrimaryDoctor();
  const location = getPrimaryLocation();
  const faqGroups = getFaqGroups();
  const whatsappHref = whatsappUrl(site.whatsapp, site.whatsappPrefill);
  const leadLocations = getLocations().map((l) => ({ value: l.slug, label: l.city }));

  return (
    <>
      <JsonLd
        data={[
          websiteJsonLd(site),
          medicalClinicJsonLd({
            location,
            site,
            doctors: getDoctorsForLocation(location),
            treatments: getTreatments(),
            pageUrl: absoluteUrl("/"),
          }),
          faqPageJsonLd(faqGroups.flatMap((g) => g.items)),
        ]}
      />
      <HomeHero hero={home.hero} site={site} />
      <IntakeSection
        eyebrow={home.intake.eyebrow}
        lead={home.intake.lead}
        rest={home.intake.rest}
        site={site}
        options={getLeadOptions()}
        locations={leadLocations}
        defaultLocation={location.slug}
        whatsappHref={whatsappHref}
      />
      <FeaturedTreatments
        eyebrow={home.treatments.eyebrow}
        title={home.treatments.title}
        tiles={getFeaturedTiles()}
        categories={getCategories()}
        tone="muted"
        action={
          <Button href={routes.treatments} variant="primary" icon="arrow-right">
            All Treatments
          </Button>
        }
      />
      <DoctorIntro
        eyebrow={home.doctorIntro.eyebrow}
        title={home.doctorIntro.title}
        doctor={doctor}
        image={doctor.photo}
        stats={site.stats}
        tone="white"
      />
      <WhyPatientsStay
        eyebrow={home.whyChoose.eyebrow}
        title={home.whyChoose.title}
        image={home.whyChoose.image}
        principles={getPrinciples()}
        tone="muted"
      />
      <TestimonialBand
        eyebrow={home.testimonials.eyebrow}
        title={home.testimonials.title}
        testimonials={getTestimonials()}
      />
      <TechMosaic
        eyebrow={home.technology.eyebrow}
        title={home.technology.title}
        description={home.technology.description}
        items={getTechnology()}
      />
      <FaqSection eyebrow={home.faq.eyebrow} title={home.faq.title} groups={faqGroups} />
      <LocationsSection eyebrow={home.locations.eyebrow} title={home.locations.title} locations={getLocations()} site={site} />
    </>
  );
}
