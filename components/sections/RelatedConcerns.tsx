import Link from "next/link";
import type { Concern } from "@/content/schema";
import { routes } from "@/lib/links";
import { ArrowBadge } from "@/components/ui/ArrowBadge";
import { Container } from "@/components/ui/Container";
import { SectionCard } from "@/components/ui/SectionCard";
import { SectionHeading } from "@/components/ui/SectionHeading";

type Props = { id?: string; eyebrow: string; title: string; concerns: Concern[]; tone?: "white" | "muted" };

/** Cards linking to the patient-concern pages a treatment addresses. */
export function RelatedConcerns({ id = "related-concerns", eyebrow, title, concerns, tone = "white" }: Props) {
  if (!concerns.length) return null;
  return (
    <SectionCard id={id} headingId={`${id}-heading`} tone={tone}>
      <Container>
        <SectionHeading id={`${id}-heading`} eyebrow={eyebrow} title={title} align="left" size="md" />
        <ul className="mt-10 grid gap-4 md:grid-cols-2">
          {concerns.map((concern) => (
            <li key={concern.slug}>
              <article className="group relative flex h-full flex-col justify-between rounded-3xl border border-line bg-surface-2/60 p-6 transition-colors hover:border-brand-300 md:p-8">
                <div>
                  <p className="text-xs text-muted">Patient concern</p>
                  <h3 className="mt-1 text-xl font-semibold">
                    <Link href={routes.concern(concern.slug)} className="after:absolute after:inset-0">
                      {concern.name}
                    </Link>
                  </h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">{concern.intro[0]}</p>
                </div>
                <div className="mt-6 flex items-center justify-between text-sm font-medium text-brand-700">
                  <span>Causes and treatment options</span>
                  <ArrowBadge tone="dark" />
                </div>
              </article>
            </li>
          ))}
        </ul>
      </Container>
    </SectionCard>
  );
}
