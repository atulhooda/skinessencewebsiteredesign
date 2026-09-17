import { Container } from "@/components/ui/Container";
import { SectionCard } from "@/components/ui/SectionCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { NumberedList } from "./NumberedList";

type Props = { id?: string; eyebrow: string; title: string; steps: { title: string; description: string }[]; tone?: "white" | "muted" };

export function HowItWorks({ id = "how-it-works", eyebrow, title, steps, tone = "muted" }: Props) {
  return (
    <SectionCard id={id} headingId={`${id}-heading`} tone={tone}>
      <Container>
        <SectionHeading id={`${id}-heading`} eyebrow={eyebrow} title={title} align="left" size="md" />
        <NumberedList items={steps} className="mt-10" />
      </Container>
    </SectionCard>
  );
}
