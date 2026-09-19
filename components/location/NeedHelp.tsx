import type { LocationConfig } from "@/lib/location-config";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionCard } from "@/components/ui/SectionCard";
import { PhoneIcon, WhatsAppIcon } from "@/components/ui/icons";

const action =
  "inline-flex min-h-14 flex-1 items-center justify-center gap-2.5 rounded-full px-6 py-4 text-base font-medium transition-colors duration-200 sm:flex-none sm:min-w-56";

/**
 * Last resort for anyone standing in the lobby. It also carries `id="book"`,
 * which is where the site-wide mobile bar's Book button points.
 */
export function NeedHelp({ config }: { config: LocationConfig }) {
  return (
    <SectionCard id="book" headingId="help-heading" tone="white">
      <Container size="narrow" className="text-center">
        <Eyebrow className="justify-center">Need help?</Eyebrow>
        <h2 id="help-heading" className="mt-4 text-2xl font-medium leading-[1.12] sm:text-3xl md:text-4xl">
          {config.help.title}
        </h2>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-muted">{config.help.description}</p>
        <div className="mx-auto mt-8 flex max-w-lg flex-col gap-3 sm:flex-row sm:justify-center">
          {config.telHref && (
            <a href={config.telHref} className={`${action} bg-brand-600 text-white shadow-pill hover:bg-brand-700`}>
              <PhoneIcon className="size-5 shrink-0" />
              Call {config.phoneDisplay}
            </a>
          )}
          {config.whatsappHref && (
            <a
              href={config.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className={`${action} border border-line bg-white text-ink shadow-soft hover:border-ink/25`}
            >
              <WhatsAppIcon className="size-5 shrink-0 text-brand-700" />
              WhatsApp
              <span className="sr-only">the clinic (opens in a new tab)</span>
            </a>
          )}
        </div>
      </Container>
    </SectionCard>
  );
}
