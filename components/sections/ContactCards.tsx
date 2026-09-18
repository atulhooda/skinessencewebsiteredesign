import type { Site } from "@/content/schema";
import { formatPhone, mailtoUrl, telUrl, whatsappUrl } from "@/lib/links";
import { Container } from "@/components/ui/Container";
import { MailIcon, PhoneIcon, WhatsAppIcon } from "@/components/ui/icons";
import { SectionCard } from "@/components/ui/SectionCard";

/** Call, WhatsApp and email cards for the contact page. */
export function ContactCards({ site }: { site: Site }) {
  const cards = [
    { label: "Call us", value: formatPhone(site.phone), note: "Speak to the front desk during clinic hours.", href: telUrl(site.phone), Icon: PhoneIcon, external: false },
    { label: "WhatsApp", value: "Message the clinic", note: "Send a photo and your question; we reply during clinic hours.", href: whatsappUrl(site.whatsapp, site.whatsappPrefill), Icon: WhatsAppIcon, external: true },
    { label: "Email", value: site.email, note: "For reports, records and general enquiries.", href: mailtoUrl(site.email), Icon: MailIcon, external: false },
  ];
  return (
    <SectionCard id="reach-us" headingId="reach-us-heading" tone="muted" padding="compact">
      <Container size="wide">
        <h2 id="reach-us-heading" className="sr-only">
          Ways to reach Skin Essence
        </h2>
        <ul className="grid gap-3 md:grid-cols-3">
          {cards.map(({ label, value, note, href, Icon, external }) => (
            <li key={label}>
              <a
                href={href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="group flex h-full gap-4 rounded-2xl border border-brand-100 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-brand-400 hover:shadow-soft md:p-6"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-700 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                  <Icon className="size-5" />
                </span>
                <span>
                  <span className="block text-xs text-muted">{label}</span>
                  <span className="mt-0.5 block break-all text-base font-semibold text-ink">{value}</span>
                  <span className="mt-1 block text-xs leading-relaxed text-muted">{note}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </SectionCard>
  );
}
