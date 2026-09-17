import Image from "next/image";
import type { Technology } from "@/content/schema";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionCard } from "@/components/ui/SectionCard";

type Props = { id?: string; eyebrow: string; title: string; description: string; items: Technology[]; disclaimer?: string };

function Tile({ item }: { item: Technology }) {
  return (
    <figure className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-surface-3 lg:aspect-auto lg:h-full">
      <Image
        src={item.image.src}
        alt={item.image.alt}
        width={item.image.width}
        height={item.image.height}
        loading="lazy"
        sizes="(min-width: 1024px) 25vw, 50vw"
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
      />
      <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent p-4 text-white">
        <span className="block text-sm font-semibold">{item.name}</span>
        <span className="mt-0.5 hidden text-xs text-white/90 md:block">{item.description}</span>
      </figcaption>
    </figure>
  );
}

/**
 * Technology grid: a teal text card two columns wide, then one tile per
 * machine. Four columns on desktop (text card + 2 tiles, then 4 tiles), two
 * columns below that. Tiles come from content/technology.json.
 */
export function TechMosaic({ id = "technology", eyebrow, title, description, items, disclaimer }: Props) {
  return (
    <SectionCard id={id} headingId={`${id}-heading`} tone="muted">
      <Container>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:auto-rows-[224px] xl:auto-rows-[248px]">
          <div className="col-span-2 flex flex-col justify-center rounded-2xl bg-brand-700 p-6 text-white md:p-8 lg:h-full">
            <Eyebrow tone="light">{eyebrow}</Eyebrow>
            <h2 id={`${id}-heading`} className="mt-3 text-xl font-medium leading-snug md:text-2xl">
              {title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/90 lg:line-clamp-3">{description}</p>
          </div>
          {items.map((item) => (
            <Tile key={item.name} item={item} />
          ))}
        </div>
        {disclaimer && <p className="mt-4 text-xs text-muted">{disclaimer}</p>}
      </Container>
    </SectionCard>
  );
}
