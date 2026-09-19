import Image from "next/image";
import type { HomePage, Site } from "@/content/schema";
import { routes, whatsappUrl } from "@/lib/links";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ArrowDownIcon } from "@/components/ui/icons";

/**
 * Homepage hero: teal gradient card with the doctor's photo on the right.
 * Left column: eyebrow, "MD Dermatologist…" H1 and a trust strip, vertically
 * centred. Right column: intro copy and CTAs, anchored to the bottom.
 */
export function HomeHero({ hero, site }: { hero: HomePage["hero"]; site: Site }) {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative flex min-h-[820px] overflow-hidden rounded-3xl bg-brand-800 text-white md:min-h-[680px] md:rounded-4xl lg:min-h-[740px]"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(120%_90%_at_75%_15%,#1d909a_0%,#106d76_45%,#08444a_100%)]"
      />
      <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,black_22%)] md:left-[38%] md:[mask-image:linear-gradient(to_right,transparent,black_42%)]">
        <Image
          src={hero.image.src}
          alt={hero.image.alt}
          width={hero.image.width}
          height={hero.image.height}
          priority
          fetchPriority="high"
          sizes="(min-width: 768px) 62vw, 100vw"
          className="h-full w-full object-cover object-[55%_0%] md:object-top"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-brand-900 via-brand-900/60 to-brand-900/10 md:bg-gradient-to-r md:from-brand-800 md:via-brand-800/25 md:to-transparent"
        />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-40 [background:linear-gradient(112deg,transparent_38%,rgba(255,255,255,0.14)_38.5%,transparent_39.5%),linear-gradient(112deg,transparent_52%,rgba(255,255,255,0.1)_52.5%,transparent_53.5%)]"
      />

      <Container size="wide" className="relative flex flex-1 flex-col px-5 pb-8 pt-28 md:px-10 md:pb-10 md:pt-28 lg:px-14">
        <div className="grid flex-1 content-end gap-8 md:content-stretch md:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
          <div className="flex flex-col justify-end md:justify-center">
            <Eyebrow tone="light">{hero.eyebrow}</Eyebrow>
            <h1 id="hero-heading" className="mt-5 max-w-3xl text-[2.6rem] font-medium leading-[1.02] sm:text-6xl lg:text-7xl">
              {hero.title}
            </h1>
            <ul className="mt-8 hidden flex-wrap gap-2 md:flex" aria-label="Clinic at a glance">
              {site.stats.map((stat) => (
                <li
                  key={stat.value}
                  className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm text-white/90 backdrop-blur-sm"
                >
                  <span className="font-semibold text-white">{stat.value}</span>
                  {stat.short && <span> {stat.short}</span>}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col justify-end md:max-w-md md:justify-self-end">
            <p className="text-sm leading-relaxed text-white/85 md:text-base">{hero.subtitle}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href={routes.book} variant="light" icon="arrow-right">
                {hero.primaryCta}
              </Button>
              <Button href={routes.treatments} variant="outline" icon="arrow-right">
                {hero.secondaryCta}
              </Button>
            </div>
            <a
              href={whatsappUrl(site.whatsapp, site.whatsappPrefill)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-block text-xs text-white/85 underline-offset-4 hover:text-white hover:underline"
            >
              Prefer WhatsApp? Message us directly
            </a>
          </div>
        </div>
        <p className="mt-8 hidden items-center gap-1.5 text-xs text-white/75 md:flex" aria-hidden="true">
          Scroll <ArrowDownIcon className="size-3.5" />
        </p>
      </Container>
    </section>
  );
}
