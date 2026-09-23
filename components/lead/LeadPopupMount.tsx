import { getLeadOptions, getLocations, getPopup, getPrimaryLocation, getSite } from "@/lib/content";
import { routes, whatsappUrl } from "@/lib/links";
import { LeadPopup } from "./LeadPopup";

/**
 * Server wrapper for the entry popup: reads the content and the clinic's own
 * details, then hands them to the client dialog. Renders nothing at all when
 * content/pages/popup.json has `enabled: false`, so switching it off ships no
 * dialog code to the browser.
 */
export function LeadPopupMount() {
  const popup = getPopup();
  if (!popup.enabled) return null;
  const site = getSite();
  return (
    <LeadPopup
      popup={popup}
      options={getLeadOptions()}
      locations={getLocations().map((l) => ({ value: l.slug, label: l.city }))}
      defaultLocation={getPrimaryLocation().slug}
      whatsappHref={whatsappUrl(site.whatsapp, site.whatsappPrefill)}
      privacyHref={routes.privacy}
    />
  );
}
