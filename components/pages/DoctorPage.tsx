import { JsonLd } from "@/components/seo/JsonLd";
import { FeaturedTreatments } from "@/components/sections/FeaturedTreatments";
import { LeadFormSection } from "@/components/sections/LeadFormSection";
import { LocationsSection } from "@/components/sections/LocationsSection";
import { PageHero } from "@/components/sections/PageHero";
import { ProseSection } from "@/components/sections/ProseSection";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Container } from "@/components/ui/Container";
import { SectionCard } from "@/components/ui/SectionCard";
import { StatsRow } from "@/components/ui/StatCard";
import type { Doctor } from "@/content/schema";
import { getCategories, getFeaturedTiles, getHomePage, getLeadOptions, getLocation, getLocations, getPrimaryLocation, getSite } from "@/lib/content";
import { routes, whatsappUrl } from "@/lib/links";
import { breadcrumbJsonLd, physicianJsonLd, type Crumb } from "@/lib/schema-org";

/** Doctor profile page. */
export function DoctorPage({ doctor }: { doctor: Doctor }) {
  const site = getSite();
  const home = getHomePage();
  const primary = getPrimaryLocation();
  const clinics = doctor.locationSlugs.map((slug) => getLocation(slug)).filter((l) => l !== undefined);
  const whatsappHref = whatsappUrl(site.whatsapp, site.whatsappPrefill);
  const crumbs: Crumb[] = [
    { name: "Home", path: routes.home },
    { name: doctor.name, path: routes.doctorProfile(doctor.slug) },
  ];

  return (
    <>
      <JsonLd data={[physicianJsonLd(doctor, site, primary), breadcrumbJsonLd(crumbs)]} />
      <PageHero
        crumbs={crumbs}
        eyebrow={`${doctor.qualifications.join(", ")} · ${doctor.title}`}
        title={doctor.heroTitle}
        description={doctor.shortBio}
        image={doctor.photo}
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
          <div className="flex flex-wrap items-center gap-2 text-xs text-white/80">
            <span>Special interests:</span>
            {doctor.specialInterests.map((interest) => (
              <Chip key={interest} tone="dark">
                {interest}
              </Chip>
            ))}
          </div>
        }
      />
      <SectionCard id="experience" headingId="experience-heading" tone="muted" padding="compact">
        <Container size="wide">
          <h2 id="experience-heading" className="sr-only">
            {doctor.name}&apos;s experience in numbers
          </h2>
          <StatsRow stats={site.stats} />
        </Container>
      </SectionCard>
      <ProseSection
        id="about-doctor"
        eyebrow={doctor.subheading ?? "Know Your Doctor"}
        title={`About ${doctor.name}`}
        paragraphs={doctor.bio}
        tone="white"
        aside={
          <div className="rounded-3xl bg-surface-2 p-6 md:p-8">
            <h3 className="text-lg font-semibold">At a glance</h3>
            <dl className="mt-4 space-y-4 text-sm">
              <div>
                <dt className="text-xs text-muted">Qualifications</dt>
                <dd className="mt-1 font-medium">{doctor.qualifications.join(", ")}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Experience</dt>
                <dd className="mt-1 font-medium">{doctor.yearsExperience}+ years in dermatology and cosmetology</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Consults at</dt>
                <dd className="mt-1 font-medium">{clinics.map((c) => `${c.area}${c.area !== c.city ? `, ${c.city}` : ""}`).join("; ") || primary.city}</dd>
              </div>
            </dl>
            <Button href={routes.book} variant="primary" icon="arrow-right" className="mt-6">
              Book A Consultation
            </Button>
          </div>
        }
      />
      <FeaturedTreatments
        eyebrow="Treatments"
        title={`What ${doctor.name} Treats`}
        tiles={getFeaturedTiles()}
        categories={getCategories()}
        tone="muted"
        action={
          <Button href={routes.treatments} variant="primary" icon="arrow-right">
            All Treatments
          </Button>
        }
      />
      <LocationsSection eyebrow="Where To Find Her" title={`Consult ${doctor.name}`} locations={clinics.length ? clinics : [primary]} site={site} tone="white" />
      <LeadFormSection
        eyebrow={home.leadForm.eyebrow}
        title={home.leadForm.title}
        description={home.leadForm.description}
        location={primary}
        site={site}
        options={getLeadOptions()}
        locations={getLocations().map((l) => ({ value: l.slug, label: l.city }))}
        whatsappHref={whatsappHref}
      />
    </>
  );
}
