import Image from "next/image";
import type { Technology } from "@/content/schema";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionCard } from "@/components/ui/SectionCard";

type Props = { id?: string; eyebrow: string; title: string; description: string; items: Technology[] };

function Tile({ item }: { item: Technology }) {
  return (
    <figure className="group relative aspect-square overflow-hidden rounded-2xl md:aspect-[4/3]">
      <Image
        src={item.image.src}
        alt={item.image.alt}
        width={item.image.width}
        height={item.image.height}
        loading="lazy"
        sizes="(min-width: 768px) 30vw, 50vw"
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
      />
      <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 text-white">
        <span className="block text-sm font-medium">{item.name}</span>
        <span className="mt-0.5 hidden text-xs text-white/90 md:block">{item.description}</span>
      </figcaption>
    </figure>
  );
}

/** 3×2 image mosaic with a teal text tile in the middle of the second row. */
export function TechMosaic({ id = "technology", eyebrow, title, description, items }: Props) {
  const [a, b, c, d, e] = items;
  return (
    <SectionCard id={id} headingId={`${id}-heading`} tone="muted">
      <Container>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {a && <Tile item={a} />}
          {b && <Tile item={b} />}
          {c && <Tile item={c} />}
          {d && <Tile item={d} />}
          <div className="col-span-2 flex flex-col justify-center rounded-2xl bg-brand-700 p-6 text-center text-white md:col-span-1 md:aspect-[4/3] md:p-7">
            <Eyebrow tone="light" className="justify-center">
              {eyebrow}
            </Eyebrow>
            <h2 id={`${id}-heading`} className="mt-3 text-xl font-medium leading-snug md:text-2xl">
              {title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/90">{description}</p>
          </div>
          {e && <Tile item={e} />}
        </div>
      </Container>
    </SectionCard>
  );
}
