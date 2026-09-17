import type { FaqGroup } from "@/content/schema";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionCard } from "@/components/ui/SectionCard";
import { FaqAccordion } from "./FaqAccordion";

type Props = { id?: string; eyebrow: string; title: string; groups: FaqGroup[]; tone?: "white" | "muted" };

/** Centred FAQ heading + tabbed accordion. Pair with faqPageJsonLd() on the page. */
export function FaqSection({ id = "faq", eyebrow, title, groups, tone = "white" }: Props) {
  return (
    <SectionCard id={id} headingId={`${id}-heading`} tone={tone}>
      <Container size="narrow">
        <div className="text-center">
          <Eyebrow className="justify-center">{eyebrow}</Eyebrow>
          <h2 id={`${id}-heading`} className="mx-auto mt-4 max-w-xl text-3xl font-medium leading-[1.1] sm:text-4xl">
            {title}
          </h2>
        </div>
        <FaqAccordion groups={groups} className="mt-10" />
      </Container>
    </SectionCard>
  );
}
