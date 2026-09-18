import type { Concern } from "@/content/schema";
import { routes } from "@/lib/links";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionCard } from "@/components/ui/SectionCard";

/** Concern intro with a sticky "Common causes" aside. */
export function ConcernOverview({ concern, whatsappHref }: { concern: Concern; whatsappHref: string }) {
  return (
    <SectionCard id="overview" headingId="overview-heading" tone="white">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <Eyebrow>Understanding It</Eyebrow>
            <h2 id="overview-heading" className="mt-4 text-2xl font-medium leading-[1.15] sm:text-3xl md:text-4xl">
              About {concern.name}
            </h2>
            <div className="mt-6 space-y-5 text-base leading-relaxed text-ink-2 md:text-lg">
              {concern.intro.map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
            </div>
          </div>
          <aside className="self-start rounded-3xl bg-surface-2 p-6 md:p-8 lg:sticky lg:top-6" aria-labelledby="causes-heading">
            <h3 id="causes-heading" className="text-lg font-semibold">
              Common causes
            </h3>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-ink-2">
              {concern.causes.map((cause) => (
                <li key={cause} className="flex gap-3">
                  <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-600" />
                  <span>{cause}</span>
                </li>
              ))}
            </ul>
            <Button href={routes.book} variant="primary" icon="arrow-right" className="mt-6">
              Book A Consultation
            </Button>
            <p className="mt-3 text-xs text-muted">
              Not sure what it is?{" "}
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
