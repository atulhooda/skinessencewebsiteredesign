import type { Metadata } from "next";
import Image from "next/image";
import { JsonLd } from "@/components/seo/JsonLd";
import { DoctorIntro } from "@/components/sections/DoctorIntro";
import { FeaturedTreatments } from "@/components/sections/FeaturedTreatments";
import { LeadFormSection } from "@/components/sections/LeadFormSection";
import { ListsSection } from "@/components/sections/ListsSection";
import { LocationsSection } from "@/components/sections/LocationsSection";
import { PageHero } from "@/components/sections/PageHero";
import { ProseSection } from "@/components/sections/ProseSection";
import { WhyPatientsStay } from "@/components/sections/WhyPatientsStay";
import { Button } from "@/components/ui/Button";
import { getAboutPage, getCategories, getFeaturedTiles, getHomePage, getLeadOptions, getLocations, getPrimaryDoctor, getPrimaryLocation, getPrinciples, getSite } from "@/lib/content";
import { routes, whatsappUrl } from "@/lib/links";
import { breadcrumbJsonLd, physicianJsonLd, type Crumb } from "@/lib/schema-org";
import { absoluteUrl, buildMetadata } from "@/lib/seo";

const crumbs: Crumb[] = [
  { name: "Home", path: routes.home },
  { name: "About", path: routes.about },
];

export function generateMetadata(): Metadata {
  const about = getAboutPage();
  return buildMetadata({ title: about.metaTitle, description: about.metaDescription, path: routes.about });
}

/**
 * About the clinic and its doctor on one page. Dr. Patel's profile is the #doctor section
 * (`profileOnAbout` in her content file), so every "Know Your Doctor" link lands there.
 */
export default function AboutPage() {
  const site = getSite();
  const home = getHomePage();
  const about = getAboutPage();
  const doctor = getPrimaryDoctor();
  const primary = getPrimaryLocation();
  const whatsappHref = whatsappUrl(site.whatsapp, site.whatsappPrefill);
  const doctorShortName = doctor.name.replace(/^(Dr\.?\s+)\S+\s+/, "$1");
  const storyImage = about.understanding.image;

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd(crumbs),
          {
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: about.heroTitle,
            url: absoluteUrl(routes.about),
            description: about.metaDescription,
            inLanguage: "en-IN",
            mainEntity: { "@id": `${absoluteUrl(routes.about)}#physician` },
          },
          physicianJsonLd(doctor, site, primary),
        ]}
      />
      <PageHero
        crumbs={crumbs}
        eyebrow={`About ${site.name} · ${site.tagline}`}
        title={about.heroTitle}
        description={site.description}
        image={about.heroImage}
        actions={
          <>
            <Button href={routes.book} variant="light" icon="arrow-right">
              Book Consultation
            </Button>
            <Button href="#doctor" variant="outline" icon="arrow-up-right">
              Meet {doctorShortName}
            </Button>
          </>
        }
      />
      <ProseSection
        id="understanding"
        eyebrow="Who We Are"
        title={about.understanding.title}
        paragraphs={about.understanding.paragraphs}
        aside={
          <div className="space-y-4">
            <div className="rounded-3xl bg-brand-800 p-6 text-white md:p-8">
              <h3 className="text-lg font-semibold">{about.vision.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/90">{about.vision.text}</p>
            </div>
            {storyImage && (
              <div className="relative aspect-[5/4] overflow-hidden rounded-3xl bg-surface-3">
                <Image
                  src={storyImage.src}
                  alt={storyImage.alt}
                  width={storyImage.width}
                  height={storyImage.height}
                  loading="lazy"
                  sizes="(min-width: 1024px) 32vw, 90vw"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            )}
          </div>
        }
      />
      <DoctorIntro
        eyebrow={doctor.subheading ?? "Know Your Doctor"}
        title={`${doctor.name}, ${doctor.qualifications.join(", ")}`}
        doctor={doctor}
        image={doctor.photo}
        stats={site.stats}
        fullBio
        tone="muted"
        action={
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={routes.book} variant="primary" icon="arrow-right">
              Book A Consultation
            </Button>
            <Button href={whatsappHref} variant="light" icon="arrow-up-right">
              Ask On WhatsApp
            </Button>
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
        tone="white"
      />
      <WhyPatientsStay eyebrow={home.whyChoose.eyebrow} title={about.whyChoose.title} image={home.whyChoose.image} principles={getPrinciples()} tone="muted" />
      <FeaturedTreatments
        eyebrow="Treatments"
        title={`What ${doctor.name} Treats`}
        tiles={getFeaturedTiles()}
        categories={getCategories()}
        tone="white"
        action={
          <Button href={routes.treatments} variant="primary" icon="arrow-right">
            All Treatments
          </Button>
        }
      />
      <LocationsSection eyebrow={home.locations.eyebrow} title={home.locations.title} locations={getLocations()} site={site} tone="muted" />
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
