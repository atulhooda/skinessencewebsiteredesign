import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { DoctorIntro } from "@/components/sections/DoctorIntro";
import { LeadFormSection } from "@/components/sections/LeadFormSection";
import { ListsSection } from "@/components/sections/ListsSection";
import { LocationsSection } from "@/components/sections/LocationsSection";
import { PageHero } from "@/components/sections/PageHero";
import { ProseSection } from "@/components/sections/ProseSection";
import { WhyPatientsStay } from "@/components/sections/WhyPatientsStay";
import { Button } from "@/components/ui/Button";
import { getAboutPage, getHomePage, getLeadOptions, getLocations, getPrimaryDoctor, getPrimaryLocation, getPrinciples, getSite } from "@/lib/content";
import { routes, whatsappUrl } from "@/lib/links";
import { breadcrumbJsonLd, type Crumb } from "@/lib/schema-org";
import { absoluteUrl, buildMetadata } from "@/lib/seo";

const crumbs: Crumb[] = [
  { name: "Home", path: routes.home },
  { name: "About", path: routes.about },
];

export const metadata: Metadata = buildMetadata({
  title: "About Skin Essence | MD Dermatologist in Kalyani Nagar, Pune",
  description: "Skin Essence is a patient-first skin, hair, laser and cosmetic clinic in Kalyani Nagar, Pune, led by Dr. Daksha Patel, MD. Book a consultation.",
  path: routes.about,
});

export default function AboutPage() {
  const site = getSite();
  const home = getHomePage();
  const about = getAboutPage();
  const doctor = getPrimaryDoctor();
  const whatsappHref = whatsappUrl(site.whatsapp, site.whatsappPrefill);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd(crumbs),
          { "@context": "https://schema.org", "@type": "AboutPage", name: `About ${site.name}`, url: absoluteUrl(routes.about), description: site.description, inLanguage: "en-IN" },
        ]}
      />
      <PageHero
        crumbs={crumbs}
        eyebrow={`About ${site.name} · ${site.tagline}`}
        title={about.understanding.title}
        description={site.description}
        image={{ src: "/images/doctor/consultation.webp", alt: `${doctor.name} in consultation at Skin Essence`, width: 1200, height: 900 }}
        actions={
          <>
            <Button href={routes.book} variant="light" icon="arrow-right">
              Book Consultation
            </Button>
            <Button href={routes.treatments} variant="outline" icon="arrow-up-right">
              Explore Treatments
            </Button>
          </>
        }
      />
      <ProseSection
        id="understanding"
        eyebrow="Who We Are"
        title="A Clinic Built Around Listening"
        paragraphs={about.understanding.paragraphs}
        aside={
          <div className="rounded-3xl bg-brand-800 p-6 text-white md:p-8">
            <h3 className="text-lg font-semibold">{about.vision.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/90">{about.vision.text}</p>
          </div>
        }
      />
      <ListsSection
        id="approach"
        eyebrow={about.approach.title}
        title="Patient-First, Never One-Size-Fits-All"
        lists={[
          { heading: "What we focus on", items: about.approach.focus, marker: "check" },
          { heading: "What we offer", items: about.services, marker: "dot" },
        ]}
        tone="muted"
      />
      <WhyPatientsStay eyebrow={home.whyChoose.eyebrow} title={about.whyChoose.title} image={home.whyChoose.image} principles={getPrinciples()} tone="white" />
      <DoctorIntro eyebrow="Know Your Doctor" title={doctor.subheading ?? doctor.title} doctor={doctor} image={doctor.photo} stats={site.stats} tone="muted" />
      <LocationsSection eyebrow={home.locations.eyebrow} title={home.locations.title} locations={getLocations()} site={site} />
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
