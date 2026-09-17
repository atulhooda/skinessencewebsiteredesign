import Image from "next/image";
import Link from "next/link";
import { getConcerns, getLocations, getPrimaryDoctor, getPrimaryLocation, getSite, getTreatments } from "@/lib/content";
import { closedDays, groupHours } from "@/lib/format";
import { formatPhone, mailtoUrl, routes, telUrl, whatsappUrl } from "@/lib/links";
import { Button } from "@/components/ui/Button";
import { MailIcon, PhoneIcon, WhatsAppIcon } from "@/components/ui/icons";

function FooterList({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h2 className="text-xs font-semibold uppercase tracking-wide text-brand-300">{title}</h2>
      <ul className="mt-4 space-y-2 text-sm text-white/75">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="transition-colors hover:text-white">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Dark footer card with the full treatment + concern link list, NAP, hours and socials. */
export function Footer() {
  const site = getSite();
  const doctor = getPrimaryDoctor();
  const primary = getPrimaryLocation();
  const treatments = getTreatments().map((t) => ({ label: t.name, href: routes.treatment(t.slug) }));
  const concerns = getConcerns().map((c) => ({ label: c.name, href: routes.concern(c.slug) }));
  const locations = getLocations();
  const year = new Date().getFullYear();
  const hoursRows = primary.hours ? groupHours(primary.hours) : [];
  const closed = primary.hours ? closedDays(primary.hours) : [];

  return (
    <footer className="mt-3 mb-3 rounded-3xl bg-brand-950 px-5 py-12 text-white md:mt-5 md:mb-5 md:rounded-4xl md:px-12 md:py-16 lg:px-16">
      <div className="mx-auto max-w-[1280px]">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,2fr)] lg:gap-16">
          <div>
            <div className="flex items-center gap-3">
              <Image src={site.logo.src} alt="" width={site.logo.width} height={site.logo.height} loading="lazy" className="h-16 w-auto" sizes="64px" />
              <div>
                <p className="text-2xl font-semibold tracking-tight">{site.name}</p>
                <p className="text-sm text-brand-200">{site.tagline}</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-white/80">{site.positioning}</p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">{site.description}</p>
            <Button href={routes.book} variant="primary" icon="arrow-right" className="mt-7">
              Book Consultation
            </Button>
            <ul className="mt-8 space-y-3 text-sm">
              <li>
                <a href={telUrl(site.phone)} className="inline-flex items-center gap-2.5 hover:text-brand-200">
                  <PhoneIcon className="size-4 text-brand-300" /> {formatPhone(site.phone)}
                </a>
              </li>
              <li>
                <a
                  href={whatsappUrl(site.whatsapp, site.whatsappPrefill)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 hover:text-brand-200"
                >
                  <WhatsAppIcon className="size-4 text-brand-300" /> WhatsApp us
                </a>
              </li>
              <li>
                <a href={mailtoUrl(site.email)} className="inline-flex items-center gap-2.5 hover:text-brand-200">
                  <MailIcon className="size-4 text-brand-300" /> {site.email}
                </a>
              </li>
            </ul>
            {site.social.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-4 text-sm">
                {site.social.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-white/75 hover:text-white">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <nav aria-label="Footer" className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <FooterList title="Treatments" links={treatments} />
            <FooterList title="Concerns" links={concerns} />
            <FooterList
              title="Clinic"
              links={[
                { label: "About Skin Essence", href: routes.about },
                { label: doctor.name, href: routes.doctorProfile(doctor.slug) },
                { label: "All Treatments", href: routes.treatments },
                { label: "Blog", href: routes.blog },
                { label: "Contact", href: routes.contact },
                ...locations.map((l) => ({ label: `Dermatologist in ${l.area}`, href: routes.location(l.slug) })),
              ]}
            />
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wide text-brand-300">Visit Us</h2>
              <address className="mt-4 text-sm not-italic leading-relaxed text-white/75">
                {primary.addressLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
              <h3 className="mt-6 text-xs font-semibold uppercase tracking-wide text-brand-300">Hours</h3>
              {hoursRows.length ? (
                <ul className="mt-3 space-y-1 text-sm text-white/75">
                  {hoursRows.map((row) => (
                    <li key={row.days}>
                      <span className="block text-white/70">{row.days}</span>
                      {row.time}
                    </li>
                  ))}
                  {closed.length > 0 && (
                    <li>
                      <span className="block text-white/70">{closed.join(", ")}</span>Closed
                    </li>
                  )}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-white/75">Opening hours to be confirmed. Call or WhatsApp for timings.</p>
              )}
              <p className="mt-6 text-xs text-white/70">Locations: {locations.map((l) => l.area).join(", ")}</p>
            </div>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-white/70 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {site.legalName}. {doctor.name}, {doctor.qualifications.join(", ")}.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <p className="max-w-xl">Information on this site is general and not a substitute for a consultation. Results vary from person to person.</p>
            <Link href={routes.privacy} className="hover:text-white">
              Privacy Policy
            </Link>
            <Link href={routes.terms} className="hover:text-white">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
