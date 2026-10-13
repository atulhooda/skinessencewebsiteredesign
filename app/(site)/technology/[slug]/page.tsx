import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { DoctorIntro } from "@/components/sections/DoctorIntro";
import { FaqSection } from "@/components/sections/FaqSection";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { LeadFormSection } from "@/components/sections/LeadFormSection";
import { LocationsSection } from "@/components/sections/LocationsSection";
import { MachineOverview } from "@/components/sections/MachineOverview";
import { MachineSpecs } from "@/components/sections/MachineSpecs";
import { PageHero } from "@/components/sections/PageHero";
import { RelatedTreatments } from "@/components/sections/RelatedTreatments";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import {
  getCategories,
  getHomePage,
  getLeadOptions,
  getLocationForMachine,
  getLocations,
  getMachine,
  getMachines,
  getPrimaryDoctor,
  getSite,
  getTreatmentsForMachine,
} from "@/lib/content";
import { routes, whatsappMessage, whatsappUrl } from "@/lib/links";
import { breadcrumbJsonLd, faqPageJsonLd, machineJsonLd, type Crumb } from "@/lib/schema-org";
import { buildMetadata } from "@/lib/seo";

type Params = { slug: string };

const CLINIC = { pune: "Kalyani Nagar, Pune", ahmedabad: "Ahmedabad" } as const;

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return getMachines().map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const machine = getMachine(slug);
  if (!machine) return {};
  return buildMetadata({ title: machine.metaTitle, description: machine.metaDescription, path: routes.machine(slug) });
}

export default async function MachinePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const machine = getMachine(slug);
  if (!machine) notFound();

  const site = getSite();
  const home = getHomePage();
  const doctor = getPrimaryDoctor();
  const clinic = getLocationForMachine(machine);
  const treatments = getTreatmentsForMachine(machine);
  const whatsappHref = whatsappUrl(site.whatsapp, whatsappMessage(site.whatsappPrefill, machine.shortName));
  const crumbs: Crumb[] = [
    { name: "Home", path: routes.home },
    { name: "Technology", path: routes.technology },
    { name: machine.shortName, path: routes.machine(slug) },
  ];

  return (
    <>
      <JsonLd data={[machineJsonLd(machine, treatments, clinic), faqPageJsonLd(machine.faqs), breadcrumbJsonLd(crumbs)]} />
      <PageHero
        crumbs={crumbs}
        eyebrow={`${machine.kicker} · ${CLINIC[machine.location]}`}
        title={machine.heroTitle}
        description={machine.shortDesc}
        image={machine.image}
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
              <span>Used for:</span>
              {treatments.map((t) => (
                <Chip key={t.slug} href={routes.treatment(t.slug)} tone="dark">
                  {t.name}
                </Chip>
              ))}
            </div>
          )
        }
      />
      <MachineSpecs machine={machine} />
      <MachineOverview machine={machine} whatsappHref={whatsappHref} />
      <HowItWorks eyebrow="How It Works" title={`How The ${machine.shortName} Works`} steps={machine.howItWorks} />
      <RelatedTreatments eyebrow="Treatments On This Machine" title={`What We Do With The ${machine.shortName}`} treatments={treatments} categories={getCategories()} tone="white" />
      <DoctorIntro
        eyebrow="Who Operates It"
        title={`Every ${machine.shortName} session is planned and supervised by ${doctor.name}, ${doctor.qualifications.join(", ")}.`}
        doctor={doctor}
        image={doctor.photo}
        tone="muted"
      />
      <FaqSection eyebrow="Helpful Answers" title={`${machine.shortName} Questions, Answered Honestly`} groups={[{ category: "FAQ", items: machine.faqs }]} tone="white" />
      <LocationsSection eyebrow="Where To Find It" title={`The ${machine.shortName} Is At Our ${CLINIC[machine.location]} Clinic`} locations={[clinic]} site={site} />
      <LeadFormSection
        eyebrow={home.leadForm.eyebrow}
        title={home.leadForm.title}
        description={home.leadForm.description}
        location={clinic}
        site={site}
        options={getLeadOptions()}
        locations={getLocations().map((l) => ({ value: l.slug, label: l.city }))}
        whatsappHref={whatsappHref}
      />
    </>
  );
}
