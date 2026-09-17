import type { ReactNode } from "react";
import type { Machine } from "@/content/schema";
import { Container } from "@/components/ui/Container";
import { SectionCard } from "@/components/ui/SectionCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MachineCard } from "./MachineCard";

type Props = { id: string; eyebrow: string; title: string; description?: string; machines: Machine[]; action?: ReactNode; tone?: "white" | "muted"; showClinic?: boolean };

/** Grid of machine cards. Used on the technology index (per clinic) and on treatment pages ("equipment used"). */
export function MachinesGrid({ id, eyebrow, title, description, machines, action, tone = "white", showClinic = true }: Props) {
  if (!machines.length) return null;
  const cols = machines.length === 2 || machines.length === 4 ? "lg:grid-cols-2" : "lg:grid-cols-3";
  return (
    <SectionCard id={id} headingId={`${id}-heading`} tone={tone}>
      <Container>
        <SectionHeading id={`${id}-heading`} eyebrow={eyebrow} title={title} description={description} action={action} align="left" size="md" />
        <ul className={`mt-10 grid gap-4 sm:grid-cols-2 ${cols}`}>
          {machines.map((m) => (
            <li key={m.slug}>
              <MachineCard machine={m} showClinic={showClinic} />
            </li>
          ))}
        </ul>
      </Container>
    </SectionCard>
  );
}
