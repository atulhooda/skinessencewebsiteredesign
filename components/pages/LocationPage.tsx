import { JsonLd } from "@/components/seo/JsonLd";
import { DoctorIntro } from "@/components/sections/DoctorIntro";
import { FaqSection } from "@/components/sections/FaqSection";
import { FeaturedTreatments } from "@/components/sections/FeaturedTreatments";
import { LeadFormSection } from "@/components/sections/LeadFormSection";
import { LocationDetails } from "@/components/sections/LocationDetails";
import { MachinesGrid } from "@/components/sections/MachinesGrid";
import { PageHero } from "@/components/sections/PageHero";
import { ProseSection } from "@/components/sections/ProseSection";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import type { Location } from "@/content/schema";
import { getCategories, getDoctorsForLocation, getFeaturedTiles, getHomePage, getLeadOptions, getLocations, getMachines, getSite, getTreatments } from "@/lib/content";
import { formatPhone, routes, telUrl, whatsappUrl } from "@/lib/links";
import { breadcrumbJsonLd, faqPageJsonLd, medicalClinicJsonLd, type Crumb } from "@/lib/schema-org";

/** Location landing page: hero, clinic details + map, doctor, machines, treatments, FAQ and booking. */
export function LocationPage({ location }: { location: Location }) {
  const site = getSite();
  const home = getHomePage();
  const doctors = getDoctorsForLocation(location);
  const doctor = doctors[0];
  const machines = getMachines().filter((m) => (location.isPrimary ? m.location === "pune" : m.location === "ahmedabad"));
  const whatsappHref = whatsappUrl(location.whatsapp ?? site.whatsapp, site.whatsappPrefill);
  const phone = location.phone ?? site.phone;
  const place = location.area === location.city ? location.city : `${location.area}, ${location.city}`;
  const crumbs: Crumb[] = [
    { name: "Home", path: routes.home },
    { name: `Dermatologist in ${location.area}`, path: routes.location(location.slug) },
  ];

  return (
    <>
      <JsonLd
        data={[
          medicalClinicJsonLd({ location, site, doctors, treatments: getTreatments() }),
          ...(location.faqs.length ? [faqPageJsonLd(location.faqs)] : []),
          breadcrumbJsonLd(crumbs),
        ]}
      />
      <PageHero
        crumbs={crumbs}
        eyebrow={`${site.category} · ${place}`}
        title={location.heroTitle}
        description={location.intro[0]}
        image={location.heroImage}
        actions={
          <>
            <Button href={routes.book} variant="light" icon="arrow-right">
              Book Consultation
            </Button>
            <Button href={telUrl(phone)} variant="outline" icon="none">
              Call {formatPhone(phone)}
            </Button>
          </>
        }
        footer={
          location.nearbyAreas.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 text-xs text-white/80">
              <span>Also serving:</span>
              {location.nearbyAreas.map((area) => (
                <Chip key={area} tone="dark">
                  {area}
                </Chip>
              ))}
            </div>
          )
        }
      />
      <LocationDetails eyebrow="Visit The Clinic" title={`Skin Essence, ${place}`} location={location} site={site} tone="white" />
      {location.intro.length > 1 && <ProseSection id="about-clinic" eyebrow="About This Clinic" title={`Skin, Hair, Laser And Cosmetic Care In ${location.area}`} paragraphs={location.intro.slice(1)} tone="muted" />}
      {doctor && <DoctorIntro eyebrow="Your Dermatologist" title={`${doctor.name}, ${doctor.qualifications.join(", ")}`} doctor={doctor} image={doctor.photo} stats={site.stats} tone="white" />}
      <MachinesGrid id="machines" eyebrow="Technology" title={`Machines At Our ${location.city} Clinic`} machines={machines} showClinic={false} tone="muted" />
      <FeaturedTreatments
        eyebrow="Treatments"
        title={location.isPrimary ? `Treatments In ${location.area}` : "Skin Essence Treatments"}
        tiles={getFeaturedTiles()}
        categories={getCategories()}
        tone="white"
        action={
          <Button href={routes.treatments} variant="primary" icon="arrow-right">
            All Treatments
          </Button>
        }
      />
      {location.faqs.length > 0 && <FaqSection eyebrow="Helpful Answers" title={`Visiting Skin Essence In ${location.area}`} groups={[{ category: "FAQ", items: location.faqs }]} tone="muted" />}
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
