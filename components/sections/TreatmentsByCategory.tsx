import type { ReactNode } from "react";
import type { CategoryWithTreatments } from "@/lib/content-core";
import { Container } from "@/components/ui/Container";
import { SectionCard } from "@/components/ui/SectionCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TreatmentTile } from "./TreatmentTile";

type Props = { id?: string; eyebrow: string; title: ReactNode; categories: CategoryWithTreatments[]; action?: ReactNode; tone?: "white" | "muted" };

/** Treatments index: every treatment as a named rectangle, grouped under its category (anchored by category slug). */
export function TreatmentsByCategory({ id = "all-treatments", eyebrow, title, categories, action, tone = "muted" }: Props) {
  return (
    <SectionCard id={id} headingId={`${id}-heading`} tone={tone}>
      <Container>
        <SectionHeading id={`${id}-heading`} eyebrow={eyebrow} title={title} action={action} size="lg" />
        <div className="mt-12 space-y-12 md:mt-16">
          {categories.map((category) => (
            <div key={category.slug} id={category.slug} className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,2.4fr)] md:gap-10">
              <div className="border-l-4 border-brand-600 pl-5">
                <h3 className="text-xl font-semibold text-brand-900 md:text-2xl">{category.name}</h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted">{category.shortDesc}</p>
              </div>
              <ul className="grid gap-3 sm:grid-cols-2">
                {category.treatments.map((treatment) => (
                  <li key={treatment.slug}>
                    <TreatmentTile treatment={treatment} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </SectionCard>
  );
}
