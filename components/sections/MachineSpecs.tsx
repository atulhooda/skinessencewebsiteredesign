import type { Machine } from "@/content/schema";
import { Container } from "@/components/ui/Container";
import { SectionCard } from "@/components/ui/SectionCard";

/** Key facts from the manufacturer's brochure, as a compact card grid under the hero. */
export function MachineSpecs({ machine }: { machine: Machine }) {
  if (!machine.specs.length) return null;
  const cols = machine.specs.length >= 8 ? "md:grid-cols-4" : machine.specs.length >= 6 ? "md:grid-cols-3" : "md:grid-cols-2";
  return (
    <SectionCard id="specs" headingId="specs-heading" tone="muted" padding="compact">
      <Container size="wide">
        <h2 id="specs-heading" className="sr-only">
          {machine.shortName} specifications
        </h2>
        <dl className={`grid grid-cols-2 gap-3 ${cols}`}>
          {machine.specs.map((spec) => (
            <div key={spec.label} className="rounded-2xl border border-brand-100 bg-white p-4 md:p-5">
              <dt className="text-xs text-muted">{spec.label}</dt>
              <dd className="mt-1.5 text-sm font-medium leading-snug">{spec.value}</dd>
            </div>
          ))}
        </dl>
        {machine.sources.length > 0 && <p className="mt-3 text-xs text-muted">Source: {machine.sources.join("; ")}.</p>}
      </Container>
    </SectionCard>
  );
}
