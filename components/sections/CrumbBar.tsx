import type { Crumb } from "@/lib/schema-org";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";

/**
 * Slim dark bar for a page that leads with its content instead of a hero.
 *
 * The site header is overlaid on the first card in white, so that card has to
 * be dark or the logo and navigation disappear. This keeps the trail and the
 * page's label, and hands the rest of the screen to the content.
 */
export function CrumbBar({ crumbs, label }: { crumbs: Crumb[]; label?: string }) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-brand-800 text-white md:rounded-4xl">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(120%_180%_at_80%_0%,#1d909a_0%,#106d76_45%,#08444a_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-40 [background:linear-gradient(112deg,transparent_58%,rgba(255,255,255,0.12)_58.5%,transparent_59.5%)]"
      />
      <Container size="wide" className="relative px-5 pb-7 pt-24 md:px-10 md:pb-8 md:pt-28 lg:px-14">
        <Breadcrumbs items={crumbs} />
        {label && <Eyebrow tone="light" className="mt-3">{label}</Eyebrow>}
      </Container>
    </div>
  );
}
