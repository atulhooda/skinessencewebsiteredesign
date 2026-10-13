import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { ConcernOverview } from "@/components/sections/ConcernOverview";
import { DoctorIntro } from "@/components/sections/DoctorIntro";
import { FaqSection } from "@/components/sections/FaqSection";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { LeadFormSection } from "@/components/sections/LeadFormSection";
import { ListsSection } from "@/components/sections/ListsSection";
import { LocationsSection } from "@/components/sections/LocationsSection";
import { PageHero } from "@/components/sections/PageHero";
import { RelatedTreatments } from "@/components/sections/RelatedTreatments";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { getCategories, getConcern, getConcerns, getHomePage, getLeadOptions, getLocations, getPrimaryDoctor, getPrimaryLocation, getSite, getTreatmentsForConcern } from "@/lib/content";
import { routes, whatsappMessage, whatsappUrl } from "@/lib/links";
import { breadcrumbJsonLd, faqPageJsonLd, medicalConditionJsonLd, type Crumb } from "@/lib/schema-org";
import { buildMetadata } from "@/lib/seo";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return getConcerns().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const concern = getConcern(slug);
  if (!concern) return {};
  return buildMetadata({ title: concern.metaTitle, description: concern.metaDescription, path: routes.concern(slug) });
}

export default async function ConcernPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const concern = getConcern(slug);
  if (!concern) notFound();

  const site = getSite();
  const home = getHomePage();
  const doctor = getPrimaryDoctor();
  const location = getPrimaryLocation();
  const treatments = getTreatmentsForConcern(concern);
  const whatsappHref = whatsappUrl(site.whatsapp, whatsappMessage(site.whatsappPrefill, concern.name));
  const crumbs: Crumb[] = [
    { name: "Home", path: routes.home },
    { name: "Concerns", path: routes.concerns },
    { name: concern.name, path: routes.concern(slug) },
  ];

  return (
    <>
      <JsonLd data={[medicalConditionJsonLd(concern, treatments), faqPageJsonLd(concern.faqs), breadcrumbJsonLd(crumbs)]} />
      <PageHero
        crumbs={crumbs}
        eyebrow={`Skin & hair concerns · ${site.positioning}`}
        title={concern.heroTitle}
        description={concern.shortDesc}
        image={concern.heroImage}
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
        footer={
          treatments.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 text-xs text-white/80">
              <span>Treated with:</span>
              {treatments.map((t) => (
                <Chip key={t.slug} href={routes.treatment(t.slug)} tone="dark">
                  {t.name}
                </Chip>
              ))}
            </div>
          )
        }
      />
      <ConcernOverview concern={concern} whatsappHref={whatsappHref} />
      <HowItWorks eyebrow="Our Approach" title={`How We Treat ${concern.name} At Skin Essence`} steps={concern.howWeTreat} tone="muted" />
      <RelatedTreatments eyebrow="Treatments" title={`Treatments For ${concern.name}`} treatments={treatments} categories={getCategories()} tone="white" />
      <ListsSection
        id="self-care"
        eyebrow="At Home"
        title="What You Can Do, And When To See Us"
        lists={[
          { heading: "What helps at home", items: concern.selfCare, marker: "check" },
          { heading: "See a dermatologist if", items: concern.whenToSeeDoctor, marker: "dot" },
        ]}
        tone="muted"
      />
      <DoctorIntro eyebrow="Your Dermatologist" title={`${concern.name} Is Assessed And Treated By ${doctor.name}, ${doctor.qualifications.join(", ")}.`} doctor={doctor} image={doctor.photo} tone="white" />
      <FaqSection eyebrow="Helpful Answers" title={`${concern.name}: Common Questions`} groups={[{ category: "FAQ", items: concern.faqs }]} tone="muted" />
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
