import type { ReactNode } from "react";
import type { TreatmentCategory } from "@/content/schema";
import type { FeaturedTile } from "@/lib/content-core";
import { Container } from "@/components/ui/Container";
import { SectionCard } from "@/components/ui/SectionCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TreatmentTile } from "./TreatmentTile";

type Props = {
  id?: string;
  eyebrow: string;
  title: ReactNode;
  tiles: FeaturedTile[];
  categories: TreatmentCategory[];
  action?: ReactNode;
  tone?: "white" | "muted";
};

/** Homepage services: named rectangles with a small image header, three across on desktop. */
export function FeaturedTreatments({ id = "treatments", eyebrow, title, tiles, categories, action, tone = "white" }: Props) {
  const categoryName = (slug: string) => categories.find((c) => c.slug === slug)?.name;
  return (
    <SectionCard id={id} headingId={`${id}-heading`} tone={tone}>
      <Container>
        <SectionHeading id={`${id}-heading`} eyebrow={eyebrow} title={title} action={action} size="lg" />
        <ul className="mt-10 grid grid-cols-2 gap-3 md:mt-16 lg:grid-cols-3">
          {tiles.map((tile) => (
            <li key={tile.href + tile.name}>
              <TreatmentTile treatment={tile.treatment} name={tile.name} href={tile.href} image={tile.image} subline={tile.subline} label={categoryName(tile.treatment.category)} withImage />
            </li>
          ))}
        </ul>
      </Container>
    </SectionCard>
  );
}
