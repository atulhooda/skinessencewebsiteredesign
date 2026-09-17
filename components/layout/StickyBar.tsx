import { getSite } from "@/lib/content";
import { routes, telUrl, whatsappUrl } from "@/lib/links";
import { CalendarIcon, PhoneIcon, WhatsAppIcon } from "@/components/ui/icons";

/** Mobile-only bottom bar: Call | WhatsApp | Book. Hidden from md up. */
export function StickyBar() {
  const site = getSite();
  const item = "flex items-center justify-center gap-2 rounded-full py-3 text-xs font-medium transition-colors";
  return (
    <nav
      aria-label="Quick actions"
      className="fixed inset-x-0 bottom-0 z-30 px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] md:hidden"
    >
      <ul className="grid grid-cols-3 gap-1 rounded-full bg-ink/95 p-1.5 text-white shadow-float backdrop-blur">
        <li>
          <a href={telUrl(site.phone)} className={`${item} hover:bg-white/10`}>
            <PhoneIcon className="size-4" /> Call
          </a>
        </li>
        <li>
          <a
            href={whatsappUrl(site.whatsapp, site.whatsappPrefill)}
            target="_blank"
            rel="noopener noreferrer"
            className={`${item} hover:bg-white/10`}
          >
            <WhatsAppIcon className="size-4" /> WhatsApp
          </a>
        </li>
        <li>
          <a href={routes.book} className={`${item} bg-brand-600 hover:bg-brand-700`}>
            <CalendarIcon className="size-4" /> Book
          </a>
        </li>
      </ul>
    </nav>
  );
}
