import { getConcerns, getLocations, getPrimaryDoctor, getSite, getTreatmentsByCategory } from "@/lib/content";
import { formatPhone, routes, telUrl, whatsappUrl } from "@/lib/links";
import { HeaderNav } from "./HeaderNav";
import type { NavData } from "./nav-data";

/** Server wrapper: builds the nav model from content and hands it to the client header. */
export function Header() {
  const site = getSite();
  const doctor = getPrimaryDoctor();
  const nav: NavData = {
    brand: site.name,
    logo: site.logo,
    logoMono: site.logoMono,
    primary: [
      { label: "Treatments", href: routes.treatments },
      { label: "About", href: routes.about },
      { label: doctor.name, href: routes.doctorProfile(doctor.slug) },
      { label: "Blog", href: routes.blog },
      { label: "Contact", href: routes.contact },
    ],
    categories: getTreatmentsByCategory().map((c) => ({
      name: c.name,
      slug: c.slug,
      treatments: c.treatments.map((t) => ({ label: t.name, href: routes.treatment(t.slug) })),
    })),
    concerns: getConcerns().map((c) => ({ label: c.name, href: routes.concern(c.slug) })),
    locations: getLocations().map((l) => ({ label: `${l.area}${l.area !== l.city ? `, ${l.city}` : ""}`, href: routes.location(l.slug) })),
    phoneDisplay: formatPhone(site.phone),
    phoneHref: telUrl(site.phone),
    whatsappHref: whatsappUrl(site.whatsapp, site.whatsappPrefill),
    email: site.email,
    positioning: site.positioning,
  };
  return <HeaderNav nav={nav} />;
}
