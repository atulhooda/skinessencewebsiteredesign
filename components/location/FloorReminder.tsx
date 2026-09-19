import type { LocationConfig } from "@/lib/location-config";
import { Container } from "@/components/ui/Container";
import { SectionCard } from "@/components/ui/SectionCard";
import { ElevatorIcon } from "@/components/ui/icons";

/** Last word before the lift, so nobody arrives in the lobby unsure which button to press. */
export function FloorReminder({ config }: { config: LocationConfig }) {
  const detail = [config.tower, config.unit].filter(Boolean).join(" · ");
  return (
    <SectionCard id="destination" headingId="destination-heading" tone="brand" padding="compact">
      <Container size="narrow" className="flex flex-col gap-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span
            aria-hidden="true"
            className="grid size-12 shrink-0 place-items-center rounded-full bg-white/10 ring-1 ring-white/25"
          >
            <ElevatorIcon className="size-5 text-brand-200" />
          </span>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-200">Your destination</p>
            <h2 id="destination-heading" className="mt-1 text-3xl font-medium sm:text-4xl">
              {config.floor}
            </h2>
          </div>
        </div>
        {detail && <p className="text-sm leading-relaxed text-white/75 sm:text-right">{detail}</p>}
      </Container>
    </SectionCard>
  );
}
