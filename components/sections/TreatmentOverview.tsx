import type { Treatment } from "@/content/schema";
import { routes } from "@/lib/links";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { CheckIcon } from "@/components/ui/icons";
import { SectionCard } from "@/components/ui/SectionCard";

/** Overview paragraphs with a sticky "Is it right for you?" aside and sub-treatment chips. */
export function TreatmentOverview({ treatment, whatsappHref }: { treatment: Treatment; whatsappHref: string }) {
  return (
    <SectionCard id="overview" headingId="overview-heading" tone="white">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <Eyebrow>Overview</Eyebrow>
            <h2 id="overview-heading" className="mt-4 text-2xl font-medium leading-[1.15] sm:text-3xl md:text-4xl">
              About {treatment.name} At Skin Essence
            </h2>
            <div className="mt-6 space-y-5 text-base leading-relaxed text-ink-2 md:text-lg">
              {treatment.intro.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>
            {treatment.subTreatmentGroups.length > 0 && (
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                {treatment.subTreatmentGroups.map((group) => (
                  <div key={group.label}>
                    <p className="text-xs font-medium text-ink-2">{group.label}</p>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {group.items.map((item) => (
                        <li key={item}>
                          <Chip>{item}</Chip>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
            {treatment.subTreatmentGroups.length === 0 && treatment.subTreatments.length > 0 && (
              <div className="mt-8">
                <p className="text-xs font-medium text-ink-2">Options &amp; areas</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {treatment.subTreatments.map((item) => (
                    <li key={item}>
                      <Chip>{item}</Chip>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <aside className="self-start rounded-3xl bg-surface-2 p-6 md:p-8 lg:sticky lg:top-6" aria-labelledby="who-heading">
            <h3 id="who-heading" className="text-lg font-semibold">
              Is it right for you?
            </h3>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-ink-2">
              {treatment.whoIsItFor.map((item) => (
                <li key={item} className="flex gap-3">
                  <CheckIcon className="mt-1 size-4 shrink-0 text-brand-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Button href={routes.book} variant="primary" icon="arrow-right" className="mt-6">
              Book A Consultation
            </Button>
            <p className="mt-3 text-xs text-muted">
              Not sure?{" "}
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="font-medium text-brand-700 underline-offset-2 hover:underline">
                WhatsApp a photo and your question
              </a>
              .
            </p>
          </aside>
        </div>
      </Container>
    </SectionCard>
  );
}
