import type { Machine } from "@/content/schema";
import { routes } from "@/lib/links";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { CheckIcon } from "@/components/ui/icons";
import { SectionCard } from "@/components/ui/SectionCard";

/** Intro paragraphs with a sticky "What it treats" aside. */
export function MachineOverview({ machine, whatsappHref }: { machine: Machine; whatsappHref: string }) {
  return (
    <SectionCard id="overview" headingId="overview-heading" tone="white">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <Eyebrow>About The Machine</Eyebrow>
            <h2 id="overview-heading" className="mt-4 text-2xl font-medium leading-[1.15] sm:text-3xl md:text-4xl">
              {machine.name} At Skin Essence
            </h2>
            <p className="mt-3 text-sm text-muted">
              {machine.kicker} by {machine.manufacturer}
              {machine.distributor ? `, supplied by ${machine.distributor}` : ""}.
            </p>
            <div className="mt-6 space-y-5 text-base leading-relaxed text-ink-2 md:text-lg">
              {machine.intro.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>
          </div>
          <aside className="self-start rounded-3xl bg-surface-2 p-6 md:p-8 lg:sticky lg:top-6" aria-labelledby="treats-heading">
            <h3 id="treats-heading" className="text-lg font-semibold">
              What it treats
            </h3>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-ink-2">
              {machine.whatItTreats.map((item) => (
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
              Not sure it is right for you?{" "}
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="font-medium text-brand-700 underline-offset-2 hover:underline">
                Ask us on WhatsApp
              </a>
              .
            </p>
          </aside>
        </div>
      </Container>
    </SectionCard>
  );
}
