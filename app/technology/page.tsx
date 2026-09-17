import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { FaqSection } from "@/components/sections/FaqSection";
import { LeadFormSection } from "@/components/sections/LeadFormSection";
import { LocationsSection } from "@/components/sections/LocationsSection";
import { MachinesGrid } from "@/components/sections/MachinesGrid";
import { PageHero } from "@/components/sections/PageHero";
import { Button } from "@/components/ui/Button";
import { getFaqGroups, getHomePage, getLeadOptions, getLocations, getMachines, getPrimaryLocation, getSite } from "@/lib/content";
import { routes, whatsappUrl } from "@/lib/links";
import { breadcrumbJsonLd, type Crumb } from "@/lib/schema-org";
import { absoluteUrl, buildMetadata } from "@/lib/seo";

const crumbs: Crumb[] = [
  { name: "Home", path: routes.home },
  { name: "Technology", path: routes.technology },
];

export const metadata: Metadata = buildMetadata({
  title: "Dermatology Lasers & Machines in Kalyani Nagar, Pune | Skin Essence",
  description:
    "The lasers, hydrodermabrasion and skin systems used at Skin Essence in Kalyani Nagar, Pune and Ahmedabad, each explained in detail. Book a consultation.",
  path: routes.technology,
});

export default function TechnologyIndexPage() {
  const site = getSite();
  const home = getHomePage();
  const location = getPrimaryLocation();
  const machines = getMachines();
  const pune = machines.filter((m) => m.location === "pune");
  const ahmedabad = machines.filter((m) => m.location === "ahmedabad");
  const faqGroups = getFaqGroups().filter((g) => g.category === "Treatment & Safety");
  const whatsappHref = whatsappUrl(site.whatsapp, site.whatsappPrefill);
  const heroImage = pune[0]?.image ?? machines[0]?.image;

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd(crumbs),
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Machines at Skin Essence",
            itemListElement: machines.map((m, i) => ({ "@type": "ListItem", position: i + 1, name: m.name, url: absoluteUrl(routes.machine(m.slug)) })),
          },
        ]}
      />
      <PageHero
        crumbs={crumbs}
        eyebrow={`Advanced Technology · ${site.positioning}`}
        title="The Machines Behind Our Treatments"
        description="Every laser and skin system at Skin Essence, what it does, what it treats and which treatments run on it. All are operated under Dr. Daksha Patel's supervision, with settings chosen for Indian skin."
        image={heroImage}
        actions={
          <>
            <Button href={routes.book} variant="light" icon="arrow-right">
              Book Consultation
            </Button>
            <Button href={routes.treatments} variant="outline" icon="arrow-up-right">
              See Treatments
            </Button>
          </>
        }
      />
      <MachinesGrid id="pune" eyebrow="Kalyani Nagar, Pune" title="At Our Pune Clinic" machines={pune} showClinic={false} tone="white" />
      <MachinesGrid id="ahmedabad" eyebrow="Ahmedabad" title="At Our Ahmedabad Clinic" machines={ahmedabad} showClinic={false} tone="muted" />
      <FaqSection eyebrow="Helpful Answers" title="Questions About Lasers And Safety" groups={faqGroups} tone={ahmedabad.length ? "white" : "muted"} />
      <LocationsSection eyebrow="Visit Skin Essence" title="Our Clinics" locations={getLocations()} site={site} />
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
