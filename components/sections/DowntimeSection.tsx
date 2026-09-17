import type { Treatment } from "@/content/schema";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionCard } from "@/components/ui/SectionCard";

/** Honest downtime + aftercare block. */
export function DowntimeSection({ treatment }: { treatment: Treatment }) {
  const s = treatment.sessionsAndDowntime;
  return (
    <SectionCard id="downtime" headingId="downtime-heading" tone="white">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:gap-16">
          <div>
            <Eyebrow>Downtime, Honestly</Eyebrow>
            <h2 id="downtime-heading" className="mt-4 text-2xl font-medium leading-[1.15] sm:text-3xl md:text-4xl">
              What Recovery Really Looks Like
            </h2>
            <dl className="mt-6 space-y-4 text-sm">
              <div className="rounded-2xl border border-line p-4">
                <dt className="text-xs text-muted">Downtime</dt>
                <dd className="mt-1 font-medium">{s.downtime}</dd>
              </div>
              <div className="rounded-2xl border border-line p-4">
                <dt className="text-xs text-muted">When you will see results</dt>
                <dd className="mt-1 font-medium">{s.results}</dd>
              </div>
              <div className="rounded-2xl border border-line p-4">
                <dt className="text-xs text-muted">Course</dt>
                <dd className="mt-1 font-medium">{s.sessions}</dd>
              </div>
            </dl>
          </div>
          {treatment.aftercare.length > 0 && (
            <div className="rounded-3xl bg-surface-2 p-6 md:p-8">
              <h3 className="text-lg font-semibold">Aftercare</h3>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-ink-2">
                {treatment.aftercare.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Container>
    </SectionCard>
  );
}
