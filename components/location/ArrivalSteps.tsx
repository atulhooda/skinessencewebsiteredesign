import type { LocationConfig } from "@/lib/location-config";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionCard } from "@/components/ui/SectionCard";

/** Indoor directions: the part a map cannot give you. Four short steps, scannable at a glance. */
export function ArrivalSteps({ config }: { config: LocationConfig }) {
  return (
    <SectionCard id="how-to-reach" headingId="how-to-reach-heading" tone="white">
      <Container size="narrow">
        <Eyebrow>Inside the building</Eyebrow>
        <h2 id="how-to-reach-heading" className="mt-4 text-2xl font-medium leading-[1.12] sm:text-3xl md:text-4xl">
          How To Reach Us
        </h2>
        <ol className="mt-9 space-y-3">
          {config.steps.map((step, index) => (
            <li
              key={step.title}
              className={cn(
                "flex gap-4 rounded-2xl border p-5 sm:gap-5 sm:p-6",
                step.highlight ? "border-brand-200 bg-brand-50" : "border-line bg-surface",
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "grid size-9 shrink-0 place-items-center rounded-full text-sm font-semibold tabular-nums",
                  step.highlight ? "bg-brand-600 text-white" : "bg-surface-2 text-brand-700",
                )}
              >
                {index + 1}
              </span>
              <div className="min-w-0">
                <h3 className="text-base font-semibold sm:text-lg">
                  <span className="sr-only">{`Step ${index + 1}: `}</span>
                  {step.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{step.description}</p>
                {step.highlight && (
                  <p className="mt-3 text-2xl font-medium text-brand-800 sm:text-3xl">{config.floor}</p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </SectionCard>
  );
}
