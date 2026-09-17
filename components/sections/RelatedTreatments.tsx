import type { Treatment, TreatmentCategory } from "@/content/schema";
import { routes } from "@/lib/links";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionCard } from "@/components/ui/SectionCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TreatmentCard } from "./TreatmentCard";

type Props = { id?: string; eyebrow: string; title: string; treatments: Treatment[]; categories: TreatmentCategory[]; tone?: "white" | "muted" };

export function RelatedTreatments({ id = "related-treatments", eyebrow, title, treatments, categories, tone = "muted" }: Props) {
  if (!treatments.length) return null;
  const categoryName = (slug: string) => categories.find((c) => c.slug === slug)?.name;
  return (
    <SectionCard id={id} headingId={`${id}-heading`} tone={tone}>
      <Container>
        <SectionHeading
          id={`${id}-heading`}
          eyebrow={eyebrow}
          title={title}
          align="left"
          size="md"
          action={
            <Button href={routes.treatments} variant="light" icon="arrow-up-right" size="sm">
              All Treatments
            </Button>
          }
        />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {treatments.map((t) => (
            <li key={t.slug}>
              <TreatmentCard treatment={t} categoryName={categoryName(t.category)} />
            </li>
          ))}
        </ul>
      </Container>
    </SectionCard>
  );
}
