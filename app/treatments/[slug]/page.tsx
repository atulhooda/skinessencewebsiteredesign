import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { DoctorIntro } from "@/components/sections/DoctorIntro";
import { DowntimeSection } from "@/components/sections/DowntimeSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { LeadFormSection } from "@/components/sections/LeadFormSection";
import { LocationsSection } from "@/components/sections/LocationsSection";
import { PageHero } from "@/components/sections/PageHero";
import { RelatedConcerns } from "@/components/sections/RelatedConcerns";
import { RelatedTreatments } from "@/components/sections/RelatedTreatments";
import { TreatmentFacts } from "@/components/sections/TreatmentFacts";
import { TreatmentOverview } from "@/components/sections/TreatmentOverview";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import {
  getCategories,
  getCategory,
  getHomePage,
  getLeadOptions,
  getLocations,
  getPrimaryDoctor,
  getPrimaryLocation,
  getRelatedConcerns,
  getRelatedTreatments,
  getSite,
  getTreatment,
  getTreatments,
} from "@/lib/content";
import { routes, whatsappMessage, whatsappUrl } from "@/lib/links";
import { breadcrumbJsonLd, faqPageJsonLd, medicalProcedureJsonLd, type Crumb } from "@/lib/schema-org";
import { buildMetadata } from "@/lib/seo";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return getTreatments().map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const treatment = getTreatment(slug);
  if (!treatment) return {};
  return buildMetadata({ title: treatment.metaTitle, description: treatment.metaDescription, path: routes.treatment(slug) });
}

export default async function TreatmentPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const treatment = getTreatment(slug);
  if (!treatment) notFound();

  const site = getSite();
  const home = getHomePage();
  const doctor = getPrimaryDoctor();
  const location = getPrimaryLocation();
  const category = getCategory(treatment.category);
  const related = getRelatedTreatments(treatment, 3);
  const concerns = getRelatedConcerns(treatment, 2);
  const whatsappHref = whatsappUrl(site.whatsapp, whatsappMessage(site.whatsappPrefill, treatment.name));
  const leadOptions = getLeadOptions();
  const defaultOption = leadOptions.find((o) => o.label.toLowerCase().includes(treatment.name.toLowerCase().split(" ")[0] ?? ""))?.value;

  const crumbs: Crumb[] = [
    { name: "Home", path: routes.home },
    { name: "Treatments", path: routes.treatments },
    { name: treatment.name, path: routes.treatment(slug) },
  ];

  return (
    <>
      <JsonLd
        data={[
          medicalProcedureJsonLd(treatment, site, location, doctor),
          faqPageJsonLd(treatment.faqs),
          breadcrumbJsonLd(crumbs),
        ]}
      />
      <PageHero
        crumbs={crumbs}
        eyebrow={`${category?.name ?? "Treatment"} · ${site.positioning}`}
        title={treatment.heroTitle}
        description={treatment.shortDesc}
        image={treatment.heroImage}
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
          concerns.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 text-xs text-white/80">
              <span>Helps with:</span>
              {concerns.map((c) => (
                <Chip key={c.slug} href={routes.concern(c.slug)} tone="dark">
                  {c.name}
                </Chip>
              ))}
            </div>
          )
        }
      />
      <TreatmentFacts treatment={treatment} />
      <TreatmentOverview treatment={treatment} whatsappHref={whatsappHref} />
      <HowItWorks eyebrow="What To Expect" title={`How ${treatment.name} Works At Skin Essence`} steps={treatment.howItWorks} />
      <DowntimeSection treatment={treatment} />
      <RelatedConcerns eyebrow="Helps With" title="Concerns This Treatment Addresses" concerns={concerns} tone="muted" />
      <RelatedTreatments eyebrow="You Might Also Consider" title="Related Treatments" treatments={related} categories={getCategories()} tone="white" />
      <DoctorIntro
        eyebrow="Your Dermatologist"
        title={`${treatment.name} Is Planned And Supervised By ${doctor.name}, ${doctor.qualifications.join(", ")}.`}
        doctor={doctor}
        image={doctor.photo}
        tone="muted"
      />
      <FaqSection eyebrow="Helpful Answers" title={`${treatment.name} Questions, Answered Honestly`} groups={[{ category: "FAQ", items: treatment.faqs }]} tone="white" />
      <LocationsSection eyebrow="Where To Find Us" title={`Visit Skin Essence In ${location.area}, ${location.city}`} locations={[location]} site={site} />
      <LeadFormSection
        eyebrow={home.leadForm.eyebrow}
        title={home.leadForm.title}
        description={home.leadForm.description}
        location={location}
        site={site}
        options={leadOptions}
        locations={getLocations().map((l) => ({ value: l.slug, label: l.city }))}
        defaultOption={defaultOption}
        whatsappHref={whatsappHref}
      />
    </>
  );
}
