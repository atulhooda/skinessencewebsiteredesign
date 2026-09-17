import Image from "next/image";
import type { ReactNode } from "react";
import type { Image as ImageData } from "@/content/schema";
import type { Crumb } from "@/lib/schema-org";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";

type PageHeroProps = {
  crumbs: Crumb[];
  eyebrow: string;
  title: string;
  description?: string;
  image?: ImageData;
  actions?: ReactNode;
  /** Small facts rendered under the actions, e.g. category chips. */
  footer?: ReactNode;
};

/** Inner-page hero card: breadcrumbs, eyebrow, H1, description, CTAs and an optional framed image. */
export function PageHero({ crumbs, eyebrow, title, description, image, actions, footer }: PageHeroProps) {
  return (
    <section aria-labelledby="page-heading" className="relative overflow-hidden rounded-3xl bg-brand-800 text-white md:rounded-4xl">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(110%_90%_at_80%_0%,#1d909a_0%,#106d76_45%,#08444a_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-40 [background:linear-gradient(112deg,transparent_58%,rgba(255,255,255,0.12)_58.5%,transparent_59.5%)]"
      />
      <Container size="wide" className="relative px-5 pb-10 pt-24 md:px-10 md:pb-14 md:pt-32 lg:px-14">
        <Breadcrumbs items={crumbs} />
        <div className={image ? "mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-end" : "mt-8 max-w-3xl"}>
          <div>
            <Eyebrow tone="light">{eyebrow}</Eyebrow>
            <h1 id="page-heading" className="mt-4 text-4xl font-medium leading-[1.05] sm:text-5xl md:text-6xl">
              {title}
            </h1>
            {description && <p className="mt-6 max-w-xl text-base leading-relaxed text-white/85 md:text-lg">{description}</p>}
            {actions && <div className="mt-8 flex flex-wrap gap-3">{actions}</div>}
            {footer && <div className="mt-8">{footer}</div>}
          </div>
          {image && (
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/15 shadow-float lg:aspect-[5/4]">
              <Image
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                priority
                fetchPriority="high"
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="h-full w-full object-cover"
              />
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
