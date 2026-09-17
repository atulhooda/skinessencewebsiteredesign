import Image from "next/image";
import Link from "next/link";
import type { Technology } from "@/content/schema";
import { routes } from "@/lib/links";
import { ArrowBadge } from "@/components/ui/ArrowBadge";
import { ArrowRightIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionCard } from "@/components/ui/SectionCard";

type Props = { id?: string; eyebrow: string; title: string; description: string; items: Technology[]; disclaimer?: string };

type Span = { sm: 1 | 2; lg: 1 | 2 | 4 };

/**
 * Column spans so the last row is never left with a lone tile. The grid is
 * 2 columns (text card spans both) below lg and 4 columns on lg (text card
 * spans two). Wide tiles get a wider crop and a larger `sizes` hint.
 */
function spans(count: number): Span[] {
  const cellsLg = 2 + count, cellsSm = 2 + count;
  const remLg = cellsLg % 4, remSm = cellsSm % 2;
  return Array.from({ length: count }, (_, i) => {
    const fromEnd = count - 1 - i;
    const sm: Span["sm"] = remSm === 1 && fromEnd === 0 ? 2 : 1;
    let lg: Span["lg"] = 1;
    if (remLg === 1 && fromEnd === 0) lg = 4;
    else if (remLg === 2 && fromEnd <= 1) lg = 2;
    else if (remLg === 3 && fromEnd === 0) lg = 2;
    return { sm, lg };
  });
}

function Tile({ item, span }: { item: Technology; span: Span }) {
  const sizes = span.lg === 4 ? "(min-width: 1024px) 80vw, 100vw" : span.lg === 2 ? "(min-width: 1024px) 40vw, 100vw" : "(min-width: 1024px) 25vw, 50vw";
  const className = cn(
    "group relative block overflow-hidden rounded-2xl bg-surface-3 lg:aspect-auto lg:h-full",
    span.sm === 2 ? "col-span-2 aspect-[2/1]" : "aspect-[4/3]",
    span.lg === 4 ? "lg:col-span-4" : span.lg === 2 ? "lg:col-span-2" : "lg:col-span-1",
  );
  const inner = (
    <>
      <Image
        src={item.image.src}
        alt={item.image.alt}
        width={item.image.width}
        height={item.image.height}
        loading="lazy"
        sizes={sizes}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
      />
      {item.location && (
        <span className="absolute left-3 top-3 rounded-full bg-brand-600 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow-pill">
          {item.location === "pune" ? "Kalyani Nagar, Pune" : "Ahmedabad"}
        </span>
      )}
      {item.machine && <ArrowBadge className="absolute right-3 top-3" />}
      <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/45 to-transparent px-4 pb-4 pt-16 text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.7)]">
        <span className="block text-sm font-semibold">{item.name}</span>
        <span className="mt-0.5 hidden text-xs text-white/90 md:block">{item.description}</span>
        {item.machine && <span className="mt-1 hidden text-xs font-medium text-brand-200 md:block">About this machine</span>}
      </figcaption>
    </>
  );
  return item.machine ? (
    <Link href={routes.machine(item.machine)} className={className} aria-label={`${item.name}: about this machine`}>
      {inner}
    </Link>
  ) : (
    <figure className={className}>{inner}</figure>
  );
}

/**
 * Machines grid: a teal text card two columns wide, then one tile per
 * machine (highlighted ones first). Tiles come from content/technology.json.
 */
export function TechMosaic({ id = "technology", eyebrow, title, description, items, disclaimer }: Props) {
  // Confirmed machines first (Pune, then Ahmedabad), representative stock next, rooms last.
  const rank = (i: Technology) => (i.kind === "room" ? 3 : i.location === "pune" ? 0 : i.location === "ahmedabad" ? 1 : 2);
  const ordered = [...items].sort((a, b) => rank(a) - rank(b));
  const layout = spans(ordered.length);
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
            <Link href={routes.technology} className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-white underline-offset-4 hover:underline">
              Every machine in detail <ArrowRightIcon className="size-4" />
            </Link>
          </div>
          {ordered.map((item, i) => (
            <Tile key={item.name} item={item} span={layout[i]!} />
          ))}
        </div>
        {disclaimer && <p className="mt-4 text-xs text-muted">{disclaimer}</p>}
      </Container>
    </SectionCard>
  );
}
