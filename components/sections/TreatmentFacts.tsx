import type { Treatment } from "@/content/schema";
import { formatInr } from "@/lib/format";
import { Container } from "@/components/ui/Container";
import { CalendarIcon, ClockIcon, SparkleIcon, UsersIcon } from "@/components/ui/icons";
import { SectionCard } from "@/components/ui/SectionCard";

/** Compact key-facts strip under the treatment hero: sessions, time, downtime, results, price. */
export function TreatmentFacts({ treatment }: { treatment: Treatment }) {
  const s = treatment.sessionsAndDowntime;
  const facts = [
    { label: "Sessions", value: s.sessions, Icon: CalendarIcon },
    { label: "Session time", value: s.sessionTime, Icon: ClockIcon },
    { label: "Downtime", value: s.downtime, Icon: UsersIcon },
    { label: "Results", value: s.results, Icon: SparkleIcon },
    {
      label: "Starts from",
      value: treatment.priceFrom ? `${formatInr(treatment.priceFrom)} per session` : "Discussed at consultation",
      Icon: SparkleIcon,
    },
  ];
  return (
    <SectionCard id="facts" headingId="facts-heading" tone="muted" padding="compact">
      <Container size="wide">
        <h2 id="facts-heading" className="sr-only">
          Key facts about {treatment.name}
        </h2>
        <dl className="grid grid-cols-2 gap-3 md:grid-cols-5">
          {facts.map(({ label, value, Icon }) => (
            <div key={label} className="rounded-2xl border border-line bg-surface-2/60 p-4 md:p-5">
              <dt className="flex items-center gap-1.5 text-xs text-muted">
                <Icon className="size-3.5" /> {label}
              </dt>
              <dd className="mt-2 text-sm font-medium leading-snug md:text-[15px]">{value}</dd>
            </div>
          ))}
        </dl>
        {treatment.priceFrom && (
          <p className="mt-3 text-xs text-muted">
            Indicative starting price in INR. The exact cost depends on the area treated and the number of sessions, and is confirmed at your consultation.
          </p>
        )}
      </Container>
    </SectionCard>
  );
}
